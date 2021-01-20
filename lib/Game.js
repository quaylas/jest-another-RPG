const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');


function Game() {
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
}

Game.prototype.initializeGame = function () {
    this.enemies.push(new Enemy('goblin','sword'));
    this.enemies.push(new Enemy('orc','baseball bat'));
    this.enemies.push(new Enemy('skeleton','axe'));

    this.currentEnemy = this.enemies[0];

    inquirer.prompt({
        type: 'text',
        name: 'playerName',
        message: 'What is your player name?'
    })
    .then(({playerName}) => {
        this.player = new Player(playerName);

        this.startNewBattle();
    });
};

Game.prototype.startNewBattle = function() {
    if(this.player.agility > this.currentEnemy.agility) {
        this.isPlayerTurn = true;
    } else {
        this.isPlayerTurn = false;
    }

    console.log('Your stats are as follows:');
    console.table(this.player.getStats());
    
    console.log(this.currentEnemy.getDescription());

    this.battle();
};

Game.prototype.battle = function() {
    if(this.isPlayerTurn){
        inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'What would you like to do',
            choices: ['Attack','Use a potion']
        })
        .then(({ action }) => {
            if(action === 'Use a potion'){
                if(!this.player.getInventory()){
                    console.log('You don\'t have any potions!');

                    return this.checkEndOfBattle();
                }
                inquirer.prompt({
                    type: 'list',
                    name: 'action',
                    message: 'Which potion woould youo like to use?',
                    choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                })
                .then(({ action }) => {
                    const potionDetails = action.split(': ');

                    this.player.usePotion(potionDetails[0] - 1);
                    console.log(`You used a ${potionDetails[1]} potion.`);

                    this.checkEndOfBattle();
                });
            } else {
                const damage = this.player.getAttackValue();
                this.currentEnemy.reduceHealth(damage);

                console.log(`You attacked the ${this.currentEnemy.name}`);
                console.log(this.currentEnemy.getHealth());

                this.checkEndOfBattle();
            }
        });
    } else {
        const damage = this.currentEnemy.getAttackValue();
        this.player.reduceHealth(damage);

        console.log(`You were attacked by the ${this.currentEnemy.name}`);
        console.log(this.player.getHealth());

        this.checkEndOfBattle();
    }
}

Game.prototype.checkEndOfBattle = function () {
    if (this.player.isAlive() && this.currentEnemy.isAlive()) {
        this.isPlayerTurn = !this.isPlayerTurn;
        this.battle();
    } else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
        console.log(`You have defeated the ${this.currentEnemy.name}!`);

        this.player.addPotion(this.currentEnemy.potion);
        console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion.`);

        this.roundNumber++;

        if(this.roundNumber < this.enemies.length) {
            this.currentEnemy = this.enemies[this.roundNumber];
            this.startNewBattle();
        } else {
            console.log(`You have faced all enemies and emerged victorious!`);
        }
    } else {
        console.log(`You have been slain in battle against a ${this.currentEnemy.name}`);
    }
};

module.exports = Game;