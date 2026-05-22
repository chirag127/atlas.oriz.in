"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Supabase auth would go here
      window.location.href = "/feed";
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Supabase Google OAuth would go here
    window.location.href = "/feed";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-atlas-bg-primary">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-atlas-accent-emerald mb-2">Atlas</h1>
          <p className="text-sm text-atlas-text-secondary">Your personal intelligence feed</p>
        </div>

        <div className="bg-atlas-bg-secondary border border-atlas-border rounded-xl p-6">
          <Button
            variant="secondary"
            className="w-full mb-4"
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-atlas-border" />
            <span className="text-xs text-atlas-text-muted">or</span>
            <div className="flex-1 h-px bg-atlas-border" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-3">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-xs text-atlas-text-muted text-center mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-atlas-accent-sky hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-xs text-atlas-text-muted text-center mt-4">
          Atlas works without an account —{" "}
          <Link href="/feed" className="text-atlas-accent-emerald hover:underline">
            continue as guest
          </Link>
        </p>
      </div>
    </div>
  );
}
