const hre = require("hardhat");

// 0x5FbDB2315678afecb367f032d93F642f64180aa3
// tip address 

// Returns the Ether balance of a given address.
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  for (const address of addresses) {
    console.log(`${address.name} (${address.address}) has : `, await getBalance(address.address));
  }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    const amount = memo.amount;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}" and sent ${amount}`);
  }
}

async function main() {

  const TipFactory = await hre.ethers.getContractFactory("Tip");
  const tipContract = await TipFactory.attach(
    "0xE8Af1a4108A42D52F162fEb855096aE0E191c718"
  );

  const tip = {value: hre.ethers.utils.parseEther("0.02")};

  await tipContract.buyCoffee("jey", "first memo", tip);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });