"use client"
import { createContext, useContext, useState, useEffect } from "react";

import { ethers } from "ethers";
interface MetaMaskAuthContextType {
    provider: ethers.BrowserProvider | null;
    signer: ethers.Signer | null;
    address: string | null;
    chainId: string | null;
    isConnecting: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
    switchNetwork: (targetChainId: string) => Promise<boolean>;
}



export const MetaMaskAuthContext = createContext<MetaMaskAuthContextType | null>(null);

export const MetaMaskAuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [chainId, setChainId] = useState<string | null>(null);
    const getNetworkName = (id: string) => {
        const networks: { [key: string]: string } = {
            "1": "Mainnet",
            "11155111": "Sepolia",
            "5": "Goerli",
            "137": "Polygon",
            "80001": "Mumbai",
        };
        return networks[id] || `Unknown (${id})`;
    };

   //this useeffect hook will make sure in case user switch to some other network since whastever we are doing now is in sepolia network
    useEffect(() => {
        if (typeof window !== "undefined" && window.ethereum) {
            console.log("🔌 MetaMask: Listeners initialized.");
            const handleAccounts = (accounts: string[]) => {
                const message = accounts.length > 0 ? `👤 Account changed: ${accounts[0]}` : "👤 MetaMask: Disconnected/Locked";
                console.log(message);
                logToServer(message, "info");

                if (accounts.length > 0) {
                    setAddress(accounts[0]);
                } else {
                    disconnect();
                }
            };

            const handleChain = (hexChainId: string) => {
                const numericId = parseInt(hexChainId, 16).toString();
                const networkName = getNetworkName(numericId);
                const message = `Network changed: ${networkName}`;
                console.log(message);
                logToServer(message, "info");
                setChainId(numericId);
            };

            window.ethereum.on("accountsChanged", handleAccounts);
            window.ethereum.on("chainChanged", handleChain);

            return () => {
                window.ethereum.removeListener("accountsChanged", handleAccounts);
                window.ethereum.removeListener("chainChanged", handleChain);
            };
        }
    }, []);

    const logToServer = async (message: string, type: "info" | "error" = "info") => {
        try {
            await fetch("/api/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, type }),
            });
        } catch (e) {
            console.log("Error",e)
         }
    };

    const switchNetwork = async (targetChainId: string) => {
        if (!window.ethereum) return false;
        const networkName = getNetworkName(targetChainId);
        console.log(`MetaMask: Requesting switch to ${networkName}...`);

        const hexChainId = `0x${parseInt(targetChainId).toString(16)}`;
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: hexChainId }],
            });
            console.log(`MetaMask network name ${networkName}.`);
            return true;
        } catch (error: any) {
            console.error(`❌ MetaMask: Switch to ${networkName} failed:`, error);
            if (error.code === 4902) {
                alert(`Please add ${networkName} network to your MetaMask.`);
            } else {
                alert(`Network switch failed: ${error.message}`);
            }
            return false;
        }
    };

    const connect = async () => {
        if (!window.ethereum) {
            const msg = "❌ MetaMask: Extension not found";
            console.error(msg);
            alert(msg);
            return;
        }

        setIsConnecting(true);
        console.log(" MetaMask: Starting connection flow...");
        await logToServer(" MetaMask: Starting connection flow...", "info");
        try {
            const providerI = new ethers.BrowserProvider(window.ethereum);
            const accounts = await providerI.send("eth_requestAccounts", []);

            const network = await providerI.getNetwork();
            const currentId = network.chainId.toString();
            const targetId = "11155111"; // Sepolia


            // ENFORCEMENT: If not on Sepolia, force the switch request
            if (currentId !== targetId) {
                console.warn(` MetaMask: Wrong network (${getNetworkName(currentId)}). Enforcing Sepolia...`);
                const switched = await switchNetwork(targetId);
                if (!switched) {
                    throw new Error("User rejected network switch or switch failed.");
                }
            }

            const signerI = await providerI.getSigner();
            const addressI = await signerI.getAddress();
            const finalNetwork = await providerI.getNetwork();
            const finalId = finalNetwork.chainId.toString();

            setAddress(addressI);
            setChainId(finalId);
            setProvider(providerI);
            setSigner(signerI);

            const successMsg = `MetaMask: Connected! Addr: ${addressI}, Net: ${getNetworkName(finalId)}`;
            console.log(successMsg);
            await logToServer(successMsg, "info");
        } catch (error: any) {
            const errorMsg = ` MetaMask: Connection error: ${error.message || error}`;
            console.error(errorMsg);
            await logToServer(errorMsg, "error");
            if (error.code !== 4001) { 
                alert(errorMsg);
            }
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnect = async() => {
        console.log("🔌 MetaMask: Disconnecting...");
        setProvider(null);
        setSigner(null);
        setAddress(null);
        setChainId(null);
        await logToServer("🔌 MetaMask: Disconnected...", "info");
    };

    return (
        <MetaMaskAuthContext.Provider value={{ provider, signer, address, chainId, isConnecting, connect, disconnect, switchNetwork }}>
            {children}
        </MetaMaskAuthContext.Provider>
    );
};

export const useMetaMaskAuth = () => {
    const context = useContext(MetaMaskAuthContext);
    if (!context) {
        throw new Error("useMetaMaskAuth must be used within a MetaMaskAuthContextProvider");
    }
    return context;
};
