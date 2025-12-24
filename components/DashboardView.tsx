
import React from 'react';
import { Book, Member, Transaction } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Props {
  books: Book[];
  members: Member[];
  transactions: Transaction[];
}

const DashboardView: React.FC<Props> = ({ books, members, transactions }) => {
  const stats = [
    { label: 'หนังสือทั้งหมด', value: books.length, trend: '+12% เดือนนี้', color: 'bg-blue-500' },
    { label: 'สมาชิกทั้งหมด', value: members.length, trend: '+5% เดือนนี้', color: 'bg-sky-500' },
    { label: 'กำลังถูกยืม', value: books.filter(b => b.status === 'Borrowed').length, trend: '-2% เดือนนี้', color: 'bg-indigo-500' },
    { label: 'ผู้เข้าชมวันนี้', value: 24, trend: '+18% เดือนนี้', color: 'bg-cyan-500' },
  ];

  const chartData = [
    { name: 'ม.ค.', count: 40 },
    { name: 'ก.พ.', count: 30 },
    { name: 'มี.ค.', count: 65 },
    { name: 'เม.ย.', count: 45 },
    { name: 'พ.ค.', count: 90 },
    { name: 'มิ.ย.', count: 75 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-sky-100 group hover:border-sky-300 transition-all cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <span className="text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-sky-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">สถิติการยืมหนังสือ</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  labelFormatter={(name) => `เดือน: ${name}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#0ea5e9', strokeWidth: 2 }}
                />
                <Area type="monotone" name="จำนวนการยืม" dataKey="count" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">หนังสือมาใหม่</h3>
          <div className="space-y-4">
            {books.slice(0, 4).map((book) => (
              <div key={book.id} className="flex items-center gap-4 p-2 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer group">
                <img src={book.coverImage} className="w-12 h-16 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 truncate">{book.title}</p>
                  <p className="text-xs text-slate-400 truncate">{book.author}</p>
                  <span className="text-[10px] mt-1 inline-block px-1.5 py-0.5 bg-sky-100 text-sky-600 rounded font-medium">{book.category}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors">
            ดูรายการทั้งหมด
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
