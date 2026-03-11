"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/SemanticComponents/Navbar'
import Footer from '@/components/SemanticComponents/Footer'
import { SmoothCursor } from '@/components/ui/smooth-cursor'
import { useMetaMaskAuth } from '@/context/metamaskAuth'
import { auth } from '@/utils/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { useRouter } from 'next/navigation'

function page() {
  const { address } = useMetaMaskAuth();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/");
      } else {
        setUser(currentUser);
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-gray-900">
        <SmoothCursor />
        <img src="https://res.cloudinary.com/dpju1wia5/image/upload/v1769274336/samples/waves.png" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="background"/>
        <Navbar />
        
        <main className="grow flex flex-col items-center justify-start pt-32 pb-20 px-6 z-10">
            <h1 className="text-4xl font-bold mb-8 text-orange-500">User Profile</h1>
            
            <div className="p-8 rounded-xl bg-gray-800 border border-orange-500/30 shadow-[0_0_15px_rgba(234,88,12,0.15)] max-w-2xl w-full text-center hover:shadow-[0_0_25px_rgba(234,88,12,0.25)] transition duration-300 mb-6">
                {user?.photoURL && (
                   <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-orange-500 object-cover" />
                )}
                <p className="text-2xl font-bold text-white mb-2">{user?.displayName || 'Voter'}</p>
                <p className="text-gray-400 mb-4">{user?.email}</p>
            </div>

            {address ? (
                <div className="p-8 flex flex-col w-full max-w-2xl rounded-xl bg-gray-800 border border-orange-500/30 shadow-[0_0_15px_rgba(234,88,12,0.15)] text-center hover:shadow-[0_0_25px_rgba(234,88,12,0.25)] transition duration-300">
                    <p className="text-lg font-medium text-gray-300 mb-3">Wallet Connected</p>
                    <p className="font-mono text-sm md:text-base text-orange-300 break-all bg-gray-900/50 p-4 rounded-lg border border-orange-500/20">{address}</p>
                </div>
            ) : (
                <div className="text-center bg-gray-800/80 p-6 rounded-xl border border-gray-700 max-w-2xl w-full">
                    <p className="text-xl text-gray-400">Please connect your MetaMask wallet in the Dashboard to view wallet details.</p>
                </div>
            )}
        </main>

        <Footer />
    </div>
  )
}

export default page