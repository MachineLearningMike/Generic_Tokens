
// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";
import "hardhat/console.sol";

contract Fixed_Token is ERC20PresetFixedSupply {
    constructor(
        string memory token_name,
        string memory token_symbol,
        uint256 initialSupply,
        address owner
    ) ERC20PresetFixedSupply(token_name, token_symbol, initialSupply, owner) {
    }
}