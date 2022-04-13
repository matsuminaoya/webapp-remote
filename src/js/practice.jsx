/**
 * 練習用ページにおけるReactコンポーネントの配置
 */
import ReactDOM from 'react-dom';

// デバッグ用にエラー発生時にエラーメッセージを表示するコンポーネントで囲む．
import { ErrorBoundary } from './ErrorBoundary';

// コンポーネントの定義をimportする．
import { Hello } from './Hello';
/* ここから */





/* ここまで */

// Reactコンポーネントを idがrootのDOM要素に配置する．
ReactDOM.render(
  // Reactコンポーネントの配置．JSXで記述できる．
  <ErrorBoundary>
    <Hello />
    {/* ここから */}





    {/* ここまで */}
  </ErrorBoundary>,
  // id属性がrootのHTML要素を求める．
  document.getElementById('root')
);
