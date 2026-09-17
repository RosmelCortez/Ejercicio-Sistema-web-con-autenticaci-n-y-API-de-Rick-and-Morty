const canvas = document.getElementById('galaxy-bg');
const ctx = canvas.getContext('2d');

let stars = [];
const numStars = 150;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Crear estrellas con movimiento espacial
for (let i = 0; i < numStars; i++) {
  stars.push({
    x: Math.random() * canvas.width - canvas.width / 2,
    y: Math.random() * canvas.height - canvas.height / 2,
    z: Math.random() * canvas.width,
    color: `hsl(${Math.random() * 60 + 180}, 80%, 80%)` // Tonos cian/azul galáctico
  });
}

function animate() {
  // Fondo semitransparente para efecto de estela
  ctx.fillStyle = 'rgba(9, 10, 15, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  stars.forEach(star => {
    star.z -= 1.5; // Velocidad de acercamiento

    if (star.z <= 0) {
      star.z = canvas.width;
      star.x = Math.random() * canvas.width - canvas.width / 2;
      star.y = Math.random() * canvas.height - canvas.height / 2;
    }

    const k = 128 / star.z;
    const px = star.x * k + cx;
    const py = star.y * k + cy;

    if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
      const size = (1 - star.z / canvas.width) * 2.5;
      ctx.beginPath();
      ctx.arc(px, py, Math.max(size, 0.5), 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.fill();
    }
  });

  requestAnimationFrame(animate);
}

animate();