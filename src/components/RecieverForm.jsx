// import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
// import {
//   UserPlus, Globe, Landmark, Wallet, Lock, ChevronDown, ArrowRight,
//   Coins, RefreshCw, Banknote, Printer, Plus, AlertCircle,
//   CheckCircle2, MinusCircle, PlusCircle, X
// } from 'lucide-react';

// // ─── Constants ────────────────────────────────────────────────────────────────
// const PRIMARY = '#30e87a';

// const CURRENCIES = [
//   { code: 'USD', name: 'US Dollar',        symbol: '$',  rateToUsd: 1     },
//   { code: 'EUR', name: 'Euro',             symbol: '€',  rateToUsd: 0.92  },
//   { code: 'GBP', name: 'British Pound',    symbol: '£',  rateToUsd: 0.79  },
//   { code: 'MXN', name: 'Mexican Peso',     symbol: '$',  rateToUsd: 17.10 },
//   { code: 'PHP', name: 'Philippine Peso',  symbol: '₱',  rateToUsd: 56.20 },
//   { code: 'INR', name: 'Indian Rupee',     symbol: '₹',  rateToUsd: 83.30 },
//   { code: 'CAD', name: 'Canadian Dollar',  symbol: '$',  rateToUsd: 1.35  },
//   { code: 'AUD', name: 'Australian Dollar',symbol: '$',  rateToUsd: 1.52  },
// ];

// const COUNTRY_CASH_INFO = {
//   Spain:       { currency:'EUR', symbol:'€', flag:'🇪🇸', notes:[500,200,100,50,20,10,5],       coins:[2,1,0.50,0.20,0.10,0.05,0.02,0.01], pickupNote:'Available at partner banks & Correos branches'       },
//   Mexico:      { currency:'MXN', symbol:'$', flag:'🇲🇽', notes:[1000,500,200,100,50,20],        coins:[10,5,2,1,0.50],                     pickupNote:'Available at OXXO, Elektra & partner branches'      },
//   Philippines: { currency:'PHP', symbol:'₱', flag:'🇵🇭', notes:[1000,500,200,100,50,20],        coins:[10,5,1,0.25],                       pickupNote:'Available at LBC, Palawan Pawnshop & SM outlets'    },
//   India:       { currency:'INR', symbol:'₹', flag:'🇮🇳', notes:[2000,500,200,100,50,20,10],     coins:[10,5,2,1],                          pickupNote:'Available at partner bank branches & India Post'    },
//   Germany:     { currency:'EUR', symbol:'€', flag:'🇩🇪', notes:[500,200,100,50,20,10,5],       coins:[2,1,0.50,0.20,0.10,0.05,0.02,0.01], pickupNote:'Available at Deutsche Post & partner outlets'       },
// };

// const inputBase = "w-full rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white h-14 px-5 text-base font-bold focus:outline-none placeholder:text-gray-400 transition-all";

// function buildRows(amount, notes) {
//   const breakdown = [];
//   let rem = Math.floor(amount);
//   for (const n of notes) {
//     const count = Math.floor(rem / n);
//     breakdown.push({ id: n, denom: n, count: count > 0 ? count : 0 });
//     if (count > 0) rem -= count * n;
//   }
//   return breakdown;
// }

// // ─── Unified Cash Denomination Panel ─────────────────────────────────────────
// const CashDenominationPanel = ({ country, receivedAmount, senderCurrency }) => {
//   const info = COUNTRY_CASH_INFO[country];
//   if (!info) return null;

//   // Tab: 'guide' = static banknote/coin reference, 'counter' = editable teller tool
//   const [tab, setTab] = useState('guide');
//   const [rows, setRows] = useState(() => buildRows(receivedAmount, info.notes));
//   const [customDenom, setCustomDenom] = useState('');
//   const [showCustom, setShowCustom] = useState(false);
//   const prevKey = useRef(`${country}:${receivedAmount}`);

//   // Reset rows whenever country or amount changes
//   useEffect(() => {
//     const key = `${country}:${receivedAmount}`;
//     if (prevKey.current !== key) {
//       prevKey.current = key;
//       setRows(buildRows(receivedAmount, info.notes));
//     }
//   }, [country, receivedAmount, info.notes]);

//   const totalDispensed = useMemo(() => rows.reduce((s, r) => s + r.denom * r.count, 0), [rows]);
//   const difference = totalDispensed - (receivedAmount || 0);
//   const isBalanced = Math.abs(difference) < 0.01;
//   const isOver = difference > 0.01;

//   const updateCount = useCallback((id, val) => {
//     setRows(p => p.map(r => r.id === id ? { ...r, count: Math.max(0, parseInt(val) || 0) } : r));
//   }, []);
//   const step = useCallback((id, delta) => {
//     setRows(p => p.map(r => r.id === id ? { ...r, count: Math.max(0, r.count + delta) } : r));
//   }, []);
//   const removeRow = useCallback((id) => setRows(p => p.filter(r => r.id !== id)), []);
//   const reset = () => setRows(buildRows(receivedAmount, info.notes));

//   const activeDenomSet = new Set(rows.map(r => r.denom));
//   const allDenoms = [...info.notes, ...info.coins];
//   const addablePresets = allDenoms.filter(d => !activeDenomSet.has(d));

//   const addPreset = (d) => setRows(p => [...p, { id: d, denom: d, count: 0 }]);
//   const addCustom = () => {
//     const v = parseFloat(customDenom);
//     if (!v || v <= 0) return;
//     setRows(p => [...p, { id: Date.now(), denom: v, count: 0 }]);
//     setCustomDenom(''); setShowCustom(false);
//   };

//   const handlePrint = () => {
//     const w = window.open('', '_blank');
//     const now = new Date().toLocaleString();
//     const activeRows = rows.filter(r => r.count > 0);
//     const rowsHtml = activeRows.map(r => `
//       <tr>
//         <td>${info.symbol}${r.denom < 1 ? r.denom.toFixed(2) : r.denom.toLocaleString()}</td>
//         <td style="text-align:center">${r.count}</td>
//         <td style="text-align:right;font-weight:700">${info.symbol}${(r.denom*r.count).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
//       </tr>`).join('');
//     w.document.write(`<!DOCTYPE html><html><head><title>Cash Disbursement</title>
//     <style>
//       body{font-family:sans-serif;padding:32px;color:#111;font-size:14px}
//       h1{font-size:18px;font-weight:900;margin-bottom:2px}
//       .sub{font-size:11px;color:#6b7280;margin-bottom:20px}
//       table{width:100%;border-collapse:collapse;margin-top:16px}
//       th{background:#f3f4f6;padding:8px 14px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;font-weight:900}
//       td{padding:9px 14px;border-bottom:1px solid #f3f4f6}
//       .total td{font-weight:900;font-size:15px;background:#f9fafb;border-top:2px solid #e5e7eb}
//       .status{margin-top:14px;padding:10px 14px;border-radius:8px;font-size:12px;font-weight:700}
//       .ok{background:#dcfce7;color:#15803d} .warn{background:#fef9c3;color:#92400e}
//       .sig{margin-top:28px;font-size:11px;color:#9ca3af}
//     </style></head><body>
//     <h1>Counter Cash Disbursement — ${info.currency}</h1>
//     <div class="sub">Agent Payout &nbsp;·&nbsp; ${info.flag} ${country} &nbsp;·&nbsp; ${now}</div>
//     <table>
//       <thead><tr><th>Denomination</th><th style="text-align:center">Count</th><th style="text-align:right">Subtotal</th></tr></thead>
//       <tbody>${rowsHtml}</tbody>
//       <tr class="total"><td>Total Dispensed</td><td></td><td style="text-align:right">${info.symbol}${totalDispensed.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} ${info.currency}</td></tr>
//     </table>
//     <div class="status ${isBalanced?'ok':'warn'}">
//       Expected: ${info.symbol}${(receivedAmount||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} &nbsp;|&nbsp;
//       Dispensed: ${info.symbol}${totalDispensed.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} &nbsp;|&nbsp;
//       ${isBalanced ? '✓ Balanced' : `${isOver?'Over':'Short'} by ${info.symbol}${Math.abs(difference).toFixed(2)}`}
//     </div>
//     <p class="sig">Teller: _________________________ &nbsp;&nbsp;&nbsp; Date: _____________</p>
//     <script>window.print();window.close();</script>
//     </body></html>`);
//     w.document.close();
//   };

//   return (
//     <div
//       style={{ borderColor: `${PRIMARY}33` }}
//       className="rounded-2xl border overflow-hidden animate-in slide-in-from-top-2 duration-300"
//     >
//       {/* ── Panel Header ── */}
//       <div
//         style={{ background: `${PRIMARY}0d` }}
//         className="px-6 pt-5 pb-0"
//       >
//         <div className="flex items-center justify-between flex-wrap gap-3 pb-4">
//           <div className="flex items-center gap-3">
//             <span className="text-2xl leading-none">{info.flag}</span>
//             <div>
//               <div style={{ color: PRIMARY }} className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
//                 <Banknote size={13} strokeWidth={3} /> Cash Denomination Guide
//               </div>
//               <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{info.pickupNote}</p>
//             </div>
//           </div>

//           {/* Live amount badge */}
//           {receivedAmount > 0 && (
//             <div
//               style={{ borderColor: `${PRIMARY}55`, color: PRIMARY }}
//               className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black bg-white dark:bg-gray-800"
//             >
//               <RefreshCw size={10} strokeWidth={3} />
//               {info.symbol}{receivedAmount.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} {info.currency}
//               <span className="opacity-50">· from {senderCurrency}</span>
//             </div>
//           )}
//         </div>

//         {/* ── Tab bar ── */}
//         <div className="flex gap-1">
//           {[
//             { key: 'guide',   label: 'Denomination Guide' },
//             { key: 'counter', label: 'Counter Cash Out'   },
//           ].map(({ key, label }) => {
//             const active = tab === key;
//             return (
//               <button
//                 key={key}
//                 type="button"
//                 onClick={() => setTab(key)}
//                 style={active ? { color: PRIMARY, borderColor: PRIMARY, borderBottomColor: 'transparent' } : { color: '#9ca3af', borderColor: 'transparent' }}
//                 className="px-5 py-2.5 text-xs font-black uppercase tracking-widest border-t border-l border-r rounded-t-xl transition-all bg-white dark:bg-gray-900"
//               >
//                 {label}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* ── TAB: Denomination Guide ── */}
//       {tab === 'guide' && (
//         <div className="p-6 bg-white dark:bg-gray-900 flex flex-col gap-5">
//           {/* Banknotes */}
//           <div className="flex flex-col gap-2.5">
//             <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Banknotes</div>
//             <div className="flex flex-wrap gap-2">
//               {info.notes.map(note => (
//                 <div key={note} style={{ borderColor: `${PRIMARY}44` }}
//                   className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg border shadow-sm">
//                   <span style={{ color: PRIMARY }} className="text-xs font-black">{info.symbol}</span>
//                   <span className="text-gray-900 dark:text-white font-black text-sm">{note.toLocaleString()}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Coins */}
//           <div className="flex flex-col gap-2.5">
//             <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Coins</div>
//             <div className="flex flex-wrap gap-2">
//               {info.coins.map(coin => (
//                 <div key={coin} style={{ background: `${PRIMARY}1a`, borderColor: `${PRIMARY}33` }}
//                   className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border">
//                   <span style={{ color: PRIMARY }} className="text-[10px] font-black">{info.symbol}</span>
//                   <span className="text-gray-700 dark:text-gray-200 font-black text-xs">{coin < 1 ? coin.toFixed(2) : coin}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Auto suggested breakdown */}
//           {receivedAmount > 0 && (() => {
//             const bd = buildRows(receivedAmount, info.notes).filter(r => r.count > 0);
//             return bd.length > 0 ? (
//               <div className="flex flex-col gap-3">
//                 <div style={{ background: `${PRIMARY}22` }} className="h-px w-full" />
//                 <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex flex-wrap items-center gap-2">
//                   <RefreshCw size={11} strokeWidth={3} style={{ color: PRIMARY }} />
//                   Suggested Breakdown
//                   <span className="normal-case tracking-normal font-bold text-gray-400">
//                     for {info.symbol}{Math.floor(receivedAmount).toLocaleString()} {info.currency}
//                   </span>
//                 </div>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                   {bd.map(({ denom, count }) => (
//                     <div key={denom} style={{ borderColor: `${PRIMARY}44` }}
//                       className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border">
//                       <div className="flex items-center gap-1">
//                         <span style={{ color: PRIMARY }} className="text-xs font-black">{info.symbol}</span>
//                         <span className="text-gray-900 dark:text-white font-black text-sm">{denom.toLocaleString()}</span>
//                       </div>
//                       <div className="flex items-center gap-1.5">
//                         <span className="text-gray-400 text-xs">×</span>
//                         <span style={{ color: PRIMARY }} className="text-lg font-black">{count}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <p className="text-[10px] text-gray-400 font-bold">
//                   * Switch to <span style={{ color: PRIMARY }}>Counter Cash Out</span> tab to edit and print.
//                 </p>
//               </div>
//             ) : null;
//           })()}
//         </div>
//       )}

//       {/* ── TAB: Counter Cash Out ── */}
//       {tab === 'counter' && (
//         <div className="bg-white dark:bg-gray-900 flex flex-col">

//           {/* Status + action bar */}
//           <div className="flex items-center justify-between flex-wrap gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
//             {/* Expected / Dispensed / Diff */}
//             <div className="flex items-center gap-4 flex-wrap">
//               {[
//                 { label: 'Expected',  val: receivedAmount || 0,   col: '#6b7280'                                             },
//                 { label: 'Dispensed', val: totalDispensed,        col: PRIMARY                                               },
//                 { label: isBalanced ? 'Balanced' : isOver ? 'Overage' : 'Shortfall',
//                   val: Math.abs(difference), col: isBalanced ? PRIMARY : isOver ? '#d97706' : '#dc2626',
//                   prefix: isBalanced ? '' : isOver ? '+' : '-' },
//               ].map(({ label, val, col, prefix = '' }) => (
//                 <div key={label} className="flex flex-col">
//                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
//                   <span style={{ color: col }} className="text-base font-black leading-tight">
//                     {prefix}{info.symbol}{val.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
//                   </span>
//                 </div>
//               ))}
//               {/* Status pill */}
//               <div style={
//                 isBalanced
//                   ? { background:`${PRIMARY}18`, borderColor:`${PRIMARY}55`, color: PRIMARY }
//                   : isOver
//                     ? { background:'#fef3c722', borderColor:'#fcd34d88', color:'#92400e' }
//                     : { background:'#fee2e222', borderColor:'#fca5a588', color:'#b91c1c' }
//               } className="flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-black">
//                 {isBalanced ? <CheckCircle2 size={11} strokeWidth={3}/> : <AlertCircle size={11} strokeWidth={3}/>}
//                 {isBalanced ? 'Balanced' : isOver ? `Over ${info.symbol}${Math.abs(difference).toFixed(2)}` : `Short ${info.symbol}${Math.abs(difference).toFixed(2)}`}
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex items-center gap-2">
//               <button onClick={reset} type="button"
//                 className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-black text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
//                 <RefreshCw size={11} strokeWidth={2.5} /> Reset
//               </button>
//               {/* <button onClick={handlePrint} type="button"
//                 style={{ background: PRIMARY, color: '#111' }}
//                 className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black hover:opacity-90 transition-opacity">
//                 <Printer size={12} strokeWidth={2.5} /> Print
//               </button> */}
//             </div>
//           </div>

//           {/* Column headers */}
//           <div className="grid grid-cols-12 gap-2 px-6 py-2.5 bg-gray-50 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800">
//             <div className="col-span-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Note / Coin</div>
//             <div className="col-span-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Count</div>
//             <div className="col-span-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Subtotal</div>
//             <div className="col-span-1" />
//           </div>

//           {/* Denomination rows */}
//           <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
//             {rows.length === 0 && (
//               <div className="px-6 py-8 text-center text-gray-400 text-sm font-bold">
//                 No denominations. Add from presets below.
//               </div>
//             )}
//             {rows.map(row => {
//               const subtotal = row.denom * row.count;
//               const active = row.count > 0;
//               return (
//                 <div key={row.id}
//                   style={active ? { background: `${PRIMARY}07` } : {}}
//                   className="grid grid-cols-12 gap-2 items-center px-6 py-2.5 transition-colors group"
//                 >
//                   {/* Denomination badge */}
//                   <div className="col-span-3">
//                     <div style={active
//                       ? { background:`${PRIMARY}18`, borderColor:`${PRIMARY}55`, color: PRIMARY }
//                       : { borderColor:'#e5e7eb', color:'#374151' }}
//                       className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-black transition-all dark:border-gray-700 dark:text-gray-200"
//                     >
//                       <span className="text-[10px] opacity-50">{info.symbol}</span>
//                       {row.denom < 1 ? row.denom.toFixed(2) : row.denom.toLocaleString()}
//                     </div>
//                   </div>

//                   {/* Stepper */}
//                   <div className="col-span-5 flex items-center gap-2">
//                     <button type="button" onClick={() => step(row.id, -1)}
//                       className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-300 hover:text-red-400 hover:border-red-300 transition-colors">
//                       <MinusCircle size={16} strokeWidth={2} />
//                     </button>
//                     <input
//                       type="number" min="0"
//                       value={row.count}
//                       onChange={e => updateCount(row.id, e.target.value)}
//                       style={active ? { borderColor:`${PRIMARY}77`, background:`${PRIMARY}08` } : {}}
//                       className="w-16 h-8 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-center text-sm font-black focus:outline-none transition-all"
//                     />
//                     <button type="button" onClick={() => step(row.id, 1)}
//                       style={active ? { color: PRIMARY, borderColor:`${PRIMARY}66` } : {}}
//                       className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-300 transition-colors">
//                       <PlusCircle size={16} strokeWidth={2} />
//                     </button>
//                   </div>

//                   {/* Subtotal */}
//                   <div className="col-span-3 text-right">
//                     <span style={{ color: active ? PRIMARY : '#d1d5db' }} className="text-sm font-black transition-colors">
//                       {info.symbol}{subtotal.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
//                     </span>
//                   </div>

//                   {/* Remove */}
//                   <div className="col-span-1 flex justify-end">
//                     <button type="button" onClick={() => removeRow(row.id)}
//                       className="w-6 h-6 rounded-md flex items-center justify-center text-gray-200 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100">
//                       <X size={13} strokeWidth={2.5} />
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Footer — add presets / custom / total */}
//           <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4">

//             {/* Quick-add preset denominations */}
//             {addablePresets.length > 0 && (
//               <div className="flex flex-wrap items-center gap-2">
//                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0 mr-1">Add:</span>
//                 {addablePresets.slice(0, 12).map(d => (
//                   <button key={d} type="button" onClick={() => addPreset(d)}
//                     style={{ borderColor:`${PRIMARY}44`, color: PRIMARY }}
//                     className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-black hover:opacity-75 transition-opacity bg-white dark:bg-gray-800">
//                     <Plus size={9} strokeWidth={3} />
//                     {info.symbol}{d < 1 ? d.toFixed(2) : d.toLocaleString()}
//                   </button>
//                 ))}
//                 <button type="button" onClick={() => setShowCustom(v => !v)}
//                   className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-xs font-black text-gray-400 hover:text-gray-600 transition-colors">
//                   <Plus size={9} strokeWidth={3} /> Custom
//                 </button>
//               </div>
//             )}

//             {/* Custom denomination input */}
//             {showCustom && (
//               <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-150">
//                 <div style={{ borderColor:`${PRIMARY}55` }}
//                   className="flex items-center rounded-xl border bg-white dark:bg-gray-800 overflow-hidden">
//                   <span className="pl-4 text-gray-400 font-black text-sm">{info.symbol}</span>
//                   <input
//                     type="number" min="0.01" step="0.01"
//                     placeholder="e.g. 500"
//                     value={customDenom}
//                     onChange={e => setCustomDenom(e.target.value)}
//                     onKeyDown={e => e.key === 'Enter' && addCustom()}
//                     className="h-10 px-3 w-32 text-sm font-bold focus:outline-none bg-transparent dark:text-white"
//                     autoFocus
//                   />
//                 </div>
//                 <button type="button" onClick={addCustom}
//                   style={{ background: PRIMARY, color:'#111' }}
//                   className="h-10 px-4 rounded-xl text-xs font-black hover:opacity-90 transition-opacity">
//                   Add
//                 </button>
//                 <button type="button" onClick={() => { setShowCustom(false); setCustomDenom(''); }}
//                   className="h-10 w-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
//                   <X size={14} />
//                 </button>
//               </div>
//             )}

//             {/* Grand total */}
//             <div style={{ background:`${PRIMARY}0d`, borderColor:`${PRIMARY}33` }}
//               className="flex items-center justify-between rounded-2xl border px-5 py-4">
//               <div className="flex items-center gap-3">
//                 <div style={{ background:`${PRIMARY}22`, color: PRIMARY }}
//                   className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
//                   <Banknote size={16} strokeWidth={2.5} />
//                 </div>
//                 <div>
//                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total to Dispense</div>
//                   <div className="text-xs text-gray-400 font-bold mt-0.5">
//                     {rows.filter(r=>r.count>0).length} denom · {rows.reduce((s,r)=>s+r.count,0)} notes
//                   </div>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div style={{ color: PRIMARY }} className="text-2xl font-black">
//                   {info.symbol}{totalDispensed.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
//                 </div>
//                 <div className="text-xs text-gray-400 font-bold">{info.currency}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Main Form ────────────────────────────────────────────────────────────────
// export const ReceiverForm = ({ initialData, sendAmount: externalSendAmount, onContinue, onBack }) => {
//   const [formData, setFormData] = useState({
//     senderCurrency: 'USD', receiverCurrency: 'EUR', country: 'Spain',
//     deliveryMethod: 'CASH_PICKUP', firstName: '', lastName: '', city: '',
//     bankName: '', accountNumber: '',
//     ...initialData,
//   });
//   const [sendAmount, setSendAmount] = useState(externalSendAmount ?? 500);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => {
//       const next = { ...prev, [name]: value };
//       if (name === 'senderCurrency' && prev.receiverCurrency === prev.senderCurrency) next.receiverCurrency = value;
//       return next;
//     });
//   };

//   const exchangePreview = useMemo(() => {
//     const sc = CURRENCIES.find(c => c.code === formData.senderCurrency);
//     const rc = CURRENCIES.find(c => c.code === formData.receiverCurrency);
//     if (!sc || !rc || !sendAmount) return null;
//     const rate = rc.rateToUsd / sc.rateToUsd;
//     const raw = sendAmount * rate;
//     return {
//       rate: rate.toFixed(4),
//       formatted: raw.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}),
//       rawAmount: raw,
//       symbol: rc.symbol,
//     };
//   }, [formData.senderCurrency, formData.receiverCurrency, sendAmount]);

//   const toggleDelivery = m => setFormData(p => ({ ...p, deliveryMethod: m }));
//   const handleSubmit = e => { e.preventDefault(); onContinue?.({ ...formData, sendAmount }); };

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-white/10 shadow-sm p-6 sm:p-10">
//       <h3 className="text-gray-900 dark:text-white font-black text-xl mb-8 flex items-center gap-3">
//         <UserPlus size={24} style={{ color: PRIMARY }} />
//         Transfer & Receiver Details
//       </h3>

//       <form onSubmit={handleSubmit} className="flex flex-col gap-8">
//         {/* Past Receivers */}
//         <div className="relative group">
//           <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2.5">Select a past receiver</label>
//           <div className="relative">
//             <select className={`${inputBase} appearance-none pr-12`} defaultValue="New Receiver">
//               <option>New Receiver</option>
//               <option>Sarah Connor (Spain)</option>
//               <option>John Smith (United Kingdom)</option>
//               <option>Maria Rodriguez (Mexico)</option>
//             </select>
//             <div style={{ color: PRIMARY }} className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 group-hover:scale-110 transition-transform"><ChevronDown size={20}/></div>
//           </div>
//         </div>

//         <div className="h-px bg-gray-100 dark:bg-gray-800" />

//         {/* Currency & Amount */}
//         <div className="flex flex-col gap-4">
//           <div style={{ background:`${PRIMARY}0d`, borderColor:`${PRIMARY}22` }} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border">
//             {/* You Send */}
//             <div className="flex flex-col gap-2.5">
//               <label style={{ color: PRIMARY }} className="text-xs font-black uppercase tracking-widest flex items-center gap-2"><Coins size={14}/> You Send</label>
//               <div className="relative">
//                 <input type="number" min="0" step="any" value={sendAmount}
//                   onChange={e => setSendAmount(parseFloat(e.target.value)||0)}
//                   className="w-full rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white h-14 px-5 pr-16 text-lg font-black focus:outline-none transition-all" placeholder="0"/>
//                 <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 text-xs font-black">{formData.senderCurrency}</span>
//               </div>
//               <div className="relative group">
//                 <select name="senderCurrency" value={formData.senderCurrency} onChange={handleChange} className={`${inputBase} appearance-none pr-12`}>
//                   {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name} {c.symbol}</option>)}
//                 </select>
//                 <div style={{ color: PRIMARY }} className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 group-hover:scale-110 transition-transform"><ChevronDown size={20}/></div>
//               </div>
//             </div>
//             {/* They Receive */}
//             <div className="flex flex-col gap-2.5">
//               <label style={{ color: PRIMARY }} className="text-xs font-black uppercase tracking-widest flex items-center gap-2"><Coins size={14}/> They Receive</label>
//               <div className="h-14 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 flex items-center px-5">
//                 {exchangePreview
//                   ? <><span style={{ color: PRIMARY }} className="text-lg font-black">{exchangePreview.symbol}{exchangePreview.formatted}</span><span className="ml-2 text-gray-400 text-xs font-bold">{formData.receiverCurrency}</span></>
//                   : <span className="text-gray-300 text-sm font-bold">Enter amount above</span>}
//               </div>
//               <div className="relative group">
//                 <select name="receiverCurrency" value={formData.receiverCurrency} onChange={handleChange} className={`${inputBase} appearance-none pr-12`}>
//                   {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name} {c.symbol}</option>)}
//                 </select>
//                 <div style={{ color: PRIMARY }} className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 group-hover:scale-110 transition-transform"><ChevronDown size={20}/></div>
//               </div>
//             </div>
//           </div>
//           {exchangePreview && (
//             <div className="flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
//               <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider"><RefreshCw size={13} style={{ color: PRIMARY }}/> Live Rate</div>
//               <span className="font-black text-gray-900 dark:text-white text-sm">1 {formData.senderCurrency} = <span style={{ color: PRIMARY }}>{exchangePreview.rate}</span> {formData.receiverCurrency}</span>
//             </div>
//           )}
//         </div>

//         {/* Name */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {[['firstName','First Name','e.g. Maria'],['lastName','Last Name','e.g. Garcia']].map(([name,label,ph]) => (
//             <div key={name} className="flex flex-col gap-2.5">
//               <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{label}</label>
//               <input name={name} value={formData[name]} onChange={handleChange} className={inputBase} placeholder={ph} type="text" required/>
//             </div>
//           ))}
//         </div>

//         {/* Country & City */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="flex flex-col gap-2.5">
//             <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Destination Country</label>
//             <div className="relative group">
//               <select name="country" value={formData.country} onChange={handleChange} className={`${inputBase} appearance-none pl-12 pr-12`}>
//                 {Object.keys(COUNTRY_CASH_INFO).map(c => <option key={c}>{c}</option>)}
//               </select>
//               <div style={{ color: PRIMARY }} className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4"><Globe size={20}/></div>
//               <div style={{ color: PRIMARY }} className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 group-hover:scale-110 transition-transform"><ChevronDown size={20}/></div>
//             </div>
//           </div>
//           <div className="flex flex-col gap-2.5">
//             <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">City / Province</label>
//             <input name="city" value={formData.city} onChange={handleChange} className={inputBase} placeholder="e.g. Madrid" type="text" required/>
//           </div>
//         </div>

//         {/* Delivery Method */}
//         <div className="flex flex-col gap-4">
//           <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Delivery Method</label>
//           <div className="flex p-1.5 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800">
//             {[{key:'BANK_DEPOSIT',label:'Bank Deposit',Icon:Landmark},{key:'CASH_PICKUP',label:'Cash Pickup',Icon:Wallet}].map(({key,label,Icon}) => {
//               const active = formData.deliveryMethod === key;
//               return (
//                 <button key={key} type="button" onClick={() => toggleDelivery(key)}
//                   className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2.5 ${active?'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg shadow-black/5 ring-1 ring-black/5':'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}>
//                   <Icon size={18} style={active?{color:PRIMARY}:{}} /> {label}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Bank Details */}
//         {formData.deliveryMethod === 'BANK_DEPOSIT' && (
//           <div style={{ background:`${PRIMARY}0d`, borderColor:`${PRIMARY}33` }} className="p-6 rounded-2xl border flex flex-col gap-6 animate-in slide-in-from-top-2 duration-300">
//             <div style={{ color: PRIMARY }} className="flex items-center gap-3 font-black text-xs uppercase tracking-widest"><Lock size={16} strokeWidth={3}/> Bank details are encrypted and secure</div>
//             <div className="flex flex-col gap-4">
//               <div className="flex flex-col gap-2.5">
//                 <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Bank Name</label>
//                 <input name="bankName" value={formData.bankName} onChange={handleChange}
//                   className="w-full rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white h-14 px-5 text-base font-bold focus:outline-none placeholder:text-gray-300 transition-all"
//                   placeholder="e.g. Banco Santander" type="text" required/>
//               </div>
//               <div className="flex flex-col gap-2.5">
//                 <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">IBAN / Account Number</label>
//                 <input name="accountNumber" value={formData.accountNumber} onChange={handleChange}
//                   className="w-full rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white h-14 px-5 text-base font-mono font-bold focus:outline-none placeholder:text-gray-300 transition-all"
//                   placeholder="ES00 0000 0000 0000 0000" type="text" required/>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Unified Cash Denomination Panel */}
//         {formData.deliveryMethod === 'CASH_PICKUP' && (
//           <CashDenominationPanel
//             country={formData.country}
//             receivedAmount={exchangePreview?.rawAmount ?? 0}
//             senderCurrency={formData.senderCurrency}
//           />
//         )}

//         {/* Actions */}
//         <div className="flex items-center justify-between pt-4">
//           <button type="button" onClick={onBack} className="text-gray-400 hover:text-gray-600 font-black text-sm transition-colors px-6 py-2 uppercase tracking-widest">Back</button>
//           <button type="submit" style={{ background: PRIMARY, boxShadow:`0 8px 24px ${PRIMARY}44` }}
//             className="flex items-center justify-center gap-3 rounded-2xl text-gray-900 text-base font-black h-14 px-10 transition-all transform active:scale-95 hover:opacity-90 group">
//             Continue <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform"/>
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };
















import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  UserPlus, Globe, Landmark, Wallet, Lock, ChevronDown, ArrowRight,
  Coins, RefreshCw, Banknote, Printer, Plus, AlertCircle,
  CheckCircle2, MinusCircle, PlusCircle, X
} from 'lucide-react';

const PRIMARY = '#30e87a';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar',         symbol: '$',  rateToUsd: 1     },
  { code: 'EUR', name: 'Euro',              symbol: '€',  rateToUsd: 0.92  },
  { code: 'GBP', name: 'British Pound',     symbol: '£',  rateToUsd: 0.79  },
  { code: 'MXN', name: 'Mexican Peso',      symbol: '$',  rateToUsd: 17.10 },
  { code: 'PHP', name: 'Philippine Peso',   symbol: '₱',  rateToUsd: 56.20 },
  { code: 'INR', name: 'Indian Rupee',      symbol: '₹',  rateToUsd: 83.30 },
  { code: 'CAD', name: 'Canadian Dollar',   symbol: '$',  rateToUsd: 1.35  },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$',  rateToUsd: 1.52  },
];

const COUNTRY_CASH_INFO = {
  Spain:       { currency:'EUR', symbol:'€', flag:'🇪🇸', notes:[500,200,100,50,20,10,5],    coins:[2,1,0.50,0.20,0.10,0.05,0.02,0.01], pickupNote:'Available at partner banks & Correos branches'    },
  Mexico:      { currency:'MXN', symbol:'$', flag:'🇲🇽', notes:[1000,500,200,100,50,20],     coins:[10,5,2,1,0.50],                     pickupNote:'Available at OXXO, Elektra & partner branches'   },
  Philippines: { currency:'PHP', symbol:'₱', flag:'🇵🇭', notes:[1000,500,200,100,50,20],     coins:[10,5,1,0.25],                       pickupNote:'Available at LBC, Palawan Pawnshop & SM outlets'  },
  India:       { currency:'INR', symbol:'₹', flag:'🇮🇳', notes:[2000,500,200,100,50,20,10],  coins:[10,5,2,1],                          pickupNote:'Available at partner bank branches & India Post'  },
  Germany:     { currency:'EUR', symbol:'€', flag:'🇩🇪', notes:[500,200,100,50,20,10,5],    coins:[2,1,0.50,0.20,0.10,0.05,0.02,0.01], pickupNote:'Available at Deutsche Post & partner outlets'     },
};

const inputBase = "w-full rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white h-14 px-5 text-base font-bold focus:outline-none placeholder:text-gray-400 transition-all";

function buildRows(amount, notes) {
  const rows = [];
  let rem = Math.floor(amount);
  for (const n of notes) {
    const count = Math.floor(rem / n);
    rows.push({ id: n, denom: n, count: count > 0 ? count : 0 });
    if (count > 0) rem -= count * n;
  }
  return rows;
}

// ─── Cash Denomination Panel ──────────────────────────────────────────────────
const CashDenominationPanel = ({ country, receivedAmount, senderCurrency, onRowsChange }) => {
  const info = COUNTRY_CASH_INFO[country];
  if (!info) return null;

  const [tab, setTab] = useState('guide');
  const [rows, setRows] = useState(() => buildRows(receivedAmount, info.notes));
  const [customDenom, setCustomDenom] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const prevKey = useRef(`${country}:${receivedAmount}`);

  useEffect(() => {
    const key = `${country}:${receivedAmount}`;
    if (prevKey.current !== key) {
      prevKey.current = key;
      setRows(buildRows(receivedAmount, info.notes));
    }
  }, [country, receivedAmount, info.notes]);

  useEffect(() => {
  onRowsChange?.(rows);
}, [rows]);

  const totalDispensed = useMemo(() => rows.reduce((s, r) => s + r.denom * r.count, 0), [rows]);
  const difference     = totalDispensed - (receivedAmount || 0);
  const isBalanced     = Math.abs(difference) < 0.01;
  const isOver         = difference > 0.01;

  const updateCount = useCallback((id, val) =>
    setRows(p => p.map(r => r.id === id ? { ...r, count: Math.max(0, parseInt(val) || 0) } : r)), []);
  const step      = useCallback((id, d) =>
    setRows(p => p.map(r => r.id === id ? { ...r, count: Math.max(0, r.count + d) } : r)), []);
  const removeRow = useCallback((id) => setRows(p => p.filter(r => r.id !== id)), []);
  const reset     = () => setRows(buildRows(receivedAmount, info.notes));

  const activeDenomSet  = new Set(rows.map(r => r.denom));
  const addablePresets  = [...info.notes, ...info.coins].filter(d => !activeDenomSet.has(d));
  const addPreset       = (d) => setRows(p => [...p, { id: d, denom: d, count: 0 }]);
  const addCustom       = () => {
    const v = parseFloat(customDenom);
    if (!v || v <= 0) return;
    setRows(p => [...p, { id: Date.now(), denom: v, count: 0 }]);
    setCustomDenom(''); setShowCustom(false);
  };

  const handlePrint = () => {
    const w   = window.open('', '_blank');
    const now = new Date().toLocaleString();
    const rowsHtml = rows.filter(r => r.count > 0).map(r => `
      <tr>
        <td>${info.symbol}${r.denom < 1 ? r.denom.toFixed(2) : r.denom.toLocaleString()}</td>
        <td style="text-align:center">${r.count}</td>
        <td style="text-align:right;font-weight:700">${info.symbol}${(r.denom * r.count).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
      </tr>`).join('');
    w.document.write(`<!DOCTYPE html><html><head><title>Cash Disbursement</title>
    <style>
      body{font-family:sans-serif;padding:32px;color:#111;font-size:14px}
      h1{font-size:18px;font-weight:900;margin-bottom:2px}
      .sub{font-size:11px;color:#6b7280;margin-bottom:20px}
      table{width:100%;border-collapse:collapse;margin-top:16px}
      th{background:#f3f4f6;padding:8px 14px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;font-weight:900}
      td{padding:9px 14px;border-bottom:1px solid #f3f4f6}
      .total td{font-weight:900;font-size:15px;background:#f9fafb;border-top:2px solid #e5e7eb}
      .status{margin-top:14px;padding:10px 14px;border-radius:8px;font-size:12px;font-weight:700}
      .ok{background:#dcfce7;color:#15803d} .warn{background:#fef9c3;color:#92400e}
      .sig{margin-top:28px;font-size:11px;color:#9ca3af}
    </style></head><body>
    <h1>Counter Cash Disbursement — ${info.currency}</h1>
    <div class="sub">Agent Payout · ${info.flag} ${country} · ${now}</div>
    <table>
      <thead><tr><th>Denomination</th><th style="text-align:center">Count</th><th style="text-align:right">Subtotal</th></tr></thead>
      <tbody>${rowsHtml}</tbody>
      <tr class="total"><td>Total Dispensed</td><td></td><td style="text-align:right">${info.symbol}${totalDispensed.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} ${info.currency}</td></tr>
    </table>
    <div class="status ${isBalanced ? 'ok' : 'warn'}">
      Expected: ${info.symbol}${(receivedAmount||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} |
      Dispensed: ${info.symbol}${totalDispensed.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} |
      ${isBalanced ? '✓ Balanced' : `${isOver ? 'Over' : 'Short'} by ${info.symbol}${Math.abs(difference).toFixed(2)}`}
    </div>
    <p class="sig">Teller: _________________________ &nbsp;&nbsp; Date: _____________</p>
    <script>window.print();window.close();</script>
    </body></html>`);
    w.document.close();
  };

  return (
    <div style={{ borderColor:`${PRIMARY}33` }} className="rounded-2xl border overflow-hidden">

      {/* Header */}
      <div style={{ background:`${PRIMARY}0d` }} className="px-6 pt-5 pb-0">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl leading-none">{info.flag}</span>
            <div>
              <div style={{ color:PRIMARY }} className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                <Banknote size={13} strokeWidth={3} /> Cash Denomination Guide
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{info.pickupNote}</p>
            </div>
          </div>
          {receivedAmount > 0 && (
            <div style={{ borderColor:`${PRIMARY}55`, color:PRIMARY }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black bg-white dark:bg-gray-800">
              <RefreshCw size={10} strokeWidth={3} />
              {info.symbol}{receivedAmount.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} {info.currency}
              <span className="opacity-50">· from {senderCurrency}</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {[{ key:'guide', label:'Denomination Guide' }, { key:'counter', label:'Counter Cash Out' }].map(({ key, label }) => {
            const active = tab === key;
            return (
              <button key={key} type="button" onClick={() => setTab(key)}
                style={active
                  ? { color:PRIMARY, borderColor:PRIMARY, borderBottomColor:'transparent', background:'#fff' }
                  : { color:'#9ca3af', borderColor:'transparent' }}
                className="px-5 py-2.5 text-xs font-black uppercase tracking-widest border-t border-l border-r rounded-t-xl transition-all dark:bg-gray-900">
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB: Guide ── */}
      {tab === 'guide' && (
        <div className="p-6 bg-white dark:bg-gray-900 flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Banknotes</div>
            <div className="flex flex-wrap gap-2">
              {info.notes.map(note => (
                <div key={note} style={{ borderColor:`${PRIMARY}44` }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg border shadow-sm">
                  <span style={{ color:PRIMARY }} className="text-xs font-black">{info.symbol}</span>
                  <span className="text-gray-900 dark:text-white font-black text-sm">{note.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Coins</div>
            <div className="flex flex-wrap gap-2">
              {info.coins.map(coin => (
                <div key={coin} style={{ background:`${PRIMARY}1a`, borderColor:`${PRIMARY}33` }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border">
                  <span style={{ color:PRIMARY }} className="text-[10px] font-black">{info.symbol}</span>
                  <span className="text-gray-700 dark:text-gray-200 font-black text-xs">{coin < 1 ? coin.toFixed(2) : coin}</span>
                </div>
              ))}
            </div>
          </div>
          {receivedAmount > 0 && (() => {
            const bd = buildRows(receivedAmount, info.notes).filter(r => r.count > 0);
            return bd.length > 0 ? (
              <div className="flex flex-col gap-3">
                <div style={{ background:`${PRIMARY}22` }} className="h-px w-full" />
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex flex-wrap items-center gap-2">
                  <RefreshCw size={11} strokeWidth={3} style={{ color:PRIMARY }} />
                  Suggested Breakdown
                  <span className="normal-case tracking-normal font-bold text-gray-400">
                    for {info.symbol}{Math.floor(receivedAmount).toLocaleString()} {info.currency}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {bd.map(({ denom, count }) => (
                    <div key={denom} style={{ borderColor:`${PRIMARY}44` }}
                      className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                      <div className="flex items-center gap-1">
                        <span style={{ color:PRIMARY }} className="text-xs font-black">{info.symbol}</span>
                        <span className="text-gray-900 dark:text-white font-black text-sm">{denom.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400 text-xs">×</span>
                        <span style={{ color:PRIMARY }} className="text-lg font-black">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 font-bold">
                  * Switch to <span style={{ color:PRIMARY }}>Counter Cash Out</span> tab to edit and print.
                </p>
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* ── TAB: Counter ── */}
      {tab === 'counter' && (
        <div className="bg-white dark:bg-gray-900 flex flex-col">

          {/* Status + actions bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-5 flex-wrap">
              {[
                { label:'Expected',  val: receivedAmount || 0,  col:'#6b7280'  },
                { label:'Dispensed', val: totalDispensed,       col: PRIMARY   },
                { label: isBalanced ? 'Balanced' : isOver ? 'Overage' : 'Shortfall',
                  val: Math.abs(difference),
                  col: isBalanced ? PRIMARY : isOver ? '#d97706' : '#dc2626',
                  prefix: isBalanced ? '' : isOver ? '+' : '-' },
              ].map(({ label, val, col, prefix='' }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
                  <span style={{ color:col }} className="text-base font-black leading-tight">
                    {prefix}{info.symbol}{val.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
                  </span>
                </div>
              ))}
              <div style={
                isBalanced
                  ? { background:`${PRIMARY}18`, borderColor:`${PRIMARY}55`, color:PRIMARY }
                  : isOver
                    ? { background:'#fef3c722', borderColor:'#fcd34d88', color:'#92400e' }
                    : { background:'#fee2e222', borderColor:'#fca5a588', color:'#b91c1c' }
              } className="flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-black">
                {isBalanced ? <CheckCircle2 size={11} strokeWidth={3}/> : <AlertCircle size={11} strokeWidth={3}/>}
                {isBalanced ? 'Balanced' : isOver ? `Over ${info.symbol}${Math.abs(difference).toFixed(2)}` : `Short ${info.symbol}${Math.abs(difference).toFixed(2)}`}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={reset} type="button"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-black text-gray-400 hover:text-gray-700 transition-colors">
                <RefreshCw size={11} strokeWidth={2.5} /> Reset
              </button>
              <button onClick={handlePrint} type="button"
                style={{ background:PRIMARY, color:'#111' }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black hover:opacity-90 transition-opacity">
                <Printer size={12} strokeWidth={2.5} /> Print
              </button>
            </div>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-12 gap-2 px-6 py-2.5 bg-gray-50 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800">
            {['Note / Coin','Count','Subtotal',''].map((h, i) => (
              <div key={i} className={`text-[10px] font-black text-gray-400 uppercase tracking-widest ${i===0?'col-span-3':i===1?'col-span-5':i===2?'col-span-3 text-right':'col-span-1'}`}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
            {rows.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-400 text-sm font-bold">No denominations. Add from presets below.</div>
            )}
            {rows.map(row => {
              const subtotal = row.denom * row.count;
              const active   = row.count > 0;
              return (
                <div key={row.id}
                  style={active ? { background:`${PRIMARY}07` } : {}}
                  className="grid grid-cols-12 gap-2 items-center px-6 py-2.5 transition-colors group">
                  <div className="col-span-3">
                    <div style={active
                      ? { background:`${PRIMARY}18`, borderColor:`${PRIMARY}55`, color:PRIMARY }
                      : { borderColor:'#e5e7eb', color:'#374151' }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-black transition-all dark:border-gray-700 dark:text-gray-200">
                      <span className="text-[10px] opacity-50">{info.symbol}</span>
                      {row.denom < 1 ? row.denom.toFixed(2) : row.denom.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-span-5 flex items-center gap-2">
                    <button type="button" onClick={() => step(row.id, -1)}
                      className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-300 hover:text-red-400 hover:border-red-300 transition-colors">
                      <MinusCircle size={16} strokeWidth={2} />
                    </button>
                    <input type="number" min="0" value={row.count}
                      onChange={e => updateCount(row.id, e.target.value)}
                      style={active ? { borderColor:`${PRIMARY}77`, background:`${PRIMARY}08` } : {}}
                      className="w-16 h-8 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-center text-sm font-black focus:outline-none transition-all" />
                    <button type="button" onClick={() => step(row.id, 1)}
                      style={active ? { color:PRIMARY, borderColor:`${PRIMARY}66` } : {}}
                      className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-300 transition-colors">
                      <PlusCircle size={16} strokeWidth={2} />
                    </button>
                  </div>
                  <div className="col-span-3 text-right">
                    <span style={{ color: active ? PRIMARY : '#d1d5db' }} className="text-sm font-black transition-colors">
                      {info.symbol}{subtotal.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button type="button" onClick={() => removeRow(row.id)}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-gray-200 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100">
                      <X size={13} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4">
            {addablePresets.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0 mr-1">Add:</span>
                {addablePresets.slice(0, 12).map(d => (
                  <button key={d} type="button" onClick={() => addPreset(d)}
                    style={{ borderColor:`${PRIMARY}44`, color:PRIMARY }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-black hover:opacity-75 transition-opacity bg-white dark:bg-gray-800">
                    <Plus size={9} strokeWidth={3} />
                    {info.symbol}{d < 1 ? d.toFixed(2) : d.toLocaleString()}
                  </button>
                ))}
                <button type="button" onClick={() => setShowCustom(v => !v)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-xs font-black text-gray-400 hover:text-gray-600 transition-colors">
                  <Plus size={9} strokeWidth={3} /> Custom
                </button>
              </div>
            )}
            {showCustom && (
              <div className="flex items-center gap-2">
                <div style={{ borderColor:`${PRIMARY}55` }}
                  className="flex items-center rounded-xl border bg-white dark:bg-gray-800 overflow-hidden">
                  <span className="pl-4 text-gray-400 font-black text-sm">{info.symbol}</span>
                  <input type="number" min="0.01" step="0.01" placeholder="e.g. 500"
                    value={customDenom} onChange={e => setCustomDenom(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustom()}
                    className="h-10 px-3 w-32 text-sm font-bold focus:outline-none bg-transparent dark:text-white" autoFocus />
                </div>
                <button type="button" onClick={addCustom}
                  style={{ background:PRIMARY, color:'#111' }}
                  className="h-10 px-4 rounded-xl text-xs font-black hover:opacity-90 transition-opacity">Add</button>
                <button type="button" onClick={() => { setShowCustom(false); setCustomDenom(''); }}
                  className="h-10 w-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={14} />
                </button>
              </div>
            )}
            <div style={{ background:`${PRIMARY}0d`, borderColor:`${PRIMARY}33` }}
              className="flex items-center justify-between rounded-2xl border px-5 py-4">
              <div className="flex items-center gap-3">
                <div style={{ background:`${PRIMARY}22`, color:PRIMARY }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Banknote size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total to Dispense</div>
                  <div className="text-xs text-gray-400 font-bold mt-0.5">
                    {rows.filter(r=>r.count>0).length} denom · {rows.reduce((s,r)=>s+r.count,0)} notes
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div style={{ color:PRIMARY }} className="text-2xl font-black">
                  {info.symbol}{totalDispensed.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
                </div>
                <div className="text-xs text-gray-400 font-bold">{info.currency}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main ReceiverForm ────────────────────────────────────────────────────────
/**
 * Props:
 *  initialData   — receiver form defaults from parent state
 *  sendAmount    — initial send amount from parent (e.g. 1000)
 *  onContinue(payload) — called on submit; payload contains everything the
 *                        parent needs to update its own state:
 *                        { ...formData, sendAmount, exchangeRate,
 *                          receiverGets, senderCurrency, receiverCurrency }
 *  onBack        — called when teller clicks Back
 *  onSummaryChange(summary) — optional; called on every change so the parent
 *                             can keep the <Summary> sidebar live
 */
export const ReceiverForm = ({
  initialData,
  sendAmount: externalSendAmount,
  onContinue,
  onBack,
  onSummaryChange,   // ← new: real-time sidebar updates
}) => {
  const [formData, setFormData] = useState({
    senderCurrency:  'USD',
    receiverCurrency:'EUR',
    country:         'Spain',
    deliveryMethod:  'BANK_DEPOSIT',
    firstName:       '',
    lastName:        '',
    city:            '',
    bankName:        '',
    accountNumber:   '',
    ...initialData,
  });

  // Editable send amount — starts from whatever the parent passed
  const [sendAmount, setSendAmount] = useState(externalSendAmount ?? 1000);

  const denominationRowsRef = useRef([]);
const handleRowsChange = useCallback((rows) => {
  denominationRowsRef.current = rows;
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      // Keep receiver currency in sync when sender changes (if they were equal)
      if (name === 'senderCurrency' && prev.receiverCurrency === prev.senderCurrency) {
        next.receiverCurrency = value;
      }
      return next;
    });
  };

  // Derived exchange numbers — recompute on every relevant change
  const exchangePreview = useMemo(() => {
    const sc = CURRENCIES.find(c => c.code === formData.senderCurrency);
    const rc = CURRENCIES.find(c => c.code === formData.receiverCurrency);
    if (!sc || !rc || !sendAmount) return null;
    const rate = rc.rateToUsd / sc.rateToUsd;
    const raw  = sendAmount * rate;
    return {
      rate,                                                                                          // number  e.g. 0.92
      rateDisplay: rate.toFixed(4),                                                                 // string  e.g. "0.9200"
      rawAmount:   raw,                                                                             // number  e.g. 920
      formatted:   raw.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}), // string  e.g. "920.00"
      symbol:      rc.symbol,
    };
  }, [formData.senderCurrency, formData.receiverCurrency, sendAmount]);

  // ── Lift summary changes to parent in real time ───────────────────────────
  useEffect(() => {
    if (!onSummaryChange) return;
    onSummaryChange({
      sendAmount,
      currency:         formData.senderCurrency,
      exchangeRate:     exchangePreview?.rate     ?? 0,
      receiverGets:     exchangePreview?.rawAmount ?? 0,
      receiverCurrency: formData.receiverCurrency,
      // fee stays as-is in the parent; we don't touch it here
    });
  }, [sendAmount, formData.senderCurrency, formData.receiverCurrency, exchangePreview]);

  const toggleDelivery = (method) => setFormData(prev => ({ ...prev, deliveryMethod: method }));

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Build a rich payload so the parent has everything it needs
  //   onContinue?.({
  //     ...formData,
  //     sendAmount,
  //     exchangeRate:     exchangePreview?.rate     ?? 0,
  //     receiverGets:     exchangePreview?.rawAmount ?? 0,
  //   });
  // };

   const handleSubmit = (e) => {
    e.preventDefault();

    const rows         = denominationRowsRef.current;
    const totalDispensed = rows.reduce((s, r) => s + r.denom * r.count, 0);
    const expectedPayout = exchangePreview?.rawAmount ?? 0;
    const difference     = totalDispensed - expectedPayout;

    onContinue?.({
      // form fields
      ...formData,

      // amounts
      sendAmount,
      exchangeRate:     exchangePreview?.rate     ?? 0,
      receiverGets:     expectedPayout,

      // denomination data — ready to map straight into Frappe child table
      denominationRows: rows
        .filter(r => r.count > 0)
        .map(r => ({
          denomination_value: r.denom,
          denomination_type:  r.denom >= 1 ? 'Note' : 'Coin',
          count:              r.count,
          subtotal:           r.denom * r.count,
          is_custom:          r.isCustom ?? 0,
        })),

      // pre-calculated for Frappe fields
      totalDispensed,
      difference,
      balanceStatus: Math.abs(difference) < 0.01
        ? 'Balanced'
        : difference > 0
          ? 'Over'
          : 'Short',
    });
  };
  
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-white/10 shadow-sm p-6 sm:p-10">
      <h3 className="text-gray-900 dark:text-white font-black text-xl mb-8 flex items-center gap-3">
        <UserPlus size={24} style={{ color:PRIMARY }} />
        Transfer & Receiver Details
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">

        {/* Past Receivers */}
        <div className="relative group">
          <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2.5">Select a past receiver</label>
          <div className="relative">
            <select className={`${inputBase} appearance-none pr-12`} defaultValue="New Receiver">
              <option>New Receiver</option>
              <option>Sarah Connor (Spain)</option>
              <option>John Smith (United Kingdom)</option>
              <option>Maria Rodriguez (Mexico)</option>
            </select>
            <div style={{ color:PRIMARY }} className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 group-hover:scale-110 transition-transform"><ChevronDown size={20}/></div>
          </div>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        {/* Currency & Amount */}
        <div className="flex flex-col gap-4">
          <div style={{ background:`${PRIMARY}0d`, borderColor:`${PRIMARY}22` }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border">

            {/* You Send */}
            <div className="flex flex-col gap-2.5">
              <label style={{ color:PRIMARY }} className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Coins size={14}/> You Send
              </label>
              <div className="relative">
                <input type="number" min="0" step="any" value={sendAmount}
                  onChange={e => setSendAmount(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white h-14 px-5 pr-16 text-lg font-black focus:outline-none transition-all"
                  placeholder="0" />
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 text-xs font-black">{formData.senderCurrency}</span>
              </div>
              <div className="relative group">
                <select name="senderCurrency" value={formData.senderCurrency} onChange={handleChange}
                  className={`${inputBase} appearance-none pr-12`}>
                  {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name} {c.symbol}</option>)}
                </select>
                <div style={{ color:PRIMARY }} className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 group-hover:scale-110 transition-transform"><ChevronDown size={20}/></div>
              </div>
            </div>

            {/* They Receive */}
            <div className="flex flex-col gap-2.5">
              <label style={{ color:PRIMARY }} className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Coins size={14}/> They Receive
              </label>
              <div className="h-14 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 flex items-center px-5">
                {exchangePreview
                  ? <><span style={{ color:PRIMARY }} className="text-lg font-black">{exchangePreview.symbol}{exchangePreview.formatted}</span><span className="ml-2 text-gray-400 text-xs font-bold">{formData.receiverCurrency}</span></>
                  : <span className="text-gray-300 text-sm font-bold">Enter amount above</span>}
              </div>
              <div className="relative group">
                <select name="receiverCurrency" value={formData.receiverCurrency} onChange={handleChange}
                  className={`${inputBase} appearance-none pr-12`}>
                  {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name} {c.symbol}</option>)}
                </select>
                <div style={{ color:PRIMARY }} className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 group-hover:scale-110 transition-transform"><ChevronDown size={20}/></div>
              </div>
            </div>
          </div>

          {/* Live rate bar */}
          {exchangePreview && (
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <RefreshCw size={13} style={{ color:PRIMARY }}/> Live Rate
              </div>
              <span className="font-black text-gray-900 dark:text-white text-sm">
                1 {formData.senderCurrency} = <span style={{ color:PRIMARY }}>{exchangePreview.rateDisplay}</span> {formData.receiverCurrency}
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[['firstName','First Name','e.g. Maria'],['lastName','Last Name','e.g. Garcia']].map(([name,label,ph]) => (
            <div key={name} className="flex flex-col gap-2.5">
              <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{label}</label>
              <input name={name} value={formData[name]} onChange={handleChange}
                className={inputBase} placeholder={ph} type="text" required />
            </div>
          ))}
        </div>

        {/* Country & City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Destination Country</label>
            <div className="relative group">
              <select name="country" value={formData.country} onChange={handleChange}
                className={`${inputBase} appearance-none pl-12 pr-12`}>
                {Object.keys(COUNTRY_CASH_INFO).map(c => <option key={c}>{c}</option>)}
              </select>
              <div style={{ color:PRIMARY }} className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4"><Globe size={20}/></div>
              <div style={{ color:PRIMARY }} className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 group-hover:scale-110 transition-transform"><ChevronDown size={20}/></div>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">City / Province</label>
            <input name="city" value={formData.city} onChange={handleChange}
              className={inputBase} placeholder="e.g. Madrid" type="text" required />
          </div>
        </div>

        {/* Delivery Method */}
        <div className="flex flex-col gap-4">
          <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Delivery Method</label>
          <div className="flex p-1.5 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800">
            {[
              { key:'BANK_DEPOSIT', label:'Bank Deposit', Icon:Landmark },
              { key:'CASH_PICKUP',  label:'Cash Pickup',  Icon:Wallet   },
            ].map(({ key, label, Icon }) => {
              const active = formData.deliveryMethod === key;
              return (
                <button key={key} type="button" onClick={() => toggleDelivery(key)}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2.5 ${active ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg shadow-black/5 ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}>
                  <Icon size={18} style={active ? { color:PRIMARY } : {}} /> {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bank Details */}
        {formData.deliveryMethod === 'BANK_DEPOSIT' && (
          <div style={{ background:`${PRIMARY}0d`, borderColor:`${PRIMARY}33` }}
            className="p-6 rounded-2xl border flex flex-col gap-6 animate-in slide-in-from-top-2 duration-300">
            <div style={{ color:PRIMARY }} className="flex items-center gap-3 font-black text-xs uppercase tracking-widest">
              <Lock size={16} strokeWidth={3}/> Bank details are encrypted and secure
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Bank Name</label>
                <input name="bankName" value={formData.bankName} onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white h-14 px-5 text-base font-bold focus:outline-none placeholder:text-gray-300 transition-all"
                  placeholder="e.g. Banco Santander" type="text" required />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">IBAN / Account Number</label>
                <input name="accountNumber" value={formData.accountNumber} onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white h-14 px-5 text-base font-mono font-bold focus:outline-none placeholder:text-gray-300 transition-all"
                  placeholder="ES00 0000 0000 0000 0000" type="text" required />
              </div>
            </div>
          </div>
        )}

        {/* Cash Denomination Panel — only for Cash Pickup */}
        {formData.deliveryMethod === 'CASH_PICKUP' && (
          <CashDenominationPanel
            country={formData.country}
            receivedAmount={exchangePreview?.rawAmount ?? 0}
            senderCurrency={formData.senderCurrency}
            onRowsChange={handleRowsChange}
          />
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <button type="button" onClick={onBack}
            className="text-gray-400 hover:text-gray-600 font-black text-sm transition-colors px-6 py-2 uppercase tracking-widest">
            Back
          </button>
          <button type="submit"
            style={{ background:PRIMARY, boxShadow:`0 8px 24px ${PRIMARY}44` }}
            className="flex items-center justify-center gap-3 rounded-2xl text-gray-900 text-base font-black h-14 px-10 transition-all transform active:scale-95 hover:opacity-90 group">
            Continue <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform"/>
          </button>
        </div>
      </form>
    </div>
  );
};