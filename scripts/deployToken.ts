import { ethers } from "hardhat";

const OWNER_ADDRESS = process.env.OWNER_ADDRESS!;

async function main() {
  console.log("Deploying TokenERC20 contract with the account:", OWNER_ADDRESS);

  const Token = await ethers.getContractFactory("TokenERC20");
  const token = await Token.deploy("TokenERC20", "TKN");

  await token.deployed();
  console.log("Token contract deployed to:", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
