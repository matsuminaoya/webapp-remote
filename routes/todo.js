/**
 * ToDoアプリ用のWeb API
 * (MongoDB version)
 * ユーザ認証機能が導入されている時は，usernameでフィルタリングする
 */
const router = require('express').Router();
const { ObjectId } = require('mongodb');

module.exports = () => {
  // ここでは，MongoDBとのコネクションは app.locals.dbに設定している．
  // MongoDBのコレクション名
  const COLLECTION_NAME = 'todo';

  router.get('/', async (req, res) => {
    // ユーザ認証がある場合は条件を追加する．
    /* ここから */


    /* ここまで */
    try {
      // データベースからタスク一覧を求める．
      /* ここから */




      /* ここまで */
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  router.get('/:id', async (req, res) => {
    /* ここから */





    /* ここまで */
  });

  router.post('/', async (req, res) => {
    /* ここから */





    /* ここまで */
  });

  // idで指定されたタスクを更新する．
  router.put('/:id', async (req, res) => {
    /* ここから */





    /* ここまで */
  });

  // idで指定されたタスクを削除する．そのようなタスクが存在しない場合はNot Found (404)を返す．
  router.delete('/:id', async (req, res) => {
    /* ここから */





    /* ここまで */
  });

  // すべてのタスクを削除する．（実際にはコレクションを削除している）（デバッグ支援用）
  router.delete('/', async (req, res) => {
    try {
      await req.app.locals.db.collection(COLLECTION_NAME).drop();
      res.sendStatus(204);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  // すべてのタスクを置き換える．（デバッグ支援用）
  router.put('/', async (req, res) => {
    try {
      // まずデータをすべて削除する．
      await req.app.locals.db.collection(COLLECTION_NAME).remove({});
      const items = req.body;
      // _idは振り直すことにする．
      const newItems = items.map(({ _id, ...rest }) => rest);
      const result = await req.app.locals.db.collection(COLLECTION_NAME)
        .insertMany(newItems);
      res.status(201).send(result.insertedIds);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  return router;
};
