const nextConfig = {
    basePath: process.env.BASEPATH ?? '',
    reactStrictMode: true,
    pageExtensions: [
        'js',
        'jsx',
        'ts',
        'tsx'
    ],
    redirects: async ()=>{
        return [
            {
                source: '/',
                destination: '/dashboard',
                permanent: true
            },
            {
                source: '/apps/users',
                destination: '/apps/users/list',
                permanent: true
            }
        ];
    }
};
export default nextConfig;
