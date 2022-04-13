/**
 * 簡易Text-Chat機能
 */
module.exports = (io) => {
  // サーバからのメッセージの送信の際にfromに入れる値
  const SERVER_NAME = 'SERVER';

  // ここではユーザ名ごとにルームを作成している．
  // ユーザ名の配列を返す．
  const allUsernames = () => {
    const usernames = new Set();
    // ルームの一覧からsocketIdがルーム名になっているルームを除く．
    // (socketIdがルーム名となっているルームが暗黙のうちに作成されているため)
    io.adapter.rooms.forEach((socketIds, roomName) => {
      if (!socketIds.has(roomName)) {
        usernames.add(roomName);
      }
    });
    // Setを配列に変換して返す．
    return [...usernames];
  }

  // コネクションがはられた時にsocketを初期化する．
  io.on('connection', (socket) => {
    const username = socket.handshake.auth.username;
    // デバッグ支援用
    console.log(`[/text-chat] Connected from ${username}`);

    // 初期メッセージを受け取った時の処理
    socket.on('join', (data) => {
      // fromと auth.usernameが一致していることを確認する．
      if (data.from === username) {
        // ユーザ名のroomにjoinすることにする．
        socket.join(username);
        // サーバからのWelcomeメッセージを送る．
        socket.emit('message', {
          from: SERVER_NAME, to: username, text: 'connected', time: Date.now()
        });
        const users = allUsernames();
        // デバッグ支援用
        console.log(`[/text-chat] current users: [${users}]`);
        // 現在のユーザリストをブロードキャストする．
        io.emit('userlist', users);
      } else {
        // fromと auth.usernameが一致していなければソケットを閉じる．
        // デバッグ支援用
        console.log(`[/text-chat] join: username ${username} and data.from ${data.from} does not match. Diconnecting...`);
        socket.disconnect(true);
      }
    });

    // メッセージを受け取った時の処理
    socket.on('message', (data) => {
      // サーバでタイムスタンプをつけることにする．
      const msg = { ...data, time: Date.now() };
      // デバッグ支援用
      console.log(msg)
      if (!data.to || data.to === '*') {
        // toが指定されていないか，あるいは'*の場合は，
        // この名前空間に接続されているソケットすべてに転送する．
        io.emit('message', msg);
      } else {
        // 宛先が指定されている場合は宛先のroomに送る
        io.in(data.to).emit('message', msg);
        // 宛先が自分自身でなければ，送信元のsocketにもコピーを送る．
        if (data.to !== data.from) {
          socket.emit('message', data);
        }
      }
    });

    // ユーザ名のリストを返す．
    socket.on('userlist', () => {
      const users = allUsernames();
      io.emit('userlist', users);
    });

    // ディスコネクトした時の処理
    socket.on('disconnect', (reason) => {
      // デバッグ支援用
      console.log(`[/text-chat] Disconnected from ${username}`);
      // 
      const users = allUsernames();
      io.emit('userlist', users);
      // デバッグ支援用
      console.log(`[/text-chat] current users: [${users}]`);
    });

    // ToDoリストのアプリと共用できるようにtodo-updateのサポートを追加する．
    /* ここから */




    /* ここまで */
  });
}
