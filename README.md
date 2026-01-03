# MONOSCAPE Portfolio
- 「Craft（職人技）」をコンセプトにした、自身の制作実績を管理・公開するためのポートフォリオサイト

## 開発・更新ガイド
### 実績データの更新
- 実績の追加や説明文の修正は、すべて以下のJSONファイルを編集する。
- `src/data/works.json`

### ローカル環境での確認手順：
- npm install
- npm run dev(開発環境プレビュー)
- npm run preview(dist環境プレビュー)<-リアルタイムに反映されないので注意。

### 本番反映の流れ
- mainブランチにマージすると、GitHub Actionsが走り自動でビルド・デプロイされる。
- 反映されない場合はGitHubのActions タブを確認する。

### 画像圧縮
- vite-plugin-imageminを利用して圧縮しているので、品質を変えたい場合は`vite.config.js`内の`viteImagemin`を編集する。

### 画像の命名規則
- TOP用のサムネイル: thumb_ファイル名.jpg (または .mp4) / 動画用のポスター画像: poster_ファイル名.jpg e.g.) thumb_mono.mp4/poter_mono.jpgをセットで用意。
- 詳細ページ用の素材: ファイル名.jpg (thumb_ や poster_ を除いたもの) 詳細ページのメイン部分にはtopで使用した画像からthumb_を抜いたものが設定されるようになっている。

### Scripts & Logic (JS仕様) 
- mp4形式の動画には、同名のjpgをposter画像に割り当てる仕組みとなっている。top(main.js)はファイル名から`thumb_`を抜くように設定している。

### 詳細ページ
- 詳細ページは、projects.htmlにidを割り振る形にしているため、個々のhtmlの制作は不要。
- また、補足画像のモーダル部分はカテゴリ（Web Graphicsなど）に応じて、グリッド表示とスライダー表示を自動で切り替えるロジックを搭載。

### 共通パーツ
- 共通パーツは`partials`配下に格納

### コピーライト年号
- コピーライトの年号は自動で更新されるようにしているため更新不要
