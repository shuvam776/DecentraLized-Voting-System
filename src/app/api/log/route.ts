import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { message, type } = await request.json();

        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}] [MetaMask]`;

        if (type === "error") {
            console.error(`\x1b[31m${prefix} ERROR: ${message}\x1b[0m`);
        } else {
            console.log(`\x1b[34m${prefix} INFO: ${message}\x1b[0m`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
