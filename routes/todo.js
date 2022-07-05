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
    const filter = req.user ?
      { $or: [{ username: req.user.username }, { username: null }] } : {};
    /* ここまで */
    try {
      // データベースからタスク一覧を求める．
      /* ここから */
      const items = await req.app.locals.db.collection(COLLECTION_NAME)
        .find(filter).sort({ _id: 1 }).toArray();
      res.json(items);
      /* ここまで */
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  router.get('/:id', async (req, res) => {
    const filter = req.user ?
      { $or: [{ username: req.user.username }, { username: null }] } : {};
    try {
      const id = req.params.id;
      const item = await req.app.locals.db.collection(COLLECTION_NAME)
        .findOne({ _id: new ObjectId(id), ...filter });
      if (item === undefined) {
        res.sendStatus(404);
      } else {
        res.json(item);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
    /* ここまで */
  });

  router.post('/', async (req, res) => {
    /* ここから */
    try {
      const newItem = req.body;
      const { _id, ...item } = newItem;
      const result = await req.app.locals.db.collection(COLLECTION_NAME)
        .insertOne(item);
      const id = result.insertedId;
      res.status(201).location(`${req.baseUrl}/${id}`).send();
    } catch (error) {
      res.status(500).send(error.message);
    }
    /* ここまで */
  });

  // idで指定されたタスクを更新する．
  router.put('/:id', async (req, res) => {
    const filter = req.user ?
      { $or: [{ username: req.user.username }, { username: null }] } : {};
    /* ここから */
    try {
      const putItem = req.body;
      const id = req.params.id;
      if (!putItem._id || putItem._id !== id) {
        res.sendStatus(400);
      } else {
        const { _id, ...item } = putItem;
        const result = await req.app.locals.db.collection(COLLECTION_NAME)
          .updateOne({ _id: new ObjectId(id), ...filter }, { $set: item });
        if (result.matchedCount === 0) {
          res.sendStatus(400);
        } else {
          res.sendStatus(204);
        }
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
    /* ここまで */
  });

  // idで指定されたタスクを削除する．そのようなタスクが存在しない場合はNot Found (404)を返す．
  router.delete('/:id', async (req, res) => {
    const filter = req.user ?
      { $or: [{ username: req.user.username }, { username: null }] } : {};
    /* ここから */
    try {
      const id = req.params.id;
      const result = await req.app.locals.db.collection(COLLECTION_NAME)
        .deleteOne({ _id: new ObjectId(id), ...filter });
      if (result.deletedCount == 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
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
