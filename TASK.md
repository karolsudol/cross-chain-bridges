# Cross-chain bridges

1. Write a bridge contract for ERC-20 token transfers between Ethereum and Binance Smart chain. Implement the following functions:

    - Swap(): transfers tokens from sender to the contract and emits event ‘swapInitialized’. 
    - Redeem(): takes hashed message and a signature, calls ecrecover to recover the signer and verifies if the recovered address is the validator address; if yes, transfers tokens to the receiver.
2. Write tests.
3. Write deploy script.
4. Deploy on testnet.
5. Write tasks for swap and redeem.
6. Verify the contract.

### Tips

- For backend to hash the message, use [Solidity Hashing Algorithms](https://docs.ethers.io/v5/api/utils/hashing/) from ethers library.  
- 2 approaches to verify a message: using raw signature **or** *r, v, s* which are all parts of raw signature.  
- If using raw signature, on-chain verification is convenient with OpenZeppelin [ECDSA](https://docs.openzeppelin.com/contracts/2.x/utilities) library.  
- If using enrecover with r, v, s have a look [here](https://ethereum.stackexchange.com/questions/78815/ethers-js-recover-public-key-from-contract-deployment-via-v-r-s-values) and [here](https://solidity-by-example.org/signature).  
- [Reentrancy](https://solidity-by-example.org/hacks/re-entrancy) and [replay](https://solidity-by-example.org/hacks/signature-replay) attacks.
