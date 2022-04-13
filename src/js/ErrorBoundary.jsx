/**
 * Errorの表示
 */
import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error: error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          color: "hsla(355, 100%, 32%, 1)",
          backgroundColor: "hsla(355, 100%, 94%, 1)",
          borderRadius: "8px",
          padding: "8px 8px",
        }}>
          <p style={{ margin: "0px 0px 8px 0px" }}>
            Reactコンポーネント描画時にJavaScriptエラーが発生しました。ブラウザのWeb開発ツール→コンソールを開いて原因を調べてください。
          </p>
          <code>{this.state.error.name}: {this.state.error.message}</code>
        </div>
      )
    }
    return (
      <React.StrictMode>
        {this.props.children}
      </React.StrictMode>
    );
  }
}
