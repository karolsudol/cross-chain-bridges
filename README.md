# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run --network goerli scripts/deployToken.ts

npx hardhat verify --network goerli 0xc1c13750cFC5f3C1E5A894543FC56e2aB8cbDd4e "TokenERC20" "TKN"
https://goerli.etherscan.io/address/0xc1c13750cFC5f3C1E5A894543FC56e2aB8cbDd4e#code

npx hardhat run --network bsctestnet scripts/deployToken.ts

npx hardhat verify --network bsctestnet 0xc1c13750cFC5f3C1E5A894543FC56e2aB8cbDd4e "TokenERC20" "TKN"
https://testnet.bscscan.com/address/0xc1c13750cFC5f3C1E5A894543FC56e2aB8cbDd4e#code

npx hardhat run --network bsctestnet scripts/deployBridgeBSC.ts


npx hardhat verify --network bsctestnet 0x04792d2f0533Aa944A611190e01Da756806550b2 "0x1f190F523deBD185183d8Afe76e4587a08bb84e7" "0xc1c13750cFC5f3C1E5A894543FC56e2aB8cbDd4e" 5

Successfully verified contract Bridge on Etherscan.
https://testnet.bscscan.com/address/0x04792d2f0533Aa944A611190e01Da756806550b2#code

npx hardhat run --network goerli scripts/deployBridgeETH.ts

npx hardhat verify --network goerli 0x04792d2f0533Aa944A611190e01Da756806550b2 "0x1f190F523deBD185183d8Afe76e4587a08bb84e7" "0xc1c13750cFC5f3C1E5A894543FC56e2aB8cbDd4e" 97

Successfully verified contract Bridge on Etherscan.
https://goerli.etherscan.io/address/0x04792d2f0533Aa944A611190e01Da756806550b2#code


```
