const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 10, paddleHeight = 100, ballSize = 12;
let leftPaddle = { x: 0, y: canvas.height/2 - paddleHeight/2, dy: 0 };
let rightPaddle = { x: canvas.width - paddleWidth, y: canvas.height/2 - paddleHeight/2, dy: 0 };
let ball = { x: canvas.width/2, y: canvas.height/2, dx: 5, dy: 5 };
let leftScore = 0, rightScore = 0;

// Draw functions
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}
function drawBall(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}
function drawText(text, x, y) {
  ctx.fillStyle = "#fff";
  ctx.font = "40px Arial";
  ctx.fillText(text, x, y);
}

// Game loop
function update() {
  // Move paddles
  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;

  // Prevent paddles from leaving canvas
  leftPaddle.y = Math.max(Math.min(leftPaddle.y, canvas.height - paddleHeight), 0);
  rightPaddle.y = Math.max(Math.min(rightPaddle.y, canvas.height - paddleHeight), 0);

  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball collision with top/bottom
  if (ball.y < ballSize || ball.y > canvas.height - ballSize) ball.dy *= -1;

  // Ball collision with paddles
  if (
    ball.x - ballSize < leftPaddle.x + paddleWidth &&
    ball.y > leftPaddle.y &&
    ball.y < leftPaddle.y + paddleHeight
  ) {
    ball.dx *= -1;
    ball.x = leftPaddle.x + paddleWidth + ballSize; // Avoid sticking
  }
  if (
    ball.x + ballSize > rightPaddle.x &&
    ball.y > rightPaddle.y &&
    ball.y < rightPaddle.y + paddleHeight
  ) {
    ball.dx *= -1;
    ball.x = rightPaddle.x - ballSize; // Avoid sticking
  }

  // Score update
  if (ball.x < 0) {
    rightScore++;
    resetBall();
  } else if (ball.x > canvas.width) {
    leftScore++;
    resetBall();
  }
}

function resetBall() {
  ball.x = canvas.width/2;
  ball.y = canvas.height/2;
  ball.dx = (Math.random() > 0.5 ? 5 : -5);
  ball.dy = (Math.random() > 0.5 ? 5 : -5);
}

function draw() {
  // Clear canvas
  drawRect(0, 0, canvas.width, canvas.height, "#000");
  // Draw net
  for (let i = 10; i < canvas.height; i += 30) {
    drawRect(canvas.width/2 - 1, i, 2, 20, "#fff");
  }
  // Draw paddles and ball
  drawRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight, "#fff");
  drawRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight, "#fff");
  drawBall(ball.x, ball.y, ballSize, "#fff");
  // Draw scores
  drawText(leftScore, canvas.width/4, 50);
  drawText(rightScore, 3*canvas.width/4, 50);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener('keydown', function(e) {
  // Left paddle: W/S
  if (e.key === 'w' || e.key === 'W') leftPaddle.dy = -7;
  if (e.key === 's' || e.key === 'S') leftPaddle.dy = 7;
  // Right paddle: ArrowUp/ArrowDown
  if (e.key === 'ArrowUp') rightPaddle.dy = -7;
  if (e.key === 'ArrowDown') rightPaddle.dy = 7;
});
document.addEventListener('keyup', function(e) {
  // Left paddle: W/S
  if (e.key === 'w' || e.key === 'W') leftPaddle.dy = 0;
  if (e.key === 's' || e.key === 'S') leftPaddle.dy = 0;
  // Right paddle: ArrowUp/ArrowDown
  if (e.key === 'ArrowUp') rightPaddle.dy = 0;
  if (e.key === 'ArrowDown') rightPaddle.dy = 0;
});

gameLoop();