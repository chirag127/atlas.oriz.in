import type { Metadata } from "next";

const title = "Terms of Service — Atlas";
const description = "Terms governing your use of Atlas.";

export const metadata: Metadata = { title, description };

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-zinc-300">
      <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
      <p className="text-sm text-zinc-500 mb-8">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="space-y-6 leading-relaxed text-sm">
        <Section title="1. Acceptance">
          <p>By using Atlas, you agree to these terms. If you do not agree, do not use the service.</p>
        </Section>

        <Section title="2. Service Description">
          <p>Atlas is a personal reading assistant that helps you discover, bookmark, highlight, and take notes on articles from RSS feeds and web sources.</p>
        </Section>

        <Section title="3. User Accounts">
          <p>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information when creating an account.</p>
        </Section>

        <Section title="4. Acceptable Use">
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Use the service for any unlawful purpose.</li>
            <li>Attempt to access, scrape, or disrupt the service beyond normal use.</li>
            <li>Upload malicious content or abuse the API.</li>
          </ul>
        </Section>

        <Section title="5. Intellectual Property">
          <p>Atlas itself is open source. Content accessed through feeds belongs to their respective owners. You retain rights to your own notes and highlights.</p>
        </Section>

        <Section title="6. Limitation of Liability">
          <p>Atlas is provided &ldquo;as is&rdquo; without warranty. We are not liable for any damages arising from your use of the service.</p>
        </Section>

        <Section title="7. Changes">
          <p>We may update these terms. Continued use after changes constitutes acceptance. We will notify users of material changes via email.</p>
        </Section>

        <Section title="8. Contact">
          <p>Questions? <a href="mailto:support@oriz.in" className="text-blue-400 hover:underline">support@oriz.in</a></p>
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
