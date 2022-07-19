import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from './Authenticate';
import { SocketContext } from './WithSocket';

export const ToDoList = (props) => {
  const [items, setItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [itemInput, setItemInput] = useState('');

  const inputDeadlineRef = useRef();
  const inputPriorityRef = useRef();
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
    const deadline = inputDeadlineRef.current.value;
    const priority = inputPriorityRef.current.value;
    try {
      setErrorMessage('');
      await axios({
        method: 'post',
        url: props.url,
        data: {
          task: itemInput,
          completed: false,
          ...(deadline ? { deadline: deadline } : {}),
          ...(priority !== '0' ? { priority: priority } : {}),
          //...(user ? { username: user.username } : {}),
          ...(taskUsername === '*' ? {} : username)
        },
        headers: authHeader
      });
      setItemInput('');
      inputDeadlineRef.current.value = '';
      inputPriorityRef.current.value = '0';
      updateItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  const setItemCompleted = async (id, event) => {
    const item = items.find((item) => item._id === id);
    if (item) {
      const copiedItem = { ...item, completed: event.target.checked };
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
  const setItemDeadline = async (id, event) => {
    const item = items.find((item) => item._id === id);
    if (item) {
      const copiedItem = { ...item, deadline: event.target.value };
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
  const setItemPriority = async (id, event) => {
    const item = items.find((item) => item._id === id);
    if (item) {
      const copiedItem = { ...item, priority: event.target.value };
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
        ToDoリスト [{props.url}]
      </div>
      {items.length === 0 ? null :
        <div className="todolist-task-list">
          {items.map((row) => (
            <div className="todolist-task" key={row['_id']}>
              <span className="todolist-completed">
                <input type="checkbox" checked={row['completed']}
                  onChange={setItemCompleted.bind(null, row['_id'])} />
              </span>
              <span className={"todolist-description" +
                (row['completed'] ? " todolist-done" : "")}>
                {row['task']}</span>
              <input type="date" value={row['deadline']}
                onChange={setItemDeadline.bind(null, row['_id'])} />
              <select value={row['priority'] || '0'}
                onChange={setItemPriority.bind(null, row['_id'])}>
                <option value="3">★★★</option>
                <option value="2">★★☆</option>
                <option value="1">★☆☆</option>
                <option value="0">☆☆☆</option>
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
                onChange={handleTaskUsernameInput} />*</label>
          </form> : null}
        <input type="text" onChange={handleItemInput}
          placeholder="タスク" value={itemInput} />
        <input type="date" ref={inputDeadlineRef} />
        <select defaultValue="0" ref={inputPriorityRef}>
          <option value="3">★★★</option>
          <option value="2">★★☆</option>
          <option value="1">★☆☆</option>
          <option value="0">☆☆☆</option>
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
