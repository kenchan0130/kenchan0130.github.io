const introduction = "ソフトウェアエンジニアが、試したことやハマったことを気ままに書いています。";
const disclaimer =
  "未来の自分を助けつつ、ときどき誰かの役にも立てたらうれしいです。内容は個人の見解です。";

export const SITE = {
  title: "kenchan0130 blog",
  subtitle: "A software engineer's blog",
  introduction,
  disclaimer,
  description: `${introduction}${disclaimer}`,
  url: "https://kenchan0130.github.io",
  author: "Tadayuki Onishi",
  locale: "ja_JP",
  language: "ja",
  profiles: {
    github: "https://github.com/kenchan0130",
    x: "https://x.com/kenchan0130",
    coffee: "https://www.buymeacoffee.com/kenchan0130",
  },
  analyticsId: "G-B7RX34Q5PL",
  adsenseClient: "ca-pub-2444060431947599",
  adsenseSlot: "7319689305",
  googleSiteVerification: "ZxlKORgZZwZ4TTmaQJFFEXLF3jmd6P_NVU9TEVW1bSg",
} as const;
