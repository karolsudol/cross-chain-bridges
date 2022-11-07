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

contract Bridge is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;

    address private validator;

    uint256 public chainID;
    address token;
    string tokenSymbol;
    mapping(string => bool) public tokenSymbols;
    mapping(bytes => bool) public signatures;

    event SwapInitialized(
        address from,
        address to,
        uint256 amount,
        uint256 nonce,
        uint256 chainId,
        string symbol
    );

    constructor(
        address _validator,
        address _token,
        uint256 _chainID
    ) {
        validator = _validator;
        chainID = _chainID;
        token = _token;
        tokenSymbol = TokenERC20(_token).symbol();
        tokenSymbols[tokenSymbol] = true;
    }

    function swap(
        address _to,
        uint256 _amount,
        uint256 _nonce,
        uint256 _chainID,
        string memory _tokenSymbol
    ) external {
        require(tokenSymbols[tokenSymbol] == true, "non supported erc20 token");
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
        string memory _symbol,
        bytes calldata signature
    ) external {
        require(tokenSymbols[tokenSymbol] == true, "non supported erc20 token");
        require(chainID == _chainID, "non supported chain");
        require(!signatures[signature], "no reentrancy");

        bytes32 message = keccak256(
            abi.encodePacked(from, to, amount, nonce, _chainID, _symbol)
        );
        require(_verify(message, signature, validator), "invalid signature");
        signatures[signature] = true;

        TokenERC20(token).mint(to, amount);
    }

    function _verify(
        bytes32 data,
        bytes calldata signature,
        address account
    ) internal pure returns (bool) {
        return data.toEthSignedMessageHash().recover(signature) == account;
    }
}
