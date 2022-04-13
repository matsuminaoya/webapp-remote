/**
 * 簡易ログイン機能
 */
import { useState, useRef, createContext } from 'react';
import axios from 'axios';

export const LoginContext = createContext();

export const Authenticate = (props) => {
  // ユーザ名の入力処理（propsでデフォルト値を渡せるようにしている）
  const [usernameInput, setUsernameInput] = useState(props.username || '');
  // passwordの入力はブラウザにまかせる．
  const passwordInputRef = useRef('');

  // /loginにPOSTリクエストを送った際のエラーメッセージ
  const [errorMessage, setErrorMessage] = useState('');

  // ユーザ情報（usernameとtoken）を保持する．
  const [user, setUser] = useState(null);

  // loginのAPIを呼ぶ．
  const login = async () => {
    try {
      setErrorMessage('');
      const result = await axios({
        method: 'post',
        url: '/login',
        data: {
          // username と password を渡す．
          username: usernameInput,
          password: passwordInputRef.current.value
        }
      });
      // ユーザ情報（usernameとtoken）が返ってくるので，これを保存する．
      setUser(result.data);
    } catch (error) {
      // Forbiddenエラーであれば，ログインエラーとして扱う
      if (error.response.status === 403) {
        setErrorMessage('ログインエラー');
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  // ユーザ情報を削除する．
  const logout = () => {
    setUser(null);
  };

  return (user ?
    <div>
      <div className="authenticate-logout">
        <span>User: {user ? user.username : ''} </span>
        <button type="button" onClick={logout}>ログアウト</button>
      </div>
      <LoginContext.Provider value={user}>
        {props.children}
      </LoginContext.Provider>
    </div>
    :
    <div>
      <div className="authenticate">
        <label>
          <span>ユーザ名:</span>
          <input type="text" placeholder="ユーザ名"
            onChange={(event) => setUsernameInput(event.target.value)}
            value={usernameInput} />
        </label>
        <label>
          <span>パスワード:</span>
          <input type="password" ref={passwordInputRef}
            placeholder="パスワード" defaultValue='' />
        </label>
        <button type="button" onClick={login}>ログイン</button>
      </div>
      <div>
        {errorMessage === '' ? null :
          <div className="error-message" onClick={() => setErrorMessage('')}>
            {errorMessage}</div>}
      </div>
    </div>
  );
};
