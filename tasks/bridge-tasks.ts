import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
import { ethers } from "ethers";
import { Address } from "cluster";

dotenv.config();

const bridgeAddress: string = "0xBE56c7cc235E25C9873e55Df8fc1A2434d74ef2B";
const tokenAddress: string = "0xc1c13750cFC5f3C1E5A894543FC56e2aB8cbDd4e";
const ownerAddress: string = "0x1f190F523deBD185183d8Afe76e4587a08bb84e7";

const roleMinter = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("MINTER_ROLE")
);
const roleBurner = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("BURNER_ROLE")
);

task(
  "token-grant-bridge-MINTER_ROLE",
  "erc20 token grants MINTER_ROLE to the bridge"
).setAction(async (hre) => {
  const erc20 = await hre.ethers.getContractAt("TokenERC20", tokenAddress);
  let result = await erc20.grantRole(roleMinter, bridgeAddress);
  console.log(result);
});

task(
  "token-grant-bridge-BURNER_ROLE",
  "erc20 token grants BURNER_ROLE to the bridge"
).setAction(async (hre) => {
  const erc20 = await hre.ethers.getContractAt("TokenERC20", tokenAddress);
  let result = await erc20.grantRole(roleBurner, bridgeAddress);
  console.log(result);
});

task("swap", "Initializes swap from one chain to another")
  .addParam("to", "Recepient")
  .addParam("amount", "Amount to swap")
  .addParam("nonce", "Unique nonce of a transaction")
  .addParam("chainid", "Chain ID to transfer tokens to")
  .addParam("symbol", "Token symbol to transfer")
  .setAction(
    async (
      taskArgs: {
        to: any;
        amount: any;
        chainid: any;
        nonce: any;
        symbol: any;
      },
      hre
    ) => {
      let to = taskArgs.to;
      let amount = taskArgs.amount;
      let chainid = taskArgs.chainid;
      let nonce = taskArgs.nonce;
      let symbol = taskArgs.symbol;

      const bridge = await hre.ethers.getContractAt("Bridge", bridgeAddress);
      const result = await bridge.swap(to, amount, nonce, chainid, symbol);
      console.log(result);
    }
  );

task("redeem", "Redeems swapped tokens from one chain to another")
  .addParam("from", "Sender")
  .addParam("to", "Recepient")
  .addParam("amount", "Amount to swap")
  .addParam("nonce", "Unique nonce of a transaction")
  .addParam("chainid", "Chain ID to transfer tokens to")
  .addParam("symbol", "Token symbol to transfer")
  .addParam("sign", "Validator signature")
  .setAction(
    async (
      taskArgs: {
        from: any;
        to: any;
        amount: any;
        chainid: any;
        nonce: any;
        symbol: any;
        sign: any;
        address: any;
      },
      hre
    ) => {
      let from = taskArgs.from;
      let to = taskArgs.to;
      let amount = taskArgs.amount;
      let chainid = taskArgs.chainid;
      let nonce = taskArgs.nonce;
      let symbol = taskArgs.symbol;
      let sign = taskArgs.sign;

      const bridge = await hre.ethers.getContractAt("Bridge", bridgeAddress);
      const result = await bridge.redeem(
        from,
        to,
        amount,
        nonce,
        chainid,
        symbol,
        sign
      );
      console.log(result);
    }
  );
