const Character = require('./Character');
const Potion = require('./Potion');

class Enemy extends Character {
    constructor(name, weapon) {
        super(name); 

        this.weapon = weapon;
        this.potion = new Potion();
    }

// inherit prototype methods from Character
// Enemy.prototype = Object.create(Character.prototype);

    getDescription() {
        return `A ${this.name} holding a ${this.weapon} has appeared!`;
    }
}
module.exports = Enemy;