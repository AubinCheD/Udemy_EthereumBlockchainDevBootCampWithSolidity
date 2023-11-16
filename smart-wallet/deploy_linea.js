const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
var util = require('util');    
//updated web3 and hdwallet-provider imports added for convenience
//const { interface, bytecode } = require('./compile') //old
const { abi, evm } = require('./compile') //new

const provider = new HDWalletProvider(
    'permit tool oak title verb caught sign dumb position normal soap only', //account mnemonic
    'https://sepolia.infura.io/v3/053019b5c9a2433dbcaa5ba44239ba51' //network address
);

const web3 = new Web3(provider);

// deploy code will go here
const deploy = async () => 
{
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);

    //deploy lottery
    // lottery = await new web3.eth.Contract(JSON.parse(abi))
    //     .deploy({data: evm.bytecode.object})
    //     .send({from: accounts[0], gas: '1000000'});

    lottery = await new web3.eth.Contract(abi)
        .deploy({data: evm.bytecode.object})
        .send({from: accounts[0], gas: '1000000'});

    //console.log('Lottery:', lottery);
    console.log('Contract deployed to', lottery.options.address);
    //console.log('abi', abi);

    console.log('abi full', util.inspect(abi,false,null,true));


    provider.engine.stop(); //to prevent deployment from hanging in the terminal, see https://github.com/trufflesuite/truffle/tree/master/packages/hdwallet-provider#general-usage

    //how to undeploy ?
};

deploy();