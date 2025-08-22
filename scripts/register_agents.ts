import { ethers } from "ethers";

// Connect to Base Mainnet
const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");

// Load your relayer wallet
const relayer = new ethers.Wallet(
  process.env.BASE_RELAYER_PRIVATE_KEY!,
  provider
);

async function sendHighPriorityTx() {
  // Current gas price
  const feeData = await provider.getFeeData();

  // Add a multiplier for priority (e.g. 1.3x higher)
  const maxFeePerGas = feeData.maxFeePerGas!.mul(13).div(10);
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas!.mul(2);

  const tx = await relayer.sendTransaction({
    to: "0x000000000000000000000000000000000000dead", // example target
    value: ethers.parseEther("0.01"),
    maxFeePerGas,
    maxPriorityFeePerGas,
  });

  console.log("High priority tx sent:", tx.hash);
}

sendHighPriorityTx().catch(console.error);
