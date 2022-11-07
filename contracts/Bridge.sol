// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IBridge {
    function deposit(
        uint256 chainId,
        address depositToken,
        uint256 amount,
        address receiver
    ) external;

    function withdraw(
        address token,
        address receiver,
        uint256 amount,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function validator() external view returns (address);

    // only called by an admin
    function setChain(uint256 chainId) external;
}

contract Bridge is Ownable {
    using ECDSA for bytes32;

    address private validator;

    mapping(uint256 => bool) public chains;
    mapping(string => bool) public tokens;
    mapping(string => address) public tokenAddresses;
    mapping(bytes => bool) public signatures;

    event SwapInitialized(
        address from,
        address to,
        uint256 amount,
        uint256 nonce,
        uint256 chainId,
        string _symbol
    );

    constructor(address _validator) {
        validator = _validator;
    }
}
