import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TCU-DC PG Docs",
  description: "東京都市大学デジタルコンテンツ研究会プログラミング班引き継ぎ資料",
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
          { text: '固定ページ管理', link: '/website/pages' },
          { text: '記事ページ管理', link: '/website/posts' },
          { text: '作品紹介ページ管理', link: '/website/works' },
          { text: '班管理', link: '/website/groups' },
          { text: 'メンバー管理', link: '/website/members' },
          { text: '記事ページ用カテゴリ管理', link: '/website/post_categories' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/TCU-DC' }
    ]
  }
})
