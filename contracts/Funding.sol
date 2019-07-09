// contracts/Funding.sol
pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Funding is Ownable {
  using SafeMath for uint;

  uint public raised;
  uint public goal;
  uint public finishesAt;
  mapping(address => uint) public balances;

/*
Modifiers are used as an extention of a function.
Modifier code is ran before the function code
 `_;` continues to execution of the function
Results in less duplicated code for common conditions
*/
  modifier onlyNotFinished() {
    require(!isFinished(), "Contract must be not finished");
    _;
  }

  modifier onlyFinished() {
    require(isFinished(), "Contract is must be finished");
    _;
  }

  modifier onlyNotFunded() {
    require(!isFunded(), "Contract must not be funded");
    _;
  }

  modifier onlyFunded() {
    require(isFunded(), "Contract must be funded");
    _;
  }

  constructor(uint _duration, uint _goal) public {
    // set fields of the contract for finishesAt and goal
  }

  function isFinished() public view returns (bool) {
    // if the current time is greater than finishesAt time
    // return true, else return false
  }

  function isFunded() public view returns (bool) {
    // if raised is greater than or equal to goal return true, else return false
  }

  function donate() public onlyNotFinished payable {
    // create a new entry in the balances hash map,
    // key is the address of the msg sender - value is the msg value.
    // Add msg value to the raised value
  }

  function withdraw() public onlyOwner onlyFunded {
    // transfer the balance of this contract at this address
    // to the owner of this contract
  }

  function refund() public onlyFinished onlyNotFunded {
    // check the donation amount of the address calling this function
    // require that this amount is greater than zero, else reject it
    // zero out the balance for the address calling this function
    // transfer the amount to the donor
  }
}
