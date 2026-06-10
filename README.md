<div align="center">

# xiaohongshu-preview

把一个项目，推进到一条能发的小红书草稿。

给 AI agent 项目背景，它按仓库结构生成 HTML 卡片和文案。你在本地看到接近小红书 App 的效果，导出 1242×1656 图片，再用 opencli 整理到创作者中心草稿箱。

[![Xiaohongshu](https://img.shields.io/badge/Xiaohongshu-publish_pack-FF2442?style=flat-square)]()
[![Agent ready](https://img.shields.io/badge/agent-ready-111827?style=flat-square)]()
[![HTML cards](https://img.shields.io/badge/cards-HTML%2FCSS-2563EB?style=flat-square)]()
[![OpenCLI](https://img.shields.io/badge/opencli-draft_publish-16A34A?style=flat-square)]()

<img src="assets/readme/workbench.png" alt="xiaohongshu-preview workbench" width="900" />

</div>

---

## 为什么需要这个

很多项目不是没人想看，是发布前卡住了。

做完一个 side project、工具、课程笔记、活动记录之后，真正麻烦的是这些事：

- 文案和图片分开生成，最后拼不到一篇完整笔记里。
- AI 做的图单张看还行，放进小红书轮播节奏不一定对。
- 你不知道第一张封面、正文、互动栏在手机里到底长什么样。
- 导出图片、复制标题正文、整理 hashtag、上传排序，全是重复劳动。
- 直接让自动化工具发布又有点危险，最好先到草稿箱，人看一眼。

这个仓库解决的是最后这段路：

```text
项目背景
  ↓
AI agent 生成 cards/ + cards.config.js
  ↓
本地预览小红书 App / 网页版效果
  ↓
npm run export 生成发布包
  ↓
npm run xhs:draft 整理到小红书草稿
  ↓
你确认后发布
```

它不是“再做一个图片模板工具”。它更像一个给 agent 用的发布前工作台。

---

## 适合谁

适合这些场景：

- 独立开发者、学生、创作者：做了东西，但不想再打开 Figma 从零排版。
- 经常用 Claude / GPT 写代码的人：希望 AI 产出的内容能直接落到文件和草稿里。
- 小红书图文作者：想保持系列感，但又不想每次手动调九张图。
- 产品经理、运营、小团队：需要把功能更新、案例、教程快速变成一篇可检查的笔记。
- build in public：希望把“我做了什么”讲成“别人为什么会在意”。

不适合这些需求：

- 不适合做爬虫、数据采集、批量养号。
- 不适合绕过验证码、风控或平台审核。
- 不适合纯拖拽修图。这里的图是 HTML/CSS，适合让 AI 和版本管理接管。

---

## 它能做什么

### 1. 让 agent 按固定结构交付

Agent 不再只给你一段散文和几张不知怎么落地的图。它要产出：

```text
cards/
  01-cover.html
  02-....html
  ...
cards.config.js
```

`cards.config.js` 是整篇笔记的数据源：图片顺序、标题、正文、hashtag、作者信息都放在这里。

### 2. 在发布前看见真实阅读效果

工作台提供两种预览：

- 手机视图：模拟小红书 App 的轮播、作者区、互动栏。
- 网页视图：检查电脑端的图片和正文排布。

你可以在本地改文案、切换深浅色、翻页、导出单张或全部图片。

### 3. 导出发布包

```bash
npm run export
```

输出：

```text
dist/xhs-pack/
├── images/              # 按上传顺序排列的 PNG
├── title.txt
├── body.txt
├── topics.txt
├── caption-full.txt
└── publish.json
```

图片尺寸是小红书常用的 1242×1656，最多 9 张。

### 4. 自动整理到小红书草稿

```bash
npm run xhs:draft
```

它会通过 opencli 打开小红书创作者中心，上传图片、填写标题正文、选择话题，然后保存为草稿。

如果你明确确认，也可以直接发布：

```bash
npm run xhs:publish
```

默认建议先草稿。小红书页面会改，账号也可能遇到风控。草稿模式把重复劳动交给自动化，把最后判断留给人。

---

## 30 秒体验预览

```bash
git clone https://github.com/xing0325/xiaohongshu-preview.git
cd xiaohongshu-preview
python -m http.server 8060
```

浏览器打开：

```text
http://localhost:8060
```

仓库自带一组示例卡片。你可以先看工作台效果，再把 `cards/` 和 `cards.config.js` 换成自己的内容。

---

## 一条完整发布流程

### 第一步：让 agent 生成图文

把这段 prompt 给 Claude、GPT、Hermes 或其他能操作文件的 agent：

````markdown
我有一个小红书图文工作台仓库：
https://github.com/xing0325/xiaohongshu-preview

请按这个仓库的结构，帮我做一组完整的小红书图文：

1. 生成 6-9 张 HTML 卡片，放到 cards/，尺寸 1242×1656，全部 inline CSS。
2. 更新 cards.config.js，配置卡片顺序、标题、正文、hashtag、作者信息。
3. 内容重点不是“我多努力”，而是读者为什么会在意、能获得什么、为什么现在该看。
4. 封面要有明确钩子，内页要有节奏，最后一页给行动入口。
5. 视觉风格根据项目气质来，不要套通用营销模板。

# 项目背景
[粘贴项目起因、解决的问题、目标用户、最有意思的细节、你希望读者做什么]

# 发布动作
- 默认运行 npm run export，然后 npm run xhs:draft 整理到小红书草稿。
- 只有我明确说“直接发布”时，才运行 npm run xhs:publish。
- 如果 opencli 未登录、标题超过 20 字、图片超过 9 张，先停下来说明问题。
````

### 第二步：导出发布包

```bash
npm run export
```

### 第三步：整理到草稿

```bash
npm run xhs:draft
```

### 可选：直接发布

```bash
npm run xhs:publish
```

建议先用 dry-run 看一下最终命令：

```bash
npm run xhs:dry-run
```

---

## opencli 设置

小红书发布这一步依赖 opencli 和 Chrome / Chromium Browser Bridge。

### 检查 opencli

```bash
npm run xhs:doctor
```

如果显示：

```text
Extension: connected
Connectivity: connected
```

说明浏览器桥已经通了。

### 登录创作者中心

```bash
npm run xhs:login
```

第一次会打开小红书创作者中心。你扫码登录一次即可。之后 `--site-session persistent` 会尽量复用登录态。

注意：opencli 走 Chrome / Chromium，不会自动复用 Zen 浏览器里的登录态。你需要在 opencli 能控制的 Chrome 或 Edge profile 里登录一次。

如果 `xhs:doctor` 显示扩展已连接，但 `xhs:login` 仍然 401：

```bash
opencli profile list
opencli profile use <profile-id>
npm run xhs:login
```

---

## 文件结构

```text
xiaohongshu-preview/
├── index.html                    # 预览工作台
├── cards.config.js               # 笔记数据源：顺序、标题、正文、话题
├── cards/                        # HTML 卡片
│   ├── 01-cover.html
│   ├── 02-...
│   └── 09-cta.html
├── scripts/
│   ├── export-publish-pack.mjs   # 导出 PNG + publish.json
│   └── xhs-publish.mjs           # 调 opencli 发草稿 / 发布
├── assets/readme/                # README 截图
├── package.json
└── README.md
```

`cards.config.js` 示例：

```js
window.CARDS_CONFIG = {
  cards: [
    'cards/01-cover.html',
    'cards/02-origin.html',
    'cards/03-workflow.html',
  ],
  post: {
    author_name: '你的名字',
    location: '成都',
    title: '20字以内的小红书标题',
    body: `多段正文。

空一行就是分段。`,
    hashtags: ['独立开发', '小红书运营', 'AI工作流'],
    stats: { likes: '12.3k', comments: '234', collects: '78' },
  },
};
```

---

## 和 Figma、Canva、自动发布工具的区别

| 工具 | 更适合 | 问题 |
| --- | --- | --- |
| Figma / Sketch | 精修设计稿 | AI 很难直接接管；一套九图改起来慢 |
| Canva / 醒图 | 套模板出图 | 系列感容易像模板；批量修改不舒服 |
| 普通 AI 生图 | 做氛围图 | 字体、排版、长文、版本迭代都不稳定 |
| 全自动发布脚本 | 批量运营 | 容易跳过人工判断，也更容易踩平台风控 |
| xiaohongshu-preview | 项目叙事、图文工作流、草稿发布 | 需要接受 HTML/CSS 卡片这种可编程方式 |

这个仓库不追求把人彻底拿掉。它把重复劳动拿掉：排版、预览、导出、上传、填表。最后是否发布，仍然应该由你决定。

---

## 设计原则

- 先展示结果，再解释怎么做。
- 一篇笔记只有一个核心承诺，不把所有功能都塞进封面。
- 每张图都是 HTML 文件，能被 AI 修改，能进 Git diff。
- 文案和图片顺序来自同一个配置文件，避免手动复制时出错。
- 默认保存草稿，不默认直接发布。

---

## 常见问题

### 双击 index.html 为什么预览不完整？

浏览器的 `file://` 安全限制会影响 iframe。用本地 server：

```bash
python -m http.server 8060
```

然后访问 `http://localhost:8060`。

### 标题为什么限制 20 字？

opencli 的小红书发布命令按创作者中心规则限制标题最多 20 字。脚本会在发布前检查，超了就停下来。

### 图片可以超过 9 张吗？

不建议。小红书图文最多 9 张，导出脚本也会检查这个限制。

### opencli 会保存我的账号密码吗？

不会。它复用浏览器登录态。账号登录、验证码、风控验证都应该由你自己在浏览器里完成。

### 能不能让 agent 直接发布？

可以，命令是 `npm run xhs:publish`。但默认建议 `npm run xhs:draft`。草稿模式更适合真实创作：自动化负责填好，人负责最后判断。

### 这个和 Auto-Redbook-Skills 一样吗？

不一样。那类 Skill 更像批量内容流水线：选题、撰写、生图、发布。这个仓库更窄：它服务于“我已经有一个项目/故事，要把它变成一篇可检查、可发布的小红书图文”。

---

## Roadmap

- [x] 小红书 App / 网页双视图预览
- [x] HTML 卡片轮播
- [x] 文案编辑和本地保存
- [x] 单张 / 全部 PNG 下载
- [x] 命令行导出发布包
- [x] opencli 草稿 / 直接发布
- [ ] 多 deck 管理：一个仓库维护多篇待发笔记
- [ ] 自动按 cards/ 文件名生成卡片列表
- [ ] 发布前检查清单：标题、封面、敏感词、话题、链接
- [ ] 视频笔记预览

---

## License

随便用。觉得有用的话，给个 star。真正欢迎的是 issue 和 PR：如果你也在把项目发到小红书，这个工作流还有很多地方可以继续磨。
