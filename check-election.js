import ethers from "ethers";
const electionAbi = require("./src/abi/election.json");
const config = {
    rpc: "https://ethereum-sepolia-rpc.publicnode.com",
    address: "0x3F9A4215A55696E63062230A6C7ce3fC285f23DB"
};

async function checkContract() {
    const provider = new ethers.JsonRpcProvider(config.rpc);
    const contract = new ethers.Contract(config.address, electionAbi, provider);

    try {
        const admin = await contract.admin();
        console.log("Admin Address:", admin);

        const start = await contract.electionStartsAt();
        const end = await contract.electionEndsAt();
        const now = Math.floor(Date.now() / 1000);

        console.log("Current Time:", now);
        console.log("Starts at:", Number(start));
        console.log("Ends at:", Number(end));

        const count = await contract.getPartyCount();
        console.log("Party Count:", Number(count));
    } catch (err) {
        console.error("Error checking contract:", err);
    }
}

checkContract();
