"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      window.location.href = "/onboarding";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-atlas-bg-primary">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-atlas-accent-emerald mb-2">Atlas</h1>
          <p className="text-sm text-atlas-text-secondary">Create your account</p>
        </div>

        <div className="bg-atlas-bg-secondary border border-atlas-border rounded-xl p-6">
          <form onSubmit={handleSignup} className="space-y-3">
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
              minLength={8}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-xs text-atlas-text-muted text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-atlas-accent-sky hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
