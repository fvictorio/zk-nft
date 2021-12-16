include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/mimcsponge.circom";

include "./merkleTree.circom";

template UnshieldNFT(levels) {
    signal input id;
    signal input address;
    signal input root;
    signal private input secret;
    signal private input pathElements[levels];
    signal private input pathIndices[levels];
    signal output nullifier;

    component commitmentHasher = Poseidon(2);
    commitmentHasher.inputs[0] <== id;
    commitmentHasher.inputs[1] <== secret;

    component tree = MerkleTreeChecker(levels);
    tree.leaf <== commitmentHasher.out;
    for (var i = 0; i < levels; i++) {
        tree.pathElements[i] <== pathElements[i];
        tree.pathIndices[i] <== pathIndices[i];
    }
    tree.root <== root;

    component nullifierHasher = MiMCSponge(2, 220, 1);
    nullifierHasher.ins[0] <== id;
    nullifierHasher.ins[1] <== secret;
    nullifierHasher.k <== 0;
    nullifier <== nullifierHasher.outs[0];
}


component main = UnshieldNFT(2);
