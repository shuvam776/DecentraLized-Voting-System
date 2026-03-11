"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link";
import { motion } from "framer-motion"

function Navbar() {
  const [isHamburg, setIsHamburg] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <nav className=" h-16 sm:h-14 sm:block fixed top-0 z-50 bg-gradient-to-r from-orange-900 to-orange-500 shadow-lg w-screen">

      {/* big screens */}


      <div className="w-full">
        {(!isSmall) ? (
          <div className="flex items-center justify-between px-8 py-4 w-full">

            {/* Logo / Brand */}
            <Link
              href="/"
              className="text-xl font-bold tracking-wide text-white"
            >
              VoteChain
            </Link>

            {/* Navigation */}
            <div className="flex gap-8 text-white font-medium">

              <Link
                href="/"
                className="hover:text-blue-200 transition"
              >
                Home
              </Link>

              <Link
                href="/dashboard"
                className="hover:text-blue-200 transition"
              >
                Dashboard
              </Link>

              <Link
                href="/votepanel"
                className="hover:text-blue-200 transition"
              >
                Vote Panel
              </Link>

              <Link
                href="/profile"
                className="hover:text-blue-200 transition"
              >
                Profile
              </Link>

              <Link
                href="/about"
                className="hover:text-blue-200 transition"
              >
                About
              </Link>

            </div>
          </div>
        ) : (
          <div className="justify-around gap-4  flex items-center w-full px-8 py-4 ">
            <Link
              href="/"
              className="text-xl font-bold tracking-wide text-white"
            >
              VoteChain
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsHamburg(!isHamburg)}
              className="text-white p-4 left-15 relative  hover:scale-105 transition ease-in-out duration-300 "
            >
              <i className={`fa-solid ${isHamburg ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
            </button>

            {/* Mobile Menu Sidebar */}
            {isHamburg && (
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="fixed top-0 right-0 h-screen w-64 bg-orange-600 flex flex-col items-start p-8 gap-6 shadow-2xl z-[60]"
              >
                {/* Close Button Inside Sidebar */}
                <button
                  onClick={() => setIsHamburg(false)}
                  className="self-end text-white hover:rotate-90 transition-transform duration-300"
                >
                  <i className="fa-solid fa-xmark text-2xl"></i>
                </button>

                <Link href="/" className="text-white text-lg font-semibold hover:translate-x-2 transition-transform" onClick={() => setIsHamburg(false)}>
                  <i className="fa-solid fa-house mr-3"></i> Home
                </Link>
                <Link href="/dashboard" className="text-white text-lg font-semibold hover:translate-x-2 transition-transform" onClick={() => setIsHamburg(false)}>
                  <i className="fa-solid fa-chart-line mr-3"></i> Dashboard
                </Link>
                <Link href="/votepanel" className="text-white text-lg font-semibold hover:translate-x-2 transition-transform" onClick={() => setIsHamburg(false)}>
                  <i className="fa-solid fa-check-to-slot mr-3"></i> Vote Panel
                </Link>
                <Link href="/profile" className="text-white text-lg font-semibold hover:translate-x-2 transition-transform" onClick={() => setIsHamburg(false)}>
                  <i className="fa-solid fa-user mr-3"></i> Profile
                </Link>
                <Link href="/about" className="text-white text-lg font-semibold hover:translate-x-2 transition-transform" onClick={() => setIsHamburg(false)}>
                  <i className="fa-solid fa-circle-info mr-3"></i> About
                </Link>
              </motion.aside>
            )}
          </div>
        )}
      </div>

    </nav>
  )
}

export default Navbar