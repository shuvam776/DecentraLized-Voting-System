"use client"
import { ELECTION_CONFIG } from "@/config/electionConfig"
import { useElectionContract } from "@/hooks/useElectionContract"
import { useState, useEffect, useCallback } from "react"
import { useMetaMaskAuth } from "@/context/metamaskAuth"
import MetaMaskConnect from "@/components/MetaMaskConnect"
import { motion } from "framer-motion"
import Navbar from "@/components/SemanticComponents/Navbar"
import Footer from "@/components/SemanticComponents/Footer"
import { useContext } from "react"
import { PartyAuthContext, usePartyAuth } from "@/context/partyAuth"
import { useRouter } from "next/navigation"
import { auth } from "@/utils/firebase"
import { onAuthStateChanged } from "firebase/auth"
export default function VotePanel() {
    const { read, write, isReady }: any = useElectionContract();
    const { address, chainId, isConnecting, switchNetwork }: any = useMetaMaskAuth();
    const partyAuth = usePartyAuth();
    const parties = partyAuth?.parties || [];
    const setParties = partyAuth?.setParties || (() => { });
    const [hasVotedToday, setHasVotedToday] = useState(false);
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/");
            } else {
                setAuthLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    const fetchAllData = useCallback(async () => {
        if (!isReady) return;
        setIsLoading(true);

        try {
            if (chainId === ELECTION_CONFIG.chainId) {
                setIsCorrectNetwork(true);
                if (!address) {
                    setIsLoading(false);
                    return;
                }

                console.log("[votepanel] starting blockchain data fetch");
                const [hasVoted, partyCountBase] = await Promise.all([
                    read.hasVotedToday(),
                    read.getPartyCount()
                ]);

                setHasVotedToday(hasVoted);
                const partyCount = Number(partyCountBase);
                console.log("[votepanel] parties found:", partyCount);

                const partyPromises = [];
                for (let i = 0; i < partyCount; i++) {
                    partyPromises.push(read.getParty(i));
                }

                const fetchedResults = await Promise.all(partyPromises);
                const formattedParties = fetchedResults.map((result: any, index: number) => ({
                    id: index, // Using index as ID since it's the index in the contract
                    name: result[0] || "Unknown",
                    votes: Number(result[1] || 0)
                }));

                setParties(formattedParties);
                console.log("[votepanel] data loaded successfully");
            } else {
                console.log("[votepanel] incorrect network detected");
                switchNetwork("11155111")
                setIsCorrectNetwork(true);
            }
        } catch (err) {
            console.log("[votepanel] error fetching data:", err);
        } finally {
            setIsLoading(false);
        }
    }, [isReady, chainId, address, read, setParties, switchNetwork]);

    useEffect(() => {
        if (!authLoading) {
            fetchAllData();
        }
    }, [fetchAllData, authLoading]);

    const handleVote = async (partyId: number) => {
        try {
            console.log("[votepanel] casting vote for party:", partyId);
            const tx = await write.vote(BigInt(partyId));
            console.log("[votepanel] transaction submitted:", tx.hash);
            // Wait for 1 confirmation if necessary, but write.vote already does wait() in the hook
            await fetchAllData();
            alert("Vote cast successfully!");
        } catch (err: any) {
            console.error("[votepanel] vote error:", err);
            alert(`Vote failed: ${err.reason || err.message || "Unknown error"}`);
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                <p className="ml-4 text-orange-500 font-bold">Loading Vote Panel...</p>
            </div>
        )
    }
    return (
    <div className="relative min-h-[100dvh] flex flex-col pt-20 overflow-x-hidden">
        <Navbar />
        <img src='https://res.cloudinary.com/dpju1wia5/image/upload/v1773207808/360_F_203684776_X101RJ82DsPNBo4UGwqGbJX7Ks3lmQlA_tcdwmz.jpg' className="fixed top-0 left-0 w-full h-full object-cover -z-20 pointer-events-none"/>
        <div className="relative z-10 flex flex-col items-center justify-center mt-8 text-black text-center w-full px-4 text-3xl md:text-4xl font-extrabold uppercase tracking-widest drop-shadow-xl">
            Vote Panel
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pb-20 min-h-[60vh] mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-4 justify-items-center">
                {address ? parties.map((party: any, index: number) => {
                    const partyId = party.id !== undefined ? party.id : index;
                    return (
                        <motion.div key={partyId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl p-8 flex flex-col items-center justify-between w-full h-full hover:scale-[1.02] transition-transform duration-300">
                            <h1 className="text-gray-900 text-center text-xl md:text-2xl font-bold mb-4 uppercase tracking-wide">{party.name}</h1>

                            <div className="flex flex-col items-center justify-center bg-gray-50/80 rounded-2xl w-full py-4 border border-gray-100 gap-2 mb-4">
                                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Votes</span>
                                <h2 className="text-gray-700 text-3xl font-black">{party.votes}</h2>
                            </div>
                            
                            <button
                                disabled={hasVotedToday}
                                className={`w-full px-6 py-3 rounded-xl font-bold transition-all duration-300 transform active:scale-95 shadow-md ${hasVotedToday ? 'bg-gray-300 text-gray-500 cursor-not-allowed hidden' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg text-white'}`}
                                onClick={() => handleVote(partyId)}
                            >
                                {hasVotedToday ? "Already Voted" : "Cast Vote"}
                            </button>
                            {hasVotedToday && (
                              <p className="text-sm text-green-600 font-bold mt-2"> Vote Recorded</p>
                            )}
                        </motion.div>
                    )
                }) : (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 flex flex-col items-center justify-center py-12">
                        <MetaMaskConnect />
                    </div>
                )}
            </div>
        </div>
        <Footer />
    </div>

    )
}
