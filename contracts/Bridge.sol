// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./TokenERC20.sol";

// import "hardhat/console.sol";

contract Bridge is Ownable, ReentrancyGuard {
    /* ======================= Events ======================= */
    event SwapInitialized(
        address from,
        address to,
        uint256 amount,
        uint256 nonce,
        uint256 chainId,
        string symbol
    );

    event RedeemInitialized(
        address from,
        address to,
        uint256 amount,
        uint256 nonce,
        uint256 chainId,
        string symbol
    );

    /* ======================= STATE VARS ======================= */
    using ECDSA for bytes32;

    address immutable validator;
    uint256 immutable chainID;
    address immutable token;

    mapping(address => bytes) public signatures;

    /* ======================= CONSTRUCTOR ======================= */
    constructor(
        address _validator,
        address _token,
        uint256 _chainID
    ) {
        validator = _validator;
        chainID = _chainID;
        token = _token;
    }

    /* ======================= EXTERNAL FUNCTIONS ======================= */

    function swap(
        address _to,
        uint256 _amount,
        uint256 _nonce,
        uint256 _chainID,
        string memory _tokenSymbol
    ) external {
        // string memory tokenSymbol_ = tokenSymbol;
        require(
            keccak256(abi.encodePacked(TokenERC20(token).symbol())) ==
                keccak256(abi.encodePacked(_tokenSymbol)),
            "non supported erc20 token"
        );
        require(chainID == _chainID, "non supported chain");

        TokenERC20(token).burn(msg.sender, _amount);

        emit SwapInitialized(
            msg.sender,
            _to,
            _amount,
            _nonce,
            _chainID,
            _tokenSymbol
        );
    }

    function redeem(
        address from,
        address to,
        uint256 amount,
        uint256 nonce,
        uint256 _chainID,
        string memory _tokenSymbol,
        bytes calldata _signature
    ) external {
        bytes memory signature = signatures[msg.sender];

        require(
            keccak256(abi.encodePacked(TokenERC20(token).symbol())) ==
                keccak256(abi.encodePacked(_tokenSymbol)),
            "non supported erc20 token"
        );
        require(chainID == _chainID, "non supported chain");
        require(
            keccak256(abi.encodePacked(signature)) !=
                keccak256(abi.encodePacked(_signature)),
            "no re-entrance"
        );

        bytes32 message = keccak256(
            abi.encodePacked(from, to, amount, nonce, _chainID, _tokenSymbol)
        );
        require(_verify(message, _signature, validator), "invalid signature");
        signatures[msg.sender] = _signature;

        TokenERC20(token).mint(to, amount);

        emit RedeemInitialized(
            msg.sender,
            to,
            amount,
            nonce,
            _chainID,
            _tokenSymbol
        );
    }

    function _verify(
        bytes32 data,
        bytes calldata signature,
        address account
    ) internal pure returns (bool) {
        return data.toEthSignedMessageHash().recover(signature) == account;
    }
}
