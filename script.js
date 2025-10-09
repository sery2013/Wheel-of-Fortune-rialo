document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById('board');
  const rollBtn = document.getElementById('roll-btn');
  const pointsDisplay = document.getElementById('points');
  const diceElement = document.getElementById('dice');

  let totalPoints = 0;
  let currentPosition = 0;
  let isRolling = false;

  // Маршрут по периметру (20 клеток)
  const route = [];
  const size = 5;

  // Верхняя строка
  for (let i = 0; i < size; i++) route.push(i);
  // Правый столбец (без углов)
  for (let i = 1; i < size - 1; i++) route.push(i * size + size - 1);
  // Нижняя строка (в обратном порядке)
  for (let i = size - 1; i >= 0; i--) route.push((size - 1) * size + i);
  // Левый столбец (в обратном порядке, без углов)
  for (let i = size - 2; i >= 1; i--) route.push(i * size);

  const cells = [];
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    board.appendChild(cell);
    cells.push(cell);
  }

  // Генерация содержимого
  const contents = [];
  const specialCells = [3, 7, 11, 15, 17, 19]; // индексы в маршруте
  const specialTexts = ["Шанс", "Бонус", "Штраф", "Приз", "Блок", "Супер"];
  const penaltyIndex = 9; // индекс штрафной клетки

  const values = [];
  for (let i = 1; i <= 12; i++) values.push(i * 50);
  shuffleArray(values);

  for (let i = 0; i < route.length; i++) {
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

    if (content.type === 'penalty') {
      cell.classList.add('penalty');
    }
  });

  // Фигурка (SVG-робот)
  const piece = document.createElement('div');
  piece.className = 'piece';
  piece.innerHTML = `
    <svg width="30" height="30" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" fill="#3498db"/>
      <rect x="8" y="13" width="8" height="8" rx="2" fill="#2ecc71"/>
      <line x1="10" y1="16" x2="14" y2="16" stroke="black" stroke-width="1"/>
    </svg>
  `;
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
      diceElement.textContent = roll;
      diceElement.style.animation = 'none';
      movePiece(roll);
    }, 1000);
  }

  function movePiece(steps) {
    let nextPos = (currentPosition + steps) % route.length;
    let currentRouteIndex = currentPosition;
    let step = 0;

    const moveStep = () => {
      if (step < steps) {
        currentRouteIndex = (currentRouteIndex + 1) % route.length;
        step++;

        const currentCell = cells[route[currentRouteIndex]];
        piece.style.transition = 'all 0.3s ease';
        piece.style.transform = `translate(${currentCell.offsetLeft - cells[route[currentPosition]].offsetLeft}px, ${currentCell.offsetTop - cells[route[currentPosition]].offsetTop}px)`;

        setTimeout(() => {
          if (step < steps) {
            moveStep();
          } else {
            currentPosition = currentRouteIndex;
            const cell = cells[route[currentPosition]];
            const content = contents[currentPosition];

            if (content.type === 'penalty') {
              totalPoints -= 200;
              pointsDisplay.textContent = totalPoints;
              alert('Штраф! -200 очков');
            } else if (content.type === 'special') {
              alert(`Специальная клетка: ${content.value}`);
            } else {
              totalPoints += content.value;
              pointsDisplay.textContent = totalPoints;
            }

            isRolling = false;
            rollBtn.disabled = false;
          }
        }, 300);
      }
    };

    moveStep();
  }

  rollBtn.addEventListener('click', rollDice);
});
