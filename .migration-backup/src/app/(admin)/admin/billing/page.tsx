"use client";

export default function AdminBillingPage() {
  const plans = [
    { name: 'Starter', price: '$0', desc: 'Baseline SEO scoring and 1 competitor slot.', users: '842 Active', color: 'border-[var(--black)]', btn: 'Current Plan' },
    { name: 'Pro SEO', price: '$29', desc: 'Real-time AI briefs, 5 competitors, bulk analysis.', users: '315 Active', color: 'border-[#16a34a]', btn: 'Edit Plan' },
    { name: 'Agency', price: '$99', desc: 'Unlimited accounts, API access, white-label PDF.', users: '90 Active', color: 'border-[var(--red)]', btn: 'Edit Plan' },
  ];

  const history = [
    { id: 'INV-2026-004', date: 'Apr 01, 2026', amount: '$29.00', plan: 'Pro SEO', status: 'Paid' },
    { id: 'INV-2026-003', date: 'Mar 01, 2026', amount: '$29.00', plan: 'Pro SEO', status: 'Paid' },
    { id: 'INV-2026-002', date: 'Feb 01, 2026', amount: '$29.00', plan: 'Pro SEO', status: 'Paid' },
    { id: 'INV-2026-001', date: 'Jan 01, 2026', amount: '$0.00', plan: 'Starter', status: 'Free' },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-10">
      {/* Header */}
      <div className="p-[20px_24px] border-b-2 border-b-[var(--black)] bg-[#f5f2e8] flex justify-between items-center flex-wrap gap-4 z-0">
        <div>
          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--red)] mb-1">Financial Overview</div>
          <div className="text-[32px] leading-none text-[var(--black)] uppercase" style={{ fontFamily: 'var(--font-d)' }}>Subscription & Billing</div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm font-bold text-[10px] uppercase bg-white">Download Statements</button>
          <button className="btn btn-red btn-sm font-bold text-[10px] uppercase bg-white">+ Create Offer/Coupon</button>
        </div>
      </div>

      <div className="p-[24px]">
        <div className="text-[11px] font-bold text-[var(--red)] uppercase tracking-[2px] mb-4">Available Tiers</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((p, i) => (
            <div key={i} className={`border-2 ${p.color} bg-white shadow-[4px_4px_0px_var(--black)] flex flex-col p-[24px]`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[16px] leading-none uppercase font-bold text-[var(--black)]" style={{ fontFamily: 'var(--font-d)' }}>{p.name}</span>
                <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 border text-[#888] bg-[#f5f5f5]">{p.users}</span>
              </div>
              <div className="text-[48px] leading-none tracking-[-2px] mb-4 text-[var(--black)]" style={{ fontFamily: 'var(--font-d)' }}>
                {p.price}<span className="text-[14px] text-[#888] tracking-normal mb-1">/mo</span>
              </div>
              <div className="text-[12px] font-bold text-[#555] mb-6 flex-1">
                {p.desc}
              </div>
              <button className={`btn w-full justify-center font-bold text-[10px] uppercase tracking-wide h-10 ${i === 0 ? 'btn-outline bg-white' : 'btn-black bg-[var(--black)] text-white'}`}>
                {p.btn}
              </button>
            </div>
          ))}
        </div>

        <div className="text-[11px] font-bold text-[var(--red)] uppercase tracking-[2px] mb-4">Recent Invoices (Platform Stub)</div>
        <div className="border-2 border-[var(--black)] bg-white shadow-[4px_4px_0px_var(--black)] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[var(--black)] border-b-2 border-[var(--black)]">
                <th className="p-3 px-4 text-[10px] uppercase tracking-[2px] text-white">Invoice ID</th>
                <th className="p-3 px-4 text-[10px] uppercase tracking-[2px] text-white">Date</th>
                <th className="p-3 px-4 text-[10px] uppercase tracking-[2px] text-white">Plan</th>
                <th className="p-3 px-4 text-[10px] uppercase tracking-[2px] text-white">Amount</th>
                <th className="p-3 px-4 text-[10px] uppercase tracking-[2px] text-white">Status</th>
                <th className="p-3 px-4 text-[10px] uppercase tracking-[2px] text-white text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-b border-[#eaeaea] hover:bg-[#fafafa]">
                  <td className="p-4 text-[12px] font-bold text-[var(--black)] uppercase">{h.id}</td>
                  <td className="p-4 text-[12px] font-bold text-[#555]">{h.date}</td>
                  <td className="p-4 text-[12px] font-bold text-[var(--black)]"><span className="bg-[#f5f5f5] px-2 py-0.5 border border-[#eaeaea] uppercase tracking-wider text-[10px]">{h.plan}</span></td>
                  <td className="p-4 text-[14px] font-bold text-[var(--black)]" style={{ fontFamily: 'var(--font-d)' }}>{h.amount}</td>
                  <td className="p-4">
                    <span className={`text-[9px] font-bold tracking-wider uppercase px-[6px] py-[2px] border ${
                      h.status === 'Paid' ? 'bg-[#dcfce7] border-[#22c55e] text-[#166534]' : 'bg-[#f5f5f5] border-[#ccc] text-[#555]'
                    }`}>
                      {h.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-[10px] uppercase font-bold text-[var(--red)] hover:underline tracking-wide">Download PDF</button>
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
