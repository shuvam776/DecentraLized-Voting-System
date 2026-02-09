import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connect } from "@/config/dbConfig";
import jwt from "jsonwebtoken";

connect()

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        console.log(email, password);
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ message: "Invalid password" }, { status: 401 });
        }
        console.log("user exists    ")
            
        const token = jwt.sign({id : user._id},process.env.JWT_SECRET!,{expiresIn : "1d"})
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true,
        })
        return response;
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Login failed" }, { status: 500 });
    }
}