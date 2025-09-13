"use client"

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface LoanFormProps {
  loan?: {
    id: number;
    name: string;
    amount: number;
    interest: number;
    status: string;
  };
}

export default function LoanForm({ loan }: LoanFormProps) {
  const [name, setName] = useState(loan?.name || "");
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState(loan?.interest || "");
  const [status, setStatus] = useState(loan?.status || "active");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = amount === "" ? null : Number(amount);
    const numericInterest = interest === "" ? null : Number(interest);
    if (numericAmount === null || isNaN(numericAmount) || numericAmount < 0) {
      setMessage("Please enter a valid non-negative amount.");
      return;
    }
    if (numericInterest === null || isNaN(numericInterest) || numericInterest < 0) {
      setMessage("Please enter a valid non-negative interest rate.");
      return;
    }
    const values = { name, amount, interest, status };

    let res;
    if (loan?.id) {
      res = await supabase.from("loans").update(values).eq("id", loan.id);
    } else {
      res = await supabase.from("loans").insert(values);
    }

    if (res.error) {
      setMessage(`Error: ${res.error.message}`);
    } else {
      setMessage("Success!");
      setName("");
      setAmount("");
      setInterest("");
      setStatus("active");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-md mx-auto bg-gray-900 text-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">{loan ? "Edit Loan" : "Add Loan"}</h2>

      <label className="block mb-3">
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full p-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </label>

      <label className="block mb-3">
        Amount:
        <div className="relative mt-1 w-full">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">$</span>
          <input
            type="number"
            value={amount}
            placeholder = "0.00"
            onChange={(e) => setAmount(e.target.value)}
            className="pl-7 p-2 rounded border border-gray-700 bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </label>

      <label className="block mb-3">
        Interest (%):
        <div className="relative mt-1 w-full">
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="pr-7 p-2 rounded border border-gray-700 bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </label>

      <label className="block mb-4">
        Status:
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 w-full p-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="active">Active</option>
          <option value="paid">Paid</option>
          <option value="defaulted">Defaulted</option>
        </select>
      </label>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
      >
        {loan ? "Update Loan" : "Add Loan"}
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
}
