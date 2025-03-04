# 入会システム解説

> [!NOTE]
> このマニュアルは [Qiitaに投稿した記事](https://qiita.com/shokm/items/e5c81b18a76d2a46fc0b) の再掲です。

## 経緯

### 前提
- 私の所属する「[東京都市大学デジタルコンテンツ研究会](https://tcu-dc.net/)」ではサークル活動にDiscordを使用している
- 一年の入会者数は約80人
- 大学の規則で東京都市大学に所属する学生のみ入会可能
- 入会希望者には、（勧誘期間を除き）HPや𝕏から問い合わせを送ってもらい個別にやりとり


### 問題点
- 入会希望者が多いので個別に対応すると返信が大変。問い合わせを見逃す可能性もある
- 勧誘期間は直接Discordに参加した後、Googleフォームで学籍番号・本名などの情報を入力してもらっていたが、入力忘れによる取りこぼしがあった

以上のような状態であったため、デジタルコンテンツ研究会ではサークル入会とDiscord招待リンクの送付を自動化することにしました。

## 必要な機能

- 東京都市大学の学生であることの確認
- 大学への提出に必要な学籍番号、学部学科、本名の収集
- Disocrdサーバーへの招待リンクの送付
    - なお招待リンクは外部への流出を避けるため固定ではなくユーザごとにランダムが望ましい
- サークル運営者への新規入会者通知

## 使用する技術

なんと無料です。

- Googleフォーム
- Google Apps Script
- Discord API
- Cloudflare Workers（プロキシ用）

## フロー
![フロー.png](/attachments/c2a6fc1f-ebee-9ec3-e9ad-c78c9b24365d.png)


学籍番号メール宛にDiscord招待リンクを送付することで、学生本人であることの確認をします。
フロントエンド・バックエンドと記載するのが正しいのか分かりませんが、大体伝わりますでしょうか。

## 実装

### Googleフォーム作成

以下を必須項目として入会希望者に入力してもらいます。

- 学籍番号メール
- 氏名
- Discordアカウント名
- 学部
- 学科

学籍番号メール以外の入力ができないようバリデーションをかけます。
（余談ですが、フォームの運用当初は末尾に「～で終わる」を意味する `$` がなかったため、 `@tcu.ac.jp.example.com` がすり抜ける危険な状態になっていました）

![1702127093893.jpg](/attachments/89e9df3e-bd7a-f350-962a-2a00e4643044.jpeg)

### Google Apps Script

Googleフォーム編集画面からスクリプトエディタを開きます。

![1702127710983.jpg](/attachments/1ef5b380-3bf1-abba-e932-e641c3d6519b.jpeg)

編集画面が現れるので、実装していきます。

![1702130737806.jpg](/attachments/10b0cec8-26a0-d163-f499-e8848dfaf439.jpeg)

機能ごとに以下の4つにファイルを分割しています。

- 環境変数.gs
- メール自動返信.gs
- Discord通知.gs
- Discord招待コード自動発行.gs

#### 環境変数.gs

```js
/* 【設定】 Discord招待コード（招待コード自動発行に失敗した場合に使用するため、有効期限が無制限のものを設定） */
/* 'https://discord.gg/JqHTZW5JRm'であれば、'JqHTZW5JRm'の部分のみを入力 */
const DISCORD_INVITE_CODE = 'XXXXXXXXXX';

/* 【設定】 DiscordのウェブフックURL */
const WEB_HOOK_URL = 'https://discord.com/api/webhooks/00000000000000000000/XXXXXXXXXXXXXXXXXXXX';

/* 【設定】 Discord BOT APIキー */
const DISCORD_BOT_API_KEY = 'XXXXXXXXXXXXXXXXXXXX.XXXXX.XXXXXXXXXX';

/* 【設定】 Discord API URL */
/* 現在は Google Apps Script から直接 Discord API を使用できないため、 Cloudflare Workers でプロキシをおこなっている */
const DISCORD_API_URL = 'https://example.example.workers.dev/invites';

```
#### 補足

##### DiscordのウェブフックURL

Discordのチャンネルに投稿するための設定です。
ウェブフックURLはチャンネルの設定から発行することができます。

![1702132852319.jpg](/attachments/4f9ed604-c78c-14be-4ac6-75f77962d5a1.jpeg)

このウェブフックURLに情報を送ると、以下のようにウェブフックからチャンネルへ投稿が可能になります。

![1702132983654.jpg](/attachments/dbe2d1c6-323c-498a-7309-d9f222958f57.jpeg)

##### Discord API URL

GAS から直接 Discord API にアクセスできないため（※原因は後述）、何かしらの方法で API の通信を中継してください。

#### メール自動返信.gs

入会フォームに記載された学籍番号メールへDiscordサーバーへの招待リンクを送信します。

```js

async function sendMailOnSubmit(e){
  let message = '';
  let usermail;
  let username;

  let itemResponses;
  try {
    itemResponses = e.response.getItemResponses();
  } catch(e) {
    notifyDiscordWhenSendEmailError(e, usermail, username);
  }

  // 招待コード発行（失敗した場合は無期限の招待コードを設定）
  let discordInviteCode;
  try {
    discordInviteCode = await fetchInviteCode();
  } catch(e) {
    discordInviteCode = DISCORD_INVITE_CODE;
  }

  for (let i = 0; i < itemResponses.length; i++) {
    let itemResponse = itemResponses[i];
    let question = itemResponse.getItem().getTitle();
    let answer = itemResponse.getResponse();

    // Googleフォーム項目のタイトルと合わせる必要あり
    if (question == 'メールアドレス'){
      usermail = answer;
    }
    if (question == '氏名'){
      username = answer;
    }

    message += question + '：' + answer + '\n';
  }

  /* ユーザー宛メール送信設定 */
  // 件名・文面の設定
  const title = '件名';
  const content = `${username} 様

${message}
【Discordサーバー招待リンク】
https://discord.gg/${discordInviteCode}
招待コード: ${discordInviteCode}

文面はサンプルです。`;

  const options = {from: 'XXXXXX@gmail.com', name: 'デジタルコンテンツ研究会', replyTo: 'XXXXXX@example.com'};

  // 送信
  try {
    GmailApp.sendEmail(usermail, title, content, options);
  } catch(e) {
    notifyDiscordWhenSendEmailError(e, usermail, username);
  }
}

```

#### Discord通知.gs

入会フォームが送信された際にDiscordへ通知を送信します。
エラー時の通知も行っています。

```js

function notifyDiscordOnSubmit(e) {
  let itemResponses;
  try {
    itemResponses = e.response.getItemResponses();
  } catch(e) {
    notifyDiscordWhenWebhookError(e);
  }

  // Discordに表示する文章
  let messageBody;

  messageBody = '--------------------\n';

  // 学籍番号表示（メアドから数字のみ抽出）
  messageBody += '学籍番号：g' + itemResponses[0].getResponse().replace(/[^0-9]/g, '') + '\n';

  for (let i = 1; i < itemResponses.length; i++) {
    let itemResponse = itemResponses[i];
    let question = itemResponse.getItem().getTitle();
    let answer = itemResponse.getResponse();

    messageBody += question + '：' + answer + '\n';
  }

  const message = {
    'content': messageBody, 
    'tts': false,
  }

  const param = {
    'method': 'POST',
    'headers': { 'Content-type': 'application/json' },
    'payload': JSON.stringify(message)
  }

  // 送信
  try {
    UrlFetchApp.fetch(WEB_HOOK_URL, param);
  } catch(e) {
    notifyDiscordWhenWebhookError(e);
  }
}

function notifyDiscordWhenSendEmailError(error, usermail, username) {
  // Discordに表示する文章
  let messageBody = `--------------------
@everyone
# !!!【要対応】メール送信エラー!!!
入会メールを送信する際にエラーが発生しました。
入会者にDiscordサーバーへの招待リンクが通知されていません。
手動でDiscordサーバへの招待リンクを記載したメールを送信してください。
### 該当会員
- メールアドレス：\`${usermail}\`
- 氏名：\`${username}\`
※上記が\`undefined\`や空の場合、このメッセージの送信時刻とGoogleフォームの受付時刻を照らし合わせる、Gmail（\`tcu.dcs@gmail.com\`）の送信済メールを確認するなどして特定をお願いします。
### エラー内容
\`${error}\`
`;

  const message = {
    'content': messageBody, 
    'tts': false,
  }

  const param = {
    'method': 'POST',
    'headers': { 'Content-type': 'application/json' },
    'payload': JSON.stringify(message)
  }

  // 送信
  try {
    UrlFetchApp.fetch(WEB_HOOK_URL, param);
  } catch(e) {
    notifyDiscordWhenWebhookError(e);
  }
}

function notifyDiscordWhenWebhookError(error) {
  // Discordに表示する文章
  let messageBody = `--------------------
Discord通知の過程でエラーが発生しました。
### エラー内容
\`${error}\``;

  const message = {
    'content': messageBody, 
    'tts': false,
  }

  const param = {
    'method': 'POST',
    'headers': { 'Content-type': 'application/json' },
    'payload': JSON.stringify(message)
  }

  UrlFetchApp.fetch(WEB_HOOK_URL, param);
}

```

#### Discord招待コード自動発行.gs

そのままでは GAS から Discord API へのアクセスできないため、Cloudflare Workers でプロキシしています。
そのため、Discord API のエンドポイントを環境変数で設定した場合にはエラーが起こります。
`let data = JSON.stringify({"max_age": 604800,"max_uses": 1,"unique": true});` の部分で有効期限7日、利用回数1回に制限しています。

```js
function fetchInviteCode() {
  let url = DISCORD_API_URL;
  let headers = {
    'Authorization': 'Bot ' + DISCORD_BOT_API_KEY,
    'Content-Type': 'application/json',
  };
  let data = JSON.stringify({"max_age": 604800,"max_uses": 1,"unique": true});
  let options = {
     'method' : 'post',
     'payload' : data,
     'headers' : headers,
     'muteHttpExceptions': true
  };
  // 招待コード取得
  let response = UrlFetchApp.fetch(url, options);
  // レスポンスが200以外の場合はエラーを返却
  if (response.getResponseCode() !== 200) {
    throw new Error();
  }
  let json = JSON.parse(response.getContentText());
  return json.code
}

```

### GASのトリガーを設定

`実行する関数`を選択し、`イベントの種類を選択`を**フォーム送信時**に設定します。

![1702132427788.jpg](/attachments/1a95dfba-bce3-1765-1afa-0843015948cb.jpeg)

今回は以下の二つの関数をフォーム送信時に実行します。

- sendMailOnSubmit
- notifyDiscordOnSubmit

![1702132453756.jpg](/attachments/28ad18dc-82de-f004-dc3a-2d81e793a763.jpeg)

### つまづいたところ

#### 問題： GAS から Discord API へのアクセス不可能

APIにアクセスしてDiscordサーバーの招待リンク発行を行いたいのですが、Google Apps Script から直接 Discord API へのアクセスはできないようです。
以下の記事の方が原因を分析してくださっていますが、Discord API の利用時に適切な User Agent を設定する必要があるが、GAS では User Agent の設定ができません。

https://qiita.com/Chrysanthemum94/items/25ffa5683beda15d4917

#### 対処方法: Cloudflare Workers で通信を中継

下記のサイトのコードを参考にしています。

https://balloon-jp.vercel.app/cloudflare-workers/

とりあえず動けばいいやの精神で書いたので非常に雑です。
[Discord API のドキュメント](https://discord.com/developers/docs/reference#user-agent)に従い、User-Agentを適切な値に書き換えて Discord API にアクセス→結果を返却しています。

```js
const proxyMAP = new Map([
  ["/invites", "https://discordapp.com/api/channels/XXXXXXXXXXXXXXXXXX/invites"],
])

async function handleRequest(request) {

  let newHeader = new Headers(request.headers)
  newHeader.set("User-Agent", "$User-Agent: DiscordBot (xxxxxxxx, 0)")

  const requestURL = new URL(request.url)
  const location = proxyMAP.get(requestURL.pathname)
  const search = requestURL.search

  if (location) {
    return await fetch(location + search, {
      method: request.method,
      body: request.body,
      headers: newHeader
    })
  }

  return new Response("Not Found", {
    headers: { "content-type": "text/plain" },
    status: 404
  })
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})
```

## 完成

### 新規入会者への招待リンク送付

![1702136134384.jpg](/attachments/95883889-c391-1603-0ac7-434d86a81171.jpeg)

### 管理者向け通知
![1702132983654.jpg](/attachments/dbe2d1c6-323c-498a-7309-d9f222958f57.jpeg)
