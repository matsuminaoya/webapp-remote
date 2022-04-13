/**
 * Express Web Server
 */
const express = require('express');
const app = express();
const path = require('path');

// データ形式としてJSON, urlencodedをサポートする．大きなデータも送信できるようにlimitを設定する．
app.use(express.json({ extended: true, limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// faviconのサポート
const favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'favicon.ico')));

// 環境変数の設定 (.envファイルがあれば読み込む)
require('dotenv').config();

// 課題提出用のZipファイルの作成
const createZip = require('./createZip.js');
app.get('/createZip/', createZip);

// 動作確認用
app.get('/test', (req, res) => {
  res.send('Template Web Application');
});

// JSON Web Tokenを使った簡易ユーザ認証
const jwt = require('jsonwebtoken');
// 共通鍵の設定
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// usernameとpasswordでログインする．
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // 簡単にするためusernameとpasswordが同じであればログインに成功と扱う．
  if (username && username === password) {
    // JSON Web tokenを生成する．
    const token = jwt.sign({ username: username }, JWT_SECRET,
      // 有効期限を24時間に設定している．
      { expiresIn: '24h' });
    // username と tokenを返すことにする．
    res.json({ username, token });
  } else {
    // Forbidden
    res.sendStatus(403);
  }
});

// ヘッダにトークンがあるかを確認する関数．
const isAuthenticated = (req, res, next) => {
  //authorizationヘッダを取得する．
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const auth = authHeader.split(' ');
    const token = (auth[0] === 'Bearer') && auth[1];
    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
        // Forbiddenを返す
        res.sendStatus(403);
      } else {
        // トークンの内容を req.userに保存する．
        req.user = payload;
        // 次の処理に移る．
        next();
      }
    })
  } else {
    // ヘッダが設定されていなければ，Forbiddenを返す．
    res.sendStatus(403);
  }
};

// Socket.IOにおける認証用の関数
const isAuthenticatedSocketIO = (socket, next) => {
  // console.log('isAuthenicatedSocketIO is called')
  // auth には，usernameとtokenがあることを仮定する．
  const { token } = socket.handshake.auth;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
        next(new Error('auth error'));
      } else {
        next();
      }
    });
  } else {
    next(new Error('no auth in the header'));
  }
};

// メモリ上にデータを保存するバージョンを/mock-todoのURIでアクセスする．
app.use('/mock-todo', require('./routes/mock-todo')());

// MongoDBにデータを保存するバージョンを /todo のURLでアクセスする．
app.use('/todo', require('./routes/todo')());

// MongoDBのバージョンをユーザ認証付きで /todo-secure のURLで提供する．
app.use('/todo-secure', isAuthenticated, require('./routes/todo')());

// 他のAPIの定義をここに書く．

// ブラウザに提供するファイルの格納場所
app.use(express.static(path.join(__dirname, 'dist')));

// リクエストの処理がここまで達したら，Not Found (404) エラーを返す．
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// socket.ioの設定
const server = require('http').Server(app);
const io = require('socket.io')(server);

// ToDoアプリのサポート
const todoSupport = io.of('/todo-support');
require('./socketio/todo-support')(todoSupport);

// TextChat+ToDo
const textChat = io.of('/text-chat');
textChat.use(isAuthenticatedSocketIO);
require('./socketio/text-chat')(textChat);

// ポート番号
const port = process.env.PORT || 3000;

// MongoDBの設定
const { MongoClient } = require('mongodb');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'webapp';

// MongoDBへのコネクションが成立してからサーバを起動することにする．
(async () => {
  let client;
  try {
    // MongoDB コネクションが確立するまで待つ．タイムアウトをデフォルトの30 secから3 sec に短くしている．
    client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, serverSelectionTimeoutMS: 3000 });
    await client.connect();
    // ここでは，データベースを他のファイルからもアクセスできるようにapp.localsにセットしておく．
    app.locals.db = client.db(DB_NAME);
    console.log(`Connected to MongoDB: (${MONGODB_URI})`);
  } catch (error) {
    // MongoDBを使用しない場合を想定し，ServerSelectionエラーは無視する．
    if (error.name !== 'MongoServerSelectionError') {
      console.log(error.message);
    }
  } finally {
    // サーバを起動する．
    server.listen(port, () => {
      console.log(`Listening on port: ${port}`);
    })
    // サーバの終了時にMongoDBとのコネクションもクローズする． 
    const gracefullyShutdown = (signal) => {
      console.log(`${signal} received.`);
      server.close(async () => {
        console.log('HTTP server closed.');
        if (client) {
          await client.close();
          console.log('DB client closed.');
        }
      });
    }
    process.on('SIGINT', gracefullyShutdown);
    process.on('SIGTERM', gracefullyShutdown);
  }
})();
