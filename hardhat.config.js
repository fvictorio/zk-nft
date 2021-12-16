require("hardhat-circom");
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: {
    compilers: [{ version: "0.7.6" }, { version: "0.6.7" }]
  },
  circom: {
    ptau: "pot15_final.ptau",
    circuits: [{ name: "unshield" }, { name: "shield" }, { name: "transfer" }]
  }
};
