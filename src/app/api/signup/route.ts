import { connect } from "@/config/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import admin from "../../lib/firebaseAdmin";

connect()

export async function POST(request: NextRequest) {
    try {
        const { email, password, username } = await request.json()

        // Check if user already exists in MongoDB first
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        // Create user in Firebase using the admin instance
        

     

        // Hash password for MongoDB
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        const firebaseUser = await admin.auth().createUser({
            email,
            password,
            displayName: username,
        });
        console.log("Firebase user created:", firebaseUser.uid);

        const savedUser = await newUser.save()
        console.log("User saved to DB:", savedUser);

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })

    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}