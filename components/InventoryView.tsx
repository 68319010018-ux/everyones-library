
import React, { useState, useEffect } from 'react';
import { Book, BookStatus } from '../types';
import { Icons } from '../constants';
import { suggestCategory, generateBookCover } from '../services/geminiService';

interface Props {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

const InventoryView: React.FC<Props> = ({ books, setBooks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publishedYear: 2567,
    description: '',
    coverImage: ''
  });

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        isbn: editingBook.isbn,
        category: editingBook.category,
        publishedYear: editingBook.publishedYear,
        description: editingBook.description,
        coverImage: editingBook.coverImage
      });
      setIsModalOpen(true);
    }
  }, [editingBook]);

  const handleSuggestCategory = async () => {
    if (!formData.title || !formData.author) return;
    setIsLoadingCategory(true);
    const suggestion = await suggestCategory(formData.title, formData.author);
    setFormData(prev => ({ ...prev, category: suggestion }));
    setIsLoadingCategory(false);
  };

  const handleGenerateCover = async () => {
    if (!formData.title) return;
    setIsGeneratingImage(true);
    const imageUrl = await generateBookCover(formData.title, formData.category || "General");
    if (imageUrl) {
      setFormData(prev => ({ ...prev, coverImage: imageUrl }));
    }
    setIsGeneratingImage(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      coverImage: formData.coverImage || `https://picsum.photos/seed/${formData.isbn || Date.now()}/400/600`
    };

    if (editingBook) {
      setBooks(books.map(b => b.id === editingBook.id ? { ...editingBook, ...finalData } : b));
    } else {
      const id = (books.length + 1).toString();
      const newBook: Book = {
        ...finalData,
        id,
        status: BookStatus.AVAILABLE,
      };
      setBooks([newBook, ...books]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
    setFormData({
      title: '', author: '', isbn: '', category: '', publishedYear: 2567, description: '', coverImage: ''
    });
  };

  const statusMap: Record<BookStatus, string> = {
    [BookStatus.AVAILABLE]: 'ว่าง',
    [BookStatus.BORROWED]: 'ถูกยืม',
    [BookStatus.MAINTENANCE]: 'ปรับปรุง'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">จัดการคลังหนังสือ</h3>
          <p className="text-sm text-slate-500">เพิ่ม ลบ หรือแก้ไขข้อมูลหนังสือและรูปภาพในระบบ</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-lg shadow-sky-100"
        >
          <Icons.Plus />
          เพิ่มรายการหนังสือใหม่
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">ชื่อหนังสือ</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">ISBN</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">หมวดหมู่</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">สถานะ</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">ดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-50">
            {books.map(book => (
              <tr key={book.id} className="hover:bg-sky-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={book.coverImage} className="w-10 h-14 rounded object-cover shadow-sm border border-slate-100" />
                    <div>
                      <p className="text-sm font-bold text-slate-700">{book.title}</p>
                      <p className="text-xs text-slate-400">{book.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 font-mono">{book.isbn}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">{book.category}</span>
                </td>
                <td className="px-6 py-4 text-center">
                   <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                     book.status === BookStatus.AVAILABLE ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                   }`}>
                     {statusMap[book.status]}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setEditingBook(book)}
                      className="p-2 text-slate-300 hover:text-sky-600 transition-colors"
                      title="แก้ไขข้อมูลและรูปภาพ"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => setBooks(books.filter(b => b.id !== book.id))}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                      title="ลบ"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
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
           <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl p-8 animate-in zoom-in-95 duration-200 flex flex-col md:flex-row gap-8 overflow-y-auto max-h-[90vh] no-scrollbar">
              
              {/* Image Preview & Editor Side */}
              <div className="w-full md:w-1/3 space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 relative group">
                  {formData.coverImage ? (
                    <img src={formData.coverImage} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                      <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <p className="text-xs">ยังไม่มีรูปหน้าปก</p>
                    </div>
                  )}
                  {isGeneratingImage && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                       <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                       <p className="text-[10px] font-bold text-sky-600">AI กำลังสร้างภาพ...</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase">URL รูปภาพ</label>
                  <input 
                    type="text" 
                    placeholder="https://..." 
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" 
                    value={formData.coverImage} 
                    onChange={e => setFormData({...formData, coverImage: e.target.value})} 
                  />
                  <button 
                    type="button"
                    onClick={handleGenerateCover}
                    disabled={!formData.title || isGeneratingImage}
                    className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icons.Sparkles className="w-3 h-3" />
                    สร้างหน้าปกด้วย AI
                  </button>
                  <p className="text-[10px] text-slate-400 text-center italic">แนะนำ: ระบุชื่อเรื่องก่อนกดสร้างภาพ</p>
                </div>
              </div>

              {/* Form Side */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">{editingBook ? 'แก้ไขข้อมูลหนังสือ' : 'นำเข้าหนังสือสู่ระบบ'}</h3>
                  <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><Icons.Plus className="rotate-45" /></button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">ชื่อหนังสือ</label>
                            <input required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">ผู้แต่ง</label>
                            <input required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                        </div>
                      </div>
                  </div>

                  <div className="md:col-span-2 flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-slate-700 mb-1">หมวดหมู่</label>
                        <input required type="text" placeholder="เช่น วรรณกรรม, วิทยาศาสตร์" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                      </div>
                      <button 
                        type="button"
                        onClick={handleSuggestCategory}
                        disabled={!formData.title || !formData.author || isLoadingCategory}
                        className="px-4 py-2 bg-sky-50 text-sky-600 rounded-xl border border-sky-100 font-bold hover:bg-sky-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {isLoadingCategory ? 'กำลังคิด...' : <><Icons.Sparkles className="w-4 h-4" /> AI จัดหมวด</>}
                      </button>
                  </div>

                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">ISBN</label>
                      <input required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">ปีที่พิมพ์ (พ.ศ.)</label>
                      <input required type="number" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" value={formData.publishedYear} onChange={e => setFormData({...formData, publishedYear: parseInt(e.target.value)})} />
                  </div>

                  <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-1">เรื่องย่อ/คำอธิบาย</label>
                      <textarea rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none resize-none text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>

                  <div className="md:col-span-2 flex gap-4 pt-4">
                    <button type="button" onClick={closeModal} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">ยกเลิก</button>
                    <button type="submit" className="flex-1 py-3 bg-sky-600 text-white rounded-xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-700 transition-colors">
                      {editingBook ? 'บันทึกการแก้ไข' : 'บันทึกเข้าคลัง'}
                    </button>
                  </div>
                </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
