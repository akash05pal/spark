"use client";
import { useEffect, useState } from "react";

export default function ReturnsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/returns")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const downloadCSV = () => {
    window.open("/api/returns/csv", "_blank");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Returns Data</h1>
      <div className="mb-4 flex gap-2">
        <button onClick={downloadCSV} className="btn btn-primary">Download CSV</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr>
                {data[0] && Object.keys(data[0]).map((key) => (
                  <th key={key} className="border px-2 py-1">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="border px-2 py-1">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 