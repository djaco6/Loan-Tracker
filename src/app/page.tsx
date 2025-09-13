"use client"

import LoanForm from "./LoanForm";
import { supabase } from "../../lib/supabaseClient";
import { useState, useEffect } from "react";
import InterestRateBarChart from "../components/InterestRateBarChart";
import Auth from "../components/Auth";
import type { User } from '@supabase/supabase-js'; // Add this import


export default function Home() {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    };
    getUser();
  }, []);

  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [userMode, setUserMode] = useState<'admin' | 'customer'>('customer');

  // Fetch loans from Supabase
  const fetchLoans = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("loans").select("*");
    if (!error && data) setLoans(data);
    if (error) console.error(error);
    setLoading(false);
  };

  // Delete loan by id
  const handleDelete = async (id: number) => {
    setDeleting(true);
    const { error } = await supabase.from("loans").delete().eq("id", id);
    if (!error) {
      // Refresh the loans list
      fetchLoans();
    }
    setDeleting(false);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
  <>
    { user == null && (
    <div className="min-h-screen bg-blue-900 p-6 space-y-8">
      <Auth />
    </div>
    )
    }
    { user != null && (
    <div className="min-h-screen bg-blue-900 p-6 space-y-8">
      <div className = "absolute top-4 right-4 flex flex-col items-end z-10">
      {/* Sign out button */}
        <div className="flex items-center bg-blue-800 text-white px-4 py-2 rounded shadow mr-4">
          <span className="mr-3 font-semibold">{user?.email}</span>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
            onClick={async () => {
              await supabase.auth.signOut();
              setUser(null);
            }}
          >
            Sign Out
          </button>
        </div>
        {/* User mode dropdown */}
        <div className="flex justify-end mr-4">
          <label className="text-white mr-2 font-semibold">User Mode:</label>
          <select
            value={userMode}
            onChange={e => setUserMode(e.target.value as 'admin' | 'customer')}
            className="p-2 rounded bg-blue-800 text-white border border-blue-700"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      {/* Memphis Tigers Logo */}
      <div className="absolute top-6 left-6">
        <img
          src="../../../skylineFinal.png"
          alt="Skyline"
          className="h-20 w-40"
        />
      </div>

      {/* Overview Section */}
      <section className="bg-blue-800 text-white p-6 rounded shadow mt-20">
        <h1 className="text-3xl font-bold mb-4">Loan Overview</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-700 p-4 rounded">
              <h2 className="font-semibold">Total Loans</h2>
              <p className="text-xl">{loans.length}</p>
            </div>
            <div className="bg-blue-700 p-4 rounded">
              <h2 className="font-semibold">Active Loans</h2>
              <p className="text-xl">{loans.filter(l => l.status === "active").length}</p>
            </div>
            <div className="bg-blue-700 p-4 rounded">
              <h2 className="font-semibold">Paid Loans</h2>
              <p className="text-xl">{loans.filter(l => l.status === "paid").length}</p>
            </div>
          </div>
        )}
      </section>

      {/* Interest Rate Frequency Bar Chart */}
      <section>
        <InterestRateBarChart loans={loans} />
      </section>

      {/* Add Loan Form -- admin only*/}
      {userMode === 'admin' && (
      <section>
        <LoanForm />
      </section>
      )}

      {/* Optional: List all loans */}
      <section className="bg-blue-950 text-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">All Loans</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2">
            {loans.map((loan) => (
              <li key={loan.id} className="p-2 bg-blue-800 rounded flex items-center justify-between">
                <span>
                  {loan.name} - ${loan.amount} at {loan.interest}% ({loan.status})
                </span>
                {userMode === 'admin' && (
                  <button
                    onClick={() => handleDelete(loan.id)}
                    className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition disabled:opacity-50"
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
    )
    }
  </>
  );
}
