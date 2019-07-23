// test/FundingTest.js
const { increaseTime } = require("./utils");
const Funding = artifacts.require("Funding");

const ETH = 10**18;
const FINNEY = 10**15;
const DAY = 3600 * 24;

contract("Funding", accounts => {
  const [firstAccount, secondAccount, thirdAccount] = accounts;
  let funding;

  beforeEach(async () => {
    funding = await Funding.new(DAY, 10 * FINNEY);
  });

  it("is not finished when deadline is in future", async () => {
    let isFinished = await funding.isFinished.call();
    assert.equal(isFinished, false);
  });

  it("is finished when deadline is past", async () => {
    await increaseTime(DAY);
    let isFinished = await funding.isFinished.call();
    assert.equal(isFinished, true);
  });

  it("is funded when currentRaisedAmount is greater than or equal to goalAmount", async () => {
    await funding.donate({from: firstAccount, value: 11*FINNEY});
    let isFunded = await funding.isFunded.call();
    assert.equal(isFunded, true);
  });

  it("is NOT funded when currentRaisedAmount is less than goalAmount", async () => {
    await funding.donate({from: firstAccount, value: 8*FINNEY});
    let isFunded = await funding.isFunded.call();
    assert.equal(isFunded, false);
  });

  it("should update donationsMap with new donation amounts", async() => {
    await funding.donate({from: firstAccount, value: 10 * FINNEY});
    let amount = await funding.donationsMap.call(firstAccount);
    assert.equal(amount.toNumber(), 10 * FINNEY);
  });

  it("allows an owner to withdraw when funding is over and goal is reached", async () => {
    let balance = web3.eth.getBalance(firstAccount);
    await funding.donate({from: secondAccount, value: 11 * FINNEY});
    await funding.withdraw();
    let expectedBalance = balance.toNumber() + (11 * FINNEY);
    let finalBalance = web3.eth.getBalance(firstAccount);
    assert.equal(expectedBalance, finalBalance.toNumber());
    
  });

  // it("allows an owner to withdraw funds when goal is reached", async () => {
  //   await funding.donate({ from: secondAccount, value: 30 * FINNEY });
  //   await funding.donate({ from: thirdAccount, value: 70 * FINNEY });
  //   const initBalance = web3.eth.getBalance(firstAccount);
  //   assert.equal(web3.eth.getBalance(funding.address), 100 * FINNEY);
  //   await funding.withdraw();
  //   const finalBalance = web3.eth.getBalance(firstAccount);
  //   assert.ok(finalBalance.greaterThan(initBalance));
  // });

  // it("accepts donations", async () => {
  //   await funding.donate({ from: firstAccount, value: 1 * FINNEY });
  //   await funding.donate({ from: secondAccount, value: 2 * FINNEY });
  //   let raised = await funding.currentRaisedAmount.call();
  //   assert.equal(raised.toNumber(), 3 * FINNEY);
    
  // });

  // it("is funded when current donation amount is greater than or equal to goalAmount", async () => {
  //   await funding.donate({ from: firstAccount, value: 5 * FINNEY });
  //   await funding.donate({ from: firstAccount, value: 5 * FINNEY });
  //   let result = await funding.isFunded();
  //   assert.equal(result, true);
  // });

  // it("keeps track of donator balance", async () => {
  //   await funding.donate({ from: firstAccount, value: 5 * FINNEY });
  //   await funding.donate({ from: firstAccount, value: 5 * FINNEY });
  //   let donated = await funding.donationsMap.call(firstAccount);
  //   assert.equal(donated.toNumber(), 10 * FINNEY);
  // });

  // it("is not funded when current donation amount is less than goalAmount", async () => {
  //   await funding.donate({ from: firstAccount, value: 1 * FINNEY });
  //   await funding.donate({ from: firstAccount, value: 1 * FINNEY });
  //   let result = await funding.isFunded.call();
  //   assert.equal(result, false);
  // });



  // it("finishes fundraising when time is up", async () => {
  //   assert.equal(await funding.isFinished.call(), false);
  //   await increaseTime(DAY);
  //   assert.equal(await funding.isFinished.call(), true);
  // });

  // it("does not allow for donations when time is up", async () => {
  //   await funding.donate({ from: firstAccount, value: 10 * FINNEY });
  //   await increaseTime(DAY);
  //   try {
  //     await funding.donate({ from: firstAccount, value: 10 * FINNEY });
  //     assert.fail();
  //   } catch (err) {
  //     assert.ok(/revert/.test(err.message));
  //   }
  // });

  // it("allows an owner to withdraw funds when goal is reached", async () => {
  //   await funding.donate({ from: secondAccount, value: 30 * FINNEY });
  //   await funding.donate({ from: thirdAccount, value: 70 * FINNEY });
  //   const initBalance = web3.eth.getBalance(firstAccount);
  //   assert.equal(web3.eth.getBalance(funding.address), 100 * FINNEY);
  //   await funding.withdraw();
  //   const finalBalance = web3.eth.getBalance(firstAccount);
  //   assert.ok(finalBalance.greaterThan(initBalance));
  // });

  // it("does not allow non-owners to withdraw funds", async () => {
  //   await funding.donate({ from: secondAccount, value: 100 * FINNEY });
  //   try {
  //     await funding.withdraw({ from: secondAccount });
  //     assert.fail();
  //   } catch (err) {
  //     assert.ok(/revert/.test(err.message));
  //   }
  // });

  // it("allows to withdraw funds after time is up and goal is not reached", async () => {
  //   await funding.donate({ from: secondAccount, value: 50 * FINNEY });
  //   const initBalance = web3.eth.getBalance(secondAccount);
  //   assert.equal((await funding.balances.call(secondAccount)), 50 * FINNEY);
  //   await increaseTime(DAY);
  //   await funding.refund({ from: secondAccount });
  //   const finalBalance = web3.eth.getBalance(secondAccount);
  //   assert.ok(finalBalance.greaterThan(initBalance)); // hard to be exact due to the gas usage
  // });

  // it("does not allow to withdraw funds after time in up and goal is reached", async () => {
  //   await funding.donate({ from: secondAccount, value: 100 * FINNEY });
  //   assert.equal((await funding.balances.call(secondAccount)), 100 * FINNEY);
  //   await increaseTime(DAY);
  //   try {
  //     await funding.refund({ from: secondAccount });
  //     assert.fail();
  //   } catch (err) {
  //     assert.ok(/revert/.test(err.message));
  //   }
  // });

  // it("does not allow to withdraw funds before time in up and goal is not reached", async () => {
  //   await funding.donate({ from: secondAccount, value: 50 * FINNEY });
  //   assert.equal((await funding.balances.call(secondAccount)), 50 * FINNEY);
  //   try {
  //     await funding.refund({ from: secondAccount });
  //     assert.fail();
  //   } catch (err) {
  //     assert.ok(/revert/.test(err.message));
  //   }
  // });
});
