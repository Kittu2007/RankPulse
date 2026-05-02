"use client";

import Link from "next/link";

export default function AdminUsersPage() {
  const users = [
    { name: 'Kittu', email: 'kittu@example.com', plat: 'All', score: 78, analyses: 42, status: 'active', joined: 'Apr 1' },
    { name: 'Rohan K.', email: 'rohan@example.com', plat: 'Instagram', score: 72, analyses: 18, status: 'active', joined: 'Apr 10' },
    { name: 'Sanya M.', email: 'sanya@gmail.com', plat: 'LinkedIn', score: 65, analyses: 9, status: 'active', joined: 'Apr 10' },
    { name: 'Arjun P.', email: 'arjun@gmail.com', plat: 'X / Twitter', score: 80, analyses: 31, status: 'active', joined: 'Apr 9' },
    { name: 'Priya S.', email: 'priya@outlook.com', plat: 'Instagram', score: 58, analyses: 7, status: 'inactive', joined: 'Apr 9' },
    { name: 'Dev R.', email: 'dev@startup.io', plat: 'LinkedIn', score: 84, analyses: 55, status: 'active', joined: 'Apr 5' },
    { name: 'Meena J.', email: 'meena@gmail.com', plat: 'All', score: 71, analyses: 23, status: 'active', joined: 'Apr 3' },
    { name: 'Siddharth K.', email: 'sid@example.com', plat: 'X / Twitter', score: 63, analyses: 12, status: 'inactive', joined: 'Mar 29' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="p-[20px_24px] border-b-2 border-b-[var(--black)] bg-[#f5f2e8] flex justify-between items-center flex-wrap gap-4 z-0">
        <div>
          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--red)] mb-1">User Management</div>
          <div className="text-[32px] leading-none text-[var(--black)] uppercase" style={{ fontFamily: 'var(--font-d)' }}>All Users (1,247)</div>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <input className="input h-10 px-3 text-xs font-bold text-[var(--black)] border-2 border-[var(--black)] outline-none bg-white w-[220px]" placeholder="Search users..." />
          <select className="input h-10 px-3 text-xs font-bold text-[var(--black)] border-2 border-[var(--black)] outline-none bg-white cursor-pointer min-w-[120px]">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <button className="btn btn-outline h-10 px-4 font-bold text-xs uppercase bg-white">Export CSV</button>
        </div>
      </div>

      <div className="p-[24px]">
        <div className="border-2 border-[var(--black)] bg-white shadow-[4px_4px_0px_var(--black)] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[var(--black)] border-b-2 border-[var(--black)]">
                <th className="p-3 text-[10px] uppercase tracking-[2px] text-white">User</th>
                <th className="p-3 text-[10px] uppercase tracking-[2px] text-white">Platform</th>
                <th className="p-3 text-[10px] uppercase tracking-[2px] text-white">SEO Score</th>
                <th className="p-3 text-[10px] uppercase tracking-[2px] text-white">Analyses</th>
                <th className="p-3 text-[10px] uppercase tracking-[2px] text-white">Status</th>
                <th className="p-3 text-[10px] uppercase tracking-[2px] text-white">Joined</th>
                <th className="p-3 text-[10px] uppercase tracking-[2px] text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-b border-[#eaeaea] hover:bg-[#fafafa]">
                  <td className="p-4">
                    <div className="text-[13px] font-bold text-[var(--black)] mb-0.5">{u.name}</div>
                    <div className="text-[11px] font-bold text-[#888]">{u.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-[11px] font-bold text-[var(--black)] bg-[#f5f5f5] px-2 py-0.5 border border-[#eaeaea] uppercase tracking-wider">{u.plat}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[22px] leading-none tracking-[-1px] ${u.score >= 75 ? 'text-[#16a34a]' : u.score >= 60 ? 'text-[#f59e0b]' : 'text-[var(--red)]'}`} style={{ fontFamily: 'var(--font-d)' }}>
                      {u.score}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-[13px] font-bold text-[var(--black)]">{u.analyses}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[9px] font-bold tracking-wider uppercase px-[6px] py-[2px] border ${
                      u.status === 'active' ? 'bg-[#dcfce7] border-[#22c55e] text-[#166534]' : 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-[11px] font-bold text-[#666]">{u.joined}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="btn btn-outline btn-sm bg-white font-bold text-[10px] uppercase tracking-wide px-3">View</button>
                      <button className="btn btn-outline btn-sm bg-[#fafafa] font-bold text-[10px] uppercase tracking-wide px-3 text-[var(--red)] border-[#ffcaca] hover:bg-[#fff5f5]">Suspend</button>
                    </div>
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
