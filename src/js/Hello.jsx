/**
 * Helloという名前のReactコンポーネントの定義
 */
export const Hello = (props) => {
  // ボタンをクリックした時の処理
  // nameboxのCSSクラスが指定されているDOMのテキストをalertで表示する．
  const handleClick = () => {
    const name = document.querySelector('.namebox').innerText;
    alert(name);
  };

  return (
    <div>
      <p className="button-list">
        <button type="button" onClick={handleClick}>{props.label}</button>
      </p>
    </div>
  );
};

Hello.defaultProps = {
  label: 'クリック'
}
