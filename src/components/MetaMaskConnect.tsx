"use client"
import { useMetaMaskAuth } from "@/context/metamaskAuth";
import { ELECTION_CONFIG } from "@/config/electionConfig";
export const MetaMaskConnect = () => {
    const { address, connect, disconnect, isConnecting, chainId, switchNetwork } = useMetaMaskAuth();

    const isWrongNetwork = address && chainId !== ELECTION_CONFIG.chainId.toString();

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
            {address ? (
                <div className="flex flex-col items-center gap-2 w-full">
                    <p className="text-xs font-medium text-blue-200 uppercase tracking-widest">Connected Wallet</p>
                    <div className="w-full px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-500/30 flex flex-col items-center gap-1">
                        <p className="font-mono text-white text-sm ">
                            {address.slice(0, 6)}...{address.slice(-4)}
                        </p>
                    </div>

                    {isWrongNetwork && (
                        <div className="w-full mt-2 p-3 bg-amber-500/20 border border-amber-500/30 rounded-xl flex flex-col items-center gap-2">
                            <p className="text-[10px] text-amber-200 font-bold uppercase text-center">
                                 Wrong Network
                            </p>
                            <button
                                onClick={() => switchNetwork(ELECTION_CONFIG.chainId.toString())}
                                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-colors shadow-lg shadow-amber-500/20"
                            >
                                Switch to Sepolia
                            </button>
                        </div>
                    )}

                    <button
                        onClick={disconnect}
                        className="mt-2 text-[10px] text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider font-bold"
                    >
                        Disconnect
                    </button>
                </div>
            ) : (
                <button
                    onClick={connect}
                    disabled={isConnecting}
                    className={`group relative px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-400 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/25 ${isConnecting ? 'opacity-80 cursor-not-allowed scale-100' : ''}`}
                >
                    <span className="flex items-center gap-2">
                        {isConnecting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Connecting...
                            </>
                        ) : (
                            <>
                                Connect MetaMask
                                <svg
                                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </>
                        )}
                    </span>
                </button>
            )}
        </div>
    );
};

export default MetaMaskConnect;
