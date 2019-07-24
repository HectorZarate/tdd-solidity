// contracts/Funding.sol
pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Funding is Ownable {
  using SafeMath for uint;

  // public fields can be read by any other address
  uint public currentRaisedAmount = 0;     // currentRaisedAmount
  uint public goalAmount;       // goalAmount
  uint public deadline; //deadlineTime
  mapping(address => uint) public donationsMap; // donationsMap

/*
Modifiers are used as an extention of a function.
Modifier code is ran before the function code
 `_;` continues to execution of the function
Results in less duplicated code for common conditions
*/
  modifier onlyWhenNotFinished() {
    require(!isFinished(), "Contract must be not finished");
    _;
  }

  modifier onlyWhenFinished() {
    require(isFinished(), "Contract is must be finished");
    _;
  }

  modifier onlyWhenNotFunded() {
    require(!isFunded(), "Contract must not be funded");
    _;
  }

  modifier onlyWhenFunded() {
    require(isFunded(), "Contract must be funded");
    _;
  }

  constructor(uint _duration, uint _goalAmount) public {
    // set fields of the contract for finishesAt and goal
    deadline = now + _duration;
    goalAmount = _goalAmount;
  }

  function isFinished() public view returns (bool) {
    // if the current time is greater than finishesAt time
    // return true, else return false
    return deadline <= now;
  }

  function isFunded() public view returns (bool) {
    // if raised is greater than or equal to goal return true, else return false
    return currentRaisedAmount >= goalAmount;
  }

  function getCurrentRaisedAmount() public view returns (uint) {
    return currentRaisedAmount;
  }

  function donate() public onlyWhenNotFinished payable {
    // create a new entry in the balances hash map,
    // key is the address of the msg sender - value is the msg value.
    // Add msg value to the raised value
    // donationsMap[msg.sender] = donationsMap[msg.sender].add(msg.value);
    // //donationsMap[msg.sender] = donationsMap[msg.sender];
    // currentRaisedAmount = currentRaisedAmount.add(msg.value);
    donationsMap[msg.sender] = donationsMap[msg.sender].add(msg.value);
    currentRaisedAmount = currentRaisedAmount.add(msg.value);
  }

  function withdraw() public onlyOwner onlyWhenFunded onlyWhenFinished {
    // transfer the balance of this contract at this address
    // to the owner of this contract
    // owner.transfer(address(this).balance);
    owner.transfer(address(this).balance);
  }
}
