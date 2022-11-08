import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Bridge", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    const [owner, validator, acc1, acc2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("TokenERC20");
    const tokenETH = await Token.deploy();
    const tokenBSC = await Token.deploy();

    const chainID_ETH = 4;
    const chainID_BSC = 56;
    const symbol = "TKN";

    const Bridge = await ethers.getContractFactory("Bridge");
    const bridgeETH = await Bridge.deploy(
      validator.address,
      tokenETH.address,
      chainID_BSC
    );

    const bridgeBSC = await Bridge.deploy(
      validator.address,
      tokenBSC.address,
      chainID_ETH
    );

    return {
      owner,
      validator,
      acc1,
      acc2,
      tokenETH,
      tokenBSC,
      chainID_ETH,
      chainID_BSC,
      bridgeETH,
      bridgeBSC,
      symbol,
    };
  }

  describe("swap", function () {
    it("Should revert swapping correctly", async function () {
      const {
        owner,
        validator,
        acc1,
        acc2,
        tokenETH,
        tokenBSC,
        chainID_ETH,
        chainID_BSC,
        bridgeETH,
        bridgeBSC,
        symbol,
      } = await loadFixture(deploy);

      await expect(
        tokenETH.connect(acc1).mint(acc1.address, 100)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      tokenETH.mint(acc1.address, 100);

      await expect(
        tokenETH.connect(acc1).burn(acc1.address, 100)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      const tx1 = bridgeETH
        .connect(acc1)
        .swap(acc1.address, 100, 0, chainID_BSC, symbol);

      await expect(tx1).to.be.revertedWith("This token is not allowed");
    });

    it("Should set the right owner", async function () {});

    it("Should receive and store the funds to lock", async function () {});

    it("Should fail if the unlockTime is not in the future", async function () {});
  });
});
