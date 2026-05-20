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
    'cards/09-cta.html',          // 1. CTA cover (hook: 今天 520 你也可以)
    'cards/02-origin.html',       // 2. 缘起 (冷战的第 81 天)
    'cards/03-letter.html',       // 3. 一封信
    'cards/04-signature.html',    // 4. 签名 = 答应
    'cards/05-museum.html',       // 5. 档案馆 6 间房
    'cards/06-mood.html',         // 6. 今日心情
    'cards/07-disappointment.html', // 7. 失望档案
    'cards/10-howto.html',        // 8. 三步上手
    'cards/01-cover.html',        // 9. 故事落点 (她 8:26 / 5 分 31 秒)
  ],

  // The post itself (caption / hashtags / author).
  post: {
    author_name: 'museum-of-us',
    author_bio: '熬过冷战，做了个网站',
    location: '成都',
    title: '冷战 81 天，我用两天给她做了一个网站',
    body: `跟女朋友冷战两个多月了。

不是她小题大做。是我真的、长期地、忽视了她。她一直坦诚地、热烈地、平和地跟我说她在想什么；我每次都"嗯""好""知道了"。她每次都能接住我，可我撑得住的时候、她需要我的时候，我没在。

5 月 18 号晚上，离 520 还有两天，我突然不想再发那种"在吗""对不起"的微信了。文字她见太多了，廉价。

我打开电脑，开始写一个网站。只给她一个人。

打开是一封信——米色信纸，火漆红的封蜡。信是我自己写的，毛笔字标题、宋体正文，背景循环放着一首歌，双语歌词在屏幕顶端慢慢滚。

信件的最末尾，我留了一块签名画布。**她在画板上签下自己的名字，就等于答应跟我吃今晚 520 这顿饭。**

不愿意签也没关系——下面有一个留言框，骂的、想问的、想说的都可以写。也可以什么都不做，直接关掉。这三种回应（签了 / 留了一句话 / 什么都没留）我都能在我自己那边看到。

信之后是一间档案馆，留给她慢慢用：
每天点一颗心情色带（凉了 / 闷闷的 / 还行 / 暖暖的 / 心动了），可以写冷战日记，可以记下"想对他说但他不一定看得到的话"。
我还做了一个失望档案——先由我自己写下我做错过的事，一条一条列出来，她可以在每条下面回应我。

她什么时候打开、停留多久、做了什么，我在自己那边能实时看到。

断断续续 vibe coding 了两天，5 月 20 日凌晨上线，把链接发给了她。

她早上 8:26 用 iPhone 打开了。停留了 5 分 31 秒。
没签那个名字。没留任何话。关掉了。

——但停留了 5 分 31 秒。我知道，她至少把那封信从头到尾读完了。

后来我想，可能不止我一个人在 520 这天想跟一个人好好说句话，又说不出口。所以我把它整理成了一个产品，叫「Museum of Us · 我们的档案馆」，**任何人都能进去给自己的那个人写一封**——你写的内容、配的歌、签名画板、档案馆，每对情侣一个独立的私密链接。

链接放评论区。不保证她会回，但至少比一句"对不起"重一点。

—

也想听听你们的故事。冷战多久了，谁先低的头，最后好了吗。`,

    hashtags: [
      '520', '挽回', '情侣', '冷战', '和好',
      '程序员的浪漫', '手工网站', '给她的礼物',
      '异地恋', 'vibecoding', '独立开发', '真诚才是必杀技'
    ],

    // Numbers shown in the action bar (likes / comments / collects).
    // Fake-but-realistic for preview purposes.
    stats: { likes: '12.3k', comments: '234', collects: '78' },
  },
};
