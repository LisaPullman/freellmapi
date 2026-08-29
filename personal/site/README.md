# foxai 个人主页

纯静态单页站点,零构建、零依赖,可直接部署到 Cloudflare Pages。

```
site/
├── index.html            # 页面(内联全部 CSS/JS)
├── favicon.svg           # foxai「Trace」标志 · Tile 版
└── assets/brand-board.jpg  # 品牌总览图(已压缩至 ~270KB)
```

## 部署到 Cloudflare Pages

**方式一:网页拖拽(最简单,约 1 分钟)**
1. 打开 https://dash.cloudflare.com → 左侧 **Workers & Pages** → **Create** → **Pages** 标签
2. 选 **Upload assets(直接上传)**
3. 项目名随意(如 `foxai`),把整个 `site/` 文件夹拖进去
4. 点 **Deploy**,完成即可访问 `https://<项目名>.pages.dev`

**方式二:wrangler CLI**
```bash
npm install -g wrangler
wrangler login
wrangler pages deploy . --project-name=foxai
```
(在 `site/` 目录内执行)

**方式三:连接 Git 仓库**
Pages → Create → Connect to Git → 选中仓库,构建命令留空,输出目录填 `site`。

## 本地预览

```bash
cd site && python3 -m http.server 8799
# 打开 http://localhost:8799
```

## 修改指引

- 联系邮箱:全局搜索替换 `foxbobby@qq.com`(共 7 处,含 nav / hero / contact / JSON-LD)
- 品牌色:改 `index.html` 顶部 `:root` 中的 `--brand`(当前 `#FF7A4D`,foxai Ember 暗色版)
- 业务文案:`#services` 区块内四张卡片;流程文案:`#process` 区块
