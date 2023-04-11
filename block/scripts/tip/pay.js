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
  // Get the example accounts we'll be working with.
  const [owner, tipper, tipper2] = await hre.ethers.getSigners();

  // We get the contract to deploy.
  const TipFactory = await hre.ethers.getContractFactory("Tip");
 const tipContract = await TipFactory.deploy();

  // Deploy the contract.
 await tipContract.deployed();
 console.log("tipContract deployed to:", tipContract.address);

  // Check balances before the coffee purchase.
  const addresses = [
    {
        address: owner.address,
        name: 'owner'
    },
    {
        address: tipContract.address,
        name: 'tipContract'
    },
    {
        address: tipper.address,
        name: 'tipper'
    },
    {
        address: tipper2.address,
        name: 'tipper2'
    }
  ];
 
  console.log("== start ==");
  await printBalances(addresses);

  // Buy the owner a few coffees.
  const tip = {value: hre.ethers.utils.parseEther("2")};
  await tipContract.connect(tipper).buyCoffee("tipper", "You're the best!", tip);
  await tipContract.connect(tipper2).buyCoffee("tipper2", "Amazing teacher", tip);

  /*
  await tipper.sendTransaction({
    to: tipContract.address,
    value: ethers.utils.parseEther("3.0"), 
  });
  */
 
  // Check balances after the coffee purchase.
  console.log("== bought coffee ==");
  await printBalances(addresses);

  // Withdraw.
  await tipContract.connect(owner).withdrawTips();

  // Check balances after withdrawal.
  console.log("== withdrawTips ==");
  await printBalances(addresses);

  // Check out the memos.
  console.log("== memos ==");
  const memos = await tipContract.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });