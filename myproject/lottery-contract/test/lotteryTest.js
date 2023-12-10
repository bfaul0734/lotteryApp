const Lottery = artifacts.require('..\\contracts\\Lottery.sol')
const truffleAssert = require('truffle-assertions');

contract('Lottery', function (accounts) {
  let lotty;
  const manager = accounts[0];

  beforeEach(async function () {
    lotty = await Lottery.new({ from: manager });
  });

  it('should initialize with the correct manager', async function () {
    const result = await lotty.getManager();
    assert.equal(result, manager);
  });

  it('should allow a player to enter the lottery', async function () {
    const player = accounts[1];
    const initialBalance = await web3.eth.getBalance(player);

    await lotty.enter({ from: player, value: 1 });

    const hasEntered = await lotty.hasEntered(player);
    assert.isTrue(hasEntered);

    const players = await lotty.getNumPlayers();
    assert.equal(players.toNumber(), 1);

    const finalBalance = await web3.eth.getBalance(player);
    const difference = initialBalance - finalBalance;
    assert.isAbove(difference, 1 - 0.01);

  });

  it('should not allow a player to enter without sending Ether', async function () {
    const player = accounts[1];

    await truffleAssert.reverts(
      lotty.enter({ from: player, value: 0 }), 'You must send some Ether to enter the lottery.');
  });

  it('should not allow a player to enter multiple times', async function () {
    const player = accounts[1];

    await lotty.enter({ from: player, value: 1 });

    await truffleAssert.reverts(
      lotty.enter({ from: player, value: 1 }), 'You have already entered the lottery.');
    });
  
  it('should allow the manager to pick a winner', async function () {
    const player1 = accounts[1];
    const player2 = accounts[2];

    await lotty.enter({ from: player1, value: web3.utils.toWei('1', 'ether') });
    await lotty.enter({ from: player2, value: web3.utils.toWei('1', 'ether') });

    const initialBalancePlayer1 = await web3.eth.getBalance(player1);

    await lotty.pickWinner({ from: manager });

    const hasEnteredPlayer1 = await lotty.hasEntered(player1);
    assert.isFalse(hasEnteredPlayer1);

    const finalBalancePlayer1 = await web3.eth.getBalance(player1);
    const differencePlayer1 = finalBalancePlayer1 - initialBalancePlayer1;

    assert.isAbove(differencePlayer1, web3.utils.toWei('0.9', 'ether') - web3.utils.toWei('0.01', 'ether'));

    const players = await lotty.getNumPlayers();
    assert.equal(players.toNumber(), 0);
  });

  it('should not allow a manager to pick a winner without participants', async function () {
    await truffleAssert.reverts(
      lotty.pickWinner({ from: manager }),
      'No participants to pick a winner.'
    );

  });

});