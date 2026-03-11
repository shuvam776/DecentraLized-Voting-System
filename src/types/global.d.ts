export interface EIP6963ProviderInfo {
    rdns: string
    uuid: string
    name: string
    icon: string
}

export interface EIP1193Provider {
    isStatus?: boolean
    host?: string
    path?: string
    sendAsync?: (
        request: { method: string; params?: Array<unknown> },
        callback: (error: Error | null, response: unknown) => void
    ) => void
    send?: (
        request: { method: string; params?: Array<unknown> },
        callback: (error: Error | null, response: unknown) => void
    ) => void
    request: (request: {
        method: string
        params?: Array<unknown>
    }) => Promise<unknown>
}

export interface EIP6963ProviderDetail {
    info: EIP6963ProviderInfo
    provider: EIP1193Provider
}

export type EIP6963AnnounceProviderEvent = {
    detail: {
        info: EIP6963ProviderInfo
        provider: Readonly<EIP1193Provider>
    }
}

interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent<EIP6963ProviderDetail>
}

