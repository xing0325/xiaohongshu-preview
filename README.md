# 小红书图文预览工作台

一个**自己用的**小红书图文（图 + 文）排版预览工具。
HTML 卡片放在 `cards/`，文案 + hashtag 放在 `cards.config.js`，打开 `index.html` 就能看到手机 / 网页版预览效果，一键导出 PNG。

为什么不用 Figma / Sketch？因为我的图就是 HTML，可以编程化生成、可以用真字体、可以做动效（虽然小红书最后是静态图，但开发过程里用 HTML 迭代飞快）。

---

## 跑起来（30 秒）

1. Clone 或下载这个 repo
2. 把你要发的小红书卡片（每张是一个 1242×1656 的 HTML 文件）放进 `cards/` 文件夹
3. 编辑 `cards.config.js`：
   - `cards`：按发小红书时左滑顺序列出卡片文件
   - `post`：标题 / 正文 / hashtags / 作者名
4. 双击 `index.html` 在浏览器打开
5. 顶部切换「📱 手机」/「💻 网页」预览效果
6. 每张卡片右上角的「↓ PNG」按钮可单独下载；右上「下载全部 PNG」一键跑完所有

> 文案改动会自动存在浏览器 `localStorage` 里，刷新不丢。

---

## 它长什么样

**手机模式**：iPhone 形状的边框，里面是横向滑动的卡片轮播 + 作者头像 + 标题 + 正文 + hashtag + 底部互动栏。视觉跟小红书 app 几乎一样。

**网页模式**：左边大卡片 + 右边作者 + 标题 + 正文 + 评论区，仿真小红书 web。

---

## 文件结构

```
xiaohongshu-preview/
├── index.html          # 工作台主页（打开它就行）
├── cards.config.js     # ← 主要要改的就是这个
├── cards/              # 放每张卡片的 HTML（1242×1656）
│   ├── 01-cover.html
│   ├── 02-...
│   └── 10-cta.html
└── README.md
```

---

## 给未来 AI agent 的接入模板

如果你想让一个新的 AI session 帮你做一组完整的小红书图文（图 + 文 + 排版），把下面这段 prompt 喂给它就行：

````
我有一个小红书图文工作台仓库（GitHub URL）。每次发一组图文，我用这一套流程：

# 角色

1. **文案师**
   产出：项目介绍、我做这件事的初心、对话中你捕捉到我的热情所在
   （我认为的创新点 / 我自己很自豪的解决问题的过程）

2. **配图师**
   产出：用 HTML（1242×1656，符合小红书 3:4 比例）做出整套配图，
   包括一张引人入胜的封面，以及围绕产品/项目调性的若干内页
   视觉风格自己发挥，跟项目本身的气质一致

3. **媒体知识助手**
   产出：保证整套图文符合自媒体逻辑——
   封面够钩、内页节奏、CTA 落点、hashtag 选择

# 我的角色背景（不用刻意提，只是调性参考）

高三休学的人，做自媒体起步，喜欢 vibe coding + 平面设计，
build in public 的心态。语气要克制、真诚，**不要油腻、不要"宝子姐妹"**。

# 你产出的格式

- `cards/01-cover.html`、`cards/02-xxx.html` ... 一组 HTML 配图文件
  （每个 body 严格 1242×1656，全部 inline CSS，可独立打开）
- `cards.config.js` 的更新内容：
  - `cards`：按发布顺序列出文件路径
  - `post.title` / `post.body` / `post.hashtags` / `post.author_name`

我会把它们放进 repo，打开 `index.html` 就能看到完整效果 + 下载 PNG。

# 项目背景

[这里你把项目的来龙去脉粘进去，越具体越好——做这件事的起因、
最自豪的解决问题的瞬间、想传递给读者的东西]
````

复制这段，把 `[这里...]` 替换成你正在做的项目背景，发给新的 AI session。它会按这套结构出活。

---

## 视觉规范（让所有配图风格统一）

如果你想保持系列感，可以让配图师都用同一套 CSS 变量（这是这个 repo 里第一组卡片用的暖米色 + 火漆红风格）：

```css
:root {
  --bg: #ede2c8;      /* 暖米色背景 */
  --paper: #f7efd9;   /* 信纸色 */
  --ink: #2a2010;     /* 主文字 */
  --ink-soft: #5a4a30;
  --ink-faint: #8a7656;
  --wax: #8b2a1e;     /* 火漆红 · 标志色 */
  --gold: #b08d57;
  --line: rgba(176, 141, 87, 0.35);
}
```

字体（Google Fonts）：
- 中文衬线：Noto Serif SC
- 中文毛笔字：Ma Shan Zheng
- 英文 italic：Cormorant Garamond

如果你换了项目，色板/字体可以整套换——这只是个示例。

---

## 技术细节

- **下载 PNG** 用 [html2canvas](https://html2canvas.hertzen.com/)，纯客户端，无后端
- 每张卡片是独立 `<iframe>`，缩放靠 CSS `transform: scale()` 而不是改 viewport，所以**字体不会糊**
- 文案编辑器把改动存在 `localStorage`，**不会污染 `cards.config.js`**——所以你的"原始版本"始终是干净的，编辑只在浏览器里实验
- 没有 build step / 没有 npm。打开 HTML 就跑。

---

## License

随便用，喜欢就 star，不喜欢就关掉。
