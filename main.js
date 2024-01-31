import {
  hitBoxCollisions,
  determinateWinner,
  decreaseTimer,
  timerId,
} from './js/utils/utils.js';
import { Sprite } from './js/classes/Sprite.js';
import { Fighter } from './js/classes/Fighter.js';

export const canvas = document.querySelector('canvas');
export const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
canvas.style.position = 'absolute';
canvas.style.left = '50%';
canvas.style.top = '50%';
canvas.style.transform = 'translate(-50%, -50%)';

//set gravity
export const gravity = 1;

c.fillRect(0, 0, canvas.width, canvas.height);

//creating background
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './imgs/background.png',
});

//creating shop
const shop = new Sprite({
  position: {
    x: 668,
    y: 210,
  },
  imageSrc: './imgs/shop.png',
  scale: 2.1,
  framesMax: 6,
});

//creating player 1
export const player = new Fighter({
  position: { x: 120, y: 0 },
  velocity: { x: 0, y: 0 },
  offset: { x: 170, y: 100 },
  scale: 2.1,
  imageSrc: './imgs/samuraiMack/Idle.png',
  framesMax: 8,
  sprites: {
    idle: {
      imageSrc: './imgs/samuraiMack/Idle.png',
      framesMax: 8,
    },
    run: {
      imageSrc: './imgs/samuraiMack/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './imgs/samuraiMack/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './imgs/samuraiMack/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './imgs/samuraiMack/Attack1.png',
      framesMax: 6,
    },
    attack2: {
      imageSrc: './imgs/samuraiMack/Attack2.png',
      framesMax: 6,
    },
    death: {
      imageSrc: './imgs/samuraiMack/Death.png',
      framesMax: 6,
    },
    takeHit: {
      imageSrc: './imgs/samuraiMack/Take-Hit.png',
      framesMax: 4,
    },
  },
  color: 'yellow',
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 110,
    height: 60,
  },
});

//creating player 2
export const enemy = new Fighter({
  position: { x: 850, y: 0 },
  velocity: { x: 0, y: 0 },
  offset: { x: 176, y: 112 },
  scale: 2.1,
  imageSrc: './imgs/kenji/Idle.png',
  framesMax: 4,
  sprites: {
    idle: {
      imageSrc: './imgs/kenji/Idle.png',
      framesMax: 4,
    },
    run: {
      imageSrc: './imgs/kenji/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './imgs/kenji/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './imgs/kenji/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './imgs/kenji/Attack1.png',
      framesMax: 4,
    },
    attack2: {
      imageSrc: './imgs/kenji/Attack2.png',
      framesMax: 4,
    },
    death: {
      imageSrc: './imgs/kenji/Death.png',
      framesMax: 7,
    },
    takeHit: {
      imageSrc: './imgs/kenji/Take-hit.png',
      framesMax: 3,
    },
  },
  color: 'orangered',
  attackBox: {
    offset: {
      x: -140,
      y: 50,
    },
    width: 130,
    height: 50,
  },
});

//keys state
export const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  e: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
  ArrowDown: {
    pressed: false,
  },
  hit: {
    pressed: false,
  },
};

//reset game  by pressing button at the end of fight
const resetButton = document.getElementById('reset-game');
resetButton.addEventListener('click', e => {
  e.preventDefault();
  resetGame();
});

function resetGame() {
  resetButton.style.display = 'none';
  document.querySelector('#message-backdrop').style.opacity = 0;

  player.position.x = 120;
  player.position.y = 0;
  player.velocity.x = 0;
  player.velocity.y = 0;
  player.health = 100;
  player.combo = [];
  player.dead = false;
  player.image = player.sprites.idle.image;
  player.framesMax = player.sprites.idle.framesMax;
  player.framesCurrent = 0;
  player.framesCurrent = 0;
  player.framesElapsed = 0;
  player.framesHold = 5;
  gsap.to('#playerHealth', { width: `${player.health}%` });

  enemy.position.x = 850;
  enemy.position.y = 0;
  enemy.velocity.x = 0;
  enemy.velocity.y = 0;
  enemy.health = 100;
  enemy.combo = [];
  enemy.dead = false;
  enemy.image = enemy.sprites.idle.image;
  enemy.framesMax = enemy.sprites.idle.framesMax;
  enemy.framesCurrent = 0;
  enemy.framesCurrent = 0;
  enemy.framesElapsed = 0;
  enemy.framesHold = 5;
  gsap.to('#enemyHealth', { width: `${enemy.health}%` });
}

//turn on timer from Utils
decreaseTimer();

//Mani game animation
function animate() {
  window.requestAnimationFrame(animate);

  //canvas Rect
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();

  //light cover fore background for character contrast
  c.fillStyle = 'rgba(255, 255, 255, 0.13)';
  c.fillRect(0, 0, canvas.width, canvas.height);

  enemy.update();
  player.update();

  //player movement
  player.velocity.x = 0;
  if (keys.d.pressed && player.lastKey === 'd' && player.position.x < 950) {
    player.velocity.x = 8;
    player.switchSprite('run');
  } else if (
    keys.a.pressed &&
    player.lastKey === 'a' &&
    player.position.x > 5
  ) {
    player.velocity.x = -2;
    player.switchSprite('run');
  } else if (player.velocity.y < 0 && player.position.y < 600) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  } else {
    player.switchSprite('idle');
  }

  // enemy movement
  enemy.velocity.x = 0;
  if (
    keys.ArrowRight.pressed &&
    enemy.lastKey === 'ArrowRight' &&
    enemy.position.x < 950
  ) {
    if (enemy.position.x > 940) return;
    enemy.velocity.x = 3;
    enemy.switchSprite('run');
  } else if (
    keys.ArrowLeft.pressed &&
    enemy.lastKey === 'ArrowLeft' &&
    enemy.position.x > 5
  ) {
    enemy.velocity.x = -11;
    enemy.switchSprite('run');
  } else if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  } else {
    enemy.switchSprite('idle');
  }

  //detect for collisions && take hits logic
  //player
  if (
    //hitBoxCollisions logic for if from utils
    hitBoxCollisions({ obj1: player, obj2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    player.isAttacking = false;
    //takeHit function for calculate damage and switch animation
    player.takeHit(enemy);
    gsap.to('#enemyHealth', { width: `${enemy.health}%` });
  }
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  //enemy
  if (
    //hitBoxCollisions logic for if from utils
    hitBoxCollisions({ obj1: enemy, obj2: player }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    enemy.isAttacking = false;
    //takeHit function for calculate damage and switch animation
    enemy.takeHit(player);
    gsap.to('#playerHealth', { width: `${player.health}%` });
  }
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0 || player.health <= 0) {
    //end game base on health
    determinateWinner({ player, enemy, timerId });
  }
}

animate();

//player Pressing keys func
function playerPressing(event) {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        if (player.position.x === 940) return;
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case 'a':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
      case 'w':
        if (player.velocity.y === 0 && !keys.w.pressed) {
          player.lastKey = 'w';
          //if (combo === w + w + w)  Player1 jumping higher
          if (player.combo[player.combo.length - 1] === 'w')
            player.velocity.y = -30;
          else player.velocity.y = -20;
        }
        keys.w.pressed = true;
        break;
      case ' ':
        player.attack(1);
        break;
      case 'e':
        if (
          //if (combo === d + d + e)  Player1 hardHitting
          player.combo[player.combo.length - 2] === 'd' &&
          player.combo[player.combo.length - 1] === 'd'
        )
          player.attack(2);
        else break;
        break;
    }
  }
}

//enemy Pressing keys func

function enemyPressing(event) {
  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
        if (
          //if combo === ArrowRight * 3 Player2 (enemy) jumping back
          enemy.combo[enemy.combo.length - 2] === 'ArrowRight' &&
          enemy.combo[enemy.combo.length - 1] === 'ArrowRight' &&
          enemy.position.x < 810
        )
          enemy.velocity.x = 150;
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
        break;
      case 'ArrowUp':
        if (enemy.velocity.y === 0 && !keys.ArrowUp.pressed) {
          enemy.velocity.y = -20;
        }
        keys.ArrowUp.pressed = true;
        break;
      case 'ArrowDown':
        enemy.attack(1);
        break;
      case '/':
        if (
          //if (combo === ArrowLeft * 2 + "/")     Player2 (enemy) hardHitting
          enemy.combo[enemy.combo.length - 2] === 'ArrowLeft' &&
          enemy.combo[enemy.combo.length - 1] === 'ArrowLeft'
        )
          enemy.attack(2);
        else break;
        break;
    }
  }
}

//eventListener for pressing keys
window.addEventListener('keydown', event => {
  playerPressing(event);
  enemyPressing(event);
});

//keyUP for player and enemy
window.addEventListener('keyup', event => {
  switch (event.key) {
    case 'd':
      player.addToCombo('d');
      keys.d.pressed = false;
      break;
    case 'a':
      player.addToCombo('a');
      keys.a.pressed = false;
      break;
    case 'w':
      player.addToCombo('w');
      keys.w.pressed = false;
      break;
    case 'e':
      player.addToCombo('e');
      keys.e.pressed = false;
      break;
    case ' ':
      player.addToCombo(' ');
      keys.space.pressed = false;
      break;
    case 'ArrowRight':
      enemy.addToCombo('ArrowRight');
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      enemy.addToCombo('ArrowLeft');
      keys.ArrowLeft.pressed = false;
      break;
    case 'ArrowUp':
      enemy.addToCombo('ArrowUp');
      keys.ArrowUp.pressed = false;
      break;
    case 'ArrowDown':
      enemy.addToCombo('ArrowDown');
      keys.ArrowUp.pressed = false;
      break;
    case '/':
      enemy.addToCombo('/');
      keys.hit.pressed = false;
      break;
  }
});
