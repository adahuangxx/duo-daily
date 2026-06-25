# Duo Daily · 双人打卡日历

Ada & Ya 的月历打卡应用，部署于 GitHub Pages。

**线上地址：** https://adahuangxx.github.io/duo-daily/

## 功能

- 月历视图，自适应手机与桌面
- 两人（Ada / Ya）各自打卡：学习、锻炼、放松一天
- 可选备注说明
- 云端同步（Supabase，可选）或本地 localStorage 回退

## 本地开发

```bash
npm install
cp .env.example .env.local   # 填入 Supabase anon key
npm run dev
```

开发地址：`http://localhost:5173/duo-daily/`

## Supabase 配置

1. 在 [Supabase Dashboard](https://supabase.com/dashboard/project/mixeunweohqhdezhcyzy) → **SQL Editor** 运行 `supabase/schema.sql`
2. **Project Settings → API** 复制：
   - Project URL：`https://mixeunweohqhdezhcyzy.supabase.co`
   - **anon public** key（不是 service_role，不是数据库密码）
3. 本地：写入 `.env.local`（勿提交）
4. GitHub Pages：仓库 **Settings → Secrets and variables → Actions** 添加：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

**不要把数据库密码放进项目。** 前端只需 anon public key；`service_role` 密钥绝不能暴露在前端。

## 构建

```bash
npm run build
npm run preview
```

## 部署

推送到 `main` 后 GitHub Actions 自动构建并发布。

仓库 **Settings → Pages → Build and deployment → GitHub Actions**

## Git 推送（GitHub 已不支持账号密码）

任选一种：

### 方式 A：Personal Access Token（HTTPS）

1. GitHub → **Settings → Developer settings → Personal access tokens**
2. 生成 token，勾选 `repo` 权限
3. 推送时用户名填 `adahuangxx`，密码处粘贴 token：

```bash
git push -u origin main
```

或写入凭据（macOS）：

```bash
git credential-osxkeychain store
# 然后输入 protocol=https host=github.com username=adahuangxx password=<token>
```

### 方式 B：SSH

```bash
ssh-keygen -t ed25519 -C "your_email"
# 把 ~/.ssh/id_ed25519.pub 加到 GitHub → Settings → SSH keys
git remote set-url origin git@github.com:adahuangxx/duo-daily.git
git push -u origin main
```

## 仓库名

GitHub 仓库名须为 `duo-daily`，与 `vite.config.ts` 中的 `base: '/duo-daily/'` 一致。
