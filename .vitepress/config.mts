import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TCU-DC Programming Group Docs",
  description: "東京都市大学デジタルコンテンツ研究会プログラミング班の引き継ぎ資料等をまとめたドキュメント。",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '公式サイト更新マニュアル',
        items: [
          { text: 'ログイン', link: '/website/login' },
          { text: 'トップページ設定・全体設定', link: '/website/config' },
          { text: '固定ページ管理', link: '/website/pages' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/TCU-DC' }
    ]
  }
})
