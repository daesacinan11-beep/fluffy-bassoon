window.GIFT_CONFIG = {
  meta: {
    pageTitle: "For you — Sherica",
    herName: "MY SIOPAO <3",
  },
  spotifyUrl: "https://open.spotify.com/playlist/4SuAdY4XmQsdbrzLMXjLPz?si=1d14c0287f0a46df&pt=4f80a84c52c32dc8d1ffa18be4fab588",
  bgm: {
    src: "assets/leonora.mp3",
    volume: 0.11,
  },
  steps: [
    {
      id: "welcome",
      kind: "intro",
      title: "Ano, tara jay?",
      body: `
        <p>If you're reading this, you scanned the thing, which means it's officially your day.</p>
        <p>This is a small, silly, sincere surprise I built for you. There will (hopefully) be laughter, soft moments, and at least one moment where I probably overshot and made it cringey.</p>
        <p>Whenever you're ready, tara na!</p>
      `,
    },
    {
      id: "gate-1",
      kind: "gate",
      title: "Checkpoint 1 — Something only you'd know",
      body: `
        <p>Unang-una sa lahat, ano ang letcheng palayaw mo sa 'kin?</p>
        <p><strong>Extra:</strong> Eto 'yung tinawag mo sa 'kin kasi papansin ka at nagkamali lang ako 🙄</p>
      `,
      answers: ["Puto Bambang", "puto bambang", "Puto Bambang", "puto Bambang"],
      hint: "Grabe na nga lauf mo sa 'kin, di mo pa maalala ang letcheng palayaw mo sa 'kin? Nickname mo talaga 'to sa 'kin sa TikTok!",
      image: null,
    },
    {
      id: "interlude-photos",
      kind: "interlude",
      title: "List 1: things you've ruined for me",
      body: `
        <p>Eto 'yung listahan na kung saan I won't ever see the same because of you and I'll always remember you, letche 😒</p>
        <p>1. The color blue</p>
        <p>2. Siopao and Puto Bambang (🙄)</p>
        <p>3. Mga isip-bata na gusto bilhin lahat ng nakikita niya WHAHAHAHAHAHAH</p>
        <p>4. Pisngi, bwiset kasi 'yang pisngi mong sarap pisilin eh 🥺✌</p>
        <p>5. K-Drama and other Korean-related things</p>
        <p>And to be frank, there'd be another million things I want to list down, but for the sake of keeping things short, hanggang five lang muna. Just know, you will always hold a special place in my heart. 🤞🙆🏻‍♂️</p>
      `,
      image: null,
    },
    {
      id: "interlude-photos",
      kind: "interlude",
      title: "Exhibit A: proof we're unserious",
      body: `
        <p>Siguro dapat talaga nakakulong tayo sa mental hospital eh 'no?</p>
      `,
      image: "assets/seanshe.jpeg",
    },
    {
      id: "gate-2",
      kind: "gate",
      title: "Checkpoint 2 — Oh isa pa WHAHAHAHAHAHA",
      body: `
        <p>Ano 'yung first movie na pinanood natin parehas and the first time we held hands?</p>
      `,
      answers: ["The Whistle", "Whistle", "the whistle", "the Whistle", "whistle movie", "The whistle movie"],
      hint: "aray moh, 'di niya alam. nakalimutan agad 💔",
      image: null,
    },
    {
      id: "rate-me",
      kind: "rating",
      title: "Performance review (very serious)",
      body: `
        <p>In the interest of transparency: what would you rate me, from 1 out of 5 stars?</p>
        <p><strong>Fine print:</strong> This will affect my emotional state heavily.</p>
      `,
      starMessages: [
        `<p><strong>1 star:</strong> Ouch. I'm drafting a strongly worded comment in the group chat and will be messaging Gle Cy Reyes.</p>`,
        `<p><strong>2 stars:</strong> Okay… rude but fair. I'm logging this under “constructive feedback na nakaka-hurt haha".</p>`,
        `<p><strong>3 stars:</strong> Mid? MID? After everything I memed through for you? Ganyan ka naman eh, wala na, wala na, wala na. 💔🥀</p>`,
        `<p><strong>4 stars:</strong> Isa na lang, 'di pa pinerfect oh, papansin 🙄😒 alam ko namang napindont mo lang 🥰🥰.</p>`,
        `<p><strong>5 stars:</strong> Pakak. Alam ko naman talagang perfect ako, no need to say it out loud. Thank you ah — lalaki na ulo ko na mga 10x.</p>`,
      ],
      requireStarPick: true,
    },
    {
      id: "two-truths-lie",
      kind: "twoTruthsLie",
      title: "Two truths & a lie — us edition",
      body: `
        <p>Pick one. Two of these are true. One is a lie (or at least “creative truth”). Tap to see what you unlocked.</p>
      `,
      requirePick: true,
      options: [
        {
          label: "I practiced what to say before our first serious talk.",
          isLie: false,
          reveal: `<p><strong>Truth.</strong> I absolutely ran lines in my head like I was auditioning for something. Proud and embarrassed to admit that.</p>`,
        },
        {
          label: "Mahal na mahal mo 'ko tapos miss na miss mo 'ko araw-araw",
          isLie: true,
          reveal: `<p><strong>Lie.</strong> Haha, lie pala 'yan. Sakit mo naman grabe, ouchhh 💔💔</p>`,
        },
        {
          label: "You've made ordinary days feel like adventures that I wish never ended.",
          isLie: false,
          reveal: `<p><strong>Truth.</strong> The boring stuff became funny, soft, or memorable because you were in the picture. At 'yun 'yung rason kung bakit sa 'yo ako.</p>`,
        },
      ],
    },
    {
      id: "scratch-surprise",
      kind: "scratch",
      title: "Scratch-Off",
      body: `
        <p>May nakatago sa ilalim ng gray. Scratch mo — parang lotto ticket, pero 'di ka man lang nanalo sa buhay (eme, ako pala 'yung nanalo sa 'yo).</p>
      `,
      reveal: `
        <p><strong>Boom.</strong> Happy birthday ulit — figured you’d enjoy doing a tiny manual task for me as your gift to yourself.</p>
        <p>Seriously: thank you for being you. This page is cheaper than jewelry but it has more commits from me than anything else I've ever had to do.</p>
      `,
      scratchClearPercent: 0.32,
      scratchBrush: 28,
      requireScratch: true,
      showRevealLink: true,
    },
    {
      id: "finale-lore",
      kind: "interlude",
      title: "Your Complete Info",
      body: `
        <p>You know how people build “a lover's table”—a little wiki of two people, inside jokes, characteristic, the whole timeline? I love it. But for this bit I wanted something narrower on purpose since its your special day:  <strong>just you.</strong></p>
        <p>They say to be loved is to be seen. So here’s a scrap of what I see—the quiet stuff, the loud stuff, the you that doesn’t need to earn the spotlight. Not a performance or a farce or anything fake.</p>
        <div class="lore-sheet" role="region" aria-label="Your lore">
          <p class="lore-line"><strong>Known favorites.</strong> I know your favorite color is blue (pastel/midnight blue) and that your favorite number is somewhere a mix of 2 and 10. I know that your favorite flowers are hydranges and lily of the valleys and even just roses. I know you prefer both cats and dog but obviously prefer cats. I know that you're a night person and that you prefer winter. i know your favorite drink is mogu-mogu, especially the lychee flavor. I know that your favorite snacks are ones that are potatoes, but specifically potato chips from Oishi and that your favorite dessert is ice cream more specifically the cookies and cream flavor. I know that your sports are chess, badminton, and your "multo" volleyball. I know that your favorite k-drama series are queen of tears and business proposal. I know you have a wide range of hobbies, including paintin and drawing, crocheting, baking, playing the piano, journaling, and of course reading. I know that your favorite ulam are the top three: adobo, sinigang, and chicken curry. These are just some of the </p>
          <p class="lore-line"><strong>Observable traits.</strong> Humor that keeps up with (and sometimes outruns) the chaos. Will make you cry of laughter and then suddenly her mood shifts and she rolls her eyes because you said something a little mean. Softness you don’t always announce and only present to a select few. I'm lucky to be part of that group. Courage in small, everyday ways—showing up, trying again, letting someone in. The bravery it takes to be the sort-of "mom" in your friend group.</p>
          <p class="lore-line"><strong>Canon events.</strong> Ordinary days that felt like adventures because you were in the picture. The firsts we didn’t know were firsts until later. The version of you I think about when I say I’m glad it’s <em>you</em>. I had never thought I'd live to see the day that someone as great of a person such as you will ever walk into my life. Not only did that happen, it happened and we were each other's special person. It all feels like a dream somehow.</p>
          <p class="lore-line"><strong>Status.</strong> Seen and loved by none other than the GOAT: me. Worth every silly step it took to get here. Happy birthday, Sherica—my one and only siopao.</p>
        </div>
        <p>Of course, if I did try to fit every single thing about you, this would never end. I wish I could really list down all the things I know about you, maybe just for funsies, or to prove a point, or to comfort you. But know, that being loved by someone like me will always make you seen, and I will try my best to keep it that way, magpakailanman.</p>
      `,
    },
    {
      id: "finale",
      kind: "finale",
      title: "Last stop — A track of you",
      body: `
        <p>And here’s a playlist—made for you and us: what we listen to, what marks time, what I hope feels like a hug in audio form. Press play when you’re ready.</p>
        <p>There’s a letter, too: not on this screen on purpose. When the music’s going, open what I gave you on paper. That’s the part ink keeps better than pixels.</p>
      `,
    },
  ],
};
