import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import React from "react";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Loan = {
  interest: number;
  // add other fields if needed
};

function getInterestRateFrequencies(loans: Loan[]) {
  const ranges = [
    { label: "0-2%", min: 0, max: 2 },
    { label: "2-4%", min: 2, max: 4 },
    { label: "4-6%", min: 4, max: 6 },
    { label: "6-8%", min: 6, max: 8 },
    { label: "8%+", min: 8, max: Infinity },
  ];
  const frequencies = ranges.map(r =>
    loans.filter(l => l.interest >= r.min && l.interest < r.max).length
  );
  return {
    labels: ranges.map(r => r.label),
    datasets: [
      {
        label: "Loan Count",
        data: frequencies,
        backgroundColor: "rgba(30, 64, 175, 0.8)",
      },
    ],
  };
}

export default function InterestRateBarChart({ loans }: { loans: Loan[] }) {
  return (
    <section className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">Interest Rate Distribution</h2>
      <Bar
        data={getInterestRateFrequencies(loans)}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: false },
          },
          scales: {
            x: { title: { display: true, text: "Interest Rate Range" } },
            y: { title: { display: true, text: "Number of Loans" }, beginAtZero: true },
          },
        }}
      />
    </section>
  );
}