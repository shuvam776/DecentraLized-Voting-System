"use client"

import React, { createContext, useContext, useState } from "react";

export interface Party {
    name: string;
    votes: number;
}

interface PartyAuthContextType {
    parties: Party[];
    setParties: React.Dispatch<React.SetStateAction<Party[]>>;
}

export const PartyAuthContext = createContext<PartyAuthContextType | null>(null);

export const PartyAuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [parties, setParties] = useState<Party[]>([]);

    return (
        <PartyAuthContext.Provider value={{ parties, setParties }}>
            {children}
        </PartyAuthContext.Provider>
    );
};

export const usePartyAuth = () => {
    const context = useContext(PartyAuthContext);
    return context;
};
