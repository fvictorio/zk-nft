const Hasher = require("./Hasher.json");

const shield1Args = require('./calldata/shield1.json');
const shield2Args = require('./calldata/shield2.json');
const transferArgs = require('./calldata/transfer.json');
const unshieldArgs = require('./calldata/unshield.json');

async function main() {
  const [signer, signer2] = await ethers.getSigners();

  const HasherFactory = new ethers.ContractFactory(Hasher.abi, Hasher.bytecode, signer);
  const hasher = await HasherFactory.deploy();

  const Verifier = await ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();
  await verifier.deployed();

  const ZkNft = await ethers.getContractFactory("ZkNft");
  const zkNft = await ZkNft.deploy(verifier.address, 2, hasher.address);
  await zkNft.deployed();

  console.log("Contract:", zkNft.address);
  console.log();

  async function printOwnerOf(id) {
    const owner = await zkNft.ownerOf(id);
    console.log(`Owner of ${id} is ${owner}`);
  }

  console.log("Mint token 1");
  await zkNft.mint(1);
  await printOwnerOf(1)
  console.log();

  console.log("Shield token 1");
  await zkNft.shield(...shield1Args);
  await printOwnerOf(1)
  console.log();

  console.log("Mint token 2");
  await zkNft.mint(2);
  await printOwnerOf(2)
  console.log();

  console.log("Shield token 2");
  await zkNft.shield(...shield2Args);
  await printOwnerOf(2)
  console.log();

  console.log("Transfer");
  await zkNft.transfer(...transferArgs);
  console.log();

  console.log("Unshield token 1");
  await zkNft.connect(signer2).unshield(...unshieldArgs);
  await printOwnerOf(1)
  console.log();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
