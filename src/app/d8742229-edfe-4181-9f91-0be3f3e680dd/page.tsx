"use client";
import React, { useState } from "react";

export default function AdminDashboard() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMigrate = async () => {
    setMigrating(true);
    setMigrationResult(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/migrate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Migration failed");
      setMigrationResult("Migration successful!");
    } catch (err: any) {
      setError(err.message);
      setMigrationResult("Migration failed.");
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Admin SQL Dashboard</h1>
      <button
        onClick={handleMigrate}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 disabled:opacity-50"
        disabled={migrating}
      >
        {migrating ? "Running Migration..." : "Run Migration Script"}
      </button>
      {migrationResult && (
        <div className="mb-2 text-blue-700">{migrationResult}</div>
      )}
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          className="w-full border rounded p-2 mb-2 font-mono"
          rows={6}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter raw SQL query..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading || !query.trim()}
        >
          {loading ? "Running..." : "Run SQL"}
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">Error: {error}</div>}
      {result && (
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
