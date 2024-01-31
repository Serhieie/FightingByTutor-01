//logic if state
export function hitBoxCollisions({ obj1, obj2 }) {
  return (
    obj1.attackBox.position.x + obj1.attackBox.width >= obj2.position.x &&
    obj1.attackBox.position.x <= obj2.position.x + obj2.width &&
    obj1.attackBox.position.y + obj1.attackBox.height >= obj2.position.y &&
    obj1.attackBox.position.y <= obj2.position.y + obj2.height
  );
}

//show messages function after game end or time is 0 sec
export function determinateWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.getElementById('reset-game').style.display = 'block';
  document.querySelector('#message-backdrop').style.opacity = 1;
  if (player.health === enemy.health) {
    document.querySelector('#message').textContent = 'TIE';
  }
  if (player.health > enemy.health) {
    document.querySelector('#message').textContent = 'PLAYER 1 WIN';
  }
  if (player.health < enemy.health) {
    document.querySelector('#message').textContent = 'PLAYER 2 WIN';
  }
}

let timer = 100;
export let timerId;

//just timer from 100sec
export function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer -= 1;
    const formattedSeconds = timer < 10 ? `0${timer}` : timer;
    document.querySelector('#timerText').innerHTML = formattedSeconds;
  }
  if (timer === 0) {
    determinateWinner({ player, enemy, timerId });
  }
}
