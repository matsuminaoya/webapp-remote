/**
 * 第２回レポート課題用のJS
 */
import ReactDOM from 'react-dom';

// デバッグ用にエラー発生時にエラーメッセージを表示するコンポーネントで囲む．
import { ErrorBoundary } from './ErrorBoundary';

// 使用するコンポーネント
/* ここから */
import { ToDoList } from './ToDoList';
import { Authenticate } from './Authenticate';
import { WithSocket } from './WithSocket';
/* ここまで */

// Reactコンポーネントを idがrootのDOM要素に配置する．
ReactDOM.render(
  // Reactコンポーネントの配置．JSXで記述できる．
  <ErrorBoundary>
    {/* ここから */}
    <div className="row">
      <Authenticate>
        <WithSocket nsp="/text-chat">
          <div className="row">
            <ToDoList url="/todo-secure" />
          </div>
        </WithSocket>
      </Authenticate>
    </div>
    {/* ここまで */}
  </ErrorBoundary>,
  // id属性がrootのHTML要素を求める．
  document.getElementById('root')
);
