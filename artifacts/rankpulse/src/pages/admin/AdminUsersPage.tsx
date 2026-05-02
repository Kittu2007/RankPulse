export default function AdminUsersPage() {
  const users = [
    { name: 'Kittu', email: 'kittu@example.com', plat: 'All', score: 78, analyses: 42, status: 'active', joined: 'Apr 1' },
    { name: 'Rohan K.', email: 'rohan@example.com', plat: 'Instagram', score: 72, analyses: 18, status: 'active', joined: 'Apr 10' },
    { name: 'Sanya M.', email: 'sanya@gmail.com', plat: 'LinkedIn', score: 65, analyses: 9, status: 'active', joined: 'Apr 10' },
    { name: 'Arjun P.', email: 'arjun@gmail.com', plat: 'X / Twitter', score: 80, analyses: 31, status: 'active', joined: 'Apr 9' },
    { name: 'Priya S.', email: 'priya@outlook.com', plat: 'Instagram', score: 58, analyses: 7, status: 'inactive', joined: 'Apr 9' },
    { name: 'Dev R.', email: 'dev@startup.io', plat: 'LinkedIn', score: 84, analyses: 55, status: 'active', joined: 'Apr 5' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-[20px_24px] border-b-2 border-b-[var(--black)] bg-[#f5f2e8] flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--red)] mb-1">User Management</div>
          <div className="text-[32px] leading-none text-[var(--black)] uppercase" style={{ fontFamily: 'var(--font-d)' }}>All Users (1,247)</div>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <input className="input h-10 px-3 text-xs font-bold w-[220px]" placeholder="Search users..." />
          <select className="input h-10 px-3 text-xs font-bold cursor-pointer min-w-[120px]">
            <option>All Status</option><option>Active</option><option>Inactive</option>
          </select>
          <button className="btn btn-outline h-10 px-4 font-bold text-xs uppercase bg-white">Export CSV</button>
        </div>
      </div>
      <div className="p-[24px]">
        <div className="border-2 border-[var(--black)] bg-white shadow-[4px_4px_0px_var(--black)] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[var(--black)]">
                {['User', 'Platform', 'SEO Score', 'Analyses', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="p-3 text-[10px] uppercase tracking-[2px] text-white">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-b border-[#eaeaea] hover:bg-[#fafafa]">
                  <td className="p-4"><div className="text-[13px] font-bold mb-0.5">{u.name}</div><div className="text-[11px] text-[#888]">{u.email}</div></td>
                  <td className="p-4"><span className="text-[11px] font-bold bg-[#f5f5f5] px-2 py-0.5 border border-[#eaeaea] uppercase tracking-wider">{u.plat}</span></td>
                  <td className="p-4"><span className="text-[24px] font-black" style={{ fontFamily: 'var(--font-d)', color: u.score >= 70 ? 'var(--black)' : 'var(--red)' }}>{u.score}</span></td>
                  <td className="p-4 font-bold text-sm">{u.analyses}</td>
                  <td className="p-4"><span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 border ${u.status === 'active' ? 'bg-[#dcfce7] border-[#22c55e] text-[#166534]' : 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]'}`}>{u.status}</span></td>
                  <td className="p-4 text-xs text-[#888] font-bold">{u.joined}</td>
                  <td className="p-4"><button className="btn btn-outline btn-sm text-xs">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
