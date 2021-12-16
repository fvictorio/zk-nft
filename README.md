# ZK-NFT

This is an extremely WIP proof of concept for an NFT with shielded transfers.
It was created as part of [0xPARC](https://0xparc.org/)'s first Applied ZK Learning Group.

## How it works

The `ZkNft` contract has four methods (it's not ERC-721 compatible):

- `mint(id)` mints the token `id` to the sender.
- `shield(..., [commitment, id])` shields the token `id` and adds the commitment
  to the merkle tree.
  The commitment is a hash of the id of the token and a
  secret. The proof shows that you know the secret to generate that hash.
- `unshield(..., [nullifier, id, owner, root])` unshields the token.
  The proof shows that you know the secret to generate a commitment that exists
  in the merkle tree. The nullifier is the hash of the id and the secret, but
  using a different hasher. The owner is not used in the proof, but it's
  included to prevent front-running.
- `transfer(nullifier, newCommitment, root)` is similar to unshield, but instead
  of revealing the token, it assigns to it a new secret, and nullifies the
  previous commitment.

In practice this means that transferring a token means sending your secret to
the other person, and then they can do the transfer that changes the secret to a
new one only known by them.

## Running the code

1. Run `yarn` to install the dependencies
2. Run `npx hardhat circom` to build the circuits and generate the
   `Verifier.sol` file.
3. Run `node generate-inputs.js`. This will generate the input values for
   running the example script.
4. Run `./generate-calldata.sh` to generate the calldata used by the script to
   interact with the contract.
5. Finally, run `npx hardhat run script.js` to run the example script. This will
   deploy the relevant contracts, mint and shield pair of tokens, transfer one
   of them, and then unshield the transferred one.
