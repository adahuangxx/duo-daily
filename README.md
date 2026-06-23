# Duo Daily · 双人打卡日历

Ada & Ya 的月历打卡应用，部署于 GitHub Pages。

**线上地址：** https://adahuangxx.github.io/duo-daily/

## 功能

- 月历视图，自适应手机与桌面
- 两人（Ada / Ya）各自打卡：学习、锻炼、放松一天
- 可选备注说明
- 数据暂存于浏览器 localStorage（后续可切换 Supabase）

## 本地开发

```bash
npm install
npm run dev
```

开发服务器默认 `http://localhost:5173/duo-daily/`（与生产 `base` 路径一致）。

## 构建

```bash
npm run build
npm run preview
```

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并发布到 Pages。

仓库需启用：**Settings → Pages → Build and deployment → GitHub Actions**

## 仓库名

GitHub 仓库名须为 `duo-daily`，与 `vite.config.ts` 中的 `base: '/duo-daily/'` 一致。
