/**
 * ToDoアプリ用のWeb API
 * (メモリ中にデータを保持するモックアップ版）
 */
const router = require('express').Router();

module.exports = () => {
  // TODoアプリのデータ
  const todoList = [];

  // ToDoアプリのタスクのidを作成する．
  function* generateTodoItemId(id) {
    while (true) {
      yield id.toString();
      id = id + 1;
    }
  }
  const todoListId = generateTodoItemId(0);

  // タスクの一覧を返す．
  router.get('/', (req, res) => {
    res.json(todoList);
  });

  // :idのタスクを返す．存在しない場合はNot Found (404)を返す．
  router.get('/:id', (req, res) => {
    /* ここから */
    const id = req.params.id;
    const item = todoList.find(item => item._id === id);
    if (item === undefined) {
      res.sendStatus(404);
    } else {
      res.json(item);
    }
    /* ここまで */
  });

  // 新しいタスクを追加する．
  router.post('/', (req, res) => {
    const newItem = req.body;
    newItem._id = todoListId.next().value;
    todoList.push(newItem);
    // 追加されたタスクのURLを返す．ここでは，requestのURLに対するrelative URLを返すことにする．
    res.status(201).location(`${req.baseUrl}/${newItem._id}`).send();
  });

  // idで指定されたタスクを更新する．
  // 本来PUTは，リソースが存在しない場合は新たにリソースを作るが，
  // ここではIDはサーバ側で作成することに統一するため，新たなリソースは作成せず，
  // クライアントエラー(400)の扱いとする．
  router.put('/:id', (req, res) => {
    /* ここから */
    const putItem = req.body;
    const id = req.params.id;
    if (!putItem._id || putItem._id !== id) {
      res.sendStatus(400);
    } else {
      const index = todoList.findIndex((item) => item._id === id);
      if (index < 0) {
        res.sendStatus(400);
      } else {
        // タスクを置き換えることにする．
        todoList[index] = putItem;
        // 204 (No Content)を返す．
        res.sendStatus(204);
      }
    }
    /* ここまで */
  });

  // idで指定されたタスクを削除する．そのようなタスクが存在しない場合はNot Found (404)を返す．
  router.delete('/:id', (req, res) => {
    /* ここから */
    const id = req.params.id;
    const index = todoList.findIndex(item => item._id === id);
    if (index < 0) {
      res.sendStatus(404);
    } else {
      todoList.splice(index, 1);
      res.sendStatus(204);
    }
    /* ここまで */
  });

  return router;
}
