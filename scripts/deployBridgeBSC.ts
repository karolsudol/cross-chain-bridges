import { ethers } from "hardhat";

const OWNER_ADDRESS = process.env.OWNER_ADDRESS!;
const VALIDATOR_ADDRESS: string = process.env.VALIDATOR_ADDRESS!;
const TOKEN_BSC_ADDRESS: string = process.env.TOKEN_BSC_ADDRESS!;

const chainID_ETH = 5;

async function main() {
  console.log("Deploying bridge BSC contract with the account:", OWNER_ADDRESS);

  const Bridge = await ethers.getContractFactory("Bridge");
  const bridge = await Bridge.deploy(
    VALIDATOR_ADDRESS,
    TOKEN_BSC_ADDRESS,
    chainID_ETH
  );

  await bridge.deployed();
  console.log("bridge BSC contract deployed to:", bridge.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
