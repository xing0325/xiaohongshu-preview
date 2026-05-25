<div align="center">

# 你的项目 → 一篇小红书图文

**给 AI agent 一段项目背景，它产出整套图 + 文 + 标签；你在浏览器预览，一键导出 PNG 发笔记。**

5 分钟，从「做完一件事」到「这件事变成一篇能传播的小红书」

<br/>

[![project → post](https://img.shields.io/badge/any_project-→_xhs_post-FF2442?style=flat-square&labelColor=2A2010)]()
[![ai agent](https://img.shields.io/badge/AI_agent-drop_in_ready-95EC69?style=flat-square&labelColor=2A2010)]()
[![html only](https://img.shields.io/badge/no_npm_no_build-html_only-EDE2C8?style=flat-square&labelColor=2A2010)]()
[![license](https://img.shields.io/badge/license-do_whatever-8B2A1E?style=flat-square&labelColor=2A2010)]()

<br/>

```
┌───────────────┐      ┌─────────────────┐      ┌──────────────────┐
│               │      │                 │      │                  │
│   你的项目     │  ──▶ │   AI agent      │ ──▶  │  9 张 HTML 图     │
│   你的故事     │      │   (Claude/GPT)  │      │  +  一篇文案       │
│   你的想法     │      │                 │      │  +  hashtag       │
│               │      │                 │      │                  │
└───────────────┘      └─────────────────┘      └────────┬─────────┘
                                                         │
                                                         ▼
                                              ┌──────────────────┐
                                              │  浏览器预览        │
                                              │  📱 手机 / 💻 网页 │
                                              │  一键导出 PNG     │
                                              │  发小红书 ✓       │
                                              └──────────────────┘
```

</div>

---

## 这解决了什么

你做了一件事——上线了一个产品、写了一个工具、学完了一本书、跑完了一次马拉松、做了一顿好吃的、攒了三个月攒出来一个 side project ——**你想发小红书，但卡在了"图怎么做"上**。

模板太丑，Figma 太重，醒图调性不一致，找设计师贵又慢。结果：**90% 的好东西最后没被讲出来。**

这个 repo 是一条**从"项目"到"小红书笔记"的 5 分钟流水线**：

1. **AI agent 出活**——你给它你的项目背景 + 一点调性偏好，它产出 9 张 HTML 配图 + 完整文案 + hashtag
2. **你本地预览**——打开 `index.html`，按小红书 App / 网页版的真实样子看效果
3. **一键导出 PNG**——单张或全部，1242×1656 高清，直接发笔记

整套**没有 npm，没有 build，没有数据库**。HTML 文件双击就跑。

---

## 🔥 杀手锏：让 AI 帮你做整套图文

**这才是这个 repo 真正的价值。** 把下面这段 prompt 喂给 Claude / GPT / 任意 AI agent，它会按 repo 的结构产出整套素材：

````markdown
我有一个小红书图文工作台仓库：
https://github.com/xing0325/xiaohongshu-preview

请用下面三个角色帮我做一组完整的小红书图文。
产出按这个 repo 的 cards/ + cards.config.js 的结构给我：

1. 文案师 — 把项目介绍、我的初心、你在对话里捕捉到的我对这件事
   的热情，写成一篇小红书正文（标题 + 正文 + hashtag）
2. 配图师 — 用 HTML（1242×1656，全部 inline CSS）做一组配图
   一张引人入胜的封面 + 内页 + CTA / 落点
   视觉风格跟项目调性一致
3. 媒体知识助手 — 保证封面够钩、内页节奏、CTA 落地
   符合小红书爆款逻辑

我的角色调性（不用刻意提，只是参考）：
[在这里描述你的人设、风格偏好、想要的调性]

# 项目背景
[在这里粘贴你的项目来龙去脉，越具体越好——
做这件事的起因 + 你最自豪的解决问题的瞬间 +
你想传递给读者的东西]
````

**5 分钟后，你拿到**：

- 一组 HTML 配图文件 → 放进 `cards/` 文件夹
- 一段 `cards.config.js` 配置 → 替换原配置
- 一个完整的小红书发布素材包

打开 `index.html`，整套效果立刻可见。满意 → 一键导出 → 发笔记。

---

## 30 秒上手

```bash
# 1. clone（或直接 Download ZIP）
git clone https://github.com/xing0325/xiaohongshu-preview.git
cd xiaohongshu-preview

# 2. 本地起 server（避免 file:// 协议的 iframe 限制）
python -m http.server 8060
# 浏览器开 http://localhost:8060
```

仓库自带一组**完整示例**（10 张关于一个 520 求和好项目的卡片 + 一篇完整文案），打开就能看效果。然后你换成你自己的：

1. 把 AI 给你的 HTML 卡片放进 `cards/`
2. 把 AI 给的配置替换 `cards.config.js`
3. 刷新 → 预览 → 下载 → 发

---

## 它能给你的几样东西

### 📱 真实小红书 App 样式的预览
iPhone 边框、状态栏、动态轮播、互动栏、作者头像、关注按钮、评论入口——一比一还原。**发布前你看到的，就是用户会看到的。**

### 💻 网页版小红书布局
左大图右文案，方便检查电脑端用户的阅读体验。

### 🖼️ 一键 PNG 导出
单张或全部，1242×1656 高清，符合小红书最佳尺寸。html2canvas 走纯客户端 · 无后端 · 字体不糊。

### 📝 文案实时编辑
顶部「编辑文案」侧栏，标题 / 正文 / hashtag / 作者名随便改，自动存浏览器 `localStorage`。**不污染 `cards.config.js`**——你的"原始版"永远干净。

### 🌙 黑 / 白主题切换
深夜想发图不刺眼。首次访问跟随系统 `prefers-color-scheme`，之后存偏好。

### ⌨️ 键盘 ← / → 翻页
用 trackpad 滑十张图太累。

---

## 用得上的人

> 🛠️ **独立开发者 / 学生 build in public**：刚做了个 side project，想发小红书但不会做图
> 🤖 **重度 AI 用户**：写代码让 Claude / GPT 来，做图也想让它们来，最后自己只挑选
> 📚 **博主 / 笔记作者**：每周要发 2-3 篇笔记，需要风格统一、批量产出
> 🎨 **追求"系列感"的内容创作者**：用 CSS 变量统一一整年的视觉调性
> 💼 **小团队产品经理 / 运营**：要往小红书放新功能介绍，但没有设计师

---

## 它**不是**什么

- **不是图片编辑器**——你不能在工作台里画图，所有图必须是 HTML 写的
- **不是小红书爬虫 / 数据分析工具**——这个 repo 不接小红书 API，不爬数据
- **不是发布自动化**——你最后还是要手动把图片传到小红书 App
- **不是 GUI 拖拽工具**——视觉调整要改 HTML / CSS（这也是它的优势：可编程、可让 AI 接管）

---

## 文件结构

```
xiaohongshu-preview/
├── index.html          ← 工作台主页（双击就跑）
├── cards.config.js     ← AI agent 主要要更新的就是这个
├── cards/              ← AI agent 把生成的 HTML 配图丢这里
│   ├── 01-cover.html
│   ├── 02-...
│   └── 09-payoff.html
└── README.md           ← 你正在读的
```

`cards.config.js` 的格式：

```js
window.CARDS_CONFIG = {
  cards: [                       // 按小红书展示顺序排
    'cards/01-cover.html',
    'cards/02-origin.html',
    // ...
  ],
  post: {
    author_name: '你的名字',
    title: '你的标题',
    body: `你的多段正文

    空一行 = 分段`,
    hashtags: ['520', '挽回', '程序员的浪漫'],
    stats: { likes: '12.3k', comments: '234', collects: '78' },
  },
};
```

---

## 视觉规范（可选 · 让你系列感统一）

仓库示例用的是暖米色 + 火漆红信纸调性。**你可以整套换**——这只是一个参考起点：

```css
:root {
  --bg: #ede2c8;       /* 暖米色背景 */
  --paper: #f7efd9;    /* 信纸色 */
  --ink: #2a2010;      /* 主文字 */
  --ink-soft: #5a4a30;
  --ink-faint: #8a7656;
  --wax: #8b2a1e;      /* 火漆红 · 标志色 */
  --gold: #b08d57;
  --line: rgba(176, 141, 87, 0.35);
}
```

字体（Google Fonts）：

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600&family=Ma+Shan+Zheng&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
```

- 中文衬线（正文）：`Noto Serif SC`
- 中文毛笔字（标题装饰）：`Ma Shan Zheng`
- 英文 italic（次级装饰）：`Cormorant Garamond`

如果你换了项目，色板和字体可以整套换——只要在 AI 的 prompt 里说清楚你要什么风格，它会跟着改。

---

## 为什么不用 Figma / 醒图 / Canva

| 工具 | 痛点 |
|------|------|
| Figma / Sketch | 改一个数字要点 5 下；多语言切换要 5 个图层；不能让 AI 一键产出 |
| 醒图 / Canva | 模板有创作者印记，调性难统一；批量产出累 |
| PS | 不可编程、不可复用、不可让 AI 接管 |
| **HTML + AI agent** | **改一行字 = 改一张图。AI 写好一整套。可版本管理。字体真实。** |

如果你的图本来就讲究**排版、字体、字号、留白、节奏**，HTML 的表达力 + AI 的生产力，**比拼图软件高一个量级**。

---

## 技术细节

- **下载 PNG** 用 [html2canvas](https://html2canvas.hertzen.com/) · 纯客户端 · 无后端
- 每张卡片是独立 `<iframe>` · 缩放靠 CSS `transform: scale()` · **字体不会糊**
- 文案编辑实时存 `localStorage` · **不污染 `cards.config.js`**
- 主题切换跟随系统 `prefers-color-scheme`，首次自动；之后存 `localStorage`
- 黑模式背景 `#18181a`，不是纯黑——长时间盯着不刺眼

---

## FAQ

**Q：双击 index.html 打开，iPhone 框里黑了一片？**
A：是 `file://` 协议的 iframe 安全限制。起一个 server 就好：`python -m http.server 8060`，然后访问 `http://localhost:8060/`。

**Q：能换尺寸吗？不一定都 1242×1656。**
A：可以。改 `index.html` 里 `.carousel-slide iframe { transform: scale(calc(393 / 1242)); }` 那个 `1242` 和你的卡片实际宽度对应即可。最佳还是按小红书 3:4 来。

**Q：AI agent 听不懂我的项目背景怎么办？**
A：项目背景写得越具体越好——**做这件事的起因、最自豪的解决问题的瞬间、想传递给读者的东西**这三件事尤其重要。AI 会根据这些定调子。如果出来的图味道不对，你可以追问"我想要更克制 / 更俏皮 / 更尖锐"，它会调整。

**Q：导出 PNG 时字体怎么有时糊？**
A：html2canvas 在 Google Fonts 还没加载完时截图会用默认字体。第一次刷新页面后等 3-5 秒再点下载就好。

**Q：可以放敏感链接吗？**
A：小红书对图里 URL 算法识别越来越严。**建议链接放评论区自取**，图里别放完整 URL。

**Q：AI 出的图我不满意，能再让它改吗？**
A：能。直接告诉 AI"第 3 张封面字号太大，改成 80px；第 5 张档案馆颜色太重，换成淡米色"——它会重新生成那几个 HTML 文件，你替换进 `cards/` 就行。**这就是 HTML 配图的好处：可版本迭代。**

---

## 我做这个的原因

我在做一个 520 求和好的小项目时，让 AI 帮我写文案 + 帮我做配图都很顺。但**让 AI 输出的图和文案在小红书 App 里到底长什么样，没有一个工具能预览**。我只能一张张文件双击打开看，文案靠想象。

写了两小时这个工作台，解决了我的问题：

- AI 写完文案 → 我直接看到小红书里它的样子
- AI 写完配图 HTML → 我直接看到完整 9 图轮播 + 互动栏
- 我自己改一个数字 → 立刻刷新看效果
- 满意了 → 一键导出 → 直接发

后来我意识到，这个工作流的价值**不在"预览"，在于"项目 → 笔记"的整条管道**。AI 出活，我把活验收，发出去。其他做了东西想发小红书但不擅长做图的人，应该也能用上。

build in public 起来——如果你也有这样的痛点，欢迎来用 + 给 issue + PR。

---

## Roadmap

- [x] AI agent 接入模板（核心功能）
- [x] 手机 / 网页双模式预览
- [x] 黑 / 白主题
- [x] 单张 + 全部下载 PNG
- [x] 文案实时编辑 + localStorage 持久化
- [x] 键盘 ← → / 按钮翻页
- [ ] 多 deck 切换（同一个 repo 维护多组待发笔记，随时切换）
- [ ] 视频笔记预览支持
- [ ] 自动按 `cards/` 文件名顺序生成 cards 列表（不用手动写 config）
- [ ] 数据驱动的 hashtag 推荐（接个简单 LLM）
- [ ] 集成 AI agent prompt 一键生成（不用手动开新 session）

---

## 灵感来源 / 致谢

- [shadcn/ui](https://ui.shadcn.com) — 教会我"组件就是几个文件"
- [html2canvas](https://html2canvas.hertzen.com/) — 这个工具的根基
- 一个我熬夜两天做的 520 项目 [Museum of Us](https://museum-of-us-520.netlify.app) — 它逼着我做了这个工作台
- Claude · 它一边写代码一边教我什么叫"克制的设计"

---

## License

随便用。喜欢的话 ⭐ 一下。
做了好东西想分享 / 想给我留 issue / 想直接 PR —— 都行。
