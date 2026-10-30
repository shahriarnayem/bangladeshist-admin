import { db } from './db';
export function slugify(str) {
    return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}
export async function logAudit(action, entity, entityId, details, userId) {
    try {
        const adminUser = userId ? {
            id: userId
        } : await db.user.findFirst({
            where: {
                role: {
                    in: [
                        'SUPER_ADMIN',
                        'ADMIN'
                    ]
                }
            },
            select: {
                id: true
            }
        });
        if (!adminUser) return;
        await db.auditLog.create({
            data: {
                action,
                entity,
                entityId,
                details: typeof details === 'string' ? details : JSON.stringify(details || {}),
                userId: adminUser.id
            }
        });
    } catch (err) {
        console.error('[auditLog error]:', err);
    }
}
