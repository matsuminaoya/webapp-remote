/**
 * 第１回レポート課題用のJS
 */
import ReactDOM from 'react-dom';

// デバッグ用にエラー発生時にエラーメッセージを表示するコンポーネントで囲む．
import { ErrorBoundary } from './ErrorBoundary';

// 使用するコンポーネントをインポートする．
/* ここから */
import { Clock } from './Clock';
import { Counter } from './Counter';
import { Stopwatch } from './Stopwatch';
import { Countdown } from './Countdown';
import { Presentation } from './Presentation';

/* ここまで */

// Reactコンポーネントを idがrootのDOM要素に配置する．
ReactDOM.render(
  // Reactコンポーネントの配置．JSXで記述できる．
  <ErrorBoundary>
    {/* ここから */}
    <Presentation />
    <Stopwatch />
    <Countdown />
    <Clock />
    <Counter />

    {/* ここまで */}
  </ErrorBoundary>,
  // id属性がrootのHTML要素を求める．
  document.getElementById('root')
);
