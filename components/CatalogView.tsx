
import React, { useState } from 'react';
import { Book, BookStatus } from '../types';
import { Icons } from '../constants';
import { getBookInsights } from '../services/geminiService';

interface Props {
  books: Book[];
}

const CatalogView: React.FC<Props> = ({ books }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const categories = ['ทั้งหมด', ...Array.from(new Set(books.map(b => b.category)))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesCategory = selectedCategory === 'ทั้งหมด' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookClick = async (book: Book) => {
    setSelectedBook(book);
    setAiInsight(null);
    setIsAiLoading(true);
    // Note: the service prompt has been updated to request Thai response
    const insight = await getBookInsights(book);
    setAiInsight(insight);
    setIsAiLoading(false);
  };

  const statusMap: Record<BookStatus, string> = {
    [BookStatus.AVAILABLE]: 'ว่าง',
    [BookStatus.BORROWED]: 'ถูกยืม',
    [BookStatus.MAINTENANCE]: 'ปรับปรุง'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-sky-100">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat ? 'bg-sky-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-sky-50 hover:text-sky-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
           <div className="absolute inset-y-0 left-3 flex items-center text-slate-400">
             <Icons.Search />
           </div>
           <input 
            type="text"
            placeholder="ค้นหาชื่อหนังสือ, ผู้เขียน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-sky-500 transition-all text-sm outline-none"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filteredBooks.map(book => (
          <div 
            key={book.id} 
            onClick={() => handleBookClick(book)}
            className="bg-white group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden border border-sky-50"
          >
            <div className="aspect-[2/3] relative overflow-hidden">
              <img src={book.coverImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                  book.status === BookStatus.AVAILABLE ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {statusMap[book.status]}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <button className="w-full py-2 bg-white text-sky-600 rounded-xl font-bold text-xs">ดูรายละเอียด</button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold text-sky-600 mb-1">{book.category}</p>
              <h4 className="font-bold text-slate-800 line-clamp-1">{book.title}</h4>
              <p className="text-xs text-slate-500 mb-2">{book.author}</p>
              <p className="text-[10px] text-slate-400">ISBN: {book.isbn}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
            <div className="flex flex-col md:flex-row p-8 gap-8">
              <div className="w-full md:w-1/3">
                <img src={selectedBook.coverImage} className="w-full rounded-2xl shadow-lg border-4 border-white" />
              </div>
              <div className="flex-1 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800 leading-tight">{selectedBook.title}</h2>
                    <p className="text-lg text-sky-600 font-medium">{selectedBook.author}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedBook(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div className="flex gap-4">
                  <div className="px-3 py-1 bg-sky-50 text-sky-600 rounded-lg text-sm font-semibold">{selectedBook.category}</div>
                  <div className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-sm font-semibold">พ.ศ. {selectedBook.publishedYear}</div>
                </div>

                <div className="p-4 bg-sky-50 rounded-2xl relative overflow-hidden group">
                  <div className="flex items-center gap-2 mb-2 text-sky-600 font-bold text-sm">
                    <Icons.Sparkles />
                    บทวิเคราะห์โดย AI บรรณารักษ์
                  </div>
                  {isAiLoading ? (
                    <div className="space-y-2 animate-pulse">
                      <div className="h-4 bg-sky-100 rounded w-3/4"></div>
                      <div className="h-4 bg-sky-100 rounded w-full"></div>
                      <div className="h-4 bg-sky-100 rounded w-5/6"></div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 leading-relaxed">{aiInsight}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800">เรื่องย่อ</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{selectedBook.description}</p>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button className="flex-1 py-3 bg-sky-600 text-white rounded-xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-700 transition-colors">
                    ขอยืมหนังสือเล่มนี้
                  </button>
                  <button className="px-6 py-3 border border-sky-200 text-sky-600 rounded-xl font-bold hover:bg-sky-50 transition-colors">
                    เก็บไว้ในรายการโปรด
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogView;
