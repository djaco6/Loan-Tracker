
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Signed in!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMessage("Signed out!");
  };

  const showSignUp = () => {

  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? error.message : "Check your email for the confirmation link!");
  }

  return (
    <div className = "flex items-center justify-center min-h-screen bg-slate-800">
      {/* Top Div: Flexbox Page Background*/}
      
      {/* Inner Div:  Defining the Flexbox Column Setup */} 
      <div className="flex flex-col items-center gap-1">
        
        <img
          src="../../../skylineNew.png"
          alt="Skyline"
          className="h-40 w-65"
        />

        <form onSubmit={handleSignIn} className = "w-80 p-8 bg-slate-700 rounded-xl shadow-lg flex flex-col gap-4">
          <h1 className="text-3xl font-bold mb-6 text-slate-200 text-left">Welcome.</h1>
          <button onClick={showSignUp} className = "px-4 py-2 font-medium text-slate-200 bg-blue-700 rounded-lg hover:bg-blue-800 transition">Sign Up</button>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className = "w-full p-3 rounded-md bg-slate-500 bg-opacity-90 text-black" required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className = "w-full p-3 rounded-md bg-slate-500 text-black" required />
          {message ? (
            <p className="w-full p-3 bg-blue-600 rounded-md text-slate-200 text-center">{message}</p>
            ) : (
            <button type="submit" className="px-4 py-2 font-medium text-slate-200 bg-blue-700 rounded-lg hover:bg-blue-800 transition">
              Sign In
            </button>
          )}
          {/* <button onClick={handleSignOut} className = "w-full p-3 bg-blue-700 rounded-md hover:bg-blue-800 transition">Sign Out</button> */}
          
        </form>
      </div>
    </div>
  );
}