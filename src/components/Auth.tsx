
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : "Signed in!");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMessage("Signed out!");
  };

  return (
    <div>
      <form onSubmit={handleSignIn}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Sign In</button>
      </form>
      <button onClick={handleSignOut}>Sign Out</button>
      {message && <p>{message}</p>}
    </div>
  );
}