import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from './web3';
import lottery from './lottery.js';
import inbox from './inbox.js';
var util = require('util');    
 
class App extends React.Component {

  state =
  {
    manager: '',
    players: [],
    balance: '',
    winner: '',
    etherToBet: '',
    message: ''
  };

  async componentDidMount() 
  {
    const manager = await lottery.methods.manager().call(); //no need to specify the 'from' property because it will use metamask's first account by default here
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    
    console.log(lottery);

    //console.log(JSON.parse(manager));
    //console.log(manager);
    this.setState({manager, players, balance}); //this.setState({manager: manager})

    
  }
  
  //with the following syntax, 'this' will automatically be set to the component inside the function, otherwise use this.myFunction.bind(this)
  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({message : 'Waiting on transaction success...'});

    console.log(this.state.etherToBet);
    console.log(util.inspect(this.state.etherToBet,false,null,true));
    console.log(util.inspect(web3.utils.toWei(this.state.etherToBet, 'ether'),false,null,true));

    //Uncaught (in promise) TransactionRevertedWithoutReasonError: Transaction has been reverted by the EVM:
    //   {
    //     "blockHash":"0x0322c642348437672146657f814dacaea22ad9816d0788a1b7a026d2f0caf798",
    //     "blockNumber":"4514012",
    //     "cumulativeGasUsed":"15957870",
    //     "effectiveGasPrice":"99999999",
    //     "from":"0xbe76cccd9db8d22669ed0d18b6a4ff994cded6dd",
    //     "gasUsed":"21046",
    //     "logs":[
          
    //     ],
    //     "logsBloom":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    //     "status":"0",
    //     "to":"0x87fd1aa82495810ad368b77103a498b1d63fa071",
    //     "transactionHash":"0x60a8c044051309268203d1f3a992f1cc0cd599bcb73a81fe900aa9c975218311",
    //     "transactionIndex":"75",
    //     "type":"2"
    //  }
    //10000000
    //3000000

    await lottery.methods.enter()
            .send(
              { 
                from: accounts[0], 
                value: web3.utils.toWei(this.state.etherToBet, 'ether'),
                // gas: 10000000, //required absolutely
                // gasPrice: 2500000000 //0.025 ether still failing
              });
    
    const balance = await web3.eth.getBalance(lottery.options.address);
    const players = await lottery.methods.getPlayers().call();

    this.setState({players: players, balance : balance, message : 'You have been entered'});
  };


  onPickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({message : 'Waiting on transaction success...'});

    var winner = await lottery.methods.pickWinner()
            .send(
              { 
                from: accounts[0],
                // gas: 10000000, //required absolutely
                // gasPrice: 2500000000 //0.025 ether still failing
              });

    console.log("winner", winner);

    const balance = await web3.eth.getBalance(lottery.options.address);
    const players = await lottery.methods.getPlayers().call();
    
    this.setState({players: players, balance : balance, message : 'Transaction successfull'});
  };

  render() {

    // console.log("web3.version: ", web3);
    // console.log("web3.Accounts");
    // web3.eth.getAccounts().then(console.log);

    //console.log(JSON.parse(lottery));

    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>There are currently {this.state.players.length} players competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether !</p> 

        <hr/>

        <form onSubmit={this.onSubmit}>
          <h3>Want to try your luck ? </h3>
          <div>
            <p>Amount of ether to enter (min 0.01)</p>
            <input value={this.state.etherToBet} onChange={event => this.setState({etherToBet: event.target.value})}></input>
          </div>

          <button> Enter </button>
        </form>

        <h3>Ready to pick a winner ? </h3>
        <button onClick={this.onPickWinner}> Pick Winner </button>

        
        <h3>{this.state.winner} has won !</h3>

        

        <hr/>

        <h1>{this.state.message}</h1>

      </div>
    );
  }
}
export default App;