const { ethers } = require("hardhat");
const { deploy, wait } = require("./utils/helpers");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // Owner = deployer by default (change if needed)
  const owner = deployer.address;

  const vault = await deploy("OneiroVault", [owner]);
  const controller = await deploy("SwarmController", [vault.target, owner]);

  // Add a couple of placeholder strategies so runAll() works
  const oracle = await deploy("Oracle");
  const phantom = await deploy("Phantom");

  await wait((await controller.addStrategy(oracle.target)));
  await wait((await controller.addStrategy(phantom.target)));

  console.log("Vault:", await vault.getAddress());
  console.log("Controller:", await controller.getAddress());
}

main().catch((e) => { console.error(e); process.exit(1); });
