// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OneiroVault {
    address public owner;

    event Deposited(address indexed from, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);
    event OwnerTransferred(address indexed newOwner);

    modifier onlyOwner() { require(msg.sender == owner, "not owner"); _; }

    constructor(address _owner) { owner = _owner; }

    receive() external payable { emit Deposited(msg.sender, msg.value); }

    function deposit() external payable {
        require(msg.value > 0, "zero");
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 amount, address payable to) external onlyOwner {
        require(address(this).balance >= amount, "insufficient");
        to.transfer(amount);
        emit Withdrawn(to, amount);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "zero");
        owner = newOwner;
        emit OwnerTransferred(newOwner);
    }

    function balance() external view returns (uint256) { return address(this).balance; }
}
