# 本ドキュメントについて

東京都市大学デジタルコンテンツ研究会のプログラミング班が作成しています。

ドキュメントを管理している[GitHub リポジトリ](https://github.com/TCU-DC/docs)のほか、以下の URL からも閲覧できます。

- https://tcu-dc.github.io/docs/

## 目次

### はじめに

- 本ドキュメントについて

### 公式サイト更新マニュアル

- [公式サイトの更新方法](/website/readme.md)
- [ログイン](/website/login.md)
- [トップページ設定・全体設定](/website/config.md)
- [固定ページ管理](/website/pages.md)
- [記事ページ管理](/website/posts.md)
- [作品紹介ページ管理](/website/works.md)
- [班管理](/website/groups.md)
- [メンバー管理](/website/members.md)
- [記事ページ用カテゴリ管理](/website/post_categories.md)
- [プレビュー機能について](/website/preview.md)

### 公式サイト技術マニュアル

- [公式サイトの技術](/website_tech/readme.md)

### 入会システム技術マニュアル

- [入会システムの技術](/join_tech/readme.md)

### GitHub Organization

- [GitHub Organization の管理](github/readme.md)

### Cloudflare

- [Cloudflare の管理](cloudflare/readme.md)

## ドキュメントの技術情報

### `https://tcu-dc.github.io/docs/` について

サイト構築に[VitePress](https://vitepress.vuejs.org/) を利用しています。

デプロイは GitHub Actions で行い、[GitHub Pages](https://pages.github.com/) で公開しています。

### ドキュメントの編集方法

1. このリポジトリをクローンします。

```bash
git clone https://github.com/TCU-DC/docs.git
```

2. ローカルで編集を行います。
3. 変更内容をコミットし、プッシュします。
4. プッシュ後、GitHub Actions により自動的にビルド・デプロイされます。
