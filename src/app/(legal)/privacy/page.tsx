import type { Metadata } from "next";

const title = "Privacy Policy — Atlas";
const description = "How Atlas collects, uses, and protects your data.";

export const metadata: Metadata = { title, description };

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-zinc-300">
      <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
      <p className="text-sm text-zinc-500 mb-8">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="space-y-6 leading-relaxed text-sm">
        <Section title="1. Data We Collect">
          <p>When you use Atlas, we collect:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Account data</strong> — email and authentication credentials via Supabase Auth.</li>
            <li><strong>Reading data</strong> — articles you bookmark, highlight, and take notes on.</li>
            <li><strong>Usage data</strong> — page views, features used, and interaction patterns to improve the service.</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Data">
          <p>Your data is used solely to provide and improve the Atlas reading experience:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>To sync your bookmarks, highlights, and notes across devices.</li>
            <li>To generate personalized recommendations and digests.</li>
            <li>To send optional daily digests (if enabled).</li>
            <li>To diagnose issues and improve performance.</li>
          </ul>
        </Section>

        <Section title="3. Data Sharing">
          <p>We do <strong>not</strong> sell your personal data. We may share anonymized, aggregated data for analytics. Your reading data is stored on Supabase and is not shared with third parties except as required by law.</p>
        </Section>

        <Section title="4. Data Retention">
          <p>We retain your data for as long as your account is active. You may delete your account at any time, which will remove your bookmarks, highlights, and notes within 30 days.</p>
        </Section>

        <Section title="5. Your Rights">
          <p>Depending on your jurisdiction, you may have the right to access, correct, delete, or port your data. Contact <a href="mailto:support@oriz.in" className="text-blue-400 hover:underline">support@oriz.in</a> to exercise these rights.</p>
        </Section>

        <Section title="6. Cookies">
          <p>We use essential cookies for authentication and service operation. See our <a href="/cookies" className="text-blue-400 hover:underline">Cookie Policy</a> for details. No third-party tracking cookies are used.</p>
        </Section>

        <Section title="7. Contact">
          <p>For privacy-related inquiries: <a href="mailto:support@oriz.in" className="text-blue-400 hover:underline">support@oriz.in</a></p>
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
