
import React, { useState, useEffect } from 'react';
import { Member } from '../types';
import { Icons } from '../constants';

interface Props {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}

const MembersView: React.FC<Props> = ({ members, setMembers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', avatar: '' });

  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name,
        email: editingMember.email,
        phone: editingMember.phone,
        avatar: editingMember.avatar
      });
      setIsModalOpen(true);
    }
  }, [editingMember]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAvatar = formData.avatar || `https://picsum.photos/seed/${formData.email || Date.now()}/100/100`;
    
    if (editingMember) {
      setMembers(members.map(m => m.id === editingMember.id ? { ...editingMember, ...formData, avatar: finalAvatar } : m));
    } else {
      const id = `m${members.length + 1}`;
      const member: Member = {
        ...formData,
        id,
        joinDate: new Date().toLocaleDateString('th-TH'),
        borrowedCount: 0,
        avatar: finalAvatar
      };
      setMembers([...members, member]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setFormData({ name: '', email: '', phone: '', avatar: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">รายชื่อสมาชิกห้องสมุด</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-md shadow-sky-100"
        >
          <Icons.Plus />
          เพิ่มสมาชิกใหม่
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-sky-50 border-b border-sky-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-sky-600 uppercase tracking-wider">สมาชิก</th>
              <th className="px-6 py-4 text-xs font-bold text-sky-600 uppercase tracking-wider">ข้อมูลติดต่อ</th>
              <th className="px-6 py-4 text-xs font-bold text-sky-600 uppercase tracking-wider">วันที่เข้าร่วม</th>
              <th className="px-6 py-4 text-xs font-bold text-sky-600 uppercase tracking-wider">จำนวนที่ยืม</th>
              <th className="px-6 py-4 text-xs font-bold text-sky-600 uppercase tracking-wider text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-50">
            {members.map(member => (
              <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={member.avatar} className="w-10 h-10 rounded-full border border-sky-100 object-cover shadow-sm" />
                    <div>
                      <p className="font-bold text-slate-700">{member.name}</p>
                      <p className="text-xs text-slate-400">รหัสสมาชิก: {member.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600 font-medium">{member.email}</p>
                  <p className="text-xs text-slate-400">{member.phone}</p>
                </td>
                <td className="px-6 py-4">
                   <p className="text-sm text-slate-500">{member.joinDate}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-bold">
                    {member.borrowedCount} เล่ม
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => setEditingMember(member)}
                      className="text-sky-600 hover:text-sky-800 font-bold text-xs"
                    >
                      แก้ไข
                    </button>
                    <button 
                      onClick={() => setMembers(members.filter(m => m.id !== member.id))}
                      className="text-rose-500 hover:text-rose-700 font-bold text-xs"
                    >
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-8 animate-in scale-95 duration-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">{editingMember ? 'แก้ไขข้อมูลสมาชิก' : 'ลงทะเบียนสมาชิก'}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><Icons.Plus className="rotate-45" /></button>
             </div>
             
             <div className="flex justify-center mb-6">
               <div className="relative group">
                 <img 
                   src={formData.avatar || 'https://via.placeholder.com/100'} 
                   className="w-24 h-24 rounded-full object-cover border-4 border-sky-50 shadow-md"
                   alt="Avatar"
                 />
                 <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 </div>
               </div>
             </div>

             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">URL รูปโปรไฟล์</label>
                   <input 
                    type="text" 
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm" 
                    value={formData.avatar}
                    onChange={e => setFormData({...formData, avatar: e.target.value})}
                  />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">ชื่อ-นามสกุล</label>
                   <input 
                    required 
                    type="text" 
                    placeholder="ระบุชื่อจริงและนามสกุล"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">อีเมล</label>
                   <input 
                    required 
                    type="email" 
                    placeholder="example@mail.com"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                   <input 
                    required 
                    type="tel" 
                    placeholder="08x-xxx-xxxx"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={closeModal} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">ยกเลิก</button>
                  <button type="submit" className="flex-1 py-3 bg-sky-600 text-white rounded-xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-700 transition-colors">
                    {editingMember ? 'บันทึกการแก้ไข' : 'ลงทะเบียน'}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersView;
