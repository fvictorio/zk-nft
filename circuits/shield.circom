include "../node_modules/circomlib/circuits/poseidon.circom";

template ShieldNFT() {
    signal input id;
    signal private input secret;
    signal output commitment;

    component commitmentHasher = Poseidon(2);
    commitmentHasher.inputs[0] <== id;
    commitmentHasher.inputs[1] <== secret;

    commitment === commitmentHasher.out;
}


component main = ShieldNFT();
