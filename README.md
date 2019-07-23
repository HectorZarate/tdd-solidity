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

## Interacting with the Deployed Contract

```
// getting the owner account
truffle(development)> web3.eth.getAccounts(function(e,a) { accounts=a; });
undefined

truffle(development)> account = accounts[0];
'0x9b9e36012932bf9e4b418145062be8da6cc5a490'

// get owner account balance
truffle(development)> web3.eth.getBalance(account).toString(10);
'99880796000000000000'

// Funding contract instance
truffle(development)> Funding.deployed()

// get deployed instance of Funding
truffle(development)> Funding.deployed().then(function(instance) { funding = instance; });

// Getting the balance that the owner account has donated
truffle(development)> funding.balances.call(account).then(function(bal) {balance = bal});
undefined

truffle(development)> balance.toString(10);
'0'

// define a finney
truffle(development)> const FINNEY = 10**15;
undefined

// donate 5 finney from owner account
truffle(development)> funding.donate({ from: account, value: 5 * FINNEY });

// check funding, goal is 100 finney
truffle(development)> funding.isFunded().then(function(f) {isFunded = f});
undefined

truffle(development)> isFunded
false

// donate 100 finney
truffle(development)> funding.donate({ from: account, value: 100 * FINNEY });

// check isFunded 
truffle(development)> funding.isFunded().then(function(f) {isFunded = f});
undefined
truffle(development)> isFunded
true

// declare DAY constant
truffle(development)> const DAY = 3600 * 24;

// create increaseTime util
truffle(development)> 
function increaseTime(duration) {const id = Date.now();return new Promise((resolve, reject) => {web3.currentProvider.sendAsync( {jsonrpc:"2.0",method: "evm_increaseTime",params: [duration],id: id},err1 => {if (err1) return reject(err1);web3.currentProvider.sendAsync({jsonrpc: "2.0",method: "evm_mine",id: id + 1},(err2, res) => {return err2 ? reject(err2) : resolve(res);});});});};


// check if funding is finished, should be false
truffle(development)> funding.isFinished().then(function(f) {finished = f})
undefined

truffle(development)> finished;
false

// increase time by a day
truffle(development)> increaseTime(DAY);
{ id: 1563743014647, jsonrpc: '2.0', result: '0x0' }

// check if funding is over, should be true
truffle(development)> funding.isFinished().then(function(f) {finished = f})
undefined

truffle(development)> finished;
true

// withdraw funds
truffle(development)> funding.withdraw();

```


## Demo using multiple accounts, 50 ETH kickstarter

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

funding.balances.call(paul).then(function(bal) {console.log(bal.toString());});
funding.balances.call(donny).then(function(bal) {console.log(bal.toString());});
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