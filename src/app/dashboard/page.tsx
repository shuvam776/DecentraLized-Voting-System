"use client"
import React, { useState, useEffect } from 'react'
import MetaMaskConnect from '@/components/MetaMaskConnect'
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/SemanticComponents/Navbar'
import Footer from '@/components/SemanticComponents/Footer'
import { useElectionContract } from '@/hooks/useElectionContract';
import { useMetaMaskAuth } from '@/context/metamaskAuth';
import { Party, usePartyAuth } from '@/context/partyAuth';
import { auth } from '@/utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { SmoothCursor } from '@/components/ui/smooth-cursor';

function Dashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const { read, isReady } = useElectionContract();
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const { address } = useMetaMaskAuth();
  const { parties = [], setParties } = usePartyAuth() || {};
  const [electionEndsAt, setElectionEndsAt] = useState<number>(0);
  const [isElectionEnded, setIsElectionEnded] = useState(false);

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

  useEffect(() => {
    if (authLoading) return;

    const timer = setTimeout(() => setLoading(false));

    const fetchParties = async () => {
      if (!isReady) return;

      try {

        console.log("[fetchParties] Fetching from blockchain...");
        const [partyCount, endsAt] = await Promise.all([
          read.getPartyCount(),
          read.electionEndsAt ? read.electionEndsAt() : Promise.resolve(0)
        ]);

        const endTime = Number(endsAt) * 1000;
        setElectionEndsAt(endTime);
        setIsElectionEnded(Date.now() > endTime && endTime !== 0);

        const partyPromises = [];

        for (let i = 0; i < Number(partyCount); i++) {
          partyPromises.push(read.getParty(i));
        }

        const fetchedResults = await Promise.all(partyPromises);
        const fetchedParties: Party[] = fetchedResults.map((result: any) => ({
          name: result[0] || "Unknown",
          votes: Number(result[1] || 0)
        }));

        // Only update if we actually got data to prevent unnecessary redraws
        if (fetchedParties.length > 0 && setParties) {
          setParties(fetchedParties);
        }
        setIsMetaMaskConnected(!!address);

      } catch (err) {
        console.error("Error fetching parties:", err);
      }
    };

    fetchParties();
    return () => clearTimeout(timer);

  }, [isReady, read, authLoading, address, setParties]);

  if (authLoading || loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  )

  // Calculate winner/leaders at the component level so they are accessible everywhere
  const maxVotes = parties.length > 0 ? Math.max(...parties.map(p => p.votes)) : 0;
  const leaders = parties.filter(p => p.votes === maxVotes);
  const winner = leaders.length > 0 ? leaders[0] : null;

  return (
    <div className="relative min-h-dvh flex flex-col pt-20 overflow-x-hidden">
      <Navbar />
      <SmoothCursor />
      <img src="https://res.cloudinary.com/dpju1wia5/image/upload/v1773207814/images_ofdbvi.jpg" className="fixed top-0 left-0 w-full h-full object-cover opacity-20 -z-20 pointer-events-none" alt="background"/>
      
      <div className='relative z-10 flex flex-col items-center justify-center mt-8 text-black text-center w-full px-4'>
        <h1 className='text-3xl md:text-4xl font-extrabold uppercase tracking-widest drop-shadow-xl'>
          Dashboard
        </h1>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20 min-h-[60vh]">
        <h1 className='mt-8 mb-12 text-black text-center text-2xl md:text-3xl font-bold uppercase tracking-wide drop-shadow-md'> Political Parties </h1>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-4'>

          {(isMetaMaskConnected && parties.length > 0) ? parties.map((party, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="bg-white/60 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:scale-[1.02] transition-transform duration-300"
            >

              <div className='flex items-center justify-center'>
                <h1 className='text-gray-900 text-center text-xl md:text-2xl font-bold'>{party.name}</h1>
              </div>
              <div className='flex flex-col items-center justify-center bg-blue-50/50 rounded-2xl w-full py-4 border border-blue-100/50'>
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Votes</span>
                <h1 className='text-blue-700 text-3xl font-black'>{party.votes}</h1>
              </div>
            </motion.div>
          )) : <div className="col-span-1 sm:col-span-2 md:col-span-3 flex flex-col items-center justify-center py-12">
            <h1 className='text-black text-center text-xl font-bold mb-6'>Connect to MetaMask</h1>
            <MetaMaskConnect />
          </div>}
        </div>

        {isMetaMaskConnected && (
          <div className="mt-16 w-full max-w-4xl mx-auto space-y-12">
            {/* CURRENT RESULTS SECTION */}
            {parties.length > 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl text-center border border-white/40">
                <div className="flex flex-col items-center mb-6">
                  <span className="bg-blue-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-2">
                    {isElectionEnded ? "Election Finalized" : "Live Standings"}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    {isElectionEnded ? "Final Results" : "Who's Winning?"}
                  </h2>
                </div>
                
                <div className="w-16 h-1 bg-green-400 mx-auto rounded mb-8 opacity-50"></div>
                
                {(() => {
                  if (maxVotes === 0) {
                    return <p className="text-xl text-gray-500 font-medium">No votes recorded yet.</p>;
                  }
                  
                  if (leaders.length > 1) {
                    return (
                      <div className="space-y-4">
                        <p className="text-lg text-gray-600 font-semibold">Current Tie Between:</p>
                        <div className="flex flex-wrap justify-center gap-4">
                          {leaders.map((leader, idx) => (
                            <div key={idx} className="bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100 text-gray-900 font-bold text-xl shadow-sm">
                              {leader.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  
                  if (winner) {
                    return (
                      <div className="flex flex-col items-center">
                        <p className="text-lg text-gray-600 font-semibold mb-4">
                          {isElectionEnded ? "The Winner is:" : "Current Leader:"}
                        </p>
                        <div className="bg-linear-to-br bg-blue-400 px-10 py-6 rounded-3xl shadow-xl flex flex-col items-center gap-2 transform hover:scale-105 transition-transform">
                          <span className="text-4xl text-white font-black uppercase tracking-wide">{winner.name}</span>
                          <div className="flex items-center gap-2 text-blue-100">
                            <span className="text-sm font-bold opacity-80">Total Votes:</span>
                            <span className="text-xl font-bold">{winner.votes}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            ) : (
              /* INACTIVE CONTRACT FALLBACK */
              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-10 shadow-lg text-center border border-dashed border-gray-300">
                <h2 className="text-2xl font-bold text-gray-400 mb-2">Contract Currently Inactive</h2>
                <p className="text-gray-500">No active election data was found on the blockchain for this session.</p>
              </div>
            )}

            {/* PREVIOUS ELECTION SECTION */}
            <div className="bg-gray-900/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl text-center border border-gray-800">
              <h3 className="text-xl font-bold text-gray-400 mb-6 uppercase tracking-[0.2em]">Previous Election Data</h3>
              <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                <div className="text-left">
                  <p className="text-gray-500 text-xs font-bold uppercase mb-1">Last Winner (2025)</p>
                  <p className="text-3xl font-black text-white">{winner?.name || "Tied/No Votes"}</p>
                </div>
                <div className="h-px w-full md:h-12 md:w-px bg-gray-800"></div>
                <div className="text-left">
                  <p className="text-gray-500 text-xs font-bold uppercase mb-1">Network</p>
                  <p className="text-3xl font-black text-orange-400">Testnet</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard