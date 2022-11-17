// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenERC20 is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(BURNER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public {
        require(hasRole(BURNER_ROLE, msg.sender), "Caller is not a burner");
        _burn(from, amount);
    }
}

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/AccessControl.sol";

// contract TokenERC20 is ERC20, AccessControl {
//     bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

//     address public admin;

//     constructor(string memory name, string memory symbol) ERC20(name, symbol) {
//         // _grantRole(ADMIN_ROLE, msg.sender);
//         _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
//     }

//     function updateAdmin(address newAdmin) external onlyRole(ADMIN_ROLE) {
//         admin = newAdmin;
//     }

//     function mint(address to, uint256 amount) external onlyRole(ADMIN_ROLE) {
//         _mint(to, amount);
//     }

//     function burn(address account, uint256 amount)
//         external
//         onlyRole(ADMIN_ROLE)
//     {
//         _burn(account, amount);
//     }
// }
