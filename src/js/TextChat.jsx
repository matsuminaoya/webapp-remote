import { useState, useRef, useEffect, useContext } from 'react';
import { LoginContext } from './Authenticate';
import { SocketContext } from './WithSocket';

export const TextChat = () => {
  const user = useContext(LoginContext);
  const socketRef = useContext(SocketContext);
  const socket = socketRef ? socketRef.current : null;
  // chat の宛先
  const [chatTo, setChatTo] = useState('');
  // 送信するテキストメッセージの入力
  const [inputMessage, setInputMessage] = useState('');
  // テキストメッセージのリスト
  const [messages, setMessages] = useState([]);
  // テキストメッセージの最後の行
  const messageRef = useRef(null);
  // サーバから送られてくるユーザのリスト
  const [userlist, setUserlist] = useState([]);
  const handleMessage = (data) => {
    // メッセージの最後に追加する．
    setMessages((prevMessages) => [...prevMessages, data]);
  };
  const handleUserList = (data) => {
    setUserlist(data);
    // 現在の宛先（chatTo）がユーザリスト（data）に含まれていなければ宛先を'*'に設定する．
    if (data.indexOf(chatTo) < 0) {
      setChatTo('*');
    }
  };
  // チャットのメッセージを送る．
  const sendTextMessage = () => {
    if (socket) {
      socket.emit('message',
        { from: user.username, to: chatTo, text: inputMessage });
      setInputMessage('');
    }
  };
  const inputChanged = (event) => {
    setInputMessage(event.target.value);
  };
  const selectChatTo = (event) => {
    setChatTo(event.target.value);
  };

  useEffect(() => {
    if (socket) {
      socket.on('message', handleMessage);
      socket.on('userlist', handleUserList)
      socket.emit('join', { from: user.username });
      return () => {
        socket.removeListener('message', handleMessage);
        socket.removeListener('userlist', handleUserList)
      };
    }
  }, []);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [messages]);

  return (
    <div className="text-chat">
      <div className="text-chat-message-list-container">
        <div className="text-chat-message-list">
          {
            messages.map((message, index) => (
              <div
                key={message.from + message.time}
                className={message.from === user.username ?
                  'text-chat-from-me' : 'text-chat-from-them'}
                {
                ...index === messages.length - 1 ? { ref: messageRef } : {}}>
                {message.from === user.username ?
                  <div>{message.text}</div> :
                  <div>{message.from} &gt; {message.text}</div>
                }
              </div>
            )
            )}
        </div>
      </div>
      <div className="text-chat-input">
        <select onChange={selectChatTo} value={chatTo}>
          <option value="*">全体</option>
          {userlist.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <input type="text" onChange={inputChanged} value={inputMessage} />
        <button type="button" onClick={sendTextMessage}
          disabled={!socketRef.current || inputMessage.length === 0}>
          送信
        </button>
      </div>
    </div>
  );
};