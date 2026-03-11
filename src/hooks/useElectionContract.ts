import { ethers } from "ethers";
import { useMetaMaskAuth } from "@/context/metamaskAuth";
import { ELECTION_CONFIG } from "@/config/electionConfig";
import election from "@/abi/election.json";
import { useMemo, useEffect, useCallback } from "react";

export const useElectionContract = () => {
    const { address, provider, signer, chainId: currentChainId, switchNetwork } = useMetaMaskAuth();
    const contractAddress = ELECTION_CONFIG.contract.address;

    useEffect(() => {
        if (currentChainId && currentChainId !== ELECTION_CONFIG.chainId.toString()) {
            switchNetwork(ELECTION_CONFIG.chainId.toString());
        }
    }, [currentChainId, switchNetwork]);

    const readContract = useMemo(() => {
        if (!provider) return null;
        return new ethers.Contract(contractAddress, election, provider);
    }, [provider, contractAddress])

    const writeContract = useMemo(() => {
        if (!signer) return null;
        return new ethers.Contract(contractAddress, election, signer);
    }, [signer, contractAddress])

    const getVotes = useCallback(async (partyId: number) => {
        if (!readContract) return 0;
        return Number(await readContract.getVotes(partyId));
    }, [readContract]);

    const getPartyCount = useCallback(async () => {
        if (!readContract) throw new Error("Contract not ready");
        return Number(await readContract.getPartyCount());
    }, [readContract]);

    const getParty = useCallback(async (partyId: number) => {
        if (!readContract) throw new Error("Contract not ready");
        return await readContract.getParty(partyId);
    }, [readContract]);

    const hasVotedToday = useCallback(async () => {
        if (!readContract || !address) throw new Error("Missing data");
        return await readContract.hasVotedToday(address);
    }, [readContract, address]);

    const vote = useCallback(async (partyId: number) => {
        if (!writeContract) throw new Error("Wallet not connected");
        const tx = await writeContract.vote(partyId);
        return tx.wait();
    }, [writeContract]);

    const result = useMemo(() => ({
        isReady: !!readContract,
        read: {
            getPartyCount,
            getParty,
            getVotes,
            hasVotedToday,
        },
        write: {
            vote,
        },
    }), [readContract, getPartyCount, getParty, getVotes, hasVotedToday, vote]);

    return result;
}
