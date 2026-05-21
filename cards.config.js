// ============================================================
//  Cards & post config for the 小红书 preview workspace.
//  Edit this file to:
//    1. List the HTML cards (in 小红书 display order)
//    2. Set the post text / hashtags / author info
//  Reload index.html after editing.
// ============================================================

window.CARDS_CONFIG = {
  // Card files in the order they should appear on 小红书 (left → right swipe).
  // Each file should be a 1242 × 1656 standalone HTML (relative to this folder).
  cards: [
    'cards/bp-01-cover.html',    // 1. Cover — Claude 每次都问"允许吗"，我让它别问了
    'cards/bp-02-pain.html',     // 2. 缘起 — 被一个按钮折磨半个月 + 翻到 #29026
    'cards/bp-03-hook.html',     // 3. 原理 — PreToolUse hook + 哨兵文件流程
    'cards/bp-04-pet.html',      // 4. 桌宠 — 72px 浮球的两态视觉
    'cards/bp-05-personas.html', // 5. 角色 — Jack ↔ Tyler 双态隐喻
    'cards/bp-06-arch.html',     // 6. 架构 — 两个仓库:底层 hook + 桌宠 skin
    'cards/bp-07-install.html',  // 7. 部署 — Windows 三步安装命令
    'cards/bp-08-bip.html',      // 8. build in public — 时间线 + 反思
    'cards/bp-09-cta.html',      // 9. CTA — 评论 "1" 取链接 + 反向提问
  ],

  // The post itself (caption / hashtags / author).
  post: {
    author_name: 'xing0325',
    author_bio: '高三休学 · vibe coding · build in public',
    location: '成都',
    title: 'Claude 每次都问"允许吗"，我让它别问了',
    body: `被一个按钮折磨了半个月。

每次让 Claude 跑 git push、rm、curl、pip install——它都先弹一句"允许吗"。一开始我以为这是设计哲学，挺好。后来发现 settings.json 里把 bypassPermissions 设了根本没用。翻去 GitHub 才知道 #29026 / #38148 / #55095 这仨 issue 还都 open 着，七个月没修。

等不动了，自己绕。

PreToolUse hook 是另一条独立的路。写个脚本，根据一个"哨兵文件"在不在自动 allow 或者放行——文件在就 bypass，删掉就恢复审批。**一个空文件 = 一个开关**。

但光有 hook 不够，"我现在是哪个模式"看不见，容易踩坑。所以给它配了只像素桌宠：屏幕右下角悬浮一个 72px 的小球。
- ACCEPT 模式：绿球 + "审批中"
- BYPASS 模式：红球 + "裸奔中"

单击切换，拖动改位置，永远置顶。

角色用了 Fight Club 的双态：
**ACCEPT = Jack**，那个礼貌、犹豫、每件事都征求你意见的白衬衫；
**BYPASS = Tyler**，镜子里那个不一样的、说干就干的家伙。
同一个 Claude，两副面孔，点一下翻面。

整个东西拆两个仓库：
- claude-bypass-hook：底层 PreToolUse 钩子 + 安装器（必装）
- bypass-pet：桌宠视觉层（可选）

Windows 上三条命令搞定：
git clone → install.ps1 → 重启 Claude Code Desktop。

这套东西不是我"想做"的产品。是被那个按钮逼出来的副产物——从 PowerShell 单文件 → bypass.cmd → 桌宠 → 双仓库，中间还废了一版奶龙形象，pivot 到 Fight Club。高三休学之后开始 vibe coding，不是每次都成事，这次成了。

仓库链接放评论区（小红书不让外链）。
关注我 + 评论"1"我私你两个 URL。

—

你也被这个按钮折磨过吗？
或者，你最想给 Claude 装一个什么样的小工具？`,

    hashtags: [
      'claude', 'claudecode', 'AI编程', 'vibecoding',
      'build in public', '独立开发', '程序员日常',
      '桌面工具', '高三休学', '像素艺术',
    ],

    // Numbers shown in the action bar (likes / comments / collects).
    // Fake-but-realistic for preview purposes.
    stats: { likes: '3.2k', comments: '187', collects: '412' },
  },
};
