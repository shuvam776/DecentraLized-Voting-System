"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/SemanticComponents/Navbar'
import Footer from '@/components/SemanticComponents/Footer'
import { SmoothCursor } from '@/components/ui/smooth-cursor'
import { useMetaMaskAuth } from '@/context/metamaskAuth'
import { auth } from '@/utils/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import MetaMaskConnect from '@/components/MetaMaskConnect'

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
return ( <div className="flex items-center justify-center min-h-screen bg-slate-50"> <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div> </div>
    );
  }

  return (
     <div className="min-h-screen flex flex-col relative bg-slate-50"> <SmoothCursor />

        <Navbar />
        
    <main className="grow flex flex-col items-center justify-start pt-32 pb-20 px-6">

        <h1 className="text-4xl font-bold mb-8 text-gray-800">
            User Profile
        </h1>
            
        {/* USER CARD */}
        <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm max-w-2xl w-full text-center hover:shadow-md transition mb-6">

                {user?.photoURL && (
               <img
                 src={user.photoURL}
                 alt="Profile"
                 className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-100 object-cover"
               />
                )}

            <p className="text-2xl font-semibold text-gray-800 mb-1">
              {user?.displayName || 'Voter'}
            </p>

            <p className="text-gray-500">
              {user?.email}
            </p>

            </div>

        {/* WALLET CARD */}
            {address ? (
            <div className="p-8 flex flex-col w-full max-w-2xl rounded-2xl bg-white border border-gray-200 shadow-sm text-center hover:shadow-md transition text-black">

                <p className="text-lg font-medium text-gray-600 mb-3">
                    Wallet Connected
                </p>

                <MetaMaskConnect />

                </div>
            ) : (
            <div className="text-center bg-white p-6 rounded-xl border border-gray-200 max-w-2xl w-full shadow-sm">

                <p className="text-lg text-gray-500">
                    Please connect your MetaMask wallet in the Dashboard to view wallet details.
                </p>

                </div>
            )}
     
        </main>

        <Footer />
    </div>


  )
}

export default page
