#!/usr/bin/env bash

set -e

generate-calldata() {
  # generate proof.json and public.json
  npx snarkjs groth16 fullprove \
      circuits/${1}${2}.input.json circuits/${1}.wasm circuits/${1}.zkey \
      circuits/${1}${2}-proof.json circuits/${1}${2}-public.json;

  # generate a file with the calldata
  # the output is not valid json, so we surround the output with [ ]
  echo -n '[' > calldata/${1}${2}.json
  npx snarkjs zkey export soliditycalldata \
    circuits/${1}${2}-public.json circuits/${1}${2}-proof.json >> \
    calldata/${1}${2}.json
  echo -n ']' >> calldata/${1}${2}.json
}

generate-calldata shield 1
generate-calldata shield 2
generate-calldata transfer ""
generate-calldata unshield ""
