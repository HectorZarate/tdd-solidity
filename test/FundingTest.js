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

  });

  it("is finished when deadline is past", async () => {

  });

  it("is funded when currentRaisedAmount is greater than or equal to goalAmount", async () => {

  });

  it("is NOT funded when currentRaisedAmount is less than goalAmount", async () => {

  });

  it("should update donationsMap with new donation amounts", async() => {

  });

  it("allows an owner to withdraw when funding is over and goal is reached", async () => {

  });
});
