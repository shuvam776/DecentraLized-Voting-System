export const ELECTION_CONFIG = {
  network: "sepolia",

  chainId: 11155111,

  contract: {
    name: "Election",
    address: "0xaf949625B9644a7D3f45b06E834Ca776607cC054",
    deploymentTxHash:
      "0xe3eab4595fee4f7f56e41b7de85c0612ad1375ea7c7d81484c894bf59061aa91",
  },

  explorer: {
    baseUrl: "https://sepolia.etherscan.io",
    contractUrl:
      "https://sepolia.etherscan.io/address/0xd05FD922e0697fE31091Bd2720Bf40DB07B0cf24",
    txUrl:
      "https://sepolia.etherscan.io/tx/0xe60f389b3948b444fd06d24990fd7426c71c80b55f326152b3a34580913885f7",
  },
} as const