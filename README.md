# tdd-solidity
A test repo for TDD in solidity

## Required
Ganache - either cli or gui
Truffle
`Note: once gananche is up note the port number and replace the port value in truffle.js with it`
## Installing
`npm i`
`npm i -g truffle@v4.1.14`
## Compiling
`truffle compile`
## Testing
`truffle test`
## Deploying
`truffle migrate`

## Demo using multiple accounts

```
// Restart Ganache

truffle compile

truffle test

// Restart Ganache

truffle migrate

truffle console

```

##### Set up Accounts
```

truffle console

// Set up 2 accounts of generous donors

// get accounts array 

web3.eth.getAccounts(function(e,a) { accounts=a; });

// assign accounts

sprinkles = accounts[0];

donny = accounts[1];

paul = accounts[2];

// check account balances

web3.eth.getBalance(donny).toString(10);

web3.eth.getBalance(paul).toString(10);

```

##### Get the instance of the contract

```
// get instance of Funding
Funding.deployed().then(function(instance) { funding = instance; });

// call isFinished, should be false
funding.isFinished().then(function(f) {console.log(f.toString());});

// call isFunded, should be false
funding.isFunded().then(function(f) {console.log(f.toString());});

// check how much donny and paul have donated, should be 0

funding.donationsMap.call(paul).then(function(bal) {console.log(bal.toString());});
funding.donationsMap.call(donny).then(function(bal) {console.log(bal.toString());});
```

##### Donate

```
// define an ether
const ETHER = 10**18;

// donate!

funding.donate({ from: paul, value: 25 * ETHER });
funding.donate({ from: donny, value: 25 * ETHER });

```

##### Check the status of the kickstarter

```

// call isFunded, should be true
funding.isFunded().then(function(f) {console.log(f.toString());});

// call isFinished, should be false
funding.isFinished().then(function(f) {console.log(f.toString());});

```

##### Increase Time to Be Able to Withdraw

```
// declare DAY constant
truffle(development)> const DAY = 3600 * 24;

// create increaseTime util
truffle(development)> 
function increaseTime(duration) {const id = Date.now();return new Promise((resolve, reject) => {web3.currentProvider.sendAsync( {jsonrpc:"2.0",method: "evm_increaseTime",params: [duration],id: id},err1 => {if (err1) return reject(err1);web3.currentProvider.sendAsync({jsonrpc: "2.0",method: "evm_mine",id: id + 1},(err2, res) => {return err2 ? reject(err2) : resolve(res);});});});};

// increase time by a day
increaseTime(DAY);

```

##### Check status and Withdraw

```
// call isFinished, should be true
funding.isFinished().then(function(f) {console.log(f.toString());});

// withdraw
funding.withdraw();
```