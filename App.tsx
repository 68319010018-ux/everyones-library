
import React, { useState, useEffect, useMemo } from 'react';
import { View, Book, Member, Transaction, BookStatus } from './types';
import { Icons } from './constants';
import DashboardView from './components/DashboardView';
import CatalogView from './components/CatalogView';
import MembersView from './components/MembersView';
import InventoryView from './components/InventoryView';
import LendingView from './components/LendingView';

const INITIAL_BOOKS: Book[] = [
  { id: '1', title: 'รักในรอยบาป', author: 'กิ่งฉัตร', isbn: '9786161812345', category: 'วรรณกรรมไทย', status: BookStatus.AVAILABLE, publishedYear: 2545, coverImage: 'https://picsum.photos/seed/thai1/400/600', description: 'เรื่องราวความรักและความแค้นที่ฝังรากลึกในจิตใจ' },
  { id: '2', title: '1984 (ฉบับภาษาไทย)', author: 'จอร์จ ออร์เวลล์', isbn: '9786165123456', category: 'ดิสโทเปีย', status: BookStatus.AVAILABLE, publishedYear: 2492, coverImage: 'https://picsum.photos/seed/1984/400/600', description: 'วรรณกรรมอมตะที่สะท้อนภาพการควบคุมของรัฐเผด็จการ' },
  { id: '3', title: 'ความสุขของกะทิ', author: 'งามพรรณ เวชชาชีวะ', isbn: '9789749697344', category: 'วรรณกรรมเยาวชน', status: BookStatus.BORROWED, publishedYear: 2546, coverImage: 'https://picsum.photos/seed/kati/400/600', description: 'เรื่องราวของเด็กหญิงกะทิที่เติบโตมาท่ามกลางความรักของตาและยาย' },
  { id: '4', title: 'เซเปียนส์: ประวัติย่อมนุษยชาติ', author: 'ยูวาล โนอาห์ แฮรารี', isbn: '9786163016560', category: 'วิชาการ', status: BookStatus.AVAILABLE, publishedYear: 2554, coverImage: 'https://picsum.photos/seed/sapiens/400/600', description: 'การเดินทางของมนุษยชาติจากลิงสู่ผู้ครองโลก' },
  { id: '5', title: 'เจ้าชายน้อย', author: 'อ็องตวน เดอ แซ็งเตกซูว์เปรี', isbn: '9786161833114', category: 'วรรณกรรมแปล', status: BookStatus.AVAILABLE, publishedYear: 2486, coverImage: 'https://picsum.photos/seed/prince/400/600', description: 'หนังสือที่จะพาคุณกลับไปเป็นเด็กอีกครั้ง' },
];

const INITIAL_MEMBERS: Member[] = [
  { id: 'm1', name: 'สมชาย รักเรียน', email: 'somchai@example.com', phone: '081-234-5678', joinDate: '2023-01-15', borrowedCount: 2, avatar: 'https://picsum.photos/seed/somchai/100/100' },
  { id: 'm2', name: 'สมศรี มีความรู้', email: 'somsri@example.com', phone: '082-345-6789', joinDate: '2023-03-20', borrowedCount: 0, avatar: 'https://picsum.photos/seed/somsri/100/100' },
  { id: 'm3', name: 'มานะ ขยันอ่าน', email: 'mana@example.com', phone: '083-456-7890', joinDate: '2023-05-10', borrowedCount: 1, avatar: 'https://picsum.photos/seed/mana/100/100' },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const viewNames: Record<View, string> = {
    dashboard: 'หน้าแรก',
    catalog: 'รายการหนังสือ',
    lending: 'ยืม-คืนหนังสือ',
    members: 'จัดการสมาชิก',
    inventory: 'จัดการคลังหนังสือ'
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView books={books} members={members} transactions={transactions} />;
      case 'catalog':
        return <CatalogView books={books} />;
      case 'members':
        return <MembersView members={members} setMembers={setMembers} />;
      case 'lending':
        return <LendingView books={books} members={members} transactions={transactions} setBooks={setBooks} setTransactions={setTransactions} />;
      case 'inventory':
        return <InventoryView books={books} setBooks={setBooks} />;
      default:
        return <DashboardView books={books} members={members} transactions={transactions} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'แผงควบคุม', icon: <Icons.Dashboard /> },
    { id: 'catalog', label: 'ค้นหาหนังสือ', icon: <Icons.Books /> },
    { id: 'lending', label: 'ยืม-คืน', icon: <Icons.Swap /> },
    { id: 'members', label: 'สมาชิก', icon: <Icons.Users /> },
    { id: 'inventory', label: 'คลังหนังสือ', icon: <Icons.Plus /> },
  ];

  return (
    <div className="flex h-screen bg-sky-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-sky-100 flex flex-col shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-sky-600 flex items-center gap-2">
            <span className="p-2 bg-sky-100 rounded-lg"><Icons.Books /></span>
            Lumina
          </h1>
          <p className="text-xs text-sky-400 mt-1 uppercase tracking-widest font-semibold">ระบบจัดการห้องสมุด</p>
        </div>

        <nav className="flex-1 mt-4 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeView === item.id 
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-200' 
                  : 'text-slate-500 hover:bg-sky-50 hover:text-sky-600'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-sky-50">
          <div className="flex items-center gap-3 bg-sky-50 p-3 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold">
              บรร
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">ผู้ดูแลระบบ</p>
              <p className="text-xs text-slate-400">บรรณารักษ์</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-sky-100 px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {viewNames[activeView]}
          </h2>
          <div className="flex items-center gap-4">
             <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                  <Icons.Search />
                </div>
                <input 
                  type="text" 
                  placeholder="ค้นหาข้อมูล..." 
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white w-64 transition-all"
                />
             </div>
             <button className="p-2 text-slate-400 hover:text-sky-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
             </button>
          </div>
        </header>

        <div className="p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
