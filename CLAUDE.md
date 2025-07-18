# ブログ記事執筆スタイルガイド

このファイルは、kenchan0130.github.io のブログ記事を執筆する際のスタイルガイドです。
過去の記事から分析した文章の特徴と執筆方針をまとめています。

## ファイルの目的

- ブログ記事執筆時の文体・構成・表現の統一を図るためのガイドライン
- AI やその他の執筆支援ツールを使用する際の参考資料
- 一貫性のある読みやすい記事を作成するための指針

## 文章の基本スタイル

### 文体

- **基本文体**：です・ます調で統一
  - 例：「〜されました」「〜します」「〜できます」
  - 避ける：である調（「〜である」「〜だ」）

### 段落構成

- **1段落の長さ**：2〜5文程度
- **改行の使い方**：意味のまとまりごとに段落を分ける
- **箇条書きの活用**：技術的な説明や手順説明では積極的に使用

### よく使う表現・フレーズ

#### 記事の導入部
- 「今回は〜について紹介します」
- 「〜がリリースされました」
- 「〜で発表された〜」

#### 説明・解説
- 「〜することで、〜できます」
- 「〜する必要があります」
- 「〜となります」「〜となる予定です」
- 「〜する場合は」
- 「詳しくは〜を参照してください」

#### 意見・推測
- 「〜と思います」
- 「〜と考えています」
- 「〜かもしれません」
- 「〜ではないでしょうか」

#### 接続詞
- 「また、」（追加情報）
- 「しかし、」「ただし、」（逆接・注意）
- 「そのため、」「これにより、」（因果関係）
- 「たとえば、」（具体例）

### 読者との距離感

- 丁寧語を基本とし、親しみやすさを保つ
- 断定的な表現を避け、柔らかい表現を使用
- 読者の知識レベルを想定し、専門用語は初出時に説明
- 事実と筆者の感想であることがわかるようにする

### 具体例の使い方

- 「たとえば、〜のような場合」で実例を提示
- コードブロックで実際の設定例を示す
- スクリーンショットで視覚的に説明
- ユースケースを明確に提示

## 執筆の基本方針

### 記事を書く目的

1. **技術情報の共有**：自分が学んだ・解決した技術的な内容を他者と共有
2. **備忘録**：将来の自分や他の人が参照できる形で知識を整理
3. **コミュニティへの貢献**：日本語での技術情報を充実させる

### 内容の選定基準

- 自分が実際に試した・経験した内容
- 公式ドキュメントだけでは分かりにくい点の補足
- 日本語情報が少ない技術トピック
- イベントやカンファレンスで得た新しい知見

### 情報開示のバランス

- 一次情報（公式ドキュメント）への参照を必ず含める
- 自分の環境・前提条件を明記
- 成功例だけでなく、注意点や制限事項も記載
- セキュリティに配慮し、機密情報は含めない

### 避けている表現・好んで使う表現

#### 避ける表現
- 断定的すぎる表現（「絶対に」「必ず」）
- 読者を見下すような表現
- 不必要な専門用語の羅列

#### 好んで使う表現
- 「〜できます」（可能性を示す）
- 「〜と思います」（意見であることを明示）
- 「参考：」「注意：」（情報の種類を明確化）

## 記事の構成要素

### 典型的なタイトルの付け方

#### パターン
1. **実践系**：「〜する」「〜してみた」
   - 例：「Terraform で AWS アカウントを跨いだリソース管理をする」
2. **解説系**：「〜について」「〜の紹介」
   - 例：「Apple Business Manager の User Enrollment について」
3. **ニュース系**：「〜で発表された〜」
   - 例：「WWDC 2024 で発表された iOS の新機能」

#### タイトルの特徴
- 具体的な技術名・製品名を含める
- 記事の内容が一目で分かるようにする
- 検索されやすいキーワードを含める

### 導入部の書き方

1. **背景説明**：なぜこのトピックを扱うのか
2. **対象読者**：誰向けの記事なのか（必要に応じて）
3. **記事の概要**：何について説明するのか
4. **前提条件**：必要な知識や環境

例：
```markdown
先日、AWS で複数アカウントを管理する必要が出てきました。
今回は、Terraform を使って AWS アカウントを跨いだリソース管理を
実現する方法について紹介します。

この記事では、以下の内容を扱います：
- AssumeRole の設定方法
- Terraform での provider 設定
- 実際の使用例
```

### 本文の展開パターン

1. **概要説明**：トピックの基本的な説明
2. **詳細説明**：技術的な詳細、仕組みの解説
3. **実装・設定例**：具体的なコードや設定
4. **動作確認**：実際の動作や結果
5. **注意点・トラブルシューティング**：ハマりポイントや解決策

### 結びの特徴

- 「終わりに」「まとめ」セクションを設ける
- 記事の要点を簡潔にまとめる
- 今後の課題や発展的な内容への言及
- 参考資料へのリンク集

例：
```markdown
## 終わりに

今回は〜について紹介しました。
〜することで、〜が実現できます。

今後は〜についても試してみたいと思います。
```

## その他の特徴

### 記号・括弧の使い方

- **「」（かぎ括弧）**：用語の強調、UI の文言、引用
  - 例：「AssumeRole」を使用します
- **（）（丸括弧）**：補足説明、英語表記の併記
  - 例：ユーザー登録（User Enrollment）
- **``（バッククォート）**：インラインコード、コマンド、ファイル名
  - 例：`terraform apply` コマンドを実行
- **太字（`**`）**：特に重要なポイント
  - 例：**注意：この設定は必須です**

### 数字・期間の表記

- **西暦**：半角数字（2024年）
- **バージョン**：半角英数字（v1.0、iOS 17、macOS 14.0）
- **時間**：漢字表記（3時間、30分）
- **日付**：YYYY-MM-DD 形式（2024-12-16）

### 引用やコードブロックの使い方

#### コードブロック
- 言語を必ず指定（```sh、```hcl、```yaml など）
- 実行可能なコード例を提示
- 長いコードは重要部分を抜粋

```markdown
```sh
# 実行例
terraform init
terraform plan
terraform apply
```
```

#### 引用
- 公式ドキュメントからの引用は > を使用
- 出典を明記

### 画像の使い方

- 画像には代替テキストを設定
- UI の説明では画像を積極的に活用
- Jekyllを使用しているためテンプレートエンジンが使える
    - 画像は /assets/posts/post/記事ファイル名の日付 ディレクトリに保存
    - ディレクトリに設置したファイルは {% asset_path sample.png %} のように参照

### リンクの書き方

- 公式ドキュメントへのリンクを優先
- 日本語記事がある場合は併記

## textlint 準拠事項

- `yarn lint:run:textlint` が通ることを確認
- 文体の統一（です・ます調）
- 適切な句読点の使用
- 冗長な表現の回避

## 記事作成時のチェックリスト

- [ ] タイトルは内容を適切に表しているか
- [ ] 導入部で記事の目的が明確か
- [ ] 技術用語に説明があるか
- [ ] コード例は動作確認済みか
- [ ] スクリーンショットは最新か
- [ ] 参考リンクは有効か
- [ ] textlint のチェックは通るか
- [ ] 機密情報は含まれていないか