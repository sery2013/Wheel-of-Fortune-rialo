document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById('board');
  const rollBtn = document.getElementById('roll-btn');
  const pointsDisplay = document.getElementById('points');
  const diceElement = document.getElementById('dice');

  let totalPoints = 0;
  let currentPosition = 0;
  let isRolling = false;

  // Генерация маршрута по периметру: 20 клеток
  const route = [];
  const size = 5;
  const totalCells = 20;

  // Верхняя строка (0–4)
  for (let i = 0; i < size; i++) route.push(i);
  // Правый столбец (9, 14, 19)
  for (let i = 1; i < size; i++) route.push(i * size - 1);
  // Нижняя строка (18–15)
  for (let i = size - 2; i >= 0; i--) route.push((size - 1) * size + i);
  // Левый столбец (10, 5)
  for (let i = size - 2; i > 0; i--) route.push(i * size);

  const cells = [];
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    board.appendChild(cell);
    cells.push(cell);
  }

  // Генерация содержимого для маршрута
  const contents = [];
  const specialCells = [3, 7, 11, 15, 17, 19]; // Индексы в маршруте
  const specialTexts = ["Шанс", "Бонус", "Штраф", "Приз", "Блок", "Супер"];
  const penaltyIndex = 9; // Индекс штрафной клетки в маршруте

  const values = [];
  for (let i = 1; i <= 12; i++) values.push(i * 50);
  shuffleArray(values);

  for (let i = 0; i < totalCells; i++) {
    if (i === penaltyIndex) {
      contents.push({ type: 'penalty', value: '✘' });
    } else if (specialCells.includes(i)) {
      contents.push({ type: 'special', value: specialTexts[specialCells.indexOf(i)] });
    } else {
      contents.push({ type: 'points', value: values.pop() });
    }
  }

  // Применяем содержимое к клеткам маршрута
  route.forEach((index, i) => {
    const content = contents[i];
    const cell = cells[index];
    cell.textContent = content.value;

    if (content.type === 'special') {
      cell.classList.add('special');
    } else if (content.type === 'penalty') {
      cell.classList.add('penalty');
    }
  });

  // Фишка
  const piece = document.createElement('div');
  piece.className = 'piece';
  cells[route[0]].appendChild(piece);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function rollDice() {
    if (isRolling) return;
    isRolling = true;
    rollBtn.disabled = true;
    diceElement.textContent = '?';
    diceElement.style.animation = 'roll 0.5s infinite';

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      diceElement
