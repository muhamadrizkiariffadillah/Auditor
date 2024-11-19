// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VulnerableKingOfEther {
    address public king;
    uint256 public balance;

    function claimThrone() external payable {
        require(msg.value > balance, "Need to pay more to become the king");

        (bool sent,) = king.call{value: balance}("");
        require(sent, "Failed to send Ether");  // if the current king's fallback function reverts, it will prevent others from becoming the new king, causing a Denial of Service.

        balance = msg.value;
        king = msg.sender;
    }
}