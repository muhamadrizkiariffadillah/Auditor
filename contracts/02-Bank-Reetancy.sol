// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract BankReetancy{
    
    mapping (address => uint256) userBalance;

    function deposit() public payable{
        userBalance[msg.sender] += msg.value;
    }

    function withdrawAll() public{
        uint balance = userBalance[msg.sender];
        
        require(balance > 0, "not enough");

        // sent variable is not used to get success attack.
        (bool sent, ) = msg.sender.call{value: balance,gas: 100000}("");
        

        userBalance[msg.sender] = 0;
    }

    function getMyBalance() public view returns(uint256){
        return userBalance[msg.sender];
    }

    function getContractBalance() public view returns(uint256){
        return address(this).balance;
    }
}