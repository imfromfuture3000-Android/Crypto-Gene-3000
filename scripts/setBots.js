const { ethers } = require("hardhat");

async function main() {
  const controllerAddr = process.env.CONTROLLER_ADDR;
  const botAddr = process.env.BOT_ADDR;
  if (!controllerAddr || !botAddr) throw new Error("Set CONTROLLER_ADDR and BOT_ADDR");

  const controller = await ethers.getContractAt("SwarmController", controllerAddr);
  const tx = await controller.setBot(botAddr, true);
  await tx.wait();
  console.log("Bot added:", botAddr);
}
main().catch((e) => { console.error(e); process.exit(1); });
