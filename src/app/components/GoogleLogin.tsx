"use client";
import React from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../lib/firebaseCLient";
import { useRouter } from "next/navigation";

export default function GoogleLogin() {
    const router = useRouter();
    const[isLogging,setIsLogging] = React.useState(false);
    const onGoogleLogin = async () => {
        setIsLogging(true);
        try{
        const provider = new GoogleAuthProvider();  
        const auth = getAuth(app);
        const result = await signInWithPopup(auth, provider);
        console.log(result);
        const idTokenResult = await result.user.getIdTokenResult();
        console.log(idTokenResult);
        router.push("/dashboard");
        }catch(error){
            console.log(error);
        }
    }
    return (
        <div><img src="../public/google.png" alt="google" />
            <button onClick={onGoogleLogin}></button>
        </div>
    );
}