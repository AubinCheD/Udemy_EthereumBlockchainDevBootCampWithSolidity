// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
// import "hardhat/console.sol";

contract Sender 
{
    receive() external payable {}

    function withdrawTransfer(address payable _to) public 
    {
        _to.transfer(10);
    }

    function withdrawSend(address payable _to) public 
    {
        bool sentSuccessful = _to.send(10);

        require(sentSuccessful, "Sending funds failed");
    }
}

contract ReceiverNoAction 
{

    function balance() public view returns(uint) 
    {
        return address(this).balance;
    }

    receive() external payable {}
}

contract ReceiverAction 
{
    uint public balanceReceived;

    function balance() public view returns(uint) 
    {
        return address(this).balance;
    }

    receive() external payable 
    {
        balanceReceived += msg.value;
    }
}



//Test on these 2

contract ContractOne {

    mapping(address => uint) public addressBalances;

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function deposit() public payable {
        addressBalances[msg.sender] += msg.value;
    }
}

contract ContractTwo {

    function deposit() public payable {}

    function depositOnContractOne(address _contractOne) public { 
        ContractOne one = ContractOne(_contractOne);
        one.deposit{value: 10, gas: 100000}(); 
    }
}

//Another test

contract ContractThree {

    mapping(address => uint) public addressBalances;

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function deposit() public payable {
        addressBalances[msg.sender] += msg.value;
    }
}

contract ContractFour {

    function deposit() public payable {}

    function depositOnContractOne(address _contractOne) public { 
        bytes memory payload = abi.encodeWithSignature("deposit()");
        (bool success, ) = _contractOne.call{value: 10, gas: 100000}(payload);
        require(success);
    }
}