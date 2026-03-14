// vercel.ts
import { type VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
    // 其他通用配置...
    framework: 'nextjs', // 或 'vite'、'other' 等，根据你的框架

    // 动态决定 buildCommand
    // buildCommand: (() => {
    //     const branch = process.env.VERCEL_GIT_COMMIT_REF || 'unknown';

    //     console.log(`Current branch: ${branch}`);
    //     console.log(`Environment: ${process.env.VERCEL_ENV}`);

    //     if (branch === 'main') {
    //         return 'npm run build:prod'; // 或 'next build --profile=prod' 等
    //     }

    //     if (branch === 'dev' || branch === 'staging') {
    //         return 'npx prisma generate && npm run build:staging';
    //     }

    //     // 其他分支（preview/feature/*）
    //     return 'npx prisma generate && npm run build:preview'; // 可以是更轻量的构建
    // })(),

    // 你也可以在这里加其他动态逻辑，比如根据分支改 outputDirectory、rewrites 等
    // outputDirectory: branch === 'main' ? 'out-prod' : 'out-preview',
};