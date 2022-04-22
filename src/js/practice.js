/**
 * 練習用ページのJavaScript プログラム
 */

/* ここから */
const sampleSeparator = document.querySelector('.separator');
const colorMapping = { '青': 'blue', '黄': 'yellow', '赤': 'red' };
// 色の変更
document.getElementById('color-buttons')
  .addEventListener('click', (event) => {
    sampleSeparator.style.borderColor
      = colorMapping[event.target.innerText];
  });

const sampleItemlist = document.querySelector('.itemize');
// フォントを大きく
document.getElementById('bigger-button').addEventListener('click', () => {
  const fontSizeStr = getComputedStyle(sampleItemlist).fontSize;
  const fontSize = parseFloat(fontSizeStr);
  sampleItemlist.style.fontSize = fontSize * 1.2 + 'px';
});
// フォントを小さく
document.getElementById('smaller-button').addEventListener('click', () => {
  const fontSizeStr = getComputedStyle(sampleItemlist).fontSize;
  const fontSize = parseFloat(fontSizeStr);
  sampleItemlist.style.fontSize = Math.max(fontSize * 0.8, 6) + 'px';
});
// リセット
document.getElementById('reset-button').addEventListener('click', () => {
  sampleItemlist.style.fontSize = '';
});

const sampleTable = document.querySelector('.table');
// 表の向き変更
document.getElementById('transpose-button').addEventListener('click', () => {
  sampleTable.classList.toggle('table');
  sampleTable.classList.toggle('table-transposed');
});
/* ここまで */
