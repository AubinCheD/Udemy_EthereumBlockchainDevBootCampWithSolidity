// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;
// import "hardhat/console.sol";

contract SmartWallet
{   
    address payable owner;

    mapping (address => uint) allowance;
    mapping (address => bool) isAllowedToSend;

    mapping (address => bool) guardians;

    mapping(address => mapping(address => bool)) nextOwnerGuardianVoteMapping;
    
    address payable nextOwner;
    uint guardiansOwnerChangeCount;
    uint public constant confirmationFromGuardiansForOwnerChange = 3;

    constructor()
    {
        owner = payable(msg.sender);
    }


    modifier ownerRestricted()
    {
        require(msg.sender == owner, 'You are not the owner of this contract');
        _;
    }

    modifier guardianRestricted()
    {
        require(guardians[msg.sender], 'You are not the owner of this contract');
        _;
    }

    receive() external payable
    {

    }

    function setAllowance(address user, uint amount) public ownerRestricted
    {
        allowance[user] = amount;
        if(amount > 0){
            isAllowedToSend[user] = true;
        } else{
            isAllowedToSend[user] = false;
        }
    }

    function setGuardian(address guardian, bool isGuardian) public ownerRestricted
    {
        guardians[guardian] = isGuardian;
    }

    //only owner version
    function owner_transfer_send(address payable to, uint amount) public ownerRestricted
    {
        require(owner.balance >= amount, 'You do not have enough money to spend this amount');
        to.transfer(amount);
    }

    function owner_transfer_call(address payable to, uint amount, bytes memory payload) public ownerRestricted returns (bytes memory)
    {
        require(owner.balance >= amount, 'You do not have enough money to spend this amount');
        (bool success, bytes memory returnData) = to.call{value: amount}(payload);
        require(success, "transaction failed");
        return returnData;
    }

    //everybody version (including owner)
    function transfer_call(address payable to, uint amount, bytes memory payload) public returns (bytes memory)
    {
        if(msg.sender != owner)
        {
            require(isAllowedToSend[msg.sender], 'You are not allowed to spend money from this contract');
            require(allowance[msg.sender]>= amount, 'Your allowance is too small to spend this amount');

            allowance[msg.sender] -= amount;
        }

        (bool success, bytes memory returnData) = to.call{value: amount}(payload);
        require(success, "transaction failed");
        return returnData;
    }


    //change owner
    function proposeNewOwner(address payable newOwner) public guardianRestricted
    {
        require(!nextOwnerGuardianVoteMapping[newOwner][msg.sender], 'You already voted');

        if(newOwner != nextOwner)
        {
            newtOwner = newOwner;
            guardiansOwnerChangeCount = 0;
        }
        
        guardiansOwnerChangeCount++;
        nextOwnerGuardianVoteMapping[newOwner][msg.sender] = true;

        if(guardiansOwnerChangeCount >= confirmationFromGuardiansForOwnerChange)
        {
            owner = nextOwner;
            nextOwner = payable(adddress(0));
        }
    }

}