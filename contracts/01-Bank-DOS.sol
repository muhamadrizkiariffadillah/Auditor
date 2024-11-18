// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

contract Bank{
    
    address payable currentBiggestInvestor;
    uint  highestDeposit;

    // Here's the function that can be attack by DOS.
    function tryToBeBiggestInvestor()public payable{
        require(msg.value > highestDeposit,"your money not enough to be the biggest investor");
        require(currentBiggestInvestor.send(highestDeposit),"the money can't be sent");
        currentBiggestInvestor = payable(msg.sender);
        highestDeposit = msg.value;
    }

    function getCurrentBigInvestor()external view returns(address){
        return currentBiggestInvestor;
    }

    function getHighestDeposit()external view returns(uint256){
        return highestDeposit;
    }

}