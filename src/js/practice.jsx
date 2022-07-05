/**
 * 練習用ページにおけるReactコンポーネントの配置
 */
import ReactDOM from 'react-dom';

// デバッグ用にエラー発生時にエラーメッセージを表示するコンポーネントで囲む．
import { ErrorBoundary } from './ErrorBoundary';
// コンポーネントの定義をimportする．
// import { Hello } from './Hello';
/* ここから */
import { ToDoList } from './ToDoList';
import { Authenticate } from './Authenticate';
// import { Counter } from './Counter';
// import { Clock } from './Clock';
// import { Stopwatch } from './Stopwatch';



/* ここまで */

// Reactコンポーネントを idがrootのDOM要素に配置する．
ReactDOM.render(
  // Reactコンポーネントの配置．JSXで記述できる．
  <ErrorBoundary>
    <div className="row">
      <Authenticate>
        <ToDoList url="/todo-secure" />
      </Authenticate>
      <ToDoList url="/todo" />
    </div>
  </ErrorBoundary >,
  // id属性がrootのHTML要素を求める．
  document.getElementById('root')
);
