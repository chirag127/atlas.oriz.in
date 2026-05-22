"use client";

import { User, Mail, Calendar } from "lucide-react";

interface ProfileSectionProps {
  email: string;
  name?: string;
  createdAt?: string;
}

export function ProfileSection({ email, name, createdAt }: ProfileSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-900 border border-zinc-800">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
          <User className="w-6 h-6 text-blue-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{name ?? "Reader"}</p>
          <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
            <Mail className="w-3 h-3" />
            {email}
          </div>
        </div>
      </div>

      {createdAt && (
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Calendar className="w-3 h-3" />
          Member since {new Date(createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
        </div>
      )}
    </div>
  );
}
