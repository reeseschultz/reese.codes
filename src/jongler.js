/*

MIT License

Copyright (c) 2022 Reese Schultz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

////////////
// Classes /
////////////

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distance(vector) {
    return Math.sqrt(
      Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2),
    );
  }
}

class Paddle {
  constructor(
    position,
    scale,
    speed,
    juiceSpeed,
    juiceScale,
    paddleXFriction,
    paddleFollowRatio,
  ) {
    this.position = position;
    this.targetX = position.x;
    this.scale = scale;
    this.targetScale = new Vector2(scale.x, scale.y);
    this.speed = speed;
    this.juiceSpeed = juiceSpeed;
    this.juiceScale = juiceScale;
    this.paddleXFriction = paddleXFriction;
    this.paddleFollowRatio = paddleFollowRatio;

    this.velocity = new Vector2(0, 0);
    this.dragging = false;
  }

  update(ball) {
    if (this.dragging) {
      const y = mousePosition.y - this.scale.y * 0.5;

      if (this.withinYBounds(y)) this.position.y = y;
    } else {
      this.follow(ball);
    }

    this.position.x += this.velocity.x;

    this.velocity.x *= this.paddleXFriction;

    this.lerpXPositionToTarget();
    this.lerpScaleToTarget();
  }

  hasMouseHovering() {
    const quarterHeight = this.scale.y * 0.25;

    return mousePosition.x > this.position.x - this.scale.x &&
      mousePosition.x < this.position.x + this.scale.x * 2 &&
      mousePosition.y > this.position.y - quarterHeight &&
      mousePosition.y < this.position.y + this.scale.y + quarterHeight;
  }

  handleHover() {
    document.body.style.cursor = CURSOR_HOVER;
    canvas.style.zIndex = HOVER_Z_INDEX;

    if (mouseDown) {
      const offset = this.scale.x * 0.25;

      this.scale.x *= this.juiceScale;
      this.scale.y *= this.juiceScale;

      this.position.x -= offset;

      document.body.style.cursor = CURSOR_DRAGGING;
      this.dragging = true;
    }
  }

  lerpXPositionToTarget() {
    this.position.x += (this.targetX - this.position.x) * this.juiceSpeed / FPS;
  }

  lerpScaleToTarget() {
    this.scale.x += (this.targetScale.x - this.scale.x) * this.juiceSpeed / FPS;
    this.scale.y += (this.targetScale.y - this.scale.y) * this.juiceSpeed / FPS;
  }

  follow(ball) {
    if (
      this.position.distance(ball.position) >
        canvas.width * this.paddleFollowRatio
    ) {
      return;
    }

    const paddleCenterY = this.position.y + this.scale.y * 0.5;

    const y = this.position.y +
      (ball.position.y - paddleCenterY) * this.speed / FPS;

    if (!this.withinYBounds(y)) return;

    this.position.y = y;
  }

  withinYBounds(y) {
    return y >= 0 && y <= canvas.height - this.scale.y;
  }

  draw() {
    fillRoundedRect(
      this.position.x,
      this.position.y,
      this.scale.x,
      this.scale.y,
      ROUND_RECT_RADIUS,
    );
  }
}

class Trail {
  constructor(length) {
    this.particles = new Array(length);

    if (length < 1) throw new Error("Trail length must be greater than 0");

    for (let i = 0; i < length; ++i) {
      this.particles[i] = new Particle(new Vector2(0, 0), 0);
    }
  }

  add(x, y, radius) {
    this.particles.unshift(this.particles.pop());

    const particle = this.particles[0];

    particle.position.x = x;
    particle.position.y = y;
    particle.radius = radius;
  }
}

class Particle {
  constructor(position, radius) {
    this.position = position;
    this.radius = radius;
  }
}

class Ball {
  constructor(
    position,
    velocity,
    radius,
    initialSpeed,
    speedLimit,
    collisionSpeed,
    collisionVelocityScalar,
    collisionAngleRandomness,
    friction,
    minRandomAngleConstraint,
    maxRandomAngleConstraint,
    trailDriftSpeed,
    trailSize,
    trailDissolutionRate,
  ) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.speed = initialSpeed;
    this.initialSpeed = initialSpeed;
    this.speedLimit = speedLimit;
    this.collisionSpeed = collisionSpeed;
    this.collisionVelocityScalar = collisionVelocityScalar;
    this.collisionAngleRandomness = collisionAngleRandomness;
    this.friction = friction;
    this.minRandomAngleConstraint = minRandomAngleConstraint;
    this.maxRandomAngleConstraint = maxRandomAngleConstraint;
    this.trailDriftSpeed = trailDriftSpeed;
    this.trailSize = trailSize;
    this.trailDissolutionRate = trailDissolutionRate;

    this.trail = new Trail(this.trailSize);
    this.lastCollisionTime = 0;

    this.init();
  }

  init() {
    this.speed = this.initialSpeed;
    this.setInitialPosition();
    this.setRandomVelocity();
  }

  setInitialPosition() {
    this.position = new Vector2(canvas.width / 2, canvas.height / 2);
  }

  setRandomVelocity() {
    const angle = getRandomAngle(
      this.minRandomAngleConstraint,
      this.maxRandomAngleConstraint,
    );

    this.velocity.x = Math.sign(Math.random() - 0.5) * Math.cos(angle) *
      this.speed;

    this.velocity.y = -Math.sin(angle) * this.speed;
  }

  update(paddles) {
    this.updateSpeed();

    if (this.collidesWithTop()) {
      this.velocity.y = -this.velocity.y;
      this.position.y += this.radius * 2;
    } else if (this.collidesWithBottom()) {
      this.velocity.y = -this.velocity.y;
      this.position.y -= this.radius * 2;
    }

    for (const paddle of paddles) {
      if (!this.collidesWithPaddle(paddle)) continue;

      this.updateVelocityFromCollision(paddle);

      this.lastCollisionTime = Date.now();
    }

    if (
      this.collidesWithLeft() || this.collidesWithRight()
    ) {
      this.init();
    }

    if (this.lastCollisionTime + this.speed > Date.now()) {
      this.trail.add(this.position.x, this.position.y, this.radius);
    } else {
      for (const particle of this.trail.particles) {
        particle.position.y += this.trailDriftSpeed / FPS;
      }
    }

    for (const particle of this.trail.particles) {
      particle.radius *= this.trailDissolutionRate;
    }

    this.updatePosition();
  }

  updateSpeed() {
    this.speed *= this.friction;
    this.speed = Math.max(this.speed, this.initialSpeed);
    this.speed = Math.min(this.speed, this.speedLimit);
  }

  updatePosition() {
    this.position.x += this.velocity.x / FPS;
    this.position.y += this.velocity.y / FPS;
  }

  updateVelocityFromCollision(paddle) {
    const paddleCenterY = paddle.position.y + paddle.scale.y * 0.5;

    let angle = (paddleCenterY - this.position.y) * Math.PI /
      paddle.scale.y * 0.5;

    angle += Math.sign(angle) * Math.random() * this.collisionAngleRandomness;

    this.speed += this.collisionSpeed;

    this.velocity.x = Math.sign(-this.velocity.x) * Math.cos(angle) *
      this.speed;
    this.velocity.y = -Math.sin(angle) * this.speed;

    this.position.x += Math.sign(this.velocity.x) * this.radius;
    this.position.y += Math.sign(this.velocity.y) * this.radius;

    paddle.velocity.x = -Math.sign(ball.velocity.x) *
      Math.abs(ball.velocity.x) * this.collisionVelocityScalar / FPS;
  }

  collidesWithPaddle(paddle) {
    const { position: paddlePos, scale: paddleScale } = paddle;

    return (
      this.position.x + this.radius > paddlePos.x &&
      this.position.x - this.radius < paddlePos.x + paddleScale.x &&
      this.position.y + this.radius > paddlePos.y &&
      this.position.y - this.radius < paddlePos.y + paddleScale.y
    );
  }

  collidesWithTop() {
    return this.position.y - this.radius < 0;
  }

  collidesWithBottom() {
    return this.position.y + this.radius > canvas.height;
  }

  collidesWithLeft() {
    return this.position.x + this.radius < 0;
  }

  collidesWithRight() {
    return this.position.x - this.radius > canvas.width;
  }

  draw() {
    fillCircle(this.position.x, this.position.y, this.radius);

    for (const particle of this.trail.particles) {
      fillCircle(particle.position.x, particle.position.y, particle.radius);
    }
  }
}

//////////////
// Constants /
//////////////

const PADDLE_WIDTH = 25;
const PADDLE_HEIGHT = 120;
const PADDLE_OFFSET = 40;
const PADDLE_SPEED = 10;
const PADDLE_JUICE_SPEED = 4;
const PADDLE_JUICE_SCALE = 1.5;
const PADDLE_X_FRICTION = 0.8;
const PADDLE_FOLLOW_RATION = 0.6;

const BALL_RADIUS = 10;
const BALL_SPEED = 800;
const BALL_SPEED_LIMIT = BALL_SPEED * 2;
const BALL_COLLISION_SPEED = 100;
const BALL_COLLISION_VELOCITY_SCALAR = 0.45;
const BALL_COLLISION_ANGLE_RANDOMNESS = 0.1;
const BALL_FRICTION = 0.9998;
const BALL_MIN_RANDOM_ANGLE_CONSTRAINT = -45;
const BALL_MAX_RANDOM_ANGLE_CONSTRAINT = 45;
const BALL_TRAIL_DRIFT_SPEED = 100;
const BALL_TRAIL_SIZE = 20;
const BALL_TRAIL_DISSOLUTION_RATE = 0.94;

const FPS = 60;
const FPS_INTERVAL = 1000 / FPS;

const HOVER_Z_INDEX = "1";
const CURSOR_HOVER = "grab";
const CURSOR_DRAGGING = "none";

const UNDO_STYLE = "";

const ROUND_RECT_RADIUS = 5;

const MIN_CANVAS_WIDTH = 1024;
const MIN_CANVAS_HEIGHT = 768;

const GRADIENT_AMPLITUDE = 0.2;
const GRADIENT_FREQUENCY = 0.25;

const BLUE = "#0099ff";
const GREEN = "#19ff5a";
const YELLOW = "#ffcb0d";
const ORANGE = "#ff9600";
const RED = "#ff1b19";

////////////
// Globals /
////////////

const canvas = document.createElement("canvas");
canvas.id = "jongler";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

let then = Date.now();

const mousePosition = new Vector2(0, 0);
let mouseDown = false;

////////////
// Objects /
////////////

const leftPaddle = new Paddle(
  new Vector2(PADDLE_OFFSET, 0),
  new Vector2(PADDLE_WIDTH, PADDLE_HEIGHT),
  PADDLE_SPEED,
  PADDLE_JUICE_SPEED,
  PADDLE_JUICE_SCALE,
  PADDLE_X_FRICTION,
  PADDLE_FOLLOW_RATION,
);

const rightPaddle = new Paddle(
  new Vector2(canvas.width - PADDLE_WIDTH - PADDLE_OFFSET, 0),
  new Vector2(PADDLE_WIDTH, PADDLE_HEIGHT),
  PADDLE_SPEED,
  PADDLE_JUICE_SPEED,
  PADDLE_JUICE_SCALE,
  PADDLE_X_FRICTION,
  PADDLE_FOLLOW_RATION,
);

const ball = new Ball(
  new Vector2(0, 0),
  new Vector2(0, 0),
  BALL_RADIUS,
  BALL_SPEED,
  BALL_SPEED_LIMIT,
  BALL_COLLISION_SPEED,
  BALL_COLLISION_VELOCITY_SCALAR,
  BALL_COLLISION_ANGLE_RANDOMNESS,
  BALL_FRICTION,
  BALL_MIN_RANDOM_ANGLE_CONSTRAINT,
  BALL_MAX_RANDOM_ANGLE_CONSTRAINT,
  BALL_TRAIL_DRIFT_SPEED,
  BALL_TRAIL_SIZE,
  BALL_TRAIL_DISSOLUTION_RATE,
);

///////////////
// Game Logic /
///////////////

play();

function play() {
  self.requestAnimationFrame(play);

  const now = Date.now();
  const elapsed = now - then;

  if (elapsed <= FPS_INTERVAL) return;

  then = now - (elapsed % FPS_INTERVAL);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (screenTooSmall()) return;

  update();
  draw(now);
}

function update() {
  ball.update([leftPaddle, rightPaddle]);
  leftPaddle.update(ball);
  rightPaddle.update(ball);

  handleMouseInput();
}

function handleMouseInput() {
  if (!mouseDown) {
    leftPaddle.dragging = rightPaddle.dragging = false;
  }

  const noDragging = !leftPaddle.dragging && !rightPaddle.dragging;
  const leftPaddleHovering = leftPaddle.hasMouseHovering();
  const rightPaddleHovering = rightPaddle.hasMouseHovering();

  if (noDragging) {
    if (leftPaddleHovering) {
      leftPaddle.handleHover();
    } else if (rightPaddleHovering) {
      rightPaddle.handleHover();
    }
  }

  const hovering = leftPaddleHovering || rightPaddleHovering;

  if (!hovering && !mouseDown) {
    canvas.style.zIndex = document.body.style.cursor = UNDO_STYLE;
  }
}

//////////////////////
// Utility Functions /
//////////////////////

function screenTooSmall() {
  return canvas.width <= MIN_CANVAS_WIDTH || canvas.height <= MIN_CANVAS_HEIGHT;
}

function draw(now) {
  setRainbowGradient(now);

  leftPaddle.draw();
  rightPaddle.draw();
  ball.draw();
}

function getRainbowGradient(x, y, width, height, now) {
  const gradient = ctx.createLinearGradient(x, y, width, height);

  const offset = GRADIENT_AMPLITUDE * Math.cos(GRADIENT_FREQUENCY * now / FPS);

  gradient.addColorStop(0, BLUE);
  gradient.addColorStop(offset + 0.25, GREEN);
  gradient.addColorStop(offset + 0.5, YELLOW);
  gradient.addColorStop(offset + 0.75, ORANGE);
  gradient.addColorStop(1, RED);

  return gradient;
}

function setRainbowGradient(now) {
  ctx.fillStyle = getRainbowGradient(
    0,
    0,
    canvas.width,
    canvas.height,
    now,
  );
}

function fillCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

function fillRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);

  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);

  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);

  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);

  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);

  ctx.closePath();
  ctx.fill();
}

function getRandomAngle(minDegrees, maxDegrees) {
  return ((maxDegrees - minDegrees) * Math.random() + minDegrees) /
    180 * Math.PI;
}

///////////
// Events /
///////////

self.addEventListener("resize", () => {
  const lastWidth = canvas.width;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ball.position.x += canvas.width - lastWidth;

  rightPaddle.targetX = rightPaddle.position.x = canvas.width - PADDLE_WIDTH -
    PADDLE_OFFSET;
});

self.addEventListener("mousemove", (e) => {
  mousePosition.x = e.clientX;
  mousePosition.y = e.clientY;
});

self.addEventListener("mousedown", () => {
  mouseDown = true;
});

self.addEventListener("mouseup", () => {
  mouseDown = false;
});
