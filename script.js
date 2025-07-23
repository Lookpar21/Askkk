
let history = JSON.parse(localStorage.getItem('roadmap_history')) || [];
let current = { result: '', big: '', small: '', cockroach: '' };

function setResult(value) {
  current.result = value;
}

function setEye(type, value) {
  current[type] = value;
}

function analyzePattern(data) {
  const resultList = data.map(item => item.result);
  let last = resultList.slice(-4);
  let pattern = '';
  if (last.length >= 4 && last.every(r => r === last[0])) {
    pattern = 'มังกร';
  } else if (last.join('').match(/(BP){2,}|(PB){2,}/)) {
    pattern = 'ปิงปอง';
  } else if (last.slice(-2)[0] === last.slice(-1)[0]) {
    pattern = 'ไพ่ติด';
  }
  return pattern || '-';
}

function analyzeAsk(big, small, cockroach) {
  if (big === small && small === cockroach) {
    return big.repeat(3);
  }
  return 'รอดู';
}

function getStats(history, big, small, cockroach) {
  let P = 0, B = 0;
  history.forEach(item => {
    if (item.big === big && item.small === small && item.cockroach === cockroach) {
      if (item.result === 'P') P++;
      if (item.result === 'B') B++;
    }
  });
  return `P=${P} / B=${B}`;
}

function addData() {
  const item = { ...current };
  item.pattern = analyzePattern(history.concat([item]));
  item.ask = analyzeAsk(item.big, item.small, item.cockroach);
  item.suggestion = (item.ask === '🔴🔴🔴') ? 'สวน P' : (item.ask === '🔵🔵🔵') ? 'ตาม P' : 'รอดู';
  item.stats = getStats(history, item.big, item.small, item.cockroach);
  history.push(item);
  save();
  render();
}

function save() {
  localStorage.setItem('roadmap_history', JSON.stringify(history));
}

function render() {
  const body = document.getElementById('table-body');
  body.innerHTML = '';
  history.slice().reverse().forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${history.length - index}</td>
      <td>${item.result}</td>
      <td>${item.big}</td>
      <td>${item.small}</td>
      <td>${item.cockroach}</td>
      <td>${item.pattern}</td>
      <td>${item.ask}</td>
      <td>${item.suggestion}</td>
      <td>${item.stats}</td>
    `;
    body.appendChild(row);
  });
}

function resetData() {
  history = [];
  save();
  render();
}

render();
