// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IStrategy {
    /// Execute a single strategy step. Returns profit/loss in wei.
    function execute() external returns (int256);
}
