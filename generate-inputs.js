const { poseidon, mimcsponge } = require("circomlib");
const Tree = require("fixed-merkle-tree");
const fs = require("fs-extra");
const path = require("path");

const circuitsDir = path.resolve(__dirname, "circuits");

async function main() {
  const tree = new Tree(2);

  // shield1.input.json
  const shield1 = {
    id: 1,
    secret: 11
  };
  shield1.commitment = poseidon([shield1.id, shield1.secret]).toString();
  tree.insert(shield1.commitment);
  fs.writeJsonSync(path.resolve(circuitsDir, "shield1.input.json"), shield1);

  // shield2.input.json
  const shield2 = {
    id: 2,
    secret: 22
  };
  shield2.commitment = poseidon([shield2.id, shield2.secret]).toString();
  tree.insert(shield2.commitment);
  fs.writeJsonSync(path.resolve(circuitsDir, "shield2.input.json"), shield2);

  // transfer.input.json
  const transfer = {
    id: 1,
    root: tree.root(),
    secret: shield1.secret,
    newSecret: 21,
    pathElements: tree.path(0).pathElements.map(x => x.toString()),
    pathIndices: tree.path(0).pathIndices.map(x => x.toString()),
    nullifier: mimcsponge.multiHash([shield1.id, shield1.secret]).toString()
  };
  transfer.newCommitment = poseidon([
    transfer.id,
    transfer.newSecret
  ]).toString();
  tree.insert(transfer.newCommitment)
  fs.writeJsonSync(path.resolve(circuitsDir, "transfer.input.json"), transfer);

  // unshield.input.json
  const unshield = {
    id: transfer.id,
    // address is second hardhat address in decimal
    address: "642829559307850963015472508762062935916233390536",
    root: tree.root(),
    secret: transfer.newSecret,
    pathElements: tree.path(2).pathElements.map(x => x.toString()),
    pathIndices: tree.path(2).pathIndices.map(x => x.toString()),
    nullifier: mimcsponge.multiHash([transfer.id, transfer.newSecret]).toString()
  };
  fs.writeJsonSync(path.resolve(circuitsDir, "unshield.input.json"), unshield);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
