const { TestScheduler } = require('jest');
const Player = require('../lib/Player.js');
const Potion = require('../lib/__mocks__/Potion.js');

jest.mock('../lib/Potion.js');
console.log(new Potion());

test('creates a player Object',() => {
    const player = new Player('James');

    expect(player.name).toBe('James');
    expect(player.health).toEqual(expect.any(Number));
    expect(player.strength).toEqual(expect.any(Number));
    expect(player.agility).toEqual(expect.any(Number));
    expect(player.inventory).toEqual(expect.arrayContaining([expect.any(Object)]));
})