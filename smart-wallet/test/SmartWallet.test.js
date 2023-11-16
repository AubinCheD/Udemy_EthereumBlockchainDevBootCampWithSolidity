const ganache = require('ganache');
const { Web3 } = require('web3');

const assert = require('assert');
const { beforeEach } = require('mocha');

const web3 = new Web3(ganache.provider());
//const { interface, bytecode } = require('../compile') //old
const { abi, evm } = require('../compile'); //new
// const { getBalance } = require('web3/lib/commonjs/eth.exports');

// updated ganache and web3 imports added for convenience

// contract test code will go here

let accounts;
let lottery;

beforeEach(async () => 
    {
        //get a list of all accounts
        accounts = await web3.eth.getAccounts()
        
        // web3.eth.getAccounts().then(fetchedAccounts => {
        //     console.log(fetchedAccounts);
        // });
        console.log('ABI: ', abi);
        console.log('FIRST STEP'); 

        //console.log('Parsing: ', JSON.parse(abi));

        console.log('SECOND STEP');


        //use one of the accounts to deploy the contract
        // lottery = await new web3.eth.Contract(JSON.parse(abi))
        //     .deploy({data: evm.bytecode.object})
        //     .send({from: accounts[0], gas: '1000000'});

        lottery = await new web3.eth.Contract(abi)
            .deploy({data: evm.bytecode.object})
            .send({from: accounts[0], gas: '1000000'});

        console.log('THIRD STEP');  
    }
);


describe('Lottery', () => {

    it('deploys a contract', () => {
        //console.log(lottery);
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async () => {
        await lottery.methods.enter()
            .send(
                {
                    from: accounts[0], 
                    value: web3.utils.toWei('0.02', 'ether')
                }
            );

        const players = await lottery.methods.getPlayers().call(
            {
                from: accounts[0]
            }
        );

        assert.equal(players.length, 1);
        assert.equal(players[0], accounts[0])
    });

    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter()
            .send(
                {
                    from: accounts[0], 
                    value: web3.utils.toWei('0.02', 'ether')
                }
            );
        await lottery.methods.enter()
            .send(
                {
                    from: accounts[1], 
                    value: web3.utils.toWei('0.02', 'ether')
                }
            );
        await lottery.methods.enter()
            .send(
                {
                    from: accounts[2], 
                    value: web3.utils.toWei('0.02', 'ether')
                }
            );

        const players = await lottery.methods.getPlayers().call(
            {
                from: accounts[0]
            }
        );

        assert.equal(players.length, 3);
        assert.equal(players[0], accounts[0])
        assert.equal(players[1], accounts[1])
        assert.equal(players[2], accounts[2])
    });

    it('requires a minimum amount of ether', async () => {
        try 
        {
            await lottery.methods.enter()
                .send(
                    {
                        from: accounts[0], 
                        value: web3.utils.toWei('0.0', 'ether')
                    }
                );
            assert(false);
        }
        catch(err)
        {
            assert(err);
        }
    });

    it('only manager can call pickWinner', async () => {
        try 
        {
            await lottery.methods.pickWinner()
                .send(
                    {
                        from: accounts[1]
                    }
                );
            assert(false);
        }
        catch(err)
        {
            assert(err);
        }
    });

    it('sends money to the winner and resets the players list', async () => {
        await lottery.methods.enter()
            .send(
                {
                    from: accounts[0], 
                    value: web3.utils.toWei('1', 'ether')
                }
            );

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        console.log('initialBalance:', initialBalance);
         
        await lottery.methods.pickWinner()
                .send(
                    {
                        from: accounts[0]
                    }
                );

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        console.log('finalBalance:', finalBalance);

        console.log('diff:', finalBalance - initialBalance);

        const diff = finalBalance - initialBalance;

        console.log('cost paid in ether: ', web3.utils.fromWei(diff, 'ether'));

        assert(diff > web3.utils.toWei('0.8', 'ether')); //need to account for some amount of gas paid to call the functions

    });

});