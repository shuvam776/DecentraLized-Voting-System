export const ELECTION_CONFIG = {
  network: "sepolia",

  chainId: 11155111,

  contract: {
    name: "Election",
    address: "0x3F9A4215A55696E63062230A6C7ce3fC285f23DB",
    deploymentTxHash:
      "0xfa1a05a6bd0639cdc0037d1860d4e586c52fc93619173ad1737f83027b23a8f0",
  },

  explorer: {
    baseUrl: "https://sepolia.etherscan.io",
    contractUrl:
      "https://sepolia.etherscan.io/address/0xd05FD922e0697fE31091Bd2720Bf40DB07B0cf24",
    txUrl:
      "https://sepolia.etherscan.io/tx/0xe60f389b3948b444fd06d24990fd7426c71c80b55f326152b3a34580913885f7",
  },
} as const