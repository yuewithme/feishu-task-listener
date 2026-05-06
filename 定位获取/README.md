# 定位采集网页

最小可用版本的定位采集网页，使用 Next.js App Router、TypeScript、Prisma 和 MySQL。

## 本地运行

1. 安装依赖

```powershell
npm install
```

2. 配置 `DATABASE_URL`

复制 `.env.example` 为 `.env`，并替换为本地 MySQL 连接信息：

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/location_capture"
```

3. 执行 Prisma migration

```powershell
npx prisma migrate dev
```

4. 启动开发服务器

```powershell
npm run dev
```

5. 打开页面测试

访问 http://localhost:3000 测试定位采集流程。

## 定位权限说明

本地 `localhost` 可以测试浏览器定位。正式线上环境必须使用 HTTPS，否则浏览器可能无法使用定位授权。
