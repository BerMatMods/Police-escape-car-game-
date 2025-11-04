// A self-contained script for a simple endless runner game.
// --- Game Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const game = {
  // Player properties
  player: {
    x: 50,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    color: 'blue',
    velocityY: 0,
    isJumping: false,
    isGrounded: true,
  },
  // Game physics settings
  physics: {
    gravity: 0.5,
    jumpForce: -12,
  },
  // Obstacle settings
  obstacles: [],
  obstacleSpeed: 5,
  obstacleInterval: 1200, // Time in ms between new obstacles
  lastObstacleTime: 0,
  // Game state
  gameOver: false,
  score: 0,
  groundLevel: canvas.height - 30,
};

// --- Game Functions ---

// Function to draw the player
function drawPlayer() {
  ctx.fillStyle = game.player.color;
  ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
}

// Function to draw all obstacles
function drawObstacles() {
  ctx.fillStyle = 'red';
  game.obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

// Function to update the player's state (gravity and jumping)
function updatePlayer() {
  // Apply gravity
  if (!game.player.isGrounded) {
    game.player.velocityY += game.physics.gravity;
  }
  game.player.y += game.player.velocityY;

  // Check for ground collision
  if (game.player.y >= game.groundLevel - game.player.height) {
    game.player.y = game.groundLevel - game.player.height;
    game.player.velocityY = 0;
    game.player.isGrounded = true;
    game.player.isJumping = false;
  }
}

// Function to generate new obstacles
function generateObstacle() {
  const currentTime = Date.now();
  if (currentTime - game.lastObstacleTime > game.obstacleInterval) {
    const obstacle = {
      x: canvas.width,
      y: game.groundLevel - 30,
      width: 30,
      height: 30,
    };
    game.obstacles.push(obstacle);
    game.lastObstacleTime = currentTime;
  }
}

// Function to update and move obstacles
function updateObstacles() {
  game.obstacles.forEach(obstacle => {
    obstacle.x -= game.obstacleSpeed;
  });

  // Remove obstacles that have moved off-screen
  game.obstacles = game.obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

// Function to check for collision between player and obstacles
function checkCollision() {
  game.obstacles.forEach(obstacle => {
    if (
      game.player.x < obstacle.x + obstacle.width &&
      game.player.x + game.player.width > obstacle.x &&
      game.player.y < obstacle.y + obstacle.height &&
      game.player.y + game.player.height > obstacle.y
    ) {
      game.gameOver = true;
      alert(`Game Over! Your score: ${game.score}`);
      document.location.reload(); // Restart the game
    }
  });
}

// Function to update the score
function updateScore() {
  game.score++;
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${game.score}`, 10, 25);
}

// The main game loop
function update() {
  if (game.gameOver) return;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update game elements
  updatePlayer();
  updateObstacles();
  generateObstacle();
  checkCollision();
  updateScore();

  // Draw game elements
  drawPlayer();
  drawObstacles();

  // Request the next frame of the animation
  requestAnimationFrame(update);
}

// --- Event Listeners ---
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && game.player.isGrounded) {
    game.player.isGrounded = false;
    game.player.isJumping = true;
    game.player.velocityY = game.physics.jumpForce;
  }
});

// --- Start the game ---
update();
