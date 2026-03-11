"use client"
import React from 'react';
import { ELECTION_CONFIG } from '@/config/electionConfig';
import Navbar from '@/components/SemanticComponents/Navbar';
import Footer from '@/components/SemanticComponents/Footer';

export default function AboutPage() {
  const contractAddress = ELECTION_CONFIG.contract.address;
  const etherscanUrl = `https://sepolia.etherscan.io/address/${contractAddress}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-24 sm:py-32">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About the Election Smart Contract</h1>
          
          <div className="prose max-w-none text-gray-600 space-y-6">
            <p className="text-lg">
              This decentralized voting system is powered by Ethereum's blockchain technology, ensuring 
              transparency, immutability, and security for every vote cast.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 my-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Contract Details</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 break-all bg-white px-4 py-3 rounded-lg border border-blue-200 text-sm font-mono text-gray-800 shadow-inner">
                  {contractAddress}
                </div>
                <a 
                  href={etherscanUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  View on Etherscan
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            <p>
              By verifying the contract on Etherscan, anyone can independently audit the source code, 
              verify the current vote counts, and track every transaction on the network. The contract 
              is deployed on the <strong>Sepolia Testnet</strong>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
