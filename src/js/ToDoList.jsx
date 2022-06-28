import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
export const ToDoList = (props) => {
  const [items, setItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [itemInput, setItemInput] = useState('');
  const inputDeadlineRef = useRef();
  const getItems = async () => {
    try {
      setErrorMessage('');
      const response = await axios({
        method: 'get',
        url: props.url,
      });
      setItems(response.data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  const handleItemInput = (event) => {
    setItemInput(event.target.value);
  };
  const addItem = async () => {
    const deadline = inputDeadlineRef.current.value;
    try {
      setErrorMessage('');
      await axios({
        method: 'post',
        url: props.url,
        data: {
          task: itemInput,
          completed: false,
          ...(deadline ? { deadline: deadline } : {})
        }
      });
      setItemInput('');
      inputDeadlineRef.current.value = '';
      getItems();
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
        });
        getItems();
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  }
  const deleteItem = async (id) => {
    try {
      setErrorMessage('');
      await axios({
        method: 'delete',
        url: props.url + '/' + id,
      });
      getItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }
  const setItemDeadline = async (id, event) => {
    const item = items.find((item) => item._id === id);
    if (item) {
      const copiedItem = { ...item, deadline: event.target.value };
      try {
        setErrorMessage('');
        await axios({
          method: 'put',
          url: props.url + '/' + id,
          data: copiedItem
        });
        getItems();
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
              <button type="button" onClick={deleteItem.bind(null, row['_id'])}>
                削除</button>
            </div>
          ))}
        </div>}

      <div className="todolist-task-input">
        <input type="text" onChange={handleItemInput}
          placeholder="タスク" value={itemInput} />
        <input type="date" ref={inputDeadlineRef} />
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