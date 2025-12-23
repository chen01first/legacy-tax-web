'use client'
import { useState } from 'react';
import { calculateDetailedTax, formatChineseUnits } from '../lib/tax-logic';

export default function Home() {
  const [tab, setTab] = useState<'ESTATE' | 'GIFT'>('ESTATE');
  const [year, setYear] = useState('115');
  const [data, setData] = useState({ 
    amount: 0, 
    children: 0, 
    parents: 0, 
    hasSpouse: false 
  });

  const res = calculateDetailedTax(tab, data);

  const handleInputChange = (key: string, value: string | boolean) => {
    let finalValue = value;
    if (typeof value === 'string') {
      finalValue = value === "" ? 0 : Number(value);
    }
    setData(prev => ({ ...prev, [key]: finalValue }));
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] p-4 md:p-12 text-black font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- 標題與導覽 --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="group">
            <h1 className="text-5xl font-black italic tracking-tighter border-l-8 border-black pl-4 group-hover:text-blue-600 transition-colors cursor-default">
              稅務設計師 <span className="text-blue-600 group-hover:text-black">{year}版</span>
            </h1>
            <p className="text-xs font-bold text-gray-400 mt-2 ml-6 tracking-[0.2em]">專業級遺贈稅試算系統</p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex bg-black p-1.5 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
              <button 
                onClick={() => setTab('ESTATE')} 
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'ESTATE' ? 'bg-white text-black' : 'text-white hover:text-blue-400'}`}
              >
                遺產稅試算
              </button>
              <button 
                onClick={() => setTab('GIFT')} 
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'GIFT' ? 'bg-white text-black' : 'text-white hover:text-blue-400'}`}
              >
                贈與稅試算
              </button>
            </div>
            <select 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
              className="bg-yellow-400 border-2 border-black font-black py-1 px-3 rounded-lg text-xs cursor-pointer"
            >
              <option value="115">民國 115 年度法規</option>
              <option value="114">民國 114 年度法規</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* --- 左側：輸入面板 --- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border-4 border-black p-8 rounded-[40px] shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">輸入金額項目 / 新台幣</label>
              <div className="relative">
                <span className="absolute left-0 top-1 text-2xl font-black text-gray-300">NT$</span>
                <input 
                  type="number" 
                  className="w-full text-5xl font-black bg-transparent border-b-4 border-gray-100 focus:border-blue-600 outline-none transition-all mb-4 pl-12" 
                  placeholder="0" 
                  value={data.amount || ""}
                  onChange={(e) => handleInputChange('amount', e.target.value)} 
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100">
                <span className="text-xs font-bold text-blue-400 block mb-1">大額單位對照表</span>
                <div className="text-blue-600 font-black text-xl leading-relaxed">
                   {formatChineseUnits(data.amount)}
                </div>
              </div>

              {tab === 'ESTATE' && (
                <div className="mt-10 space-y-6 border-t-2 border-gray-100 pt-8 animate-in slide-in-from-left duration-500">
                  <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-black rounded-2xl hover:bg-yellow-50 transition-colors cursor-pointer">
                    <label htmlFor="spouse-check" className="font-black text-lg cursor-pointer">有配偶 (扣 553 萬)</label>
                    <input 
                      id="spouse-check"
                      type="checkbox" 
                      checked={data.hasSpouse}
                      className="w-8 h-8 accent-black cursor-pointer" 
                      onChange={(e) => handleInputChange('hasSpouse', e.target.checked)} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 border-2 border-black rounded-2xl">
                      <span className="text-[10px] font-black text-gray-400 block mb-2 uppercase tracking-tighter">卑親屬子女數 (人)</span>
                      <input 
                        type="number" 
                        value={data.children || ""}
                        className="w-full bg-transparent text-2xl font-black outline-none" 
                        onChange={(e) => handleInputChange('children', e.target.value)} 
                      />
                    </div>
                    <div className="p-4 border-2 border-black rounded-2xl">
                      <span className="text-[10px] font-black text-gray-400 block mb-2 uppercase tracking-tighter">父母人數 (人)</span>
                      <input 
                        type="number" 
                        value={data.parents || ""}
                        className="w-full bg-transparent text-2xl font-black outline-none" 
                        onChange={(e) => handleInputChange('parents', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --- 右側：結果與過程 --- */}
          <div className="lg:col-span-7 space-y-8">
            {/* 稅額總結卡 */}
            <div className="bg-blue-600 text-white p-10 rounded-[40px] shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-black uppercase tracking-widest opacity-70">預計應納稅額總計</span>
                  <div className="flex gap-2">
                     <span className="bg-black text-white px-4 py-1 rounded-full font-black text-[10px]">年度: {year}</span>
                     <span className="bg-white text-blue-600 px-4 py-1 rounded-full font-black text-[10px]">稅率級距: {res.rate}</span>
                  </div>
                </div>
                <div className="text-6xl md:text-7xl font-black mb-4 tracking-tighter">
                  ${(res.tax || 0).toLocaleString()}
                </div>
                <div className="text-xl text-blue-100 font-bold bg-blue-700/50 inline-block px-4 py-1 rounded-lg">
                  {formatChineseUnits(res.tax)}
                </div>
              </div>
              <div className="absolute -right-6 -bottom-10 text-[180px] font-black opacity-10 pointer-events-none tracking-tighter group-hover:scale-110 transition-transform duration-700">
                {res.rate}
              </div>
            </div>

            {/* 計算細節報表 */}
            <div className="bg-white border-4 border-black rounded-[40px] overflow-hidden shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
              <div className="p-6 bg-black text-white flex justify-between items-center">
                <span className="font-black uppercase tracking-widest text-xs">計算過程明細摘要</span>
                <span className="text-[10px] font-mono opacity-50">試算編號 #{year}TAX-SEC-01</span>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-gray-400 font-black text-xs uppercase underline decoration-blue-500 decoration-4 underline-offset-8">扣除項目明細</span>
                  <span className="text-gray-400 font-black text-xs uppercase">金額 (新台幣)</span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xl">
                    <span className="font-black">資產總計 (A)</span>
                    <span className="font-black">${(data.amount || 0).toLocaleString()}</span>
                  </div>
                  
                  <div className="space-y-4 py-6 border-y-4 border-black border-dotted">
                    <DetailRow label={`${tab === 'ESTATE' ? '遺產' : '贈與'}免稅額`} val={res.details.EXEMPTION} />
                    {tab === 'ESTATE' && (
                      <>
                        <DetailRow label={`配偶扣除額`} val={res.details.SPOUSE} />
                        <DetailRow label={`直系卑親屬總計 (${data.children}人)`} val={res.details.CHILDREN} />
                        <DetailRow label={`父母扣除總計 (${data.parents}人)`} val={res.details.PARENTS} />
                        <DetailRow label="喪葬費標準扣除" val={res.details.FUNERAL} />
                      </>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-black text-2xl uppercase tracking-tighter">課稅淨額 (B)</span>
                    <span className="text-4xl font-black text-blue-600">${(res.net || 0).toLocaleString()}</span>
                  </div>
                  <div className="text-right text-sm text-gray-400 font-bold italic">{formatChineseUnits(res.net)}</div>

                  <div className="mt-8 p-6 bg-slate-900 rounded-3xl text-white">
                    <div className="text-[10px] font-black text-gray-500 uppercase mb-2">應納稅額計算公式</div>
                    <div className="flex flex-col md:flex-row justify-between gap-2">
                      <span className="font-mono text-green-400 text-lg font-bold">
                        (淨額 B × {res.rate}) {res.tax > 0 && res.net > (tab === 'ESTATE' ? 56210000 : 28110000) ? "- 累進差額" : ""}
                      </span>
                      <span className="text-xs text-gray-400 self-end">依據 114/115 年度最新級距</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <footer className="mt-16 text-center border-t-2 border-gray-100 pt-10">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] mb-4">
            台灣稅務實驗室 © 2025 著作權所有
          </p>
          <div className="inline-flex gap-4">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
        </footer>
      </div>
    </main>
  );
}

function DetailRow({ label, val }: { label: string, val: number }) {
  if (val === 0) return null;
  return (
    <div className="flex justify-between items-center animate-in fade-in slide-in-from-right duration-300">
      <span className="font-bold text-gray-500 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        {label}
      </span>
      <span className="font-black text-red-500 italic text-lg">- ${(val || 0).toLocaleString()}</span>
    </div>
  );
}