import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TCU-DC PG Docs",
  description: "東京都市大学デジタルコンテンツ研究会プログラミング班引き継ぎ資料",
  lang: 'ja-JP',
  head: [['link', { rel: 'icon', href: '/docs/favicon.ico' }]],
  base: '/docs/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '公式サイト更新マニュアル', link: '/website/readme' }
    ],

    sidebar: [
      {
        text: 'はじめに',
        items: [
          { text: 'このサイトについて', link: '/readme' },
        ]
      },
      {
        text: '公式サイト更新マニュアル',
        items: [
          { text: '公式サイトの更新方法', link: '/website/readme' },
          { text: 'プレビュー機能', link: '/website/preview' },
          { text: 'ログイン', link: '/website/login' },
          { text: 'トップページ設定・全体設定', link: '/website/config' },
          { text: '固定ページ管理', link: '/website/pages' },
          { text: '記事ページ管理', link: '/website/posts' },
          { text: '作品紹介ページ管理', link: '/website/works' },
          { text: '班管理', link: '/website/groups' },
          { text: 'メンバー管理', link: '/website/members' },
          { text: '記事ページ用カテゴリ管理', link: '/website/post_categories' }
        ]
      },
      {
        text: '公式サイト技術マニュアル',
        items: [
          { text: '公式サイトの技術', link: '/website_tech/readme' },
        ]
      },
      {
        text: '入会システム技術マニュアル',
        items: [
          { text: '入会システムの技術', link: '/join_tech/readme' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/TCU-DC' }
    ]
  }
})
