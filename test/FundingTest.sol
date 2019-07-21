// test/FundingTest.sol
pragma solidity 0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Funding.sol";

contract FundingTest {
  Funding funding;
  uint public initialBalance = 10 ether;

  function () public payable {}

  function beforeEach() public {
    funding = new Funding(1 days, 10 ether);
  }

  function testSettingAnOwnerDuringCreation() public {
    Assert.equal(funding.owner(), this, "An owner is different than a deployer");
  }

  function testSettingAnOwnerOfDeployedContract() public {
    funding = Funding(DeployedAddresses.Funding());
    Assert.equal(funding.owner(), msg.sender, "An owner is different than a deployer");
  }

  function testAcceptingDonations() public {
    Assert.equal(funding.raised(), 0, "Initial raised amount is different than 0");
    funding.donate.value(1 ether)();
    funding.donate.value(2 ether)();
    Assert.equal(funding.raised(), 3 ether, "Raised amount is different than sum of donations");
  }

  function testTrackingDonorsBalance() public {
    funding.donate.value(2 ether)();
    funding.donate.value(2 ether)();
    Assert.equal(funding.balances(this), 4 ether, "Donator balance is different than sum of donations");
  }

  function testDonatingAfterTimeIsUp() public {
    funding = new Funding(0, 10 ether);
    bool result = address(funding).call.value(10 ether)(bytes4(keccak256("donate()")));
    Assert.equal(result, false, "Allows for donations when time is up");
  }

  function testWithdrawalByAnOwner() public {
    uint initBalance = address(this).balance;
    funding.donate.value(5 ether)();
    bool result = address(funding).call(bytes4(keccak256("withdraw()")));
    Assert.equal(result, false, "Allows for withdrawal before reaching the goal");
    funding.donate.value(5 ether)();
    Assert.equal(address(this).balance, initBalance - 10 ether, "Balance before withdrawal doesn't correspond to the sum of donations");
    result = address(funding).call(bytes4(keccak256("withdraw()")));
    Assert.equal(result, true, "Doesn't allow for withdrawal after reaching the goal");
    Assert.equal(address(this).balance, initBalance, "Balance after withdrawal doesn't correspond to the sum of donations");
  }

  function testWithdrawalByNotAnOwner() public {
    funding = Funding(DeployedAddresses.Funding());
    funding.donate.value(100 finney)();
    bool result = address(funding).call(bytes4(keccak256("withdraw()")));
    Assert.equal(result, false, "Allows for withdrawal by not an owner");
  }
}
