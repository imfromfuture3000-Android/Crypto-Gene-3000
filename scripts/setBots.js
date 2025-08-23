/**
 * ONEIROBOT/GITHUB GENE 9000 - Bot Registration Script
 * Authorize new bots to join the autonomous trading swarm
 */

const { ethers } = require("hardhat");

async function main() {
  const controllerAddr = process.env.CONTROLLER_ADDR;
  const botAddr = process.env.BOT_ADDR;
  
  if (!controllerAddr || !botAddr) {
    throw new Error("Set CONTROLLER_ADDR and BOT_ADDR environment variables");
  }

  console.log('🤖 GENE 9000: Registering new bot to the swarm...');
  console.log(`Controller: ${controllerAddr}`);
  console.log(`Bot Address: ${botAddr}`);

  try {
    const controller = await ethers.getContractAt("SwarmController", controllerAddr);
    
    // Check if bot is already registered
    const isAlreadyBot = await controller.bot(botAddr);
    if (isAlreadyBot) {
      console.log(`⚠️ Bot ${botAddr} is already registered in the swarm`);
      return;
    }
    
    // Register the bot
    console.log('📝 Submitting bot registration transaction...');
    const tx = await controller.setBot(botAddr, true);
    const receipt = await tx.wait();
    
    console.log(`✅ Bot registered successfully!`);
    console.log(`Transaction: ${receipt.transactionHash}`);
    console.log(`Gas used: ${receipt.gasUsed}`);
    
    // Verify registration
    const isBotNow = await controller.bot(botAddr);
    if (isBotNow) {
      console.log('🎉 Bot verification complete - Welcome to the GENE 9000 swarm!');
    } else {
      console.error('❌ Bot registration verification failed');
    }
    
  } catch (error) {
    console.error('❌ Bot registration failed:', error.message);
    throw error;
  }
}

main().catch((e) => { 
  console.error('💥 GENE 9000 Bot Registration Error:', e.message); 
  process.exit(1); 
});
