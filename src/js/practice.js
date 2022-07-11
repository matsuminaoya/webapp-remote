/**
 * 練習用ページのJavaScript プログラム
 */

/* ここから */
/*
const sampleSeparator = document.querySelector('.separator');
const colorMapping = { '青': 'blue', '黄': 'yellow', '赤': 'red' };
// 色の変更
document.getElementById('color-buttons').addEventListener('click', (event) => {
  sampleSeparator.style.borderColor = colorMapping[event.target.innerText];
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
// フォントサイズリセット
document.getElementById('reset-button').addEventListener('click', () => {
  sampleItemlist.style.fontSize = '';
});

const sampleTable = document.querySelector('.table');
// 表の向き変更
document.getElementById('transpose-button').addEventListener('click', () => {
  sampleTable.classList.toggle('table');
  sampleTable.classList.toggle('table-transposed');
});

// カウンタ
const sampleCounter = document.getElementById('counter-out');
const getCountValue = () => parseInt(sampleCounter.innerText);
const setCountValue = (count) => sampleCounter.innerText = count;
// カウントアップ
document.getElementById('counter-up').addEventListener('click', () => {
  const value = getCountValue();
  setCountValue(value + 1);
});
// カウントダウン
document.getElementById('counter-down').addEventListener('click', () => {
  const value = getCountValue();
  setCountValue(value - 1);
});
// カウントリセット
document.getElementById('counter-reset').addEventListener('click', () => {
  const value = getCountValue();
  setCountValue(0);
});

// クロック
const datetime = () => {
  const pad = (num) => (num < 10 ? '0' : '') + num;
  const now = new Date();
  return `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][now.getDay()]}\n${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
};
const updateClock = () => {
  document.getElementById('clock').innerText = datetime();
  setTimeout(updateClock, 500);
};
updateClock();

//ストップウォッチ
const stopwatch = () => {
  const out = document.getElementById('stopwatch-out');
  const resetBtn = document.getElementById('stopwatch-reset');
  const startStopBtn = document.getElementById('stopwatch-start-stop');
  const lapBtn = document.getElementById('stopwatch-lap');
  const lapListEl = document.getElementById('stopwatch-lap-list');
  let startTime = 0;
  let offset = 0;
  let displayTime = 0;
  let timer;
  const startTimer = () => {
    displayTime = Date.now() - startTime + offset;
    updateTime();
    timer = setTimeout(startTimer, 100);
  }
  const clearTimer = () => {
    clearTimeout(timer);
    timer = null;
  };
  const lapList = [];
  const clearLapList = () => {
    lapList.splice(0);
    lapList.push(0);
    lapListEl.replaceChildren();
  };
  const recordLap = () => {
    const len = lapList.length;
    const laptime = displayTime - lapList[len - 1];
    lapList.push(displayTime);
    const lapEntryEl = document.createElement('div');
    lapEntryEl.classList.add('stopwatch-lap-entry');
    const lapNumEl = document.createElement('span');
    lapNumEl.classList.add('stopwatch-lap-num');
    lapEntryEl.append(lapNumEl);
    lapNumEl.innerText = len;
    const lapLaptimeEl = document.createElement('span');
    lapLaptimeEl.classList.add('stopwatch-laptime');
    lapEntryEl.append(lapLaptimeEl);
    lapLaptimeEl.innerText = timeToString(laptime);
    const lapSplittimeEl = document.createElement('span');
    lapSplittimeEl.classList.add('stopwatch-splittime');
    lapEntryEl.append(lapSplittimeEl);
    lapSplittimeEl.innerText = timeToString(displayTime);
    lapListEl.prepend(lapEntryEl);
  };
  const pad2 = (x) => (x < 10 ? '0' : '') + x;
  const timeToString = (time) => {
    time = Math.floor(time / 100);
    const subseconds = time % 10;
    time = Math.floor(time / 10);
    const seconds = time % 60;
    time = Math.floor(time / 60);
    const minutes = time % 60;
    const hours = Math.floor(time / 60);
    return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}.${subseconds}`;
  };
  const updateTime = () => out.innerText = timeToString(displayTime);
  const handleReset = () => {
    clearTimer();
    startTime = 0;
    offset = 0;
    displayTime = 0;
    updateTime();
    startStopBtn.innerText = 'スタート';
    clearLapList();
    lapBtn.disabled = true;
  };
  resetBtn.addEventListener('click', handleReset);
  const handleStartStop = () => {
    if (startStopBtn.innerText === 'スタート') {
      startTime = Date.now();
      startStopBtn.innerText = 'ストップ';
      startTimer();
      lapBtn.disabled = false;
    } else {
      clearTimer();
      offset = offset + Date.now() - startTime;
      startStopBtn.innerText = 'スタート';
      lapBtn.disabled = true;
    }
  };
  startStopBtn.addEventListener('click', handleStartStop);
  const handleLap = () => {
    recordLap();
  };
  lapBtn.addEventListener('click', handleLap);
  resetBtn.click();
};
stopwatch();
*/
/* ここまで */
