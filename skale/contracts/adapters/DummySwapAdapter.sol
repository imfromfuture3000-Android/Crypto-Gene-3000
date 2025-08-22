// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DummySwapAdapter {
    function getQuote(uint256 amountIn) external pure returns (uint256) {
        // 1:1 dummy quote
        return amountIn;
    }
}
