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
        const partyCount = await read.getPartyCount();
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

  return (
    <div className="relative min-h-[100dvh] flex flex-col pt-20 overflow-x-hidden">
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
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard