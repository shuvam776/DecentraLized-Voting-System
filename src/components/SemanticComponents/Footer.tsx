"use client"
import React from "react"

function Footer() {
  return (
    <footer className="bg-gradient-to-l font-bold from-green-900 to-green-500 text-white mt-20">

      <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">

        {/* Brand */}
        <h1 className="text-lg font-semibold">
          Decentralized Voting System
        </h1>

        {/* Social Links */}
        <ul className="flex gap-6 text-sm">

          <li>
            <a
              href="/about"
              className="hover:text-blue-200 transition"
            >
              About
            </a>
          </li>

          <li>
            <a
              href="https://github.com/shuvam776/DecentraLized-Voting-System"
              target="_blank" rel="noopener noreferrer"
              className="hover:text-blue-200 transition"
            >
              GitHub
            </a>
          </li>

          <li>
            <a
              href="https://www.instagram.com/shuvam._661/?next=%2F"
              className="hover:text-blue-200 transition"
            >
              Instagram
            </a>
          </li>

        </ul>
      </div>

      {/* Bottom bar */}
      <div className="text-center text-sm pb-6 text-blue-200">
        © {new Date().getFullYear()} VoteChain. All rights reserved.
      </div>

    </footer>
  )
}

export default Footer