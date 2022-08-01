import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from './Authenticate';
import { SocketContext } from './WithSocket';

export const ToDoList = (props) => {
  const [items, setItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [itemInput, setItemInput] = useState('');

  const inputBirthRef = useRef();
  const inputGenderRef = useRef();
  const inputMailRef = useRef();

  const user = useContext(LoginContext);
  const authHeader = user ? { 'Authorization': 'Bearer ' + user.token } : {};
  const socketRef = useContext(SocketContext);
  const socket = socketRef ? socketRef.current : null;
  const username = user ? { username: user.username } : {};
  const [taskUsername, setTaskUsername] = useState('*');

  const handleTaskUsernameInput = (event) => {
    setTaskUsername(event.target.value);
  }
  const handleItemInput = (event) => {
    setItemInput(event.target.value);
  };

  useEffect(() => {
    if (socket) {
      const todoUpdate = () => {
        getItems();
      }
      socket.on('todo-update', todoUpdate);
      return () => {
        socket.removeListener('todo-update', todoUpdate);
      };
    }
  }, []);

  const updateItems = () => {
    if (socket) {
      socket.emit('todo-update');
    } else {
      getItems();
    }
  }

  const getItems = async () => {
    try {
      setErrorMessage('');
      const response = await axios({
        method: 'get',
        url: props.url,
        headers: authHeader
      });
      setItems(response.data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const addItem = async () => {
    const Birth = inputBirthRef.current.value;
    const Gender = inputGenderRef.current.value;
    const Mail = inputMailRef.current.value;
    try {
      setErrorMessage('');
      await axios({
        method: 'post',
        url: props.url,
        data: {
          task: itemInput,
          ...(Birth ? { Birth: Birth } : {}),
          ...(Gender !== '0' ? { Gender: Gender } : {}),
          ...(Mail ? { Mail: Mail } : {}),
          ...(taskUsername === '*' ? {} : username)
        },
        headers: authHeader
      });
      setItemInput('');
      inputBirthRef.current.value = '';
      inputGenderRef.current.value = '0';
      inputMailRef.current.value = '';
      updateItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const deleteItem = async (id) => {
    try {
      setErrorMessage('');
      await axios({
        method: 'delete',
        url: props.url + '/' + id,
        headers: authHeader
      });
      updateItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const setItemBirth = async (id, event) => {
    const item = items.find((item) => item._id === id);
    if (item) {
      const copiedItem = { ...item, Birth: event.target.value };
      try {
        setErrorMessage('');
        await axios({
          method: 'put',
          url: props.url + '/' + id,
          data: copiedItem,
          headers: authHeader
        });
        updateItems();
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  };

  const setItemGender = async (id, event) => {
    const item = items.find((item) => item._id === id);
    if (item) {
      const copiedItem = { ...item, Gender: event.target.value };
      try {
        setErrorMessage('');
        await axios({
          method: 'put',
          url: props.url + '/' + id,
          data: copiedItem,
          headers: authHeader
        });
        updateItems();
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className="todolist">
      <div className="todolist-title" onClick={getItems}>
        [{user.username}] チームメンバー
      </div>
      {items.length === 0 ? null :
        <div className="todolist-task-list">
          {items.map((row) => (
            <div className="todolist-task" key={row['_id']}>
              {row['username'] ? <span>【{row['username']}】</span> : <span>【本部】</span>}
              <span className={"todolist-description" +
                (row['completed'] ? " todolist-done" : "")}>
                {row['task']}</span>
              {row['Mail']}
              <input type="date" value={row['Birth']}
                onChange={setItemBirth.bind(null, row['_id'])} />
              <select value={row['Gender'] || '0'}
                onChange={setItemGender.bind(null, row['_id'])}>
                <option value="2">男</option>
                <option value="1">女</option>
                <option value="0">性別</option>
              </select>
              <button type="button" onClick={deleteItem.bind(null, row['_id'])}>
                削除</button>
            </div>
          ))}
        </div>}
      <div className="todolist-task-input">
        {user ?
          <form className="todolist-task-username">
            <label>
              <input type="radio" name="name" value={user.username}
                checked={taskUsername === user.username}
                onChange={handleTaskUsernameInput} />
              {user.username}</label>
            <label>
              <input type="radio" name="name" value="*"
                checked={taskUsername === '*'}
                onChange={handleTaskUsernameInput} />本部</label>
          </form> : null}
        <input type="text" onChange={handleItemInput}
          placeholder="氏名" value={itemInput} />
        <input type="text" ref={inputMailRef}
          placeholder="メールアドレス" />
        <input type="date" ref={inputBirthRef} />
        <select defaultValue="0" ref={inputGenderRef}>
          <option value="2">男</option>
          <option value="1">女</option>
          <option value="0">性別</option>
        </select>
        <button type="button" onClick={addItem} disabled={itemInput.length === 0}>
          追加</button>
      </div>
      {errorMessage === '' ? null :
        <div className="error-message" onClick={() => setErrorMessage('')}>
          {errorMessage}
        </div>}
    </div>
  );
};
