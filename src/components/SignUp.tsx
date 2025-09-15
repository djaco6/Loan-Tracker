import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function SignUp() {

    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [message, setMessage] = useState("");
    
    return (
        <div className = "bg-blue-800 text-white p-6 rounded shadow mt-20">Sign Up</div>
        
    )
}