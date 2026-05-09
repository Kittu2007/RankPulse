import { Link } from "wouter";

export default function AboutPage() {
  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="border-2 border-[var(--black)] bg-white shadow-[12px_12px_0_var(--black)] p-10 md:p-20 text-center mb-16">
          <div className="inline-block bg-[var(--red)] px-3 py-1 mb-6">
            <span className="text-sm font-bold tracking-[3px] text-white uppercase">Our Mission</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase mb-8" style={{ fontFamily: "var(--font-d)" }}>
            About RankPulse
          </h1>
          <p className="text-xl font-bold text-[#555] max-w-2xl mx-auto leading-relaxed">
            Built for creators who want to win the algorithm without guessing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="border-2 border-[var(--black)] bg-white p-8 shadow-[6px_6px_0_var(--black)]">
            <div className="w-12 h-12 bg-[#eff6ff] border-2 border-[#3b82f6] flex items-center justify-center mb-6">
              <span className="text-xl font-black text-[#1d4ed8]">1</span>
            </div>
            <h3 className="text-2xl font-black uppercase mb-4" style={{ fontFamily: "var(--font-d)" }}>Data-Driven</h3>
            <p className="font-bold text-[#555]">We rely on actual signals and metrics from the platforms, not guesswork or outdated advice.</p>
          </div>
          <div className="border-2 border-[var(--black)] bg-white p-8 shadow-[6px_6px_0_var(--black)]">
            <div className="w-12 h-12 bg-[#fdf4ff] border-2 border-[#d946ef] flex items-center justify-center mb-6">
              <span className="text-xl font-black text-[#a21caf]">2</span>
            </div>
            <h3 className="text-2xl font-black uppercase mb-4" style={{ fontFamily: "var(--font-d)" }}>Creator-First</h3>
            <p className="font-bold text-[#555]">Designed specifically for solo creators and small teams who need enterprise-level tools without the complexity.</p>
          </div>
          <div className="border-2 border-[var(--black)] bg-[var(--black)] text-white p-8 shadow-[6px_6px_0_var(--red)]">
            <div className="w-12 h-12 bg-[#fef2f2] border-2 border-[#ef4444] flex items-center justify-center mb-6">
              <span className="text-xl font-black text-[var(--red)]">3</span>
            </div>
            <h3 className="text-2xl font-black uppercase mb-4 text-[var(--red)]" style={{ fontFamily: "var(--font-d)" }}>No Bullshit</h3>
            <p className="font-bold text-[#ccc]">Straightforward insights. Clear action items. We don't sugarcoat what it takes to grow.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
