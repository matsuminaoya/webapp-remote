# Webアプリケーション 雛形

## Node.js 
Node.jsの処理系を https://nodejs.org からダウンロードし，インストールしておく．

## Webサーバのインストール
必要なライブラリをインストールする．
```shell
npm install
```
## バンドラーの起動
Reactのプログラムを変換するためにここではParcel( https://parceljs.org/ )を使用している．
Parcelをバックグランドで動かしておく．
```shell
npm run dev
```
## Webサーバの起動
```shell
npm run start
```
ブラウザからは，`http://localhost:3000/` でアクセスできる．
