/**
 * Socket.IOをWrapする
 */
// socket.io.clientを使用する．
import { io } from 'socketio';

import { useState, useRef, useEffect, useContext, createContext } from 'react';

// 簡易ログイン機能を使用する．
import { LoginContext } from './Authenticate';

// socketを子要素に渡す．
export const SocketContext = createContext();

export const WithSocket = (props) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // LoginContextからユーザ情報を取得する．
  const user = useContext(LoginContext);

  const openSocket = () => {
    // ユーザ情報があればauthHeaderをつける．
    const authHeader = user ?
      { auth: { token: user.token, username: user.username } } : {};
    if (!socketRef.current) {
      const socket = io(props.nsp, {
        reconnection: false,
        ...authHeader
      });
      socket.on('connect', () => {
        setConnected(true);
      })
      socket.on('error', (data) => {
        setErrorMessage(data);
      });
      socket.on('disconnect', (reason) => {
        setErrorMessage(`Disconnected: ${reason}.`);
        setConnected(false);
      });
      socketRef.current = socket;
    } else {
      setErrorMessage('');
      socketRef.current.connect();
    }
  };

  const closeSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  // ページが表示された時にソケットをオープンし，ページを閉じる時にソケットをクローズする．
  useEffect(() => {
    if (!connected) {
      openSocket();
    }
    return () => {
      closeSocket();
    };
  }, []);

  // connect/disconnect button
  const connectOrDisconnect = () => {
    if (connected) {
      closeSocket();
    } else {
      openSocket();
    }
  };


  return (
    <div className="with-socket-wrap">
      <div className={"with-socket" +
        (connected ? " with-socket-connected" : "")}>
        <span>namespace: {props.nsp}</span>
        <button type="button" onClick={connectOrDisconnect}>
          {connected ? '切断' : '接続'}
        </button>
      </div>
      {connected ?
        <SocketContext.Provider value={socketRef}>
          {props.children}
        </SocketContext.Provider>
        : null}
      {errorMessage === '' ? null :
        <div className="error-message"
          onClick={() => setErrorMessage('')}>{errorMessage}</div>}
    </div>
  );
};

WithSocket.defaultProps = {
  // default namespace
  nsp: '/'
}
