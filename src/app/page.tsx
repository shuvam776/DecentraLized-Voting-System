"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SmoothCursor } from '@/components/ui/smooth-cursor';
import { auth } from '@/utils/firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedin,setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      if(isLoggedin){
        router.push("/dashboard");
      }
      else{
        await signInWithPopup(auth, provider);
        setIsLoggedIn(true);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Google Sign-in Error:", error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Background */}
      <SmoothCursor/>
      <img
        src="https://res.cloudinary.com/dpju1wia5/image/upload/v1772714468/beautiful-indian-flag-theme-republic-day-watercolor-texture-background_1055-16830_1_k34xxb.avif"
        className="absolute inset-0 w-full h-full object-cover -z-20"
        alt="Background"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 -z-10"></div>

      {/* Content */}
      <div className="flex flex-col items-center gap-6 px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-xl">
          Decentralized Voting System
        </h1>

        <h2 className="text-lg md:text-xl text-gray-200 tracking-wide">
          Powered by Blockchain
        </h2>

        <div className="mt-4">
          <div className="flex flex-col gap-4 items-center">
            <p className="text-white text-sm">Please sign in to continue</p>
            <button
              onClick={googleLogin}
              className="flex items-center gap-3 px-8 py-3 rounded-xl bg-white text-gray-800 font-semibold 
                      hover:bg-gray-100 transition duration-300 shadow-lg"
            >
              {isLoggedin  ? "Go to Dashboard" : <><img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" /> Continue with Google</>}
            </button>
          </div>
        </div>

        <h2 className='text-lg md:text-xl text-gray-200 tracking-wide'> ETHEREUM SEPOLIA</h2>
      </div>
    </div>
  )
}
