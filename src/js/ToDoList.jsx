import { useState, useEffect } from 'react';
import axios from 'axios';
export const ToDoList = (props) => {
  const [items, setItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [itemInput, setItemInput] = useState('');
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
    try {
      setErrorMessage('');
      await axios({
        method: 'post',
        url: props.url,
        data: {
          task: itemInput,
          completed: false
        },
      });
      setItemInput('');
      getItems();
    } catch (error) {
      setErrorMessage(error.message);
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
                <input type="checkbox" checked={row['completed']} />
              </span>
              <span className={"todolist-description" +
                (row['completed'] ? " todolist-done" : "")}>
                {row['task']}</span>
            </div>
          ))}
        </div>}

      <div className="todolist-task-input">
        <input type="text" onChange={handleItemInput}
          placeholder="タスク" value={itemInput} />
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