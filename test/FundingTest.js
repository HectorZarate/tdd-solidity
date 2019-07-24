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
    await increaseTime(DAY);
    await funding.withdraw();
    let finalBalance = web3.eth.getBalance(firstAccount);
    assert.ok(finalBalance.greaterThan(balance));
  });
});
