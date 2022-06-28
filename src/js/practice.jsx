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
// import { Counter } from './Counter';
// import { Clock } from './Clock';
// import { Stopwatch } from './Stopwatch';



/* ここまで */

// Reactコンポーネントを idがrootのDOM要素に配置する．
ReactDOM.render(
  // Reactコンポーネントの配置．JSXで記述できる．
  <ErrorBoundary>
    <ToDoList url="/todo" />
    {/*<Hello />*/}
    {/* ここから */}
    {/*<div className="row">*/}
    {/*<Counter initial={5} min={0} max={10} />*/}
    {/*<Clock />*/}
    {/*<Stopwatch />*/}
    {/*</div>*/}
    {/* ここまで */}
  </ErrorBoundary >,
  // id属性がrootのHTML要素を求める．
  document.getElementById('root')
);
