# Supabase 存储切换指南

本项目**无需改代码**即可在 localStorage 与 Supabase 之间切换，由环境变量决定。

## 使用 Supabase（云端同步）

### 1. 建表

在 Supabase Dashboard → **SQL Editor** 运行仓库里的 `supabase/schema.sql`。

### 2. 本地开发

复制 `.env.example` 为 `.env.local`（勿提交），填入：

```env
VITE_SUPABASE_URL=https://mixeunweohqhdezhcyzy.supabase.co
VITE_SUPABASE_ANON_KEY=<你的 anon public key>
```

在 **Project Settings → API** 复制 **anon public** key（不是 service_role，不是数据库密码）。

### 3. 重启 dev server

```bash
npm run dev
```

打开页面后副标题应显示 **「· 云端同步」**，数据写入 Supabase `day_entries` 表。

### 4. GitHub Pages 线上环境

仓库 **Settings → Secrets and variables → Actions** 添加：

| Secret | 值 |
|--------|-----|
| `VITE_SUPABASE_URL` | `https://mixeunweohqhdezhcyzy.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | anon public key |

推送 `main` 后 Actions 构建会注入这些变量。若未配置 secret，线上自动回退为 **localStorage**（仅本浏览器）。

## 回退到 localStorage

删除或清空 `.env.local` 中的 `VITE_SUPABASE_*`，重启 dev。线上则移除 GitHub Actions secrets 后重新部署。

## 常见错误

### `ERR_CONNECTION_CLOSED` / `Failed to fetch`

多为**本地网络**无法稳定访问 `supabase.co`（国内较常见），不是代码或 key 格式问题。

可尝试：

1. 换网络或开 VPN 后刷新
2. 浏览器直接打开：`https://mixeunweohqhdezhcyzy.supabase.co` 看能否连通
3. 暂时删掉 `.env.local` 里的 Supabase 变量，用 localStorage 继续用

代码已内置请求重试（3 次），轻微抖动可能自动恢复。

### `Could not find the table 'public.day_entries'`

说明**还没建表**。在 SQL Editor 运行 `supabase/schema.sql` 即可。

### API Key 格式

Supabase 新版 **publishable key**（`sb_publishable_...`）和旧版 **anon JWT**（`eyJ...`）均可用于前端，在 Project Settings → API 复制即可。
