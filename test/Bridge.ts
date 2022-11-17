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

    // const roleAdmin = ethers.utils.keccak256(
    //   ethers.utils.toUtf8Bytes("ADMIN_ROLE")
    // );
    const roleMinter = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("MINTER_ROLE")
    );
    const roleBurner = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("BURNER_ROLE")
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
      roleMinter,
      roleBurner,
    };
  }

  describe("swap", function () {
    it("Should swap and redeem correctly", async function () {
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
        roleBurner,
        roleMinter,
      } = await loadFixture(deploy);

      console.log(bridgeETH.address);
      console.log(owner.address);

      expect(await tokenETH.balanceOf(acc1.address)).to.equal(0);
      await tokenETH.connect(owner).mint(acc1.address, 1000);
      expect(await tokenETH.balanceOf(acc1.address)).to.equal(1000);

      await tokenETH.connect(owner).grantRole(roleBurner, bridgeETH.address);

      expect(
        await bridgeETH
          .connect(acc1)
          .swap(acc2.address, 500, 0, chainID_BSC, symbol)
      )
        .to.emit(bridgeETH, "SwapInitialized")
        .withArgs(acc1.address, acc2.address, 500, 0, chainID_BSC, symbol);

      expect(await tokenETH.balanceOf(acc1.address)).to.be.equal(500);

      let messageHash = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint256", "uint256", "string"],
        [acc1.address, acc2.address, 500, 0, chainID_ETH, symbol]
      );

      const messageArray = ethers.utils.arrayify(messageHash);
      const rawSignature = await validator.signMessage(messageArray);

      await tokenBSC.connect(owner).grantRole(roleMinter, bridgeBSC.address);

      expect(await tokenBSC.balanceOf(acc2.address)).to.equal(0);

      expect(
        await bridgeBSC
          .connect(acc1)
          .redeem(
            acc1.address,
            acc2.address,
            500,
            0,
            chainID_ETH,
            symbol,
            rawSignature
          )
      )
        .to.emit(bridgeETH, "RedeemInitialized")
        .withArgs(acc1.address, acc2.address, 500, 0, chainID_ETH, symbol);

      expect(await tokenBSC.balanceOf(acc2.address)).to.equal(500);
    });

    it("Should revert swap and redeem correctly", async function () {
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
        roleBurner,
        roleMinter,
      } = await loadFixture(deploy);

      // console.log(bridgeETH.address);
      // console.log(owner.address);

      expect(await tokenETH.balanceOf(acc1.address)).to.equal(0);

      await tokenETH.connect(owner).mint(acc1.address, 1000);

      await tokenETH.connect(owner).grantRole(roleBurner, bridgeETH.address);

      await expect(
        bridgeETH
          .connect(acc1)
          .swap(acc2.address, 500, 0, chainID_BSC, "falsSymbol")
      ).to.be.revertedWith("non supported erc20 token");

      await expect(
        bridgeETH.connect(acc1).swap(acc2.address, 500, 0, 6666666666, symbol)
      ).to.be.revertedWith("non supported chain");

      await bridgeETH
        .connect(acc1)
        .swap(acc2.address, 500, 0, chainID_BSC, symbol);

      let messageHashFalse = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint256", "uint256", "string"],
        [acc1.address, acc2.address, 500, 0, chainID_ETH, symbol]
      );

      const messageArrayFalse = ethers.utils.arrayify(messageHashFalse);
      const rawSignatureFalse = await validator.signMessage(messageArrayFalse);

      expect(
        await bridgeBSC
          .connect(acc1)
          .redeem(
            acc1.address,
            acc2.address,
            500,
            0,
            chainID_ETH,
            symbol,
            rawSignatureFalse
          )
      ).be.be.revertedWith("invalid signature");

      let messageHash = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint256", "uint256", "string"],
        [acc1.address, acc2.address, 500, 0, chainID_ETH, symbol]
      );

      await tokenBSC.connect(owner).grantRole(roleMinter, bridgeBSC.address);

      const messageArray = ethers.utils.arrayify(messageHash);
      const rawSignature = await validator.signMessage(messageArray);

      await tokenBSC.connect(owner).grantRole(roleMinter, bridgeBSC.address);

      expect(
        await bridgeBSC
          .connect(acc1)
          .redeem(
            acc1.address,
            acc2.address,
            500,
            0,
            chainID_ETH,
            "false_symbol",
            rawSignatureFalse
          )
      ).be.be.revertedWith("non supported erc20 token");

      expect(
        await bridgeBSC
          .connect(acc1)
          .redeem(
            acc1.address,
            acc2.address,
            500,
            0,
            11,
            symbol,
            rawSignatureFalse
          )
      ).be.be.revertedWith("non supported chain");

      expect(await tokenBSC.balanceOf(acc2.address)).to.equal(0);

      await bridgeBSC
        .connect(acc1)
        .redeem(
          acc1.address,
          acc2.address,
          500,
          0,
          chainID_ETH,
          symbol,
          rawSignature
        );

      expect(
        await bridgeBSC
          .connect(acc1)
          .redeem(
            acc1.address,
            acc2.address,
            500,
            0,
            chainID_ETH,
            symbol,
            rawSignatureFalse
          )
      ).be.be.revertedWith("no reentrancy");
    });
  });
});
