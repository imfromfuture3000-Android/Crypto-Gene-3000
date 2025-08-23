// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Istrategy.sol";
import "./OneiroVault.sol";

contract SwarmController {
    OneiroVault public immutable vault;
    address public owner;
    mapping(address => bool) public bot;     // authorized executors
    address[] public strategies;

    event BotSet(address indexed a, bool allowed);
    event StrategySet(address indexed s, bool added);
    event Executed(address indexed by, address indexed strategy, int256 pnl);

    modifier onlyOwner(){ require(msg.sender == owner, "not owner"); _; }
    modifier onlyBot(){ require(bot[msg.sender], "not bot"); _; }

    constructor(OneiroVault _vault, address _owner){
        vault = _vault;
        owner = _owner;
        bot[_owner] = true;
    }

    function setBot(address a, bool allowed) external onlyOwner {
        bot[a] = allowed; emit BotSet(a, allowed);
    }

    function addStrategy(address s) external onlyOwner {
        strategies.push(s); emit StrategySet(s, true);
    }

    function removeStrategy(uint idx) external onlyOwner {
        require(idx < strategies.length, "idx");
        strategies[idx] = strategies[strategies.length - 1];
        strategies.pop(); emit StrategySet(address(0), false);
    }

    function runAll() external onlyBot {
        for (uint i = 0; i < strategies.length; i++){
            int256 pnl = IStrategy(strategies[i]).execute();
            emit Executed(msg.sender, strategies[i], pnl);
        }
    }

    function strategiesCount() external view returns (uint256) { return strategies.length; }
}
