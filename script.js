
let data = [];

function addResult(result) {
  const last = data[data.length - 1];
  const round = {
    result,
    bigEye: calcEye(data, 'big'),
    small: calcEye(data, 'small'),
    cockroach: calcEye(data, 'cockroach'),
  };
  round.pAsk = predictAsk('P', round.bigEye, round.small, round.cockroach);
  round.bAsk = predictAsk('B', round.bigEye, round.small, round.cockroach);
  round.suggest = suggestBet(round.pAsk, round.bAsk);
  data.push(round);
  renderTable();
}

function calcEye(data, type) {
  const len = data.length;
  if (len < 2) return '';
  const prev1 = data[len - 1].result;
  const prev2 = data[len - 2].result;
  if (prev1 === prev2) return '🔵';
  else return '🔴';
}

function predictAsk(type, big, small, cockroach) {
  const set = [big, small, cockroach].join('');
  if (type === 'P') {
    return set === '🔵🔵🔵' ? '🔵' : '🔴';
  } else {
    return set === '🔴🔴🔴' ? '🔴' : '🔵';
  }
}

function suggestBet(pAsk, bAsk) {
  if (pAsk === '🔵' && bAsk === '🔴') return 'แทง P';
  if (pAsk === '🔴' && bAsk === '🔵') return 'แทง B';
  return 'รอดู';
}

function renderTable() {
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = '';
  data.slice().reverse().forEach((row, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${data.length - i}</td>
      <td>${row.result}</td>
      <td>${row.bigEye}</td>
      <td>${row.small}</td>
      <td>${row.cockroach}</td>
      <td>${row.pAsk}</td>
      <td>${row.bAsk}</td>
      <td>${row.suggest}</td>
    `;
    tbody.appendChild(tr);
  });
}

function resetData() {
  data = [];
  renderTable();
}
