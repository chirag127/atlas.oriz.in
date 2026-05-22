import type { Metadata } from "next";

const title = "Disclaimer — Atlas";
const description = "Disclaimers regarding Atlas and its content.";

export const metadata: Metadata = { title, description };

export default function DisclaimerPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-zinc-300">
      <h1 className="text-3xl font-bold text-white mb-8">Disclaimer</h1>

      <div className="space-y-6 leading-relaxed text-sm">
        <Section title="1. Content Accuracy">
          <p>Atlas aggregates content from third-party RSS feeds. We do not verify, endorse, or guarantee the accuracy of any content displayed. Article content belongs to their respective authors and publishers.</p>
        </Section>

        <Section title="2. No Professional Advice">
          <p>Any AI-generated summaries, insights, or recommendations provided by Atlas are for informational purposes only and should not be considered professional advice (financial, medical, legal, or otherwise).</p>
        </Section>

        <Section title="3. AI Limitations">
          <p>Atlas uses AI models to generate summaries, tags, and explanations. These outputs may contain errors, omissions, or inaccuracies. Always verify critical information against the original source.</p>
        </Section>

        <Section title="4. Third-Party Links">
          <p>Atlas links to external websites. We are not responsible for their content, privacy practices, or availability.</p>
        </Section>

        <Section title="5. Service Availability">
          <p>We strive for high availability but do not guarantee uninterrupted service. Atlas may be temporarily unavailable for maintenance or due to factors beyond our control.</p>
        </Section>

        <Section title="6. Contact">
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
