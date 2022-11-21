import { ethers } from "hardhat";

const OWNER_ADDRESS = process.env.OWNER_ADDRESS!;
const VALIDATOR_ADDRESS: string = process.env.VALIDATOR_ADDRESS!;
const TOKEN_ETH_ADDRESS: string = process.env.TOKEN_ETH_ADDRESS!;

const chainID_BSC = 97;

async function main() {
  console.log("Deploying ETH bridge contract with the account:", OWNER_ADDRESS);

  const Bridge = await ethers.getContractFactory("Bridge");
  const bridge = await Bridge.deploy(
    VALIDATOR_ADDRESS,
    TOKEN_ETH_ADDRESS,
    chainID_BSC
  );

  await bridge.deployed();
  console.log("bridge ETH contract deployed to:", bridge.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
