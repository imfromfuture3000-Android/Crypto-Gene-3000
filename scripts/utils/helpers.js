const { ethers } = require("hardhat");

async function wait(tx) {
  const r = await tx.wait();
  console.log("✓ tx", r.transactionHash);
  return r;
}

async function deploy(name, args = []) {
  const F = await ethers.getContractFactory(name);
  const c = await F.deploy(...args);
  await c.waitForDeployment();
  const addr = await c.getAddress();
  console.log(`deployed ${name}: ${addr}`);
  return c;
}

module.exports = { wait, deploy };
