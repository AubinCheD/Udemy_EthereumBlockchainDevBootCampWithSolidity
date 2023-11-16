// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
// import "hardhat/console.sol";

contract MappingStructExample
{   
    struct Transaction 
    {
        uint amount;
        uint timestamp;
    }

    struct Balance 
    {
        uint totalBalance;
        uint numDeposits;
        mapping (uint => Transaction) deposits;
        uint numWithdrawals;
        mapping(uint => Transaction) withdrawals;
    }

    mapping(address => Balance) balances;

    function depositMoney() public payable 
    {
        assert(msg.value == uint8(msg.value));

        balances[msg.sender].totalBalance += msg.value;

        Transaction memory deposit = Transaction(msg.value, block.timestamp);
        balances[msg.sender].deposits[balances[msg.sender].numDeposits] = deposit;
        
        balances[msg.sender].numDeposits ++;
    }

    function withdrawMoney (address payable to, uint amount) public 
    {
        require(balances[msg.sender].totalBalance >= amount, "Not enough funds available to withdraw this amount");

        balances[msg.sender].totalBalance -= amount;

        Transaction memory withdrawal = Transaction(amount, block.timestamp);
        balances[msg.sender].withdrawals[balances[msg.sender].numWithdrawals] = withdrawal;
        balances[msg.sender].numWithdrawals ++;

        to.transfer(amount);
    }
}