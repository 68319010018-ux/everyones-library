
import React, { useState } from 'react';
import { Book, Member, Transaction, BookStatus } from '../types';
import { Icons } from '../constants';

interface Props {
  books: Book[];
  members: Member[];
  transactions: Transaction[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const LendingView: React.FC<Props> = ({ books, members, transactions, setBooks, setTransactions }) => {
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const handleBorrow = () => {
    if (!selectedBookId || !selectedMemberId) return;

    const book = books.find(b => b.id === selectedBookId);
    if (!book || book.status !== BookStatus.AVAILABLE) return;

    const newTransaction: Transaction = {
      id: `t${transactions.length + 1}`,
      bookId: selectedBookId,
      memberId: selectedMemberId,
      borrowDate: new Date().toLocaleDateString('th-TH'),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('th-TH'),
      status: 'active'
    };

    setTransactions([...transactions, newTransaction]);
    setBooks(books.map(b => b.id === selectedBookId ? { ...b, status: BookStatus.BORROWED } : b));
    setSelectedBookId('');
    setSelectedMemberId('');
  };

  const activeTransactions = transactions.filter(t => t.status === 'active');

  const handleReturn = (tx: Transaction) => {
    setTransactions(transactions.map(t => t.id === tx.id ? { ...t, status: 'completed', returnDate: new Date().toLocaleDateString('th-TH') } : t));
    setBooks(books.map(b => b.id === tx.bookId ? { ...b, status: BookStatus.AVAILABLE } : b));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-sky-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="p-2 bg-sky-100 text-sky-600 rounded-lg"><Icons.Swap /></span>
            ทำรายการยืม
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">เลือกหนังสือ</label>
              <select 
                value={selectedBookId} 
                onChange={e => setSelectedBookId(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm"
              >
                <option value="">-- เลือกหนังสือที่ต้องการยืม --</option>
                {books.filter(b => b.status === BookStatus.AVAILABLE).map(b => (
                  <option key={b.id} value={b.id}>{b.title} ({b.author})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">ผู้ที่ต้องการยืม</label>
              <select 
                value={selectedMemberId} 
                onChange={e => setSelectedMemberId(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm"
              >
                <option value="">-- เลือกสมาชิก --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div className="pt-4">
              <button 
                onClick={handleBorrow}
                disabled={!selectedBookId || !selectedMemberId}
                className="w-full py-3 bg-sky-600 text-white rounded-xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                ยืนยันการยืม
              </button>
            </div>
          </div>
        </div>

        <div className="bg-sky-600 p-6 rounded-2xl text-white">
           <p className="text-xs uppercase tracking-widest font-bold text-sky-200">ระเบียบห้องสมุด</p>
           <h4 className="font-bold text-lg mt-1 mb-2">กำหนดส่งคืน</h4>
           <p className="text-sm text-sky-50 leading-relaxed">สมาชิกสามารถยืมหนังสือได้ครั้งละไม่เกิน 14 วัน หากส่งคืนล่าช้าจะมีค่าปรับตามระเบียบของห้องสมุด</p>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-sky-50 bg-sky-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">รายการที่กำลังถูกยืม</h3>
            <span className="text-xs font-bold text-sky-600 bg-sky-100 px-2 py-1 rounded-full">ทั้งหมด {activeTransactions.length} รายการ</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-sky-50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">รายละเอียดหนังสือ</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">ผู้ยืม</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">กำหนดส่ง</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">คืนหนังสือ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50">
                {activeTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">ไม่มีรายการยืมที่ค้างอยู่</td>
                  </tr>
                ) : (
                  activeTransactions.map(tx => {
                    const book = books.find(b => b.id === tx.bookId);
                    const member = members.find(m => m.id === tx.memberId);
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-700">{book?.title}</p>
                          <p className="text-xs text-slate-400">ISBN: {book?.isbn}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm text-slate-600">{member?.name}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className={`text-sm font-semibold text-slate-500`}>
                             {tx.dueDate}
                           </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleReturn(tx)}
                            className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                          >
                            รับคืนแล้ว
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LendingView;
