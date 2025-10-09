document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('wheel');
  const ctx = canvas.getContext('2d');
  const spinBtn = document.getElementById('spin-btn');
  const pointsDisplay = document.getElementById('points');
  const confettiContainer = document.getElementById('confetti');

  const sections = [];
  const totalSections = 12;
  const colors = ['#e74c3c', '#3498db', '#f1c40f', '#9b59b6', '#1abc9c', '#e67e22'];
  let currentRotation = 0;
  let totalPoints = 0;
  let isSpinning = false;

  // Создаём сектора: 2 "RIALO CLUB MEMBER", остальные — 50, 100, ..., 600
  for (let i = 0; i < totalSections; i++) {
    if (i === 3 || i === 8) {
      sections.push({ text: "RIALO CLUB MEMBER", type: "special" });
    } else {
      const value = (i % 10 + 1) * 50; // 50, 100, ..., 500 (но не более 10 секторов)
      // Но у нас 10 обычных секторов, поэтому:
      const pointValues = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
      const value = pointValues[(i - (i >= 3 ? 1 : 0) - (i >= 8 ? 1 : 0)) % pointValues.length];
      sections.push({ text: `${value}`, type: "points", value: value });
    }
  }

  function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    const anglePerSection = (2 * Math.PI) / totalSections;

    for (let i = 0; i < totalSections; i++) {
      const startAngle = i * anglePerSection + currentRotation;
      const endAngle = startAngle + anglePerSection;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + anglePerSection / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = sections[i].type === 'special' ? 'black' : 'white';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(sections[i].text, radius * 0.7, 0);
      ctx.restore();
    }
  }

  function spin() {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;

    const extraRotations = 5;
    const targetRotation = extraRotations * 2 * Math.PI + Math.random() * 2 * Math.PI;

    let start = null;
    const duration = 5000;

    function animate(time) {
      if (!start) start = time;
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      currentRotation = easeOut * targetRotation;

      drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        finishSpin(targetRotation);
      }
    }

    requestAnimationFrame(animate);
  }

  function finishSpin(totalRotation) {
    const normalizedRotation = totalRotation % (2 * Math.PI);
    const sectionIndex = Math.floor((totalSections - (normalizedRotation % (2 * Math.PI)) / (2 * Math.PI) * totalSections) % totalSections);

    const result = sections[sectionIndex];

    if (result.type === "special") {
      showConfetti();
    } else {
      totalPoints += result.value;
      pointsDisplay.textContent = totalPoints;
    }

    isSpinning = false;
    spinBtn.disabled = false;
  }

  function showConfetti() {
    confettiContainer.style.display = 'block';
    confettiContainer.innerHTML = '';

    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.top = `${-Math.random() * 20}vh`;
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.style.transform = `scale(${Math.random() * 1.5 + 0.5})`;
      confettiContainer.appendChild(confetti);

      confetti.animate(
        [
          { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
          { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ],
        {
          duration: Math.random() * 3000 + 2000,
          easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        }
      );
    }

    setTimeout(() => {
      confettiContainer.style.display = 'none';
    }, 5000);
  }

  drawWheel();
  spinBtn.addEventListener('click', spin);
});
