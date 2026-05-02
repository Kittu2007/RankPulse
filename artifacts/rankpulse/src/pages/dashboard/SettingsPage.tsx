export default function SettingsPage() {
  return (
    <div className="page-transition">
      <div className="page-header">
        <div className="page-kicker">Account</div>
        <div className="d4">SETTINGS</div>
      </div>
      <div className="section-wrap">
        <div className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1">
          <div className="card">
            <div className="flex items-center gap-2.5 mb-4"><div className="sh-accent" /><span className="sh-title">Profile</span></div>
            <div className="mb-4">
              <label className="block text-[10px] font-bold tracking-[2px] uppercase mb-1.5">Display Name</label>
              <input type="text" placeholder="Your name" className="rp-input" />
            </div>
            <div className="mb-4">
              <label className="block text-[10px] font-bold tracking-[2px] uppercase mb-1.5">Email</label>
              <input type="email" placeholder="you@example.com" className="rp-input" disabled />
            </div>
            <button className="btn btn-black btn-sm">Save Changes</button>
          </div>
          <div className="card">
            <div className="flex items-center gap-2.5 mb-4"><div className="sh-accent" /><span className="sh-title">Connected Platforms</span></div>
            <div className="flex flex-col gap-3">
              {[
                { name: "Instagram", tag: "tag-ig" },
                { name: "LinkedIn", tag: "tag-li" },
                { name: "X / Twitter", tag: "tag-x" },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between p-3 border-2 border-[var(--black)] bg-[var(--bg)]">
                  <div className="flex items-center gap-3">
                    <span className={`platform-tag ${p.tag}`}>{p.name}</span>
                    <span className="text-xs text-[#888]">Not connected</span>
                  </div>
                  <button className="btn btn-outline btn-sm">Connect</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
