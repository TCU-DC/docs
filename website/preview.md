# サイト更新 -プレビュー機能-

## プレビュー機能について

- Next.js(App Router) の Draft Mode を利用して、公開前のコンテンツをプレビューできます。

## プレビュー機能が利用できるページ

- [トップページ設定・全体設定](/website/config.md)
- [固定ページ管理](/website/pages.md)
- [記事ページ管理](/website/posts.md)

## プレビューの方法

- `下書き保存` 後に右上の `画面プレビュー` ボタンをクリックすると、プレビュー画面が表示されます。

> [!NOTE]
> プレビュー画面はリアルタイムで更新されません。変更内容をプレビューで確認した場合は「画面プレビュー」ボタンを再度クリックしてください。


### microCMS 操作方法
![](/attachments/20250304211538.png)

### プレビュー画面
![](/attachments/20250304211451.png)

## プレビューURL

- プレビュー画面のURLは、`https://tcu-dc.net/draft/` から始まります。

> [!IMPORTANT]
> プレビュー画面の URL はその場限りのものです。共有はできません。

## プレビューの終了方法

- タブを閉じるか、バナーの `プレビューを終了` ボタンをクリックするとプレビューを終了できます。
- `プレビューを終了` ボタンは micorCMS の管理画面へのリンクです。基本はタブを閉じることを推奨します。

## 開発者向け：microCMS 遷移先URL の設定

- microCMS の管理画面からプレビュー画面への遷移先 URL を設定しています。

### 設定内容

- トップページ
  - `https://tcu-dc.net/api/draft/top/?contentId={CONTENT_ID}&draftKey={DRAFT_KEY}`
- 固定ページ
  - `https://tcu-dc.net/api/draft/pages/?contentId={CONTENT_ID}&draftKey={DRAFT_KEY}`
- 記事ページ
  - `https://tcu-dc.net/api/draft/posts/?contentId={CONTENT_ID}&draftKey={DRAFT_KEY}`

![](/attachments/20250304214336.png)