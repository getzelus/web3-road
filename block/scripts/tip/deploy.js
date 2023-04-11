
const hre = require("hardhat");

// 0xE8Af1a4108A42D52F162fEb855096aE0E191c718
// on sepolia

async function main() {
  // We get the contract to deploy.
  const TipFactory = await hre.ethers.getContractFactory("Tip");
  const tipContract = await TipFactory.deploy();

  await tipContract.deployed();

  console.log("deployed to:", tipContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });