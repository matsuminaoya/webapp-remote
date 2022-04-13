/**
 * socket.ioを使用したTodoのSupport機能
 */
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`[/todo-support] Connected.`);
    // メッセージを受け取った時の処理
    socket.on('todo-update', () => {
      // todo-updateのメッセージをbroadcastする．
      io.emit('todo-update');
    });
    socket.on('disconnect', (reason) => {
      console.log(`[/todo-support] Disconnected. ${reason}`);
    });
  });
}
