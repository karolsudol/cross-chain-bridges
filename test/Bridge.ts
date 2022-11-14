import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Bridge", function () {
  async function deploy() {
    const chainID_ETH = 4;
    const chainID_BSC = 56;
    const symbol = "TKN";

    const [owner, validator, acc1, acc2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("TokenERC20");
    const tokenETH = await Token.deploy("tokenETH", symbol);
    const tokenBSC = await Token.deploy("tokenBSC", symbol);

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

    await tokenETH.grantRole(tokenETH.ADMIN_ROLE(), bridgeETH.address);
    await tokenBSC.grantRole(tokenBSC.ADMIN_ROLE(), tokenBSC.address);

    await tokenETH.updateAdmin(bridgeETH.address);
    await tokenBSC.updateAdmin(bridgeBSC.address);

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
    it.only("Should swap and redeem correctly", async function () {
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

      console.log(bridgeETH.address);
      console.log(owner.address);

      expect(await tokenETH.balanceOf(acc1.address)).to.equal(0);
      tokenETH.mint(acc1.address, 1000);
      expect(await tokenETH.balanceOf(acc1.address)).to.equal(1000);

      // tokenETH.connect(acc1).approve(bridgeETH.address, 1000);

      expect(
        await bridgeETH
          .connect(acc1)
          .swap(acc2.address, 500, 0, chainID_BSC, symbol)
      )
        .to.emit(bridgeETH, "SwapInitialized")
        .withArgs(acc1.address, acc2.address, 500, 0, chainID_BSC, symbol);

      expect(await tokenETH.balanceOf(acc1.address)).to.be.equal(500);
    });

    it("Should revenrt swap and redeem correctly", async function () {});
  });
});
