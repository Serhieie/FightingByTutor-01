import { Sprite } from './Sprite.js';
import { canvas, gravity, player, enemy, keys } from '../../main.js';
export class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = 'red',
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.dead = false;
    this.combo = [];

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw();
    if (!this.dead) this.animateFrames();

    // attack boxes
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // draw the attack box
    // c.fillStyle = "red";
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    // //players
    // c.fillStyle = "blue";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //moving characters
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // gravity function
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += gravity;
  }

  attack(attack) {
    if (attack === 1) this.switchSprite('attack1');
    if (attack === 2) this.switchSprite('attack2');
    this.isAttacking = true;
  }

  addToCombo(key) {
    this.combo.push(key);
    if (this.combo.length === 9) this.clearCombo();
    else if (this.combo.length >= 3) {
      setTimeout(() => {
        this.clearCombo();
      }, 1500);
    }
  }

  clearCombo() {
    this.combo = [];
  }

  takeHit(who) {
    if (who === player) {
      const block = who.lastKey === 'a' && keys.a.pressed;
      //we are checking here witch attack and have target block or not
      if (this.image === this.sprites.attack2.image)
        block ? (who.health -= 44 - 0.92 * 44) : (who.health -= 44);
      else block ? (who.health -= 14 - 0.92 * 14) : (who.health -= 14);
    }

    if (who === enemy) {
      const block = who.lastKey === 'ArrowRight' && keys.ArrowRight.pressed;
      //we are checking here witch attack and have target block or not
      if (this.image === this.sprites.attack2.image) {
        block ? (who.health -= 24 - 0.5 * 24) : (who.health -= 24);
      } else block ? (who.health -= 10 - 0.5 * 10) : (who.health -= 10);
    }

    //switching animation to the take hit or death
    if (who.health <= 0) {
      who.die();
    } else who.switchSprite('takeHit');
  }

  die() {
    this.switchSprite('death');
    this.health = 0;
  }

  switchSprite(sprite) {
    // overriding all other animations with the death animation and setting death
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true;
      return;
    }
    // overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;
    // overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack2.image &&
      this.framesCurrent < this.sprites.attack2.framesMax - 1
    )
      return;
    // override when fighter gets hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return;

    //sprite switcher
    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case 'attack1':
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'attack2':
        if (this.image !== this.sprites.attack2.image) {
          this.image = this.sprites.attack2.image;
          this.framesMax = this.sprites.attack2.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
