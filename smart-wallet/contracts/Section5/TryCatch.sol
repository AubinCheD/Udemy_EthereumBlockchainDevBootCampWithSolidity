// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
// import "hardhat/console.sol";

contract WillThrow 
{
    function aFunction1() public 
    {
        require(false, "Error message");
    }

    error ThisIsACustomError(string, string);

    function aFunction2() public pure {
        revert ThisIsACustomError("Text 1", "text message 2");
    }
}

contract ErrorHandling 
{
    event ErrorLogging(string reason);

    function catchError1() public 
    {
        WillThrow will = new WillThrow();
        try will.aFunction1() 
        {
            //here we could do something if it works
        }  
        catch Error(string memory reason) 
        {
            emit ErrorLogging(reason);
        }
    }

    function catchError2() public 
    {
        WillThrow will = new WillThrow();
        try will.aFunction2() 
        {
            //here we could do something if it works
        }  
        catch Error(string memory reason) 
        {
            emit ErrorLogging(reason);
        }
    }
}