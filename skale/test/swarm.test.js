const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Oneirobot Swarm", function () {
  it("deploys vault + controller", async function () {
    const [owner] = await ethers.getSigners();
    const V = await ethers.getContractFactory("OneiroVault");
    const vault = await V.deploy(owner.address);
    await vault.waitForDeployment();

    const C = await ethers.getContractFactory("SwarmController");
    const ctl = await C.deploy(await vault.getAddress(), owner.address);
    await ctl.waitForDeployment();

    expect(await ctl.owner()).to.equal(owner.address);
  });
});
