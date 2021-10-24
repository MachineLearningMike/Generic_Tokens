// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;

import './BlockTimestamp.sol';

import 'hardhat/console.sol';

abstract contract PeripheryValidation is BlockTimestamp {
    modifier checkDeadline(uint256 deadline) {
        console.log("checkDeadline: require blockTimeStamp <= deadline. %d <= %d", _blockTimestamp(), deadline);
        require(_blockTimestamp() <= deadline, 'Transaction too old');
        _;
    }
}
