---
layout: ../../layouts/MarkdownPageLayout.astro
title: "Resume"
disableTelephoneDetection: true
---

## 基本情報

大西　正恭 (Tadayuki Onishi)

媒体|リンク
---|---
Blog|[https://kenchan0130.github.io](https://kenchan0130.github.io)
GitHub|[https://github.com/kenchan0130](https://github.com/kenchan0130)
SlideShare|[https://www2.slideshare.net/tadayukionishi/presentations](https://www2.slideshare.net/tadayukionishi/presentations)
Speaker Deck|[https://speakerdeck.com/kenchan0130](https://speakerdeck.com/kenchan0130)
X|[https://x.com/kenchan0130](https://x.com/kenchan0130)
YouTube|[https://www.youtube.com/channel/UCJAx2EAohTGjRGqG0wWkoNQ](https://www.youtube.com/channel/UCJAx2EAohTGjRGqG0wWkoNQ)

## 強み・専門領域

* 金融サービスや法人向けSaaSに求められるセキュリティ、監査、可用性を踏まえた基盤の設計と運用
* Webサービスの立ち上げから運用改善までを横断し、業務要件をシステムへ落とし込むバックエンド開発
* ID、デバイス、SaaSを含むコーポレートIT環境の立ち上げと、ゼロトラストを目指した継続的な改善
* APIやInfrastructure as Codeを利用し、手作業の多い運用を再現可能なしくみに変える自動化

## 資格・試験

* 情報処理安全確保支援士（試験合格）

## 職務経歴

### 株式会社FOLIOホールディングス (2025/01 - 現在)

2025年1月に株式会社FOLIOから転籍。FOLIOグループ全体を対象に、情報セキュリティおよび情報システムに関する業務を担当しています。

### 株式会社FOLIO (2016/06 - 2024/12)

#### 法人向けロボアドSaaS「4RAP」のサービス基盤

マルチテナントの法人向けロボアドSaaSを、安全かつ継続的に提供するための要件整理、基盤設計、構築、運用を担当しました。

* 証券システムとして必要なセキュリティ、監査、運用要件を整理し、AWS上のアーキテクチャへ反映
* AWS、Microsoft Entra ID、Datadogの構成をTerraformで管理し、変更を再現・レビューできる運用を整備
* Amazon EKSとHelmによるアプリケーション実行基盤を構築し、Argo CDによるGitOpsを導入
* Argo Workflowsを利用したバッチ実行基盤を構築
* システム上の操作を追跡できる監査ログを設計・実装
* Datadogを利用した監視と継続的な運用改善を実施

#### 個人向け資産運用サービス「FOLIO」の開発・運用

サービスの立ち上げから運用、新機能開発、既存システムの移行までを担当しました。画面やAPIの実装だけでなく、証券業務や社内オペレーションをシステム化するための設計に取り組みました。

* 顧客管理とKYC（Know Your Customer）のAPIを設計・開発し、口座開設に関わる業務を支援
* 顧客向け郵送物を扱うシステムを設計・開発
* 証券基幹システムとの連携を設計・開発し、運用まで担当
* ロボアドバイザー基盤とバッチ処理を運用し、既存基盤をリプレイス
* 社内オペレーション用Webサービスを設計・開発し、手作業をシステム化
* 業務提携に必要なシステム連携を構築

#### コーポレートIT・セキュリティ基盤の立ち上げ

会社の立ち上げ期にコーポレートIT環境をゼロから構築し、その後は事業と組織の成長に合わせて、ゼロトラストを目指した認証・デバイス管理・セキュリティ基盤への移行を進めました。

* Windows、macOS、iOS、iPadOS、Androidを対象に、端末の調達から管理・運用までのしくみを整備
* Active Directoryとグループポリシーによる初期環境を構築し、Jamf ProとMicrosoft Intuneを中心とするデバイス管理へ移行
* Oktaの導入を経て、Microsoft Entra IDを中心とする認証基盤への移行を支援
* エンドポイント保護、パスワード管理、サーバー監視などの製品を選定・導入し、既存製品から移行
* SaaSやデバイスの調達、ベンダーマネジメント、運用ルールの整備を担当
* 脆弱性診断のベンダーコントロールと、診断結果を踏まえた対応を推進
* NIST Cybersecurity Frameworkを参考に、自社プロダクトのセキュリティ方針を整備
* 従業員向けセキュリティ研修の準備を担当

#### 業務改善

* QA作業を効率化するため、テスト管理環境を構築
* コンプライアンスチェックを支援するBotを開発・運用

#### 証券会社登録に向けたシステム統制

証券会社として求められるシステム要件を整理し、社内の施策と規程へ落とし込みました。

* 金融庁が定める監督指針、日本証券業協会が定める規則、FISC安全対策基準を精査
* 規制やガイドラインの要求を、実施可能なシステム施策として整理
* システムに関する社内規程を整備

### 株式会社ディー・エヌ・エー (2014/04 - 2016/05)

#### DeSCヘルスケア株式会社 (出向) (2015/03 - 2016/05)

健康保険組合へ提供するサービス「kencom」の開発・運用を担当しました。利用者向け機能だけでなく、健康診断データの連携や郵送、社内オペレーションまで、サービス提供に必要な業務を幅広くシステム化しました。

* 新機能の企画、設計、実装
* 圧着はがきの作成業務をシステム化
* 健康診断結果を連携するAPIとバッチを設計・実装
* 社内オペレーション用Webサービスを開発・運用
* テストの高速化とRuby on Railsのメジャーバージョンアップを実施
* CircleCI導入に向けたPoCを実施
* オンプレミス環境で稼働するサービスを継続的に運用

#### 株式会社DeNAライフサイエンス (出向) (2014/09 - 2015/03)

遺伝子検査サービス「MYCODE」の開発・運用を担当しました。

* 社内オペレーション用Webサービスを、サーバーサイドとフロントエンドの両方で開発・運用
* 新サービスの企画、設計、実装
* オンプレミス環境で稼働するサービスを継続的に運用

#### その他、業務改善など

* DeNA TechCon（対外向けエンジニアカンファレンス）の初回開催の立ち上げ
  * 登壇者マネジメント
  * 当日運営オペレーション

## 副業経歴

副業先は伏せていますが、必要でしたら直接お答えします。

### 某社 (2020/07 - 2020/10)

* 第三者認証取得に関するコンサルティング
  * どの第三者認証を取得していくかの相談
  * 第三者認証取得のためのドキュメント整備
* 社内情報システムの構築に関するコンサルティング
  * IdP選定のための資料提示
  * 社内情報システムのロードマップ整理

### 某社 (2019/06 - 2020/04)

* ISMSの年次審査に関するコンサルティング
  * 課題に対する実施内容提案
* 社内情報システム構築に関するコンサルティング
  * 統制可能なデバイス選定サポート
  * 統制可能なSaaS選定のための資料提示
  * IdP選定のための資料提示
  * Microsoft 365 E3/E5の提案および構築サポート

## 業務外活動

### Designship

デザインカンファレンス、Designship [https://design-ship.jp/](https://design-ship.jp/)の運営をお手伝いしています。

#### Designship 2020年開催分

* ライブ配信サイトの開発
  * Firebaseを活用し、配信に必要な機能を低いインフラコストで提供
  * 視聴者向けの認証機能を実装

#### Designship 2018年開催分

* 公式サイトのメンテナンス

### 登壇

社内外の勉強会、カンファレンスで発表をしています。
以下は対外的に発表したものです。

* コーポレートエンジニア・カジュアルトーク #2 実例LT [https://corp.connpass.com/event/143310/](https://corp.connpass.com/event/143310/)
  * Local Administrator Password Solution for macOS with Jamf Pro [https://speakerdeck.com/kenchan0130/koporetoenziniakaziyuarutoku-number-2-shi-li-lt](https://speakerdeck.com/kenchan0130/koporetoenziniakaziyuarutoku-number-2-shi-li-lt)
* scala.rookies #1 [https://scala-rookies.connpass.com/event/105904/](https://scala-rookies.connpass.com/event/105904/)
  * 運用を続けていくためのScalaの書き方 [https://speakerdeck.com/kenchan0130/scala-dot-rookies-number-1](https://speakerdeck.com/kenchan0130/scala-dot-rookies-number-1)
* Scramble! #2 Security [https://folio.connpass.com/event/109213/](https://folio.connpass.com/event/109213/)
  * FOLIOのこれまでの情報セキュリティへの取り組みについて [https://speakerdeck.com/kenchan0130/scramble-number-2-security](https://speakerdeck.com/kenchan0130/scramble-number-2-security)
* iOSDC Japan 2018 [https://fortee.jp/iosdc-japan-2018/proposal/0088537d-8ac5-4709-a131-539c48ae2256](https://fortee.jp/iosdc-japan-2018/proposal/0088537d-8ac5-4709-a131-539c48ae2256)
  * 教育・企業におけるデバイス管理について [https://speakerdeck.com/kenchan0130/jiao-yu-qi-ye-niokerudebaisuguan-li-nituite](https://speakerdeck.com/kenchan0130/jiao-yu-qi-ye-niokerudebaisuguan-li-nituite)
* builderscon tokyo 2018
  * イノベーションを止めずに、端末管理と運用を行う方法 [https://speakerdeck.com/kenchan0130/builderscon-tokyo-2018](https://speakerdeck.com/kenchan0130/builderscon-tokyo-2018)
* 学生向けRuby勉強会
  * RubyでWebアプリ入門 [https://speakerdeck.com/kenchan0130/rubydewebapuriwoli-jie-suru](https://speakerdeck.com/kenchan0130/rubydewebapuriwoli-jie-suru)

### コミュニティ

* コーポレートエンジニアや社内情報システムの人が集まるSlack [https://corp-engr.slack.com](https://corp-engr.slack.com)
  * 数十件の質問に回答するなど精力的にコントリビュートしている
* 自身のYouTubeチャンネル https://www.youtube.com/channel/UCJAx2EAohTGjRGqG0wWkoNQ
  * 技術的に気になったことを配信

## プログラミングスキル・OSS活動

言語そのものではなく、公開リポジトリや業務で解決してきた課題を軸にまとめています。

### Infrastructure as CodeとAPI連携

Goを中心に、クラウドやエンタープライズ製品のAPIを扱うツール、SDK、Terraform Providerを開発しています。

* Microsoft Graphで提供されるMicrosoft Entra Global Secure Accessの機能をTerraformから管理できるリソースを実装。[terraform-provider-microsoft365へ継続的にコントリビュート](https://github.com/deploymenttheory/terraform-provider-microsoft365/pulls?q=is%3Apr+author%3Akenchan0130)し、実環境でも検証
* 機密値をTerraform Stateへ保存せず`Cloudflare`を構成するための[Terraform Provider](https://github.com/kenchan0130/terraform-provider-cloudflareext)を開発
* NeonのプロジェクトやブランチなどをTerraformで管理する[Terraform Provider](https://github.com/kenchan0130/terraform-provider-neon)を設計・開発。接続URIをTerraform Stateに保存せず取得する[Ephemeral Resource](https://github.com/kenchan0130/terraform-provider-neon/pull/7)も実装

### デバイス管理と日常業務の自動化

AppleデバイスやMicrosoft Intuneの運用で発生する手作業を、CLIやスクリプトとして再利用できる形にしています。

* Microsoft Intuneのアプリケーション配布用パッケージをWindows、macOS、Linuxで作成・展開できる[intunewin CLI](https://github.com/kenchan0130/intunewin)をGoで開発
* 管理対象macOSのプライバシー権限に関する運用を支援する[TCC Permitter](https://github.com/kenchan0130/TCC-Permitter)を開発
* macOS上のクリップボード画像をすぐにぼかせる[小さな業務支援ツール](https://github.com/kenchan0130/blur-clip-board-image-for-macOS)を開発

### Webサービスと開発ワークフロー

業務ではScala、Java、Ruby、TypeScriptを用いたWeb API、バッチ、社内向けWebサービスの設計・開発・運用を経験しています。

* Markdownで書いた文書をAtlassian Wiki記法へ変換する[TypeScriptライブラリ](https://github.com/kenchan0130/markdown-to-atlassian-wiki-markup)と[CLI](https://github.com/kenchan0130/markdown-to-atlassian-wiki-markup-cli)を開発・公開
* Spring SecurityのSAML拡張へコントリビュート（[PR #468](https://github.com/spring-projects/spring-security-saml/pull/468)、[PR #470](https://github.com/spring-projects/spring-security-saml/pull/470)）
* Jekyllで記事画像の遅延読み込みを実現する[プラグイン](https://github.com/kenchan0130/jekyll-lazy-load-image)を開発
* Pythonによる小規模ツール開発と、Rを用いた研究データの分析経験
