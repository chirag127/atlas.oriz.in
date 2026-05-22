import type { Metadata } from "next";

const title = "Cookie Policy — Atlas";
const description = "How Atlas uses cookies and similar technologies.";

export const metadata: Metadata = { title, description };

export default function CookiesPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-zinc-300">
      <h1 className="text-3xl font-bold text-white mb-8">Cookie Policy</h1>
      <p className="text-sm text-zinc-500 mb-8">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="space-y-6 leading-relaxed text-sm">
        <Section title="1. What Are Cookies">
          <p>Cookies are small text files stored on your device by your browser. They help services remember your preferences and authentication state.</p>
        </Section>

        <Section title="2. Cookies We Use">
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Essential cookies</strong> — Required for authentication (Supabase Auth session tokens). Without these, you cannot log in.</li>
            <li><strong>Preference cookies</strong> — Store your theme selection and reading preferences.</li>
            <li><strong>No tracking cookies</strong> — We do not use third-party analytics, advertising, or tracking cookies.</li>
          </ul>
        </Section>

        <Section title="3. Managing Cookies">
          <p>You can control cookies through your browser settings. Blocking essential cookies will prevent you from using Atlas.</p>
        </Section>

        <Section title="4. Changes">
          <p>We may update this policy. Check back periodically.</p>
        </Section>

        <Section title="5. Contact">
          <p><a href="mailto:support@oriz.in" className="text-blue-400 hover:underline">support@oriz.in</a></p>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      <div className="text-zinc-400 space-y-2">{children}</div>
    </section>
  );
}
