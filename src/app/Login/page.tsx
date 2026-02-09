"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ConnectionStates } from "mongoose";
import GoogleLogin from "../components/GoogleLogin";

export default function Login() {
    const [user, setUser] = React.useState({
        email: "",
        password: "",
    })
    const router = useRouter();
    const onLogin = async () => {
        try {
            const response = await axios.post("/api/login", user);
            console.log(response);
            if(response.data.success){
                
                  router.push("/dashboard");
               }
             else if (response.status == 404){
                    toast.error("User not found");
                }
                else if (response.status == 401){
                    toast.error("Invalid password");
                }
            }
             catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <div>
                <h1>Login</h1>
                <input type="text" placeholder="email" value={user.email} onChange={(e) => { setUser({ email: e.target.value, password: user.password })}} className="bg-white text-black font-serif border-2" />
                <input type="password" placeholder="password" value={user.password} onChange={(e) => { setUser({ email: user.email, password: e.target.value }) }} className="bg-white text-black font-serif border-2" />
                <button onClick={onLogin} className="bg-blue-500 text-white font-serif border-2">Login</button>
                <GoogleLogin/>
            </div>
        </div>
    );
}