# 🐾 最契合你的宠物 - 部署指南

## 项目结构

```
pet-match/
├── app/
│   ├── api/quiz/route.ts    # 答题结果 API
│   ├── result/page.tsx       # 结果展示页
│   ├── layout.tsx            # 页面布局
│   ├── page.tsx              # 问卷首页
│   └── globals.css            # 全局样式
├── lib/
│   └── supabase.ts           # Supabase 客户端
├── package.json
├── next.config.js
└── tsconfig.json
```

## 快速部署（不需要 Supabase，先跑起来）

### 第一步：推送到 GitHub

```bash
cd pet-match
git init
git add .
git commit -m "init: pet match quiz site"
git remote add origin https://github.com/zhxyComing/Vercel.git
git branch -M main
git push -u origin main
```

### 第二步：Vercel 部署

1. 打开 https://vercel.com
2. 用 GitHub 登录
3. 点击 "Add New Project"
4. 选择 `Vercel` 仓库
5. Framework 选 "Next.js"（自动识别）
6. 点击 Deploy

等 1-2 分钟，你的网站就上线了！

默认地址：`https://Vercel.vercel.app`（Vercel 是你项目名）

---

## 可选配置：接入 Supabase（记录用户答题）

### 1. 创建 Supabase 项目

1. 打开 https://supabase.com
2. 注册并登录
3. 点击 "New Project"
4. 填写：
   - Organization: 选择个人
   - Name: `pet-match`
   - Database Password: 设置一个强密码（记下来）
   - Region: 选择 `Singapore` 或 `Tokyo`（国内访问快）
5. 点击 "Create new project"，等待 2 分钟

### 2. 创建数据表

在 Supabase 控制台左侧菜单找到 **SQL Editor**，运行：

```sql
CREATE TABLE quiz_records (
  id BIGSERIAL PRIMARY KEY,
  answers TEXT[] NOT NULL,
  pet TEXT NOT NULL,
  emoji TEXT NOT NULL,
  traits TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 开启 Row Level Security（允许插入，不允许读取公开）
ALTER TABLE quiz_records ENABLE ROW LEVEL SECURITY;

-- 允许匿名插入
CREATE POLICY "Allow anonymous insert" ON quiz_records
  FOR INSERT TO anon WITH CHECK (true);
```

### 3. 获取配置信息

在 Supabase 控制台 **Settings → API** 找到：

- `Project URL`: 类似 `https://xxxxx.supabase.co`
- `service_role` key（或 `anon` key）：类似 `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4. 配置 Vercel 环境变量

在 Vercel 项目页面 → **Settings → Environment Variables** 添加：

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | 你的 Supabase service_role key |

然后 **Redeploy** 即可。

---

## 可选配置：接入 OpenClaw AI（更智能的分析）

如果你想让 AI 来分析用户性格并推荐宠物：

### 1. 安装 ngrok（暴露本地 OpenClaw）

```bash
# macOS
brew install ngrok

# 注册账号 https://ngrok.com
# 登录后在 https://dashboard.ngrok.com/get-started/your-authtoken 找到 token
ngrok config add-authtoken <你的token>
```

### 2. 启动 ngrok

```bash
ngrok http 18789
```

复制输出的 `https://xxxx.ngrok.io` 地址。

### 3. 配置环境变量

在 Vercel 添加：

| Name | Value |
|------|-------|
| `OPENCLAW_GATEWAY_URL` | `https://xxxx.ngrok.io/v1` |
| `OPENCLAW_API_KEY` | `f819e2f4ca1efac75766648adced99862907445b0ee48d66` |

Redeploy 后，网站就会用 AI 来分析答题结果了！

---

## 自定义域名（可选）

在 Vercel 项目 → **Settings → Domains** 添加你的域名，按提示配置 DNS 即可。

---

## 技术栈

- **前端**: Next.js 15 (App Router) + TypeScript
- **样式**: 原生 CSS（无框架依赖）
- **数据库**: Supabase (PostgreSQL)
- **AI**: OpenClaw Agent（可选）
- **部署**: Vercel（免费）
