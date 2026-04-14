"use client";

export default function AdminFlagsPage() {
  const flags = [
    { name: 'ai_rewrite_enabled', desc: 'AI-powered caption rewrite in Content Analyser', enabled: true, users: 'all' },
    { name: 'competitor_tracking', desc: 'Competitor analysis feature in Competitors page', enabled: true, users: 'all' },
    { name: 'post_scheduler', desc: 'Calendar-based post scheduler with SEO pre-check', enabled: true, users: 'all' },
    { name: 'ai_studio', desc: 'Daily AI content ideas generation (5/day)', enabled: true, users: 'all' },
    { name: 'profile_audit_linkedin', desc: 'LinkedIn profile audit (beta — accuracy improving)', enabled: false, users: 'none' },
    { name: 'hashtag_ban_checker', desc: 'Real-time banned hashtag detection API', enabled: true, users: 'all' },
    { name: 'bulk_analyzer', desc: 'Upload CSV of captions for bulk SEO scoring', enabled: false, users: 'none' },
  ];

  const activeCount = flags.filter(f => f.enabled).length;
  const disabledCount = flags.filter(f => !f.enabled).length;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="p-[20px_24px] border-b-2 border-b-[var(--black)] bg-[#f5f2e8] flex justify-between items-center flex-wrap gap-4 z-0">
        <div>
          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--red)] mb-1">Feature Control</div>
          <div className="text-[32px] leading-none text-[var(--black)] uppercase" style={{ fontFamily: 'var(--font-d)' }}>Feature Flags</div>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border border-[#22c55e] bg-[#dcfce7] text-[#166534]">
            {activeCount} Active
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border border-[#f59e0b] bg-[#fef3c7] text-[#92400e]">
            {disabledCount} Disabled
          </span>
        </div>
      </div>

      <div className="p-[24px]">
        <div className="border-2 border-[var(--black)] bg-white shadow-[4px_4px_0px_var(--black)] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[var(--black)] border-b-2 border-[var(--black)]">
                <th className="p-3 px-4 text-[10px] uppercase tracking-[2px] text-white">Flag Name</th>
                <th className="p-3 px-4 text-[10px] uppercase tracking-[2px] text-white">Description</th>
                <th className="p-3 px-4 text-[10px] uppercase tracking-[2px] text-white">Users</th>
                <th className="p-3 px-4 text-[10px] uppercase tracking-[2px] text-white">Status</th>
                <th className="p-3 px-4 text-[10px] uppercase tracking-[2px] text-white">Toggle</th>
              </tr>
            </thead>
            <tbody>
              {flags.map((f, i) => (
                <tr key={i} className="border-b border-[#eaeaea] hover:bg-[#fafafa]">
                  <td className="p-4">
                    <code className="text-[11px] font-mono bg-[#f5f5f5] px-2 py-1 border border-[#ddd] text-[var(--black)] font-bold">
                      {f.name}
                    </code>
                  </td>
                  <td className="p-4 text-[12px] font-bold text-[#555]">{f.desc}</td>
                  <td className="p-4 text-[12px] font-bold text-[#555] uppercase tracking-wider">{f.users}</td>
                  <td className="p-4">
                    <span className={`text-[9px] font-bold tracking-wider uppercase px-[6px] py-[2px] border ${
                      f.enabled ? 'bg-[#dcfce7] border-[#22c55e] text-[#166534]' : 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]'
                    }`}>
                      {f.enabled ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </td>
                  <td className="p-4">
                    {f.enabled ? (
                      <button className="btn btn-outline btn-sm bg-[#fafafa] font-bold text-[10px] uppercase tracking-wide px-4 text-[var(--red)] border-[#ffcaca] hover:bg-[#fff5f5]">
                        Disable
                      </button>
                    ) : (
                      <button className="btn btn-outline btn-sm bg-white font-bold text-[10px] uppercase tracking-wide px-4">
                        Enable
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
