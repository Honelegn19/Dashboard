import React from 'react';

type TipSection = {
  title: string;
  subtitle: string;
  tips: string[];
};

const sections: TipSection[] = [
  {
    title: '1) Upwork Profile Optimization',
    subtitle: 'Make your profile conversion-focused, not resume-focused.',
    tips: [
      'Use a niche headline: "I help SaaS founders write high-converting landing pages" beats "Content Writer".',
      'Open your overview with outcomes, metrics, and target clients in the first 2 lines.',
      'Build 3 specialized profiles for your top services with tailored keywords and proof.',
      'Add portfolio case studies with challenge → action → measurable result format.',
      'Use a professional, high-trust profile image and complete every profile section to 100%.',
    ],
  },
  {
    title: '2) Proposal Strategies That Get Replies',
    subtitle: 'Most freelancers lose jobs in the first 15 seconds of reading.',
    tips: [
      'Personalize line 1 by referencing the client\'s exact project goal.',
      'Lead with a mini-plan: what you would do in week 1, not your life story.',
      'Include one relevant sample only; quantity lowers clarity.',
      'Ask 1-2 strategic questions that show you understand risk and success criteria.',
      'Close with a soft CTA: offer a short call or a quick audit to reduce client friction.',
    ],
  },
  {
    title: '3) Client-Winning Hacks',
    subtitle: 'Speed + clarity + confidence wins more than low pricing.',
    tips: [
      'Apply early to quality posts and skip vague, low-budget listings.',
      'Use short Loom/video intros for premium projects to build instant trust.',
      'Create 3 pricing tiers (starter, growth, premium) so clients choose value, not just cost.',
      'Set clear scope, milestones, and communication cadence before work begins.',
      'Send proactive updates before clients ask; reliability is your unfair advantage.',
    ],
  },
  {
    title: '4) Improve Your Job Success Score (JSS)',
    subtitle: 'JSS rises when client experience is consistently excellent.',
    tips: [
      'Only accept projects you can overdeliver on; bad-fit projects are expensive.',
      'Set expectations in writing on timeline, revisions, and deliverables.',
      'Respond quickly, hit deadlines, and submit polished work with context notes.',
      'After successful delivery, ask satisfied clients for honest public feedback.',
      'End contracts strategically after wins to lock in positive outcomes.',
    ],
  },
  {
    title: '5) Freelance Income Growth System',
    subtitle: 'Treat freelancing like a pipeline, not a one-off gig hunt.',
    tips: [
      'Track weekly metrics: proposals sent, reply rate, calls booked, close rate, average project value.',
      'Raise rates every 3-5 successful projects and anchor pricing to business impact.',
      'Productize repeat services (e.g., "Profile Rewrite in 5 Days") to shorten sales cycles.',
      'Upsell existing clients with retainers, audits, and monthly optimization packages.',
      'Build social proof loops: testimonials, case studies, and before/after outcomes.',
    ],
  },
];

const plan = [
  'Week 1: Rewrite headline + overview + first 3 portfolio case studies.',
  'Week 2: Submit 20 highly targeted proposals using one winning template.',
  'Week 3: Improve delivery system, request testimonials, and optimize profile keywords.',
  'Week 4: Increase pricing, launch one productized offer, and review conversion metrics.',
];

const App: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fb', color: '#0f172a', fontFamily: 'Inter, system-ui, Arial, sans-serif' }}>
      <main style={{ maxWidth: 980, margin: '0 auto', padding: '40px 20px 64px' }}>
        <header style={{ marginBottom: 28 }}>
          <p style={{ color: '#2563eb', fontWeight: 700, letterSpacing: 0.4, marginBottom: 8 }}>Freelance & Upwork Growth Tips</p>
          <h1 style={{ fontSize: '2.2rem', margin: '0 0 10px', lineHeight: 1.1 }}>Upwork Profile Mastery</h1>
          <p style={{ fontSize: '1.03rem', color: '#334155', maxWidth: 760, lineHeight: 1.6 }}>
            A practical playbook to optimize your Upwork profile, write stronger proposals, win better clients, improve Job Success Score,
            and grow freelance income with a repeatable system.
          </p>
        </header>

        <section style={{ display: 'grid', gap: 16 }}>
          {sections.map((section) => (
            <article key={section.title} style={{ background: '#ffffff', border: '1px solid #dbe4f0', borderRadius: 14, padding: 18 }}>
              <h2 style={{ margin: '0 0 6px', fontSize: '1.22rem' }}>{section.title}</h2>
              <p style={{ margin: '0 0 12px', color: '#475569' }}>{section.subtitle}</p>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.65 }}>
                {section.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section style={{ marginTop: 18, background: '#0f172a', color: '#e2e8f0', borderRadius: 14, padding: 20 }}>
          <h2 style={{ margin: '0 0 8px', color: '#f8fafc' }}>30-Day Action Plan</h2>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            {plan.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default App;
