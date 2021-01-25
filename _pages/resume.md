---
layout: page
title: "Resume"
permalink: /profile/resume
nav: "only-footer"
---

## 基本情報

大西　正恭 (Tadayuki Onishi)

媒体|リンク
---|---
Blog|[https://kenchan0130.github.io](https://kenchan0130.github.io)
SlideShare|[https://www2.slideshare.net/tadayukionishi/presentations](https://www2.slideshare.net/tadayukionishi/presentations)
Speaker Deck|[https://speakerdeck.com/kenchan0130](https://speakerdeck.com/kenchan0130)
Twitter|[https://twitter.com/kenchan0130](https://twitter.com/kenchan0130)
YouTube|[https://www.youtube.com/channel/UCJAx2EAohTGjRGqG0wWkoNQ](https://www.youtube.com/channel/UCJAx2EAohTGjRGqG0wWkoNQ)

## 職務経歴

### 株式会社FOLIO (2016/06 - 現在)

#### インフラ構築業務

法人向けロボアドSaaSの「4RAP」のインフラを構築しました。
合わせて、マルチテナントかつ証券システムであるがゆえの要件の整理などを行いました。

* AWS（Amazon Web Services）を用いたインフラ構築
* Terraformを用いたリソースの管理
  * AWS
  * Azure AD
  * Datadog
* Datadogによる監視
* Kubernetesのインフラ構築
  * EKSでの構築、運用
  * Helmによるデプロイの運用
* Argo CDによるGitOpsの実現
* Argoによるバッチ基盤の実現
* 監査ログの設計および開発
  * Golang

#### Webアプリケーションエンジニア業務

証券システムである「FOLIO」のサービスの立ち上げから、運用および新機能の開発などを行いました。

* 顧客管理基盤およびKYC（Know Your Customer）基盤のAPIの設計、開発および運用
  * Scala (Finatra)
* 郵送システムの設計、開発および運用
* 証券基幹システムの連携の設計、開発および運用
  * Scala (Finatra)
* 外注ロボアドバイザー基盤の運用
  * Java (Spring Framework)
* ロボアドバイザー基盤のリプレイス
* ロボアドバイザー基盤のバッチの開発および運用
  * Scala (Finatra)
  * Jenkins (Jenkins DSL)
* 社内オペレーション用のWebサービスの設計、開発および運用
  * Ruby (Ruby on Rails v5)
* 業務提携のためのシステム構築および開発

#### 社内情報システム（コーポレートIT）およびセキュリティ業務

社内情報システムに関する環境をゼロから構築および運用しました。
中期からは、社内システムはゼロトラストセキュリティの実現を目指してシステムのリプレイスや構築支援を行いました。

また、セキュリティに関する業務も行いました。

* ベンダーマネジメント
* デバイス調達
* デバイス管理運用
  * Windows
  * macOS
  * iOS/iPadOS
  * Android
* オンプレミスサーバー調達
* Acitive Directoryの構築
  * Windows Server 2012 R2
* Windowsデバイス管理基盤構築
  * GPO設計
  * Micorosoft Intune導入サポート
* macOSデバイス管理基盤構築
  * プロファイルマネージャの構築
    * Jamf Proの導入のため廃止
  * Jamf Proの導入
  * 管理スクリプトおよびポリシー整備
* Android/iOS/iPadOSデバイス管理基盤構築
  * Meraki MDMの導入
    * Micorosoft Intuneの導入のため廃止
  * Micorosoft Intuneの導入サポート
* IdPの整備
  * Oktaの導入
    * Azure ADの導入のため廃止
  * Azure ADの導入サポート
* セキュリティツール導入
  * Lanscope Catの導入
    * Jamf ProおよびMicorosoft Intuneの導入のため廃止
  * Symantecの導入
    * Microsoft Defender ATPの導入のため廃止
  * Microsoft Defender ATPの導入サポート
* パスワードマネージャーの導入
  * LastPassの導入
* サーバー監視システム運用
  * Zabbix
  * Datadog
* 各種SaaS導入および導入支援
* 脆弱性診断のベンダーコントロール
* 自社プロダクトのセキュリティに関する方針整備
  * NISTのセキュリティフレームワークを参考にした
* セキュリティ研修の準備

#### その他、業務改善など

* QA作業効率化のためのTestLinkの構築
* コンプライアンスチェックのためのBot開発および運用
  * TypeScript

#### 「第一種金融商品取引業」取得のためのドキュメント整備

証券会社のライセンス取得に伴うシステム周りの業務を行いました。

* システム要件の整理
  * 金融商品取引業者向けの総合的な監督指針、日本証券業協会規則およびFISCの安全対策基準の精査
  * 社内への施策へ落とし込み
* 社内規程の構築

### 株式会社ディー・エヌ・エー (2014/04 - 2016/05)

#### DeSCヘルスケア株式会社 (出向) (2015/03 - 2016/05)

Webアプリケーションエンジニアとして、健康保険組合向けサービス「kencom」の開発および運用をしました。

* 新機能の企画および設計、実装
* 圧着はがき作成システムの設計、実装
* 健康診断結果データの連携APIおよびバッチの設計、実装
* 社内オペレーション用のWebサービスの開発、運用
* 運用改善
  * テスト高速化
  * Ruby on Rails 5系のアップデート
* CircleCI導入のためのPoC

開発環境としては、

* Ruby (Ruby on Rails v4, v5)
* CoffeeScript
* Vue.js (v1)
* GitHub Enterprise（オンプレミス）
* MySQL
* Redis
* Jenkins

でした。
クラウドサービスは特に利用せず、オンプレミス環境でサービスを運用していました。

#### 株式会社DeNAライフサイエンス (出向) (2014/09 - 2015/03)

Webアプリケーションエンジニアとして、遺伝子検査サービスである「MYCODE」の開発および運用しました。

* 社内オペレーション用のWebサービスの開発、運用
  * サーバーサイド
  * フロントエンド
* 新サービスの企画および設計、実装

開発環境としては、

* Ruby (Ruby on Rails v3)
* CoffeeScript
* AngulrJS (v1)
* Adobe Experience Manager (Java 6)
* GitHub Enterprise（オンプレミス）
* MySQL
* Redis
* Jenkins

でした。
クラウドサービスは特に利用せず、オンプレミス環境でサービスを運用していました。

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
  * Firebaseのサービスを使用して開発およびインフラコストの削減
  * 認証周りの実装
    * Next.js (TypeScript)

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

## プログラミングスキル

* Golang
  * AWSのFaaSであるLambda Functionで動作する、ミニマムなアプリケーションの開発
  * AWSでSAMLでSSOしている場合でもCLIのためのクレデンシャルを作成できるツールにコントリビュート経験有
    * [https://github.com/Versent/saml2aws/pull/509](https://github.com/Versent/saml2aws/pull/509)
    * [https://github.com/Versent/saml2aws/pull/538](https://github.com/Versent/saml2aws/pull/538)
* Java
  * Spring Framewarkのアプリケーションサーバーの運用を担当
  * Spring SecurityのSAML拡張にコントリビュート経験有
    * [https://github.com/spring-projects/spring-security-saml/pull/468](https://github.com/spring-projects/spring-security-saml/pull/468)
    * [https://github.com/spring-projects/spring-security-saml/pull/470](https://github.com/spring-projects/spring-security-saml/pull/470)
* JavaScript (TypeScript)
  * Slack Botの開発
  * MarkdownをAtlassianのWiki記法に変換するツールの開発
    * [https://github.com/kenchan0130/markdown-to-atlassian-wiki-markup](https://github.com/kenchan0130/markdown-to-atlassian-wiki-markup)
    * [https://github.com/kenchan0130/markdown-to-atlassian-wiki-markup-cli](https://github.com/kenchan0130/markdown-to-atlassian-wiki-markup-cli)
* Python
  * macOSのクリップボード上の画像にBlurをかけるツールの開発
    * [https://github.com/kenchan0130/blur-clip-board-image-for-macOS](https://github.com/kenchan0130/blur-clip-board-image-for-macOS)
* R
  * 大学時代の研究でR使用してデータ分析経験有
* Ruby
  * Ruby on Railsのアプリケーションサーバーの運用を担当
  * ブログの構築
  * ブログシステムであるJekyllでの画像の遅延読み込みをサポートするライブラリを作成
    * [https://github.com/kenchan0130/jekyll-lazy-load-image](https://github.com/kenchan0130/jekyll-lazy-load-image)
* Scala
  * Finatraのアプリケーションサーバーおよびバッチの運用を担当
