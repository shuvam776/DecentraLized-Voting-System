import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const response = await NextResponse.json({
            message: "Logout successful",
            success: true,
        })
        response.cookies.set("token", "", {
            httpOnly: true,
            path: "/",
            expires: new Date(0),
        })
        return response;
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Logout failed" }, { status: 500 });
    }
}