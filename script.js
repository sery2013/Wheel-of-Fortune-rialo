document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById('board');
  const rollBtn = document.getElementById('roll-btn');
  const pointsDisplay = document.getElementById('points');
  const diceElement = document.getElementById('dice');

  let totalPoints = 0;
  let currentPosition = 0;
  let isRolling = false;

  // Генерация игрового поля (25 клеток)
  const cells = [];
  const totalCells = 25;
  const specialCells = [5, 10, 15, 20, 22, 24]; // Индексы специальных клеток
  const specialTexts = [
    "Шанс",
    "Бонус!",
    "Штраф",
    "Супер!",
    "Блок!",
    "Приз"
  ];
  const penaltyCellIndex = 12; // Клетка с штрафом

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;

    if (i === penaltyCellIndex) {
      cell.classList.add('penalty');
      cell.textContent = '✘'; // Знак штрафа
    } else if (specialCells.includes(i)) {
      cell.textContent = specialTexts[specialCells.indexOf(i)];
      cell.classList.add('special');
    } else {
      const value = ((i - specialCells.filter(x => x < i).length) - (i >= penaltyCellIndex ? 1 : 0) + 1) * 50;
      cell.textContent = value;
    }

    board.appendChild(cell);
    cells.push(cell);
  }

  // Фишка
  const piece = document.createElement('div');
  piece.className = 'piece';
  cells[0].appendChild(piece);

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
    let next = (currentPosition + steps) % totalCells;

    // Анимация
    piece.style.transition = 'all 0.5s ease';
    piece.style.transform = `translate(${cells[next].offsetLeft - cells[currentPosition].offsetLeft}px, ${cells[next].offsetTop - cells[currentPosition].offsetTop}px)`;

    setTimeout(() => {
      cells[currentPosition].removeChild(piece);
      cells[next].appendChild(piece);
      currentPosition = next;

      const cell = cells[next];

      if (cell.classList.contains('penalty')) {
        totalPoints -= 200;
        pointsDisplay.textContent = totalPoints;
        alert('Штраф! -200 очков');
      } else if (cell.classList.contains('special')) {
        // Можно добавить логику для специальных клеток
        alert(`Специальная клетка: ${cell.textContent}`);
      } else {
        const value = parseInt(cell.textContent);
        totalPoints += value;
        pointsDisplay.textContent = totalPoints;
      }

      isRolling = false;
      rollBtn.disabled = false;
    }, 500);
  }

  rollBtn.addEventListener('click', rollDice);
});
