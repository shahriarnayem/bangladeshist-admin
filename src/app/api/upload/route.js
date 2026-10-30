import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db';
// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true
    });
}
export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const explicitUserId = formData.get('userId');
        if (!file) {
            return NextResponse.json({
                success: false,
                error: 'No file uploaded'
            }, {
                status: 400
            });
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const originalName = file.name || 'image.webp';
        const mimeType = file.type || 'image/webp';
        let finalUrl = '';
        // 1. Try Cloudinary
        if (cloudName && apiKey && apiSecret) {
            try {
                const uploadResult = await new Promise((resolve, reject)=>{
                    const uploadStream = cloudinary.uploader.upload_stream({
                        folder: 'chronicle_uploads',
                        resource_type: 'auto'
                    }, (error, result)=>{
                        if (error) reject(error);
                        else resolve(result);
                    });
                    uploadStream.end(buffer);
                });
                finalUrl = uploadResult.secure_url;
            } catch (cloudErr) {
                console.warn('Cloudinary upload fallback to local storage:', cloudErr.message);
            }
        }
        // 2. Fallback to local storage if Cloudinary unavailable
        if (!finalUrl) {
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            await mkdir(uploadDir, {
                recursive: true
            });
            const ext = path.extname(originalName) || '.webp';
            const cleanBase = path.basename(originalName, ext).replace(/[^\w-]/g, '_');
            const fileName = `${cleanBase}_${Date.now()}${ext}`;
            const filePath = path.join(uploadDir, fileName);
            await writeFile(filePath, buffer);
            finalUrl = `/uploads/${fileName}`;
        }
        // 3. Resolve uploader user to maintain strict ownership
        const headerUserId = req.headers.get('x-user-id');
        const cookieUserId = req.cookies.get('cms_user_id')?.value;
        const targetUserId = explicitUserId || headerUserId || cookieUserId;
        let uploaderUser = null;
        if (targetUserId) {
            uploaderUser = await db.user.findUnique({
                where: {
                    id: targetUserId
                },
                select: {
                    id: true,
                    name: true,
                    role: true
                }
            });
        }
        if (!uploaderUser) {
            uploaderUser = await db.user.findFirst({
                where: {
                    role: {
                        in: [
                            'SUPER_ADMIN',
                            'ADMIN'
                        ]
                    }
                },
                select: {
                    id: true,
                    name: true,
                    role: true
                }
            });
        }
        // 4. Register in MongoDB Media Collection with verified uploader
        let mediaRecord = null;
        try {
            mediaRecord = await db.media.create({
                data: {
                    name: originalName,
                    url: finalUrl,
                    type: mimeType.startsWith('video') ? 'video' : 'image',
                    mimeType,
                    size: buffer.length,
                    userId: uploaderUser?.id || null
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true
                        }
                    }
                }
            });
        } catch (err) {
            console.warn('Media registration error:', err.message);
        }
        return NextResponse.json({
            success: true,
            url: finalUrl,
            name: originalName,
            size: buffer.length,
            media: mediaRecord,
            uploadedBy: uploaderUser
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, {
            status: 500
        });
    }
}
