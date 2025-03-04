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
      { text: '本ドキュメントについて', link: '/readme' },
      { text: '公式サイト更新マニュアル', link: '/website/readme' }
    ],

    sidebar: [
      {
        text: 'はじめに',
        items: [
          { text: '本ドキュメントについて', link: '/readme' },
        ]
      },
      {
        text: '公式サイト更新マニュアル',
        items: [
          { text: '公式サイトの更新方法', link: '/website/readme' },
          { text: 'ログイン', link: '/website/login' },
          { text: 'トップページ設定・全体設定', link: '/website/config' },
          { text: '固定ページ管理', link: '/website/pages' },
          { text: '記事ページ管理', link: '/website/posts' },
          { text: '作品紹介ページ管理', link: '/website/works' },
          { text: '班管理', link: '/website/groups' },
          { text: 'メンバー管理', link: '/website/members' },
          { text: '記事ページ用カテゴリ管理', link: '/website/post_categories' },
          { text: 'プレビュー機能について', link: '/website/preview' }
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
      },
      {
        text: 'GitHub Organization',
        items: [
          { text: 'GitHub Organizationの管理', link: '/github/readme' },
        ]
      },
            {
        text: 'Cloudflare',
        items: [
          { text: 'Cloudflareの管理', link: '/cloudflare/readme' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'youtube', link: 'https://www.youtube.com/@tcu_dc' },
      { icon: 'x', link: 'https://x.com/tcu_dc' },
      { icon: 'github', link: 'https://github.com/TCU-DC' },
    ]
  }
})
