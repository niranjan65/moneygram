
// import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import {
//   UserPlus, Globe, ChevronDown, ArrowRight,
//   Coins, RefreshCw, Banknote, Plus, AlertCircle,
//   CheckCircle2, MinusCircle, PlusCircle, X, ShieldCheck,
//   Upload, FileText, CreditCard,
//   Store
// } from 'lucide-react';
// import { DENOMINATION_DATA, SUPPORTED_COUNTRIES } from '../hooks/Denomination';
// import { useERPNextRates } from '../hooks/useERPNextRates';
// import { useCountries } from '../hooks/useCountry';
// import { useCustomers } from '../hooks/useCustomer';
// import { useBaseCurrency, useDenomination } from '../hooks/useDenomination';
// import { useExchange } from '../context/ExchangeContext';


// const PRIMARY = '#30e87a';

// const inputBase =
//   'w-full rounded-xl border bg-gray-50 h-14 px-5 text-base font-bold focus:outline-none placeholder:text-gray-400 transition-all';

// const fieldCls = (error) =>
//   `${inputBase} ${error ? 'border-[#E00000] focus:ring-2 focus:ring-red-200' : 'border-gray-200'}`;

// const ErrorMsg = ({ message }) =>
//   message ? (
//     <p className="flex items-center gap-1 text-[#E00000] text-xs font-bold mt-1">
//       <AlertCircle size={11} strokeWidth={3} /> {message}
//     </p>
//   ) : null;



// function buildRows(amount, denoms) {
//   const rows = [];

//   if (!amount || !denoms?.length) return rows;

//   // Convert total amount to cents (integer)
//   let remaining = Math.round(parseFloat(amount) * 100);

//   // Convert denominations to cents and sort descending
//   const sortedDenoms = [...denoms]
//     .map(d => Math.round(d * 100))
//     .sort((a, b) => b - a);

//   for (let i = 0; i < sortedDenoms.length; i++) {
//     const denomCents = sortedDenoms[i];
//     const count = Math.floor(remaining / denomCents);

//     rows.push({
//       id: `${denomCents}-${i}`,
//       denom: denomCents / 100, // convert back to normal currency
//       count: count > 0 ? count : 0,
//     });

//     remaining -= count * denomCents;
//   }

//   return rows;
// }



// const DenominationPanel = ({
//   title, subtitle, flag, symbol, currency, notes, coins,
//   targetAmount, onRowsChange, accentColor = PRIMARY,
// }) => {

//   const [rows, setRows] = useState([]);

//   const [customDenom, setCustomDenom] = useState('');
//   const [showCustom, setShowCustom] = useState(false);
  
//   const prevKey = useRef('');

//   useEffect(() => {
//     const key = `${currency}:${targetAmount}:${(notes || []).length}:${(coins || []).length}`;
//     if (prevKey.current !== key) {
//       prevKey.current = key;
//       setRows(buildRows(targetAmount, [...(notes || []), ...(coins || [])]));
//     }
//   }, [currency, targetAmount, notes, coins]);

//   useEffect(() => { onRowsChange?.(rows); }, [rows]);

//   const totalDispensed = useMemo(() => rows.reduce((s, r) => s + r.denom * r.count, 0), [rows]);
//   const difference = totalDispensed - (targetAmount || 0);
//   const isBalanced = Math.abs(difference) < 0.01;
//   const isOver = difference > 0.01;

//   const updateCount = useCallback((id, val) =>
//     setRows(p => p.map(r => r.id === id ? { ...r, count: Math.max(0, parseInt(val) || 0) } : r)), []);
//   const step = useCallback((id, d) =>
//     setRows(p => p.map(r => r.id === id ? { ...r, count: Math.max(0, r.count + d) } : r)), []);
//   const removeRow = useCallback((id) => setRows(p => p.filter(r => r.id !== id)), []);
//   // const reset = () => setRows(buildRows(targetAmount, notes));
//   const reset = () =>
//     setRows(buildRows(targetAmount, [...(notes || []), ...(coins || [])]));

//   const activeDenomSet = new Set(rows.map(r => r.denom));
//   const addablePresets = [...notes, ...coins].filter(d => !activeDenomSet.has(d));
//   const addPreset = (d) => setRows(p => [...p, { id: d, denom: d, count: 0 }]);
//   const addCustom = () => {
//     const v = parseFloat(customDenom);
//     if (!v || v <= 0) return;
//     setRows(p => [...p, { id: Date.now(), denom: v, count: 0 }]);
//     setCustomDenom(''); setShowCustom(false);
//   };

//   return (
//     <div style={{ borderColor: `${accentColor}33` }} className="rounded-2xl border overflow-hidden">
//       <div style={{ background: `${accentColor}0d` }} className="px-5 pt-4 pb-3">
//         <div className="flex items-center justify-between flex-wrap gap-3">
//           <div className="flex items-center gap-3">
//             <span className="text-2xl leading-none">{flag}</span>
//             <div>
//               <div style={{ color: accentColor }} className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
//                 <Banknote size={13} strokeWidth={3} /> {title}
//               </div>
//               <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>
//             </div>
//           </div>
//           {targetAmount > 0 && (
//             <div style={{ borderColor: `${accentColor}55`, color: accentColor }}
//               className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black bg-white">
//               <RefreshCw size={10} strokeWidth={3} />
//               {symbol}{targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 border-b border-gray-100 bg-white">
//         <div className="flex items-center gap-5 flex-wrap">
//           {[
//             { label: 'Expected', val: targetAmount || 0, col: '#6b7280' },
//             { label: 'Counted', val: totalDispensed, col: accentColor },
//             {
//               label: isBalanced ? 'Balanced' : isOver ? 'Overage' : 'Shortfall',
//               val: Math.abs(difference),
//               col: isBalanced ? accentColor : isOver ? '#d97706' : '#dc2626',
//               prefix: isBalanced ? '' : isOver ? '+' : '-',
//             },
//           ].map(({ label, val, col, prefix = '' }) => (
//             <div key={label} className="flex flex-col">
//               <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
//               <span style={{ color: col }} className="text-sm font-black leading-tight">
//                 {prefix}{symbol}{val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//               </span>
//             </div>
//           ))}
//           <div style={isBalanced
//             ? { background: `${accentColor}18`, borderColor: `${accentColor}55`, color: accentColor }
//             : isOver
//               ? { background: '#fef3c722', borderColor: '#fcd34d88', color: '#92400e' }
//               : { background: '#fee2e222', borderColor: '#fca5a588', color: '#b91c1c' }}
//             className="flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-black">
//             {isBalanced ? <CheckCircle2 size={11} strokeWidth={3} /> : <AlertCircle size={11} strokeWidth={3} />}
//             {isBalanced ? 'Balanced' : isOver ? `Over ${symbol}${Math.abs(difference).toFixed(2)}` : `Short ${symbol}${Math.abs(difference).toFixed(2)}`}
//           </div>
//         </div>
//         <button onClick={reset} type="button"
//           className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-black text-gray-400 hover:text-gray-700 transition-colors">
//           <RefreshCw size={11} strokeWidth={2.5} /> Reset
//         </button>
//       </div>

//       <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-gray-50 border-b border-gray-100">
//         {['Note / Coin', 'Count', 'Subtotal', ''].map((h, i) => (
//           <div key={i} className={`text-[10px] font-black text-gray-400 uppercase tracking-widest ${i === 0 ? 'col-span-3' : i === 1 ? 'col-span-5' : i === 2 ? 'col-span-3 text-right' : 'col-span-1'}`}>{h}</div>
//         ))}
//       </div>

//       <div className="divide-y divide-gray-50 bg-white">
//         {rows.length === 0 && (
//           <div className="px-5 py-8 text-center text-gray-400 text-sm font-bold">No denominations. Add from presets below.</div>
//         )}
//         {rows.map(row => {
//           const subtotal = row.denom * row.count;
//           const active = row.count > 0;
//           return (
//             <div key={row.id} style={active ? { background: `${accentColor}07` } : {}}
//               className="grid grid-cols-12 gap-2 items-center px-5 py-2.5 transition-colors group">
//               <div className="col-span-3">
//                 <div style={active
//                   ? { background: `${accentColor}18`, borderColor: `${accentColor}55`, color: accentColor }
//                   : { borderColor: '#e5e7eb', color: '#374151' }}
//                   className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-black transition-all">
//                   <span className="text-[10px] opacity-50">{symbol}</span>
//                   {row.denom < 1 ? row.denom.toFixed(2) : row.denom.toLocaleString()}
//                 </div>
//               </div>
//               <div className="col-span-5 flex items-center gap-2">
//                 <button type="button" onClick={() => step(row.id, -1)}
//                   className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-300 hover:text-[#E00000] hover:border-[#E00000]/30 transition-colors">
//                   <MinusCircle size={16} strokeWidth={2} />
//                 </button>
//                 <input type="number" min="0" value={row.count}
//                   onChange={e => updateCount(row.id, e.target.value)}
//                   style={active ? { borderColor: `${accentColor}77`, background: `${accentColor}08` } : {}}
//                   className="w-16 h-8 rounded-xl border border-gray-200 text-center text-sm font-black focus:outline-none transition-all" />
//                 <button type="button" onClick={() => step(row.id, 1)}
//                   style={active ? { color: accentColor, borderColor: `${accentColor}66` } : {}}
//                   className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-300 transition-colors">
//                   <PlusCircle size={16} strokeWidth={2} />
//                 </button>
//               </div>
//               <div className="col-span-3 text-right">
//                 <span style={{ color: active ? accentColor : '#d1d5db' }} className="text-sm font-black transition-colors">
//                   {symbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </span>
//               </div>
//               <div className="col-span-1 flex justify-end">
//                 <button type="button" onClick={() => removeRow(row.id)}
//                   className="w-6 h-6 rounded-md flex items-center justify-center text-gray-200 hover:text-[#E00000] hover:bg-[#E00000]/5 transition-all opacity-0 group-hover:opacity-100">
//                   <X size={13} strokeWidth={2.5} />
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="px-5 py-4 border-t border-gray-100 bg-white flex flex-col gap-3">
        
//         <div style={{ background: `${accentColor}0d`, borderColor: `${accentColor}33` }}
//           className="flex items-center justify-between rounded-2xl border px-5 py-4">
//           <div className="flex items-center gap-3">
//             <div style={{ background: `${accentColor}22`, color: accentColor }}
//               className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
//               <Banknote size={16} strokeWidth={2.5} />
//             </div>
//             <div>
//               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Counted</div>
//               <div className="text-xs text-gray-400 font-bold mt-0.5">
//                 {rows.filter(r => r.count > 0).length} denom · {rows.reduce((s, r) => s + r.count, 0)} notes
//               </div>
//             </div>
//           </div>
//           <div className="text-right">
//             <div style={{ color: accentColor }} className="text-2xl font-black">
//               {symbol}{totalDispensed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </div>
//             <div className="text-xs text-gray-400 font-bold">{currency}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// const GovernmentIdSection = ({ register, errors, setValue, watch }) => {
//   const [dragOver, setDragOver] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [previewFile, setPreviewFile] = useState(null);

//   const idType = watch('idType');

//   register('docFile', {
//     validate: (val) => !!val || 'Please upload a government document',
//   });

//   const fetchCustomerById = async (idNumber) => {
//     if (!idNumber || idNumber.length < 3) return;

//     try {
//       const response = await fetch(
//         `http://182.71.135.110:82/api/resource/Customer/${idNumber}`,
//         {
//           method: "GET",
//           headers: {
//             "Authorization": "token 661457e17b8612a:32a5ddcc5a9c177"
//           },

//         }
//       );

//       if (!response.ok) {
//         console.log("Customer not found");
//         return;
//       }

//       const result = await response.json();
//       const customer = result.data;



//       // Autofill form
//       setValue("firstName", customer.custom_first_name || "");
//       setValue("lastName", customer.custom_last_name || "");
//       setValue("country", customer.custom_country || "");
//       setValue("city", customer.custom_city || "");


//       console.log("Customer found...", customer)

//       // Show customer image in Passport Photo / Scan section
//       if (customer.image) {
//         const imageUrl = customer.image.startsWith("http")
//           ? customer.image
//           : `http://182.71.135.110:82${customer.image}`;
//         setPreviewUrl(imageUrl);
//         setPreviewFile(null); // not a local file, so clear previewFile
//         setValue("docFile", imageUrl, { shouldValidate: true });
//       }

//     } catch (error) {
//       console.error("Error fetching customer:", error);
//     }
//   };

//   const handleFile = (file) => {
//     if (!file) return;
//     const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
//     if (!allowed.includes(file.type)) { alert('Please upload a JPG, PNG, WEBP, or PDF file.'); return; }
//     if (file.size > 10 * 1024 * 1024) { alert('File must be under 10 MB.'); return; }
//     setValue('docFile', file, { shouldValidate: true });
//     setPreviewFile(file);
//     setPreviewUrl(URL.createObjectURL(file));
//   };

//   const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };

//   const removeFile = () => {
//     setValue('docFile', null, { shouldValidate: true });
//     setPreviewFile(null); setPreviewUrl(null);
//   };

//   const idTypes = [
//     { key: 'PASSPORT', label: 'Passport', Icon: FileText },
//     { key: 'GOVERNMENT_ID', label: 'Government ID', Icon: CreditCard },
//   ];
//   const placeholders = { PASSPORT: 'e.g. A12345678', GOVERNMENT_ID: 'e.g. 987654321' };

//   return (
//     <div style={{ borderColor: `${PRIMARY}33` }} className="rounded-2xl border overflow-hidden">
//       <div style={{ background: `${PRIMARY}0d` }} className="px-6 py-4 flex items-center gap-3">
//         <div style={{ background: `${PRIMARY}22`, color: PRIMARY }}
//           className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
//           <ShieldCheck size={16} strokeWidth={2.5} />
//         </div>
//         <div>
//           <div style={{ color: PRIMARY }} className="font-black text-xs uppercase tracking-widest">
//             Government ID Verification
//           </div>
//           <p className="text-[11px] text-gray-500 mt-0.5">Required for compliance — data is encrypted and secure</p>
//         </div>
//       </div>

//       <div className="bg-white px-6 py-5 flex flex-col gap-5">
//         {/* ID Type toggle */}
//         <div className="flex flex-col gap-2.5">
//           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
//             ID Type <span className="text-[#E00000]">*</span>
//           </label>
//           <input type="hidden" {...register('idType', { required: 'Please select an ID type' })} />
//           <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-200">
//             {idTypes.map(({ key, label, Icon }) => {
//               const active = idType === key;
//               return (
//                 <button key={key} type="button"
//                   onClick={() => { setValue('idType', key, { shouldValidate: true }); removeFile(); }}
//                   className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2.5 ${active
//                     ? 'bg-white text-gray-900 shadow-lg shadow-black/5 ring-1 ring-black/5'
//                     : 'text-gray-400 hover:text-gray-600'}`}>
//                   <Icon size={16} style={active ? { color: PRIMARY } : {}} />
//                   {label}
//                 </button>
//               );
//             })}
//           </div>
//           <ErrorMsg message={errors.idType?.message} />
//         </div>

//         {
//           idType === 'GOVERNMENT_ID' &&
//           <div className="relative group">
//             <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2.5">
//               Government ID Type
//             </label>
//             <div className="relative">
//               <select className={`${inputBase} border-gray-200 appearance-none pr-12`} {...register('government_id')}>
//                 <option>Driver’s Licence</option>
//                 <option>Voter ID Card</option>

//               </select>
//               <div style={{ color: PRIMARY }} className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 group-hover:scale-110 transition-transform">
//                 <ChevronDown size={20} />
//               </div>
//             </div>
//           </div>
//         }

//         {/* ID Number */}
//         <div className="flex flex-col gap-2.5">
//           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
//             {idType === 'PASSPORT' ? 'Passport Number' : 'ID Number'} <span className="text-[#E00000]">*</span>
//           </label>

//           <input
//             type="text"
//             placeholder={placeholders[idType]}
//             {...register('idNumber', {
//               required: 'ID number is required',
//               minLength: { value: 3, message: 'ID number is too short' },
//               onBlur: (e) => {
//                 fetchCustomerById(e.target.value);
//               },
//             })}
//             className={fieldCls(errors.idNumber)}
//           />
//           <ErrorMsg message={errors.idNumber?.message} />
//         </div>

//         {/* Document Upload */}
//         <div className="flex flex-col gap-2.5">
//           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
//             {idType === 'PASSPORT' ? 'Passport Photo / Scan' : 'Government ID Photo / Scan'} <span className="text-[#E00000]">*</span>
//           </label>

//           {previewUrl ? (
//             <div style={{ borderColor: errors.docFile ? '#f87171' : `${PRIMARY}55` }}
//               className="relative rounded-2xl border overflow-hidden bg-gray-50">
//               {previewFile?.type === 'application/pdf' ? (
//                 <div className="flex items-center gap-3 px-5 py-4">
//                   <div style={{ background: `${PRIMARY}22`, color: PRIMARY }}
//                     className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
//                     <FileText size={18} strokeWidth={2} />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-black text-gray-900 text-sm truncate">{previewFile.name}</p>
//                     <p className="text-xs text-gray-400 font-bold">{(previewFile.size / 1024).toFixed(1)} KB · PDF</p>
//                   </div>
//                   <button type="button" onClick={removeFile}
//                     className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#E00000] hover:bg-[#E00000]/5 transition-all">
//                     <X size={15} />
//                   </button>
//                 </div>
//               ) : (
//                 <>
//                   <img src={previewUrl} alt="ID document" className="w-full max-h-48 object-contain p-4" />
//                   <button type="button" onClick={removeFile}
//                     className="absolute top-2 right-2 w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-gray-400 hover:text-[#E00000] transition-colors">
//                     <X size={15} />
//                   </button>
//                   <div style={{ background: `${PRIMARY}18`, color: PRIMARY }}
//                     className="flex items-center justify-center gap-2 py-2 text-[11px] font-black uppercase tracking-wider">
//                     <CheckCircle2 size={12} strokeWidth={3} /> Document Uploaded
//                   </div>
//                 </>
//               )}
//             </div>
//           ) : (
//             <label
//               onDragOver={e => { e.preventDefault(); setDragOver(true); }}
//               onDragLeave={() => setDragOver(false)}
//               onDrop={handleDrop}
//               style={dragOver
//                 ? { borderColor: PRIMARY, background: `${PRIMARY}0d` }
//                 : { borderColor: errors.docFile ? '#f87171' : '#e5e7eb' }}
//               className="flex flex-col items-center justify-center gap-3 py-8 px-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all hover:border-gray-300 group">
//               <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf"
//                 className="hidden" onChange={e => handleFile(e.target.files[0])} />
//               <div style={dragOver
//                 ? { background: `${PRIMARY}22`, color: PRIMARY }
//                 : { background: errors.docFile ? '#fee2e2' : '#f3f4f6', color: errors.docFile ? '#ef4444' : '#9ca3af' }}
//                 className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110">
//                 <Upload size={20} strokeWidth={2} />
//               </div>
//               <div className="text-center">
//                 <p className="font-black text-gray-700 text-sm">
//                   Drop file here or <span style={{ color: PRIMARY }}>browse</span>
//                 </p>
//                 <p className="text-xs text-gray-400 font-bold mt-1">JPG, PNG, WEBP or PDF · Max 10 MB</p>
//               </div>
//             </label>
//           )}
//           <ErrorMsg message={errors.docFile?.message} />
//         </div>
//       </div>
//     </div>
//   );
// };


// export const ReceiverForm = ({
//   initialData,
//   sendAmount: externalSendAmount,
//   onContinue,
//   onBack,
//   onSummaryChange,
// }) => {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       country: initialData?.country ?? 'India',
//       firstName: initialData?.firstName ?? '',
//       lastName: initialData?.lastName ?? '',
//       city: initialData?.city ?? '',
//       idType: 'PASSPORT',
//       idNumber: '',
//       docFile: null,
//       pastReceiver: 'New Receiver',
//       exchangeType: "BUY"
//     },
//   });



//   const {
//     receiverGets,
//     sendAmount: ctxSendAmount,
//     serviceFee,
//     gstAmount,
//     total,
//   } = useExchange();



//   const roundToNearestFiveCents = (amount) => {
//     if (!amount) return 0;
//     return Math.round(amount / 0.05) * 0.05;
//   };

//   const roundedTotal = roundToNearestFiveCents(total);

//   const exchangeType = watch('exchangeType');

//   const exchangeTypes = [
//     { key: 'BUY', label: 'Buy', Icon: Store },
//     { key: 'SELL', label: 'Sell', Icon: CreditCard },
//   ];




//   /* ── ERPNext rates ── */
//   const {
//     rates: erpRates,
//     availableCurrencies,
//     loading: ratesLoading,
//     error: rateError,
//     rateDate,
//     noDataForToday,
//     showUploadModal,
//     setShowUploadModal,
//   } = useERPNextRates();



//   // const countryList = useCountries();

//   const {
//     countries,
//     loading: countryLoading,
//     error: countryError,
//   } = useCountries();
//   const customerList = useCustomers();




//   const FJD = { code: 'FJD', symbol: 'FJ$', name: 'Fijian Dollar' };


//   const [toCurrency, setToCurrency] = useState(null);


//   const [manualRate, setManualRate] = useState('');
//   const [useManualRate, setUseManualRate] = useState(false);


//   const [sendAmount, setSendAmount] = useState(externalSendAmount ?? 1000);
//   const [sendAmountError, setSendAmountError] = useState('');


//   const senderDenomRowsRef = useRef([]);
//   const receiverDenomRowsRef = useRef([]);


//   useEffect(() => {
//     if (availableCurrencies.length && !toCurrency) {
//       setToCurrency(availableCurrencies[0]);
//     }
//   }, [availableCurrencies]);


//   useEffect(() => {
//     if (noDataForToday) setUseManualRate(true);
//   }, [noDataForToday]);


//   const effectiveRate = useMemo(() => {
//     if (!toCurrency) return null;

//     console.log("toooo currency", toCurrency)

//     if (useManualRate) {
//       const m = parseFloat(manualRate);
//       return !isNaN(m) && m > 0 ? m : null;
//     }

//     if (exchangeType === "SELL") {
//       // You buy foreign
//       return toCurrency.sellingRate ?? null;
//     }

//     if (exchangeType === "BUY") {
//       // You sell foreign
//       return toCurrency.buyingRate ?? null;
//     }

//     return null;
//   }, [toCurrency, exchangeType, useManualRate, manualRate]);


//   const exchangePreview = useMemo(() => {

//     if (!effectiveRate || effectiveRate <= 0) return null;
//     if (!sendAmount || sendAmount <= 0) return null;

//     let receiverAmount = 0;

//     if (exchangeType === "BUY") {
//       // Customer gives FJD → gets foreign

//       console.log("send amount", sendAmount)
//       console.log("effective rate", effectiveRate)
//       receiverAmount = sendAmount * effectiveRate;
//     }

//     if (exchangeType === "SELL") {
//       // Customer gives foreign → gets FJD
//       receiverAmount = sendAmount * effectiveRate;
//     }

//     receiverAmount =
//       Math.round((receiverAmount + Number.EPSILON) * 100) / 100;

//     return {
//       rate: effectiveRate,
//       rawAmount: receiverAmount,
//       formatted: receiverAmount.toLocaleString(undefined, {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       }),
//     };

//   }, [effectiveRate, sendAmount, exchangeType]);

//   const watchedCountry = watch('country');

//   useEffect(() => {
//     if (!onSummaryChange) return;
//     onSummaryChange({
//       sendAmount,
//       currency: FJD.code,
//       exchangeRate: exchangePreview?.rate ?? 0,
//       receiverGets: exchangePreview?.rawAmount ?? 0,
//       receiverCurrency: toCurrency?.code ?? '',
//       exchangeType,
//     });
//   }, [sendAmount, toCurrency, exchangePreview]);


//   // const baseCurrencyInfo = DENOMINATION_DATA['Fiji'] ?? null;
//   const { data: baseCurrencyInfo } = useBaseCurrency();
//   // const receiverInfo = DENOMINATION_DATA[watchedCountry] ?? null;

//   //   const {
//   //   data: receiverInfo,
//   //   loading: denomLoading,
//   //   error: denomError,
//   // } = useDenomination(watchedCountry);

//   const selectedDenomCountry = toCurrency?.country ?? null;

//   const {
//     data: foreignCurrencyInfo,
//     loading: denomLoading,
//     error: denomError,
//   } = useDenomination(selectedDenomCountry);

//   // const {
//   //   data: receiverInfo,
//   //   loading: denomLoading,
//   //   error: denomError,
//   // } = useDenomination(selectedDenomCountry);

//   const senderInfo =
//     exchangeType === "BUY"
//       ? baseCurrencyInfo         
//       : foreignCurrencyInfo;      

//   const receiverInfo =
//     exchangeType === "BUY"
//       ? foreignCurrencyInfo       
//       : baseCurrencyInfo;        


//   console.log("Sender info", senderInfo)
//   console.log("Receiver Info", receiverInfo)


//   const onSubmit = (data) => {
//     if (!sendAmount || sendAmount <= 0) {
//       setSendAmountError('Please enter a valid send amount');
//       return;
//     }

//     if (!effectiveRate || effectiveRate <= 0) {
//       return;
//     }

//     if (useManualRate && (!manualRate || parseFloat(manualRate) <= 0)) {
//       return;
//     }

//     setSendAmountError('');

//     // ── Determine denomination type by checking which array it belongs to ──────
//     const getDenomType = (denom, notesArr = [], coinsArr = []) => {
//       if (notesArr.includes(denom)) return 'Note';
//       if (coinsArr.includes(denom)) return 'Coin';
//       return denom >= 1 ? 'Note' : 'Coin'; // fallback
//     };

//     onContinue?.({
//       ...data,

//       // ── Sender denomination metadata (FJD / base currency) ──────────────────
//       sender_notes: senderInfo?.notes ?? [],
//       sender_notes_name: senderInfo?.notes_name ?? [],
//       sender_coins: senderInfo?.coins ?? [],
//       sender_coins_name: senderInfo?.coins_name ?? [],

//       // ── Receiver denomination metadata (foreign currency) ───────────────────
//       notes: receiverInfo?.notes ?? [],
//       notes_name: receiverInfo?.notes_name ?? [],
//       coins: receiverInfo?.coins ?? [],
//       coins_name: receiverInfo?.coins_name ?? [],

//       // ── Exchange info ────────────────────────────────────────────────────────
//       sendAmount,
//       senderCurrency: toCurrency?.code,
//       receiverCurrency: toCurrency?.code ?? '',
//       exchangeRate: exchangePreview?.rate ?? 0,
//       receiverGets: exchangePreview?.rawAmount ?? 0,
//       rateSource: useManualRate ? 'manual' : 'erpnext',
//       rateDate: useManualRate ? null : rateDate,

//       // ── Sender rows — type resolved against senderInfo arrays ───────────────
//       senderDenominationRows: senderDenomRowsRef.current
//         .filter(r => r.count > 0)
//         .map(r => ({
//           denomination_value: r.denom,
//           denomination_type: getDenomType(r.denom, senderInfo?.notes, senderInfo?.coins),
//           count: r.count,
//           subtotal: r.denom * r.count,
//         })),

//       // ── Receiver rows — type resolved against receiverInfo arrays ────────────
//       receiverDenominationRows: receiverDenomRowsRef.current
//         .filter(r => r.count > 0)
//         .map(r => ({
//           denomination_value: r.denom,
//           denomination_type: getDenomType(r.denom, receiverInfo?.notes, receiverInfo?.coins),
//           count: r.count,
//           subtotal: r.denom * r.count,
//         })),
//     });
//   };


//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-10">

//       {/* ✅ 404 Upload Modal */}
//       {showUploadModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
//             <div className="text-4xl mb-4">📂</div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               No Exchange Rates Found
//             </h2>
//             <p className="text-gray-500 text-sm mb-6">
//               Upload exchange rates in{' '}
//               <span className="font-medium text-gray-700">Currency Master Data</span>{' '}
//               first before proceeding.
//             </p>
//             <button
//               type="button"
//               onClick={() => setShowUploadModal(false)}
//               className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition"
//             >
//               OK, Got it
//             </button>
//           </div>
//         </div>
//       )}



//       <h3 className="text-gray-900 font-black text-xl mb-8 flex items-center gap-3">
//         <UserPlus size={24} style={{ color: PRIMARY }} />
//         Customer Details
//       </h3>

//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8" noValidate>

//         {/* Government ID */}
//         <GovernmentIdSection register={register} errors={errors} setValue={setValue} watch={watch} />

//         <div className="h-px bg-gray-100" />



//         {/* Name fields */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {[
//             ['firstName', 'First Name', 'e.g. Maria', { required: 'First name is required', minLength: { value: 2, message: 'Too short' } }],
//             ['lastName', 'Last Name', 'e.g. Garcia', { required: 'Last name is required', minLength: { value: 2, message: 'Too short' } }],
//           ].map(([name, label, ph, rules]) => (
//             <div key={name} className="flex flex-col gap-2.5">
//               <label className="text-xs font-black text-gray-500 uppercase tracking-widest">
//                 {label} <span className="text-[#E00000]">*</span>
//               </label>
//               <input type="text" placeholder={ph} {...register(name, rules)} className={fieldCls(errors[name])} />
//               <ErrorMsg message={errors[name]?.message} />
//             </div>
//           ))}
//         </div>

//         {/* Country & City */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          

//           <div className="flex flex-col gap-2.5">
//             <label className="text-xs font-black text-gray-500 uppercase tracking-widest">
//               Country <span className="text-[#E00000]">*</span>
//             </label>

//             <div className="relative group">
//               {countryError ? (
//                 <div className="text-[#E00000] text-sm font-bold">
//                   Failed to load countries
//                 </div>
//               ) : countryLoading ? (
//                 <div className="h-14 bg-gray-100 animate-pulse rounded-xl" />
//               ) : (
//                 <select
//                   {...register('country', { required: 'Please select a country' })}
//                   className={`${fieldCls(errors.country)} appearance-none pl-12 pr-12`}
//                 >
//                   <option value="">Select Country</option>
//                   {countries.map((country) => (
//                     <option key={country.name} value={country.name}>
//                       {country.name}
//                     </option>
//                   ))}
//                 </select>
//               )}

//               <div
//                 style={{ color: PRIMARY }}
//                 className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4"
//               >
//                 <Globe size={20} />
//               </div>

//               <div
//                 style={{ color: PRIMARY }}
//                 className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 group-hover:scale-110 transition-transform"
//               >
//                 <ChevronDown size={20} />
//               </div>
//             </div>

//             <ErrorMsg message={errors.country?.message} />
//           </div>
//           <div className="flex flex-col gap-2.5">
//             <label className="text-xs font-black text-gray-500 uppercase tracking-widest">
//               City / Province <span className="text-[#E00000]">*</span>
//             </label>
//             <input type="text" placeholder="e.g. Madrid"
//               {...register('city', { required: 'City is required' })}
//               className={fieldCls(errors.city)} />
//             <ErrorMsg message={errors.city?.message} />
//           </div>
//         </div>


//         <div className="flex flex-col gap-2.5">
//           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
//             EXCHANGE Type <span className="text-[#E00000]">*</span>
//           </label>
//           <input type="hidden" {...register('exchangeType', { required: 'Please select an Exchange type' })} />
//           <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-200">
//             {exchangeTypes.map(({ key, label, Icon }) => {
//               const active = exchangeType === key;
//               return (
//                 <button key={key} type="button"
//                   onClick={() => { setValue('exchangeType', key, { shouldValidate: true }); }}
//                   className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2.5 ${active
//                     ? 'bg-white text-gray-900 shadow-lg shadow-black/5 ring-1 ring-black/5'
//                     : 'text-gray-400 hover:text-gray-600'}`}>
//                   <Icon size={16} style={active ? { color: PRIMARY } : {}} />
//                   {label}
//                 </button>
//               );
//             })}
//           </div>
//           <ErrorMsg message={errors.exchangeType?.message} />
//         </div>

//         {/* ── Currency & Amount ── */}
//         <div className="flex flex-col gap-4">
//           <div
//             style={{ background: `${PRIMARY}0d`, borderColor: `${PRIMARY}22` }}
//             className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border"
//           >

//             <div className="flex flex-col gap-2.5">
//               <label style={{ color: PRIMARY }} className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
//                 <Coins size={14} /> {exchangeType === "SELL"
//                   ? `Customer Gives (${toCurrency?.code})`
//                   : `Customer Gets (${toCurrency?.code ? toCurrency?.code : ''}) `
//                 } <span className="text-[#E00000]">*</span>
//               </label>
//               <input
//                 type="number" min="0" step="any" value={sendAmount}
//                 onChange={e => {
//                   const val = parseFloat(e.target.value) || 0;
//                   setSendAmount(val);
//                   setSendAmountError(val > 0 ? '' : 'Please enter a valid send amount');
//                 }}
//                 className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition text-lg font-black h-14 ${sendAmountError ? 'border-[#E00000] focus:ring-red-200' : 'border-gray-300'
//                   }`}
//                 placeholder="0"
//               />
//               {sendAmountError && <ErrorMsg message={sendAmountError} />}


//               {/* <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl">
//                 <span className="font-black text-gray-800">FJ$</span>
//                 <span className="text-gray-500 font-bold text-sm flex-1">Fijian Dollar</span>
//                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 py-1 bg-gray-100 rounded-lg">
//                   FJD
//                 </span>
//               </div> */}
//             </div>


//             <div className="flex flex-col gap-2.5">
//               <label style={{ color: PRIMARY }} className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
//                 <Coins size={14} />
//                 {/* {exchangeType == "SELL" ? "You Get" : "Need To Pay"} */}
//                 {exchangeType === "SELL"
//                   ? `Customer Receives (${FJD.code})`
//                   : `Customer Pays (${FJD.code})`
//                 }
//               </label>

//               {/* Converted amount */}
//               <input
//                 type="text" readOnly
//                 value={
//                   ratesLoading
//                     ? 'Loading rates…'
//                     : exchangePreview
//                       ? exchangePreview.formatted
//                       : '—'
//                 }
//                 className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-100 text-gray-700 font-black text-lg h-14"
//               />

//               {/* Currency dropdown */}
//               {rateError ? (
//                 <div className="flex items-center gap-2 px-4 py-3 bg-[#E00000]/5 border border-[#E00000]/20 rounded-xl text-red-600 text-xs font-bold">
//                   <AlertCircle size={13} /> {rateError}
//                 </div>
//               ) : ratesLoading ? (
//                 <div className="h-12 bg-gray-100 rounded-xl border border-gray-200 animate-pulse" />
//               ) : availableCurrencies.length === 0 ? (
//                 <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-bold">
//                   <AlertCircle size={13} /> No rates found for today — please enter manually below
//                 </div>
//               ) : (
//                 <div className="relative group">
//                   <select
//                     className={`${inputBase} border-gray-200 appearance-none pr-12`}
//                     value={toCurrency?.code ?? ''}
//                     onChange={e => {
//                       const found = availableCurrencies.find(c => c.code === e.target.value);
//                       setToCurrency(found ?? null);
//                       if (!useManualRate) setManualRate('');
//                     }}
//                   >
//                     {availableCurrencies.map(c => (
//                       <option key={c.code} value={c.code}>
//                         {c.code} — {exchangeType === "BUY"
//                           ? `Buy: ${c.buyingRate ?? '—'}`
//                           : `Sell: ${c.sellingRate ?? '—'}`
//                         }
//                       </option>
//                     ))}
//                   </select>
//                   <div style={{ color: PRIMARY }} className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 group-hover:scale-110 transition-transform">
//                     <ChevronDown size={20} />
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>


//         </div>

//         <div className="h-px bg-gray-100" />

//         {/* Denomination Panels */}
//         <div className="flex flex-col gap-3">
//           <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
//             <Banknote size={14} style={{ color: PRIMARY }} /> Cash Denomination Counts
//           </label>
//           <p className="text-xs text-gray-400 font-bold -mt-1">
//             Counter staff: count and confirm notes for both sides of the transaction.
//           </p>
//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
//             {senderInfo ? (
//               <DenominationPanel
//                 title="Sender Pays — Cash In"
//                 subtitle="Cash received from customer"
//                 flag={senderInfo.flag}
//                 symbol={senderInfo.symbol}
//                 currency={senderInfo.currency}
//                 notes={senderInfo.notes}
//                 coins={senderInfo.coins}
//                 targetAmount={
//                   exchangeType === "BUY"
//                     ? receiverGets
//                     : sendAmount
//                 }

//                 onRowsChange={rows => { senderDenomRowsRef.current = rows; }}
//                 accentColor="#3b82f6"
//               />
//             ) : (
//               <div style={{ borderColor: '#3b82f633' }} className="rounded-2xl border bg-gray-50 flex items-center justify-center p-8 text-center">
//                 <p className="font-black text-gray-400 text-sm">FJD denomination data not found — add Fiji to DENOMINATION_DATA</p>
//               </div>
//             )}
//             {/* {receiverInfo ? (
//               <DenominationPanel
//                 title="Receiver Gets — Cash Out" subtitle={`Cash to disburse to ${watchedCountry}`}
//                 flag={receiverInfo.flag} symbol={receiverInfo.symbol} currency={receiverInfo.currency}
//                 notes={receiverInfo.notes} coins={receiverInfo.coins}
//                 targetAmount={exchangePreview?.rawAmount ?? 0}
//                 onRowsChange={rows => { receiverDenomRowsRef.current = rows; }}
//                 accentColor={PRIMARY}
//               />
//             ) : (
//               <div style={{ borderColor: `${PRIMARY}33` }} className="rounded-2xl border bg-gray-50 flex items-center justify-center p-8 text-center">
//                 <p className="font-black text-gray-400 text-sm">Select a supported destination country to enable</p>
//               </div>
//             )} */}

//             {denomLoading ? (
//               <div className="rounded-2xl border bg-gray-50 flex items-center justify-center p-8 text-center">
//                 <p className="font-black text-gray-400 text-sm">Loading denomination…</p>
//               </div>
//             ) : denomError ? (
//               <div className="rounded-2xl border bg-[#E00000]/5 flex items-center justify-center p-8 text-center">
//                 <p className="font-black text-[#E00000] text-sm">{denomError}</p>
//               </div>
//             ) : receiverInfo ? (
//               <DenominationPanel
//                 title="Receiver Gets — Cash Out"
//                 // subtitle={`Cash to disburse to ${watchedCountry}`}
//                 subtitle={`Cash to disburse to ${selectedDenomCountry ?? ''}`}
//                 flag={receiverInfo.flag}
//                 symbol={receiverInfo.symbol}
//                 currency={receiverInfo.currency}
//                 notes={receiverInfo.notes}
//                 coins={receiverInfo.coins}
//                 // targetAmount={exchangePreview?.rawAmount ?? 0}
//                 targetAmount={
//                   exchangeType === "BUY"
//                     ? sendAmount
//                     : receiverGets
//                 }
//                 onRowsChange={rows => {
//                   receiverDenomRowsRef.current = rows;
//                 }}
//                 accentColor={PRIMARY}
//               />
//             ) : (
//               <div className="rounded-2xl border bg-gray-50 flex items-center justify-center p-8 text-center">
//                 <p className="font-black text-gray-400 text-sm">
//                   No denomination configured for this country
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Just above the actions div */}
//         {(!effectiveRate || effectiveRate <= 0) && !ratesLoading && (
//           <div className="flex items-center gap-2 px-4 py-3 bg-[#E00000]/5 border border-[#E00000]/20 rounded-xl text-red-600 text-sm font-bold">
//             <AlertCircle size={15} />
//             Exchange rates for today are not available. Please upload rates in Currency Master Data before proceeding.
//           </div>
//         )}

//         {/* Actions */}
//         <div className="flex items-center justify-between pt-4">
//           <button type="button" onClick={onBack}
//             className="text-gray-400 hover:text-gray-600 font-black text-sm transition-colors px-6 py-2 uppercase tracking-widest">
//             Back
//           </button>
//           <button type="submit"
//             disabled={!effectiveRate || effectiveRate <= 0 || ratesLoading}
//             style={{ background: PRIMARY, boxShadow: `0 8px 24px ${PRIMARY}44` }}
//             className="flex items-center justify-center gap-3 rounded-2xl text-gray-900 text-base font-black h-14 px-10 transition-all transform active:scale-95 hover:opacity-90 group">
//             Continue <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
//           </button>
//         </div>

//       </form>
//     </div>
//   );
// };




// import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import {
//   UserPlus, Globe, ChevronDown, ArrowRight,
//   Coins, RefreshCw, Banknote, AlertCircle,
//   CheckCircle2, MinusCircle, PlusCircle, X, ShieldCheck,
//   Upload, FileText, CreditCard, Store, Sparkles,
//   TrendingUp, ArrowLeftRight, BadgeCheck, Wallet
// } from 'lucide-react';
// import { DENOMINATION_DATA, SUPPORTED_COUNTRIES } from '../hooks/Denomination';
// import { useERPNextRates }   from '../hooks/useERPNextRates';
// import { useCountries }      from '../hooks/useCountry';
// import { useCustomers }      from '../hooks/useCustomer';
// import { useBaseCurrency, useDenomination } from '../hooks/useDenomination';
// import { useExchange }       from '../context/ExchangeContext';


// // ─── Design tokens ────────────────────────────────────────────────────────────
// const R = {
//   primary  : '#dc2626',   // red-600
//   accent   : '#ef4444',   // red-500  – hover states, focus rings
//   bright   : '#f87171',   // red-400  – light accents
//   dark     : '#7f1d1d',   // red-950-ish – header / deep bg
//   deeper   : '#450a0a',   // near-black red – gradient end
//   soft     : '#fff1f2',   // rose-50  – card fill
//   muted    : '#ffe4e6',   // rose-100 – dividers / tints
//   orange   : '#f97316',   // orange-500 – sender panel contrast
// };

// // Gradient helpers
// const gradHero   = `linear-gradient(135deg, ${R.deeper} 0%, ${R.dark} 50%, ${R.primary} 100%)`;
// const gradBtn    = `linear-gradient(135deg, ${R.accent} 0%, ${R.primary} 60%, ${R.dark} 100%)`;
// const gradCard   = `linear-gradient(135deg, ${R.soft} 0%, #fff 100%)`;

// // ─── Tiny utilities ───────────────────────────────────────────────────────────
// const inputBase =
//   'w-full rounded-2xl border bg-white h-14 px-5 text-base font-bold ' +
//   'focus:outline-none placeholder:text-gray-300 transition-all duration-200 ' +
//   'focus:ring-2 focus:ring-red-300 focus:border-[#E00000] shadow-sm';

// const fieldCls = (err) =>
//   `${inputBase} ${err ? 'border-[#E00000] bg-[#E00000]/5 focus:ring-red-300' : 'border-gray-100'}`;

// const ErrorMsg = ({ message }) =>
//   message ? (
//     <p className="flex items-center gap-1.5 text-[#E00000] text-xs font-bold mt-1.5">
//       <AlertCircle size={12} strokeWidth={3} /> {message}
//     </p>
//   ) : null;

// // ─── Divider with label ────────────────────────────────────────────────────────
// const SectionDivider = ({ label }) => (
//   <div className="flex items-center gap-3 my-1">
//     <div className="flex-1 h-px" style={{ background: R.muted }} />
//     <span className="text-[9px] font-black tracking-[0.2em] uppercase px-2 py-1 rounded-full"
//       style={{ color: R.primary, background: R.soft }}>
//       {label}
//     </span>
//     <div className="flex-1 h-px" style={{ background: R.muted }} />
//   </div>
// );

// // ─── Field label ──────────────────────────────────────────────────────────────
// const FieldLabel = ({ children, required, icon: Icon }) => (
//   <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500">
//     {Icon && <Icon size={11} style={{ color: R.primary }} />}
//     {children}
//     {required && <span style={{ color: R.accent }}>*</span>}
//   </label>
// );

// // ─── Card shell ───────────────────────────────────────────────────────────────
// const Card = ({ children, className = '', style = {} }) => (
//   <div
//     className={`rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden ${className}`}
//     style={style}
//   >
//     {children}
//   </div>
// );

// // ─── Card section header ──────────────────────────────────────────────────────
// const CardHeader = ({ icon: Icon, title, subtitle, pill }) => (
//   <div className="flex items-center gap-4 px-6 py-4" style={{ background: gradCard, borderBottom: `1px solid ${R.muted}` }}>
//     <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
//       style={{ background: gradBtn }}>
//       <Icon size={17} className="text-white" strokeWidth={2.5} />
//     </div>
//     <div className="flex-1 min-w-0">
//       <p className="font-black text-sm tracking-tight" style={{ color: R.dark }}>{title}</p>
//       {subtitle && <p className="text-[11px] text-gray-400 font-medium mt-0.5 truncate">{subtitle}</p>}
//     </div>
//     {pill && (
//       <span className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest text-white shadow-sm"
//         style={{ background: R.primary }}>
//         {pill}
//       </span>
//     )}
//   </div>
// );


// // ─────────────────────────────────────────────────────────────────────────────
// // buildRows — LOGIC UNCHANGED
// // ─────────────────────────────────────────────────────────────────────────────
// function buildRows(amount, denoms) {
//   const rows = [];
//   if (!amount || !denoms?.length) return rows;
//   let remaining = Math.round(parseFloat(amount) * 100);
//   const sortedDenoms = [...denoms].map(d => Math.round(d * 100)).sort((a, b) => b - a);
//   for (let i = 0; i < sortedDenoms.length; i++) {
//     const dc    = sortedDenoms[i];
//     const count = Math.floor(remaining / dc);
//     rows.push({ id: `${dc}-${i}`, denom: dc / 100, count: count > 0 ? count : 0 });
//     remaining -= count * dc;
//   }
//   return rows;
// }


// // ─────────────────────────────────────────────────────────────────────────────
// // DenominationPanel — redesigned, LOGIC UNCHANGED
// // ─────────────────────────────────────────────────────────────────────────────
// const DenominationPanel = ({
//   title, subtitle, flag, symbol, currency, notes, coins,
//   targetAmount, onRowsChange, accentColor = R.primary,
// }) => {
//   const [rows, setRows]               = useState([]);
//   const [customDenom, setCustomDenom] = useState('');
//   const [showCustom,  setShowCustom]  = useState(false);
//   const prevKey = useRef('');

//   useEffect(() => {
//     const key = `${currency}:${targetAmount}:${(notes||[]).length}:${(coins||[]).length}`;
//     if (prevKey.current !== key) {
//       prevKey.current = key;
//       setRows(buildRows(targetAmount, [...(notes||[]), ...(coins||[])]));
//     }
//   }, [currency, targetAmount, notes, coins]);

//   useEffect(() => { onRowsChange?.(rows); }, [rows]);

//   const totalDispensed = useMemo(() => rows.reduce((s,r) => s + r.denom*r.count, 0), [rows]);
//   const difference     = totalDispensed - (targetAmount || 0);
//   const isBalanced     = Math.abs(difference) < 0.01;
//   const isOver         = difference > 0.01;

//   const updateCount = useCallback((id,val) =>
//     setRows(p => p.map(r => r.id===id ? {...r, count:Math.max(0,parseInt(val)||0)} : r)), []);
//   const step = useCallback((id,d) =>
//     setRows(p => p.map(r => r.id===id ? {...r, count:Math.max(0,r.count+d)} : r)), []);
//   const removeRow = useCallback((id) => setRows(p => p.filter(r => r.id!==id)), []);
//   const reset = () => setRows(buildRows(targetAmount, [...(notes||[]), ...(coins||[])]));

//   const activeDenomSet = new Set(rows.map(r => r.denom));
//   const addablePresets = [...(notes||[]), ...(coins||[])].filter(d => !activeDenomSet.has(d));
//   const addPreset  = (d) => setRows(p => [...p, { id:d, denom:d, count:0 }]);
//   const addCustom  = () => {
//     const v = parseFloat(customDenom);
//     if (!v || v <= 0) return;
//     setRows(p => [...p, { id:Date.now(), denom:v, count:0 }]);
//     setCustomDenom(''); setShowCustom(false);
//   };

//   const statusCfg = isBalanced
//     ? { bg:`${accentColor}15`, border:`${accentColor}44`, color:accentColor,   Icon:CheckCircle2, label:'Balanced'  }
//     : isOver
//       ? { bg:'#fef9c322',     border:'#fde04788',       color:'#92400e',      Icon:AlertCircle,  label:`Over ${symbol}${Math.abs(difference).toFixed(2)}`  }
//       : { bg:'#fee2e222',     border:'#fca5a588',       color:'#b91c1c',      Icon:AlertCircle,  label:`Short ${symbol}${Math.abs(difference).toFixed(2)}` };

//   return (
//     <div className="rounded-2xl overflow-hidden shadow-md"
//       style={{ border:`1.5px solid ${accentColor}33`, background:'#fff' }}>

//       {/* ── Header ── */}
//       <div className="px-5 pt-5 pb-4" style={{ background:`${accentColor}08` }}>
//         <div className="flex items-start justify-between gap-3 flex-wrap">
//           <div className="flex items-center gap-3">
//             <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-sm bg-white border"
//               style={{ borderColor:`${accentColor}22` }}>
//               {flag}
//             </div>
//             <div>
//               <p className="font-black text-sm" style={{ color:accentColor }}>{title}</p>
//               <p className="text-[11px] text-gray-400 font-medium mt-0.5">{subtitle}</p>
//             </div>
//           </div>
//           {targetAmount > 0 && (
//             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black bg-white shadow-sm"
//               style={{ borderColor:`${accentColor}44`, color:accentColor }}>
//               <Wallet size={11} strokeWidth={3} />
//               {symbol}{targetAmount.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} {currency}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Stats row ── */}
//       <div className="grid grid-cols-3 divide-x bg-white border-b" style={{ borderColor:R.muted }}>
//         {[
//           { label:'Expected', val:targetAmount||0, col:'#6b7280', prefix:'' },
//           { label:'Counted',  val:totalDispensed,  col:accentColor, prefix:'' },
//           {
//             label: isBalanced ? 'Balanced' : isOver ? 'Overage' : 'Shortfall',
//             val: Math.abs(difference),
//             col: isBalanced ? accentColor : isOver ? '#d97706' : '#dc2626',
//             prefix: isBalanced ? '' : isOver ? '+' : '-',
//           },
//         ].map(({ label, val, col, prefix }) => (
//           <div key={label} className="flex flex-col items-center py-3 px-2">
//             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</span>
//             <span className="text-sm font-black" style={{ color:col }}>
//               {prefix}{symbol}{val.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
//             </span>
//           </div>
//         ))}
//       </div>

//       {/* ── Status + reset ── */}
//       <div className="flex items-center justify-between px-5 py-2.5 bg-white border-b" style={{ borderColor:R.muted }}>
//         <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black"
//           style={{ background:statusCfg.bg, borderColor:statusCfg.border, color:statusCfg.color }}>
//           <statusCfg.Icon size={11} strokeWidth={3} />
//           {statusCfg.label}
//         </div>
//         <button onClick={reset} type="button"
//           className="flex items-center gap-1.5 text-xs font-black text-gray-400 hover:text-[#E00000] transition-colors px-3 py-1.5 rounded-xl hover:bg-[#E00000]/5">
//           <RefreshCw size={11} strokeWidth={2.5} /> Reset
//         </button>
//       </div>

//       {/* ── Column headers ── */}
//       <div className="grid grid-cols-12 gap-2 px-5 py-2 border-b"
//         style={{ background:`${accentColor}06`, borderColor:R.muted }}>
//         {[['col-span-3','Note / Coin'],['col-span-5','Count'],['col-span-3 text-right','Subtotal'],['col-span-1','']].map(([cls,h]) => (
//           <div key={h} className={`${cls} text-[9px] font-black text-gray-400 uppercase tracking-widest`}>{h}</div>
//         ))}
//       </div>

//       {/* ── Rows ── */}
//       <div className="divide-y bg-white" style={{ borderColor:'#f9fafb' }}>
//         {rows.length === 0 && (
//           <div className="px-5 py-10 text-center">
//             <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
//               style={{ background:R.soft }}>
//               <Banknote size={18} style={{ color:R.bright }} />
//             </div>
//             <p className="text-gray-400 text-sm font-bold">No denominations added yet.</p>
//           </div>
//         )}
//         {rows.map(row => {
//           const subtotal = row.denom * row.count;
//           const active   = row.count > 0;
//           return (
//             <div key={row.id}
//               className="grid grid-cols-12 gap-2 items-center px-5 py-2.5 transition-all group"
//               style={active ? { background:`${accentColor}06` } : {}}>
//               {/* Denom badge */}
//               <div className="col-span-3">
//                 <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-sm font-black transition-all"
//                   style={active
//                     ? { background:`${accentColor}15`, borderColor:`${accentColor}44`, color:accentColor }
//                     : { borderColor:'#f3f4f6', color:'#374151' }}>
//                   <span className="text-[10px] opacity-40">{symbol}</span>
//                   {row.denom < 1 ? row.denom.toFixed(2) : row.denom.toLocaleString()}
//                 </div>
//               </div>
//               {/* Stepper */}
//               <div className="col-span-5 flex items-center gap-1.5">
//                 <button type="button" onClick={() => step(row.id,-1)}
//                   className="w-8 h-8 rounded-xl border flex items-center justify-center text-gray-300 hover:text-[#E00000] hover:border-[#E00000]/20 hover:bg-[#E00000]/5 transition-all"
//                   style={{ borderColor:'#f3f4f6' }}>
//                   <MinusCircle size={16} strokeWidth={2} />
//                 </button>
//                 <input type="number" min="0" value={row.count}
//                   onChange={e => updateCount(row.id,e.target.value)}
//                   className="w-16 h-8 rounded-xl border text-center text-sm font-black focus:outline-none transition-all"
//                   style={active
//                     ? { borderColor:`${accentColor}66`, background:`${accentColor}08` }
//                     : { borderColor:'#f3f4f6' }} />
//                 <button type="button" onClick={() => step(row.id,1)}
//                   className="w-8 h-8 rounded-xl border flex items-center justify-center transition-all"
//                   style={active
//                     ? { color:accentColor, borderColor:`${accentColor}55`, background:`${accentColor}0d` }
//                     : { color:'#d1d5db', borderColor:'#f3f4f6' }}>
//                   <PlusCircle size={16} strokeWidth={2} />
//                 </button>
//               </div>
//               {/* Subtotal */}
//               <div className="col-span-3 text-right">
//                 <span className="text-sm font-black transition-colors"
//                   style={{ color: active ? accentColor : '#e5e7eb' }}>
//                   {symbol}{subtotal.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
//                 </span>
//               </div>
//               {/* Remove */}
//               <div className="col-span-1 flex justify-end">
//                 <button type="button" onClick={() => removeRow(row.id)}
//                   className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-200 hover:text-[#E00000] hover:bg-[#E00000]/5 transition-all opacity-0 group-hover:opacity-100">
//                   <X size={13} strokeWidth={2.5} />
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* ── Total footer ── */}
//       <div className="px-5 py-4" style={{ background:`${accentColor}06`, borderTop:`1px solid ${accentColor}18` }}>
//         <div className="flex items-center justify-between rounded-2xl px-5 py-4 bg-white shadow-sm"
//           style={{ border:`1.5px solid ${accentColor}22` }}>
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
//               style={{ background:`${accentColor}15`, color:accentColor }}>
//               <Banknote size={18} strokeWidth={2.5} />
//             </div>
//             <div>
//               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Counted</p>
//               <p className="text-xs text-gray-400 font-bold mt-0.5">
//                 {rows.filter(r=>r.count>0).length} denom · {rows.reduce((s,r)=>s+r.count,0)} notes
//               </p>
//             </div>
//           </div>
//           <div className="text-right">
//             <p className="text-2xl font-black" style={{ color:accentColor }}>
//               {symbol}{totalDispensed.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
//             </p>
//             <p className="text-xs text-gray-400 font-bold mt-0.5">{currency}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// // ─────────────────────────────────────────────────────────────────────────────
// // GovernmentIdSection — redesigned, LOGIC UNCHANGED
// // ─────────────────────────────────────────────────────────────────────────────
// const GovernmentIdSection = ({ register, errors, setValue, watch }) => {
//   const [dragOver,    setDragOver]    = useState(false);
//   const [previewUrl,  setPreviewUrl]  = useState(null);
//   const [previewFile, setPreviewFile] = useState(null);

//   const idType = watch('idType');

//   register('docFile', { validate: v => !!v || 'Please upload a government document' });

//   const fetchCustomerById = async (idNumber) => {
//     if (!idNumber || idNumber.length < 3) return;
//     try {
//       const res = await fetch(
//         `http://182.71.135.110:82/api/resource/Customer/${idNumber}`,
//         { method:'GET', headers:{ Authorization:'token 661457e17b8612a:32a5ddcc5a9c177' } }
//       );
//       if (!res.ok) { console.log('Customer not found'); return; }
//       const { data: c } = await res.json();
//       setValue('firstName', c.custom_first_name || '');
//       setValue('lastName',  c.custom_last_name  || '');
//       setValue('country',   c.custom_country    || '');
//       setValue('city',      c.custom_city       || '');
//       console.log('Customer found...', c);
//       if (c.image) {
//         const url = c.image.startsWith('http') ? c.image : `http://182.71.135.110:82${c.image}`;
//         setPreviewUrl(url); setPreviewFile(null);
//         setValue('docFile', url, { shouldValidate:true });
//       }
//     } catch (e) { console.error('Error fetching customer:', e); }
//   };

//   const handleFile = (file) => {
//     if (!file) return;
//     if (!['image/jpeg','image/png','image/webp','application/pdf'].includes(file.type))
//       { alert('Please upload a JPG, PNG, WEBP, or PDF file.'); return; }
//     if (file.size > 10*1024*1024) { alert('File must be under 10 MB.'); return; }
//     setValue('docFile', file, { shouldValidate:true });
//     setPreviewFile(file); setPreviewUrl(URL.createObjectURL(file));
//   };

//   const handleDrop  = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };
//   const removeFile  = () => { setValue('docFile',null,{shouldValidate:true}); setPreviewFile(null); setPreviewUrl(null); };

//   const idTypes = [
//     { key:'PASSPORT',      label:'Passport',      Icon:FileText   },
//     { key:'GOVERNMENT_ID', label:'Government ID', Icon:CreditCard },
//   ];
//   const placeholders = { PASSPORT:'e.g. A12345678', GOVERNMENT_ID:'e.g. 987654321' };

//   return (
//     <Card>
//       <CardHeader icon={ShieldCheck} title="Government ID Verification"
//         subtitle="Required for compliance — data is encrypted and secure" pill="ID Verification" />

//       <div className="px-6 py-6 flex flex-col gap-6">

//         {/* ID Type toggle */}
//         <div className="flex flex-col gap-2.5">
//           <FieldLabel required icon={CreditCard}>ID Type</FieldLabel>
//           <input type="hidden" {...register('idType',{required:'Please select an ID type'})} />
//           <div className="flex p-1.5 rounded-2xl border" style={{ background:R.soft, borderColor:R.muted }}>
//             {idTypes.map(({ key, label, Icon }) => {
//               const active = idType === key;
//               return (
//                 <button key={key} type="button"
//                   onClick={() => { setValue('idType',key,{shouldValidate:true}); removeFile(); }}
//                   className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
//                     active ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-600'
//                   }`}>
//                   <Icon size={15} style={active ? { color:R.primary } : {}} />
//                   {label}
//                 </button>
//               );
//             })}
//           </div>
//           <ErrorMsg message={errors.idType?.message} />
//         </div>

//         {/* Gov ID sub-type */}
//         {idType === 'GOVERNMENT_ID' && (
//           <div className="flex flex-col gap-2.5">
//             <FieldLabel icon={FileText}>Government ID Type</FieldLabel>
//             <div className="relative group">
//               <select className={`${inputBase} border-gray-100 appearance-none pr-12`}
//                 {...register('government_id')}>
//                 <option>Driver's Licence</option>
//                 <option>Voter ID Card</option>
//               </select>
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 group-hover:scale-110 transition-transform"
//                 style={{ color:R.primary }}>
//                 <ChevronDown size={18} />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ID Number */}
//         <div className="flex flex-col gap-2.5">
//           <FieldLabel required icon={BadgeCheck}>
//             {idType==='PASSPORT' ? 'Passport Number' : 'ID Number'}
//           </FieldLabel>
//           <input type="text" placeholder={placeholders[idType]}
//             {...register('idNumber',{
//               required:'ID number is required',
//               minLength:{value:3,message:'ID number is too short'},
//               onBlur:(e) => { fetchCustomerById(e.target.value); },
//             })}
//             className={fieldCls(errors.idNumber)} />
//           <ErrorMsg message={errors.idNumber?.message} />
//         </div>

//         {/* Document Upload */}
//         <div className="flex flex-col gap-2.5">
//           <FieldLabel required icon={Upload}>
//             {idType==='PASSPORT' ? 'Passport Photo / Scan' : 'Government ID Photo / Scan'}
//           </FieldLabel>

//           {previewUrl ? (
//             <div className="relative rounded-2xl border overflow-hidden"
//               style={{ borderColor: errors.docFile ? '#f87171' : `${R.primary}44` }}>
//               {previewFile?.type === 'application/pdf' ? (
//                 <div className="flex items-center gap-3 px-5 py-4 bg-white">
//                   <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
//                     style={{ background:R.soft, color:R.primary }}>
//                     <FileText size={18} />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-black text-gray-900 text-sm truncate">{previewFile.name}</p>
//                     <p className="text-xs text-gray-400 font-bold">{(previewFile.size/1024).toFixed(1)} KB · PDF</p>
//                   </div>
//                   <button type="button" onClick={removeFile}
//                     className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#E00000] hover:bg-[#E00000]/5 transition-all">
//                     <X size={15} />
//                   </button>
//                 </div>
//               ) : (
//                 <>
//                   <img src={previewUrl} alt="ID" className="w-full max-h-52 object-contain p-4 bg-gray-50" />
//                   <button type="button" onClick={removeFile}
//                     className="absolute top-3 right-3 w-8 h-8 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-400 hover:text-[#E00000] transition-colors">
//                     <X size={15} />
//                   </button>
//                   <div className="flex items-center justify-center gap-2 py-2.5 text-[11px] font-black uppercase tracking-wider"
//                     style={{ background:`${R.primary}15`, color:R.dark }}>
//                     <CheckCircle2 size={13} strokeWidth={3} /> Document Verified
//                   </div>
//                 </>
//               )}
//             </div>
//           ) : (
//             <label
//               onDragOver={e => { e.preventDefault(); setDragOver(true); }}
//               onDragLeave={() => setDragOver(false)}
//               onDrop={handleDrop}
//               className="flex flex-col items-center justify-center gap-4 py-10 px-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all group"
//               style={
//                 dragOver
//                   ? { borderColor:R.primary, background:`${R.primary}08` }
//                   : errors.docFile
//                     ? { borderColor:'#fca5a5', background:'#fff1f2' }
//                     : { borderColor:R.muted,  background:R.soft }
//               }>
//               <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf"
//                 className="hidden" onChange={e => handleFile(e.target.files[0])} />
//               <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm"
//                 style={dragOver
//                   ? { background:`${R.primary}20`, color:R.dark }
//                   : errors.docFile
//                     ? { background:'#fee2e2', color:'#ef4444' }
//                     : { background:'white', color:R.primary }}>
//                 <Upload size={24} strokeWidth={1.5} />
//               </div>
//               <div className="text-center">
//                 <p className="font-black text-gray-700 text-sm">
//                   Drop file here or <span style={{ color:R.primary }} className="underline underline-offset-2">browse files</span>
//                 </p>
//                 <p className="text-xs text-gray-400 font-medium mt-1">JPG, PNG, WEBP or PDF · Max 10 MB</p>
//               </div>
//             </label>
//           )}
//           <ErrorMsg message={errors.docFile?.message} />
//         </div>
//       </div>
//     </Card>
//   );
// };


// // ─────────────────────────────────────────────────────────────────────────────
// // ReceiverForm — fully redesigned, ALL LOGIC UNCHANGED
// // ─────────────────────────────────────────────────────────────────────────────
// export const ReceiverForm = ({
//   initialData,
//   sendAmount: externalSendAmount,
//   onContinue,
//   onBack,
//   onSummaryChange,
// }) => {
//   const { register, handleSubmit, setValue, watch, formState:{ errors } } = useForm({
//     defaultValues: {
//       country     : initialData?.country   ?? 'India',
//       firstName   : initialData?.firstName ?? '',
//       lastName    : initialData?.lastName  ?? '',
//       city        : initialData?.city      ?? '',
//       idType      : 'PASSPORT',
//       idNumber    : '',
//       docFile     : null,
//       pastReceiver: 'New Receiver',
//       exchangeType: 'BUY',
//     },
//   });

//   const { receiverGets, sendAmount:ctxSendAmount, serviceFee, gstAmount, total } = useExchange();

//   const roundToNearestFiveCents = (amount) => {
//     if (!amount) return 0;
//     return Math.round(amount / 0.05) * 0.05;
//   };
//   const roundedTotal = roundToNearestFiveCents(total);

//   const exchangeType  = watch('exchangeType');
//   const exchangeTypes = [
//     { key:'BUY',  label:'Buy Foreign',  Icon:TrendingUp  },
//     { key:'SELL', label:'Sell Foreign', Icon:ArrowLeftRight },
//   ];

//   const {
//     rates:erpRates, availableCurrencies, loading:ratesLoading,
//     error:rateError, rateDate, noDataForToday, showUploadModal, setShowUploadModal,
//   } = useERPNextRates();

//   const { countries, loading:countryLoading, error:countryError } = useCountries();
//   const customerList = useCustomers();

//   const FJD = { code:'FJD', symbol:'FJ$', name:'Fijian Dollar' };

//   const [toCurrency,      setToCurrency]      = useState(null);
//   const [manualRate,      setManualRate]      = useState('');
//   const [useManualRate,   setUseManualRate]   = useState(false);
//   const [sendAmount,      setSendAmount]      = useState(externalSendAmount ?? 1000);
//   const [sendAmountError, setSendAmountError] = useState('');

//   const senderDenomRowsRef   = useRef([]);
//   const receiverDenomRowsRef = useRef([]);

//   useEffect(() => {
//     if (availableCurrencies.length && !toCurrency) setToCurrency(availableCurrencies[0]);
//   }, [availableCurrencies]);

//   useEffect(() => { if (noDataForToday) setUseManualRate(true); }, [noDataForToday]);

//   const effectiveRate = useMemo(() => {
//     if (!toCurrency) return null;
//     console.log('toooo currency', toCurrency);
//     if (useManualRate) { const m=parseFloat(manualRate); return !isNaN(m)&&m>0?m:null; }
//     if (exchangeType==='SELL') return toCurrency.sellingRate ?? null;
//     if (exchangeType==='BUY')  return toCurrency.buyingRate  ?? null;
//     return null;
//   }, [toCurrency, exchangeType, useManualRate, manualRate]);

//   const exchangePreview = useMemo(() => {
//     if (!effectiveRate||effectiveRate<=0) return null;
//     if (!sendAmount   ||sendAmount   <=0) return null;
//     let receiverAmount = 0;
//     if (exchangeType==='BUY')  { console.log('send amount',sendAmount); console.log('effective rate',effectiveRate); receiverAmount=sendAmount*effectiveRate; }
//     if (exchangeType==='SELL') { receiverAmount=sendAmount*effectiveRate; }
//     receiverAmount = Math.round((receiverAmount+Number.EPSILON)*100)/100;
//     return { rate:effectiveRate, rawAmount:receiverAmount,
//       formatted:receiverAmount.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}) };
//   }, [effectiveRate, sendAmount, exchangeType]);

//   const watchedCountry = watch('country');

//   useEffect(() => {
//     if (!onSummaryChange) return;
//     onSummaryChange({
//       sendAmount, currency:FJD.code,
//       exchangeRate:exchangePreview?.rate??0, receiverGets:exchangePreview?.rawAmount??0,
//       receiverCurrency:toCurrency?.code??'', exchangeType,
//     });
//   }, [sendAmount, toCurrency, exchangePreview]);

//   const { data:baseCurrencyInfo } = useBaseCurrency();
//   const selectedDenomCountry = toCurrency?.country ?? null;
//   const { data:foreignCurrencyInfo, loading:denomLoading, error:denomError } = useDenomination(selectedDenomCountry);

//   const senderInfo   = exchangeType==='BUY' ? baseCurrencyInfo    : foreignCurrencyInfo;
//   const receiverInfo = exchangeType==='BUY' ? foreignCurrencyInfo : baseCurrencyInfo;

//   console.log('Sender info', senderInfo);
//   console.log('Receiver Info', receiverInfo);

//   const onSubmit = (data) => {
//     if (!sendAmount||sendAmount<=0)       { setSendAmountError('Please enter a valid send amount'); return; }
//     if (!effectiveRate||effectiveRate<=0) return;
//     if (useManualRate&&(!manualRate||parseFloat(manualRate)<=0)) return;
//     setSendAmountError('');

//     const getDenomType = (denom,notesArr=[],coinsArr=[]) => {
//       if (notesArr.includes(denom)) return 'Note';
//       if (coinsArr.includes(denom)) return 'Coin';
//       return denom>=1?'Note':'Coin';
//     };

//     onContinue?.({
//       ...data,
//       sender_notes:senderInfo?.notes??[], sender_notes_name:senderInfo?.notes_name??[],
//       sender_coins:senderInfo?.coins??[], sender_coins_name:senderInfo?.coins_name??[],
//       notes:receiverInfo?.notes??[], notes_name:receiverInfo?.notes_name??[],
//       coins:receiverInfo?.coins??[], coins_name:receiverInfo?.coins_name??[],
//       sendAmount, senderCurrency:toCurrency?.code, receiverCurrency:toCurrency?.code??'',
//       exchangeRate:exchangePreview?.rate??0, receiverGets:exchangePreview?.rawAmount??0,
//       rateSource:useManualRate?'manual':'erpnext', rateDate:useManualRate?null:rateDate,
//       senderDenominationRows: senderDenomRowsRef.current.filter(r=>r.count>0).map(r=>({
//         denomination_value:r.denom,
//         denomination_type:getDenomType(r.denom,senderInfo?.notes,senderInfo?.coins),
//         count:r.count, subtotal:r.denom*r.count,
//       })),
//       receiverDenominationRows: receiverDenomRowsRef.current.filter(r=>r.count>0).map(r=>({
//         denomination_value:r.denom,
//         denomination_type:getDenomType(r.denom,receiverInfo?.notes,receiverInfo?.coins),
//         count:r.count, subtotal:r.denom*r.count,
//       })),
//     });
//   };

//   // ── render ────────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen" style={{ background:'#fafafa' }}>

//       {/* ── Upload modal — logic unchanged ── */}
//       {showUploadModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
//           <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
//             <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl"
//               style={{ background:R.soft }}>
//               📂
//             </div>
//             <h2 className="text-xl font-black text-gray-900 mb-2">No Exchange Rates Found</h2>
//             <p className="text-gray-500 text-sm mb-6 leading-relaxed">
//               Upload exchange rates in <span className="font-black" style={{ color:R.dark }}>Currency Master Data</span> first.
//             </p>
//             <button type="button" onClick={() => setShowUploadModal(false)}
//               className="font-black px-8 py-3 rounded-2xl text-white text-sm transition-all hover:opacity-90 w-full"
//               style={{ background:gradBtn, boxShadow:`0 8px 24px ${R.primary}44` }}>
//               OK, Got it
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ── HERO header ── */}
//       <div className="relative overflow-hidden" style={{ background:gradHero }}>
//         {/* Decorative circles */}
//         {/* <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10" style={{ background:R.bright }} />
//         <div className="absolute -bottom-8 -left-8  w-32 h-32 rounded-full opacity-10" style={{ background:R.accent }} />
//         <div className="absolute top-4 right-1/3 w-4 h-4 rounded-full opacity-20" style={{ background:R.bright }} /> */}

//         <div className="relative px-6 sm:px-10 pt-8 pb-10">
//           <div className="flex items-center gap-4 mb-6">
//             <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
//               style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.2)' }}>
//               <UserPlus size={22} className="text-white" strokeWidth={2} />
//             </div>
//             <div>
//               <h1 className="text-white font-black text-2xl tracking-tight">Customer Details</h1>
//               <p className="text-[#b5f000] text-sm font-medium mt-0.5">Currency Exchange Transaction</p>
//             </div>
//           </div>

//           {/* Live rate strip */}
//           {toCurrency && effectiveRate && (
//             <div className="flex items-center gap-3 flex-wrap">
//               <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
//                 style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.18)' }}>
                
//                 <span className="text-white/80 text-xs font-bold">Live Rate</span>
//                 <span className="text-white font-black text-sm">
//                   1 {toCurrency.code} = {FJD.symbol}{effectiveRate} {FJD.code}
//                 </span>
//               </div>
//               <div className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest"
//                 style={{ background:'rgba(255,255,255,0.15)', color:'#fde68a' }}>
//                 {exchangeType === 'BUY' ? '🟢 Buying' : '🔴 Selling'}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Form ── */}
//       <form onSubmit={handleSubmit(onSubmit)} className="px-4 sm:px-8 lg:px-12 py-8 flex flex-col gap-6 max-w-5xl mx-auto" noValidate>

//         {/* ── Government ID ── */}
//         <GovernmentIdSection register={register} errors={errors} setValue={setValue} watch={watch} />

//         <SectionDivider label="Personal Information" />

//         {/* ── Name row ── */}
//         <Card>
//           <CardHeader icon={UserPlus} title="Customer Name" subtitle="Enter the customer's legal name as on ID" />
//           <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-5">
//             {[
//               ['firstName','First Name','e.g. Maria',{ required:'First name is required', minLength:{value:2,message:'Too short'} }],
//               ['lastName', 'Last Name', 'e.g. Garcia',{ required:'Last name is required',  minLength:{value:2,message:'Too short'} }],
//             ].map(([name,label,ph,rules]) => (
//               <div key={name} className="flex flex-col gap-2">
//                 <FieldLabel required>{label}</FieldLabel>
//                 <input type="text" placeholder={ph} {...register(name,rules)} className={fieldCls(errors[name])} />
//                 <ErrorMsg message={errors[name]?.message} />
//               </div>
//             ))}
//           </div>
//         </Card>

//         {/* ── Location row ── */}
//         <Card>
//           <CardHeader icon={Globe} title="Location" subtitle="Customer's country and city of residence" />
//           <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-5">
//             {/* Country */}
//             <div className="flex flex-col gap-2">
//               <FieldLabel required icon={Globe}>Country</FieldLabel>
//               <div className="relative group">
//                 {countryError ? (
//                   <p className="text-[#E00000] text-sm font-bold">Failed to load countries</p>
//                 ) : countryLoading ? (
//                   <div className="h-14 rounded-2xl animate-pulse" style={{ background:R.soft }} />
//                 ) : (
//                   <select {...register('country',{required:'Please select a country'})}
//                     className={`${fieldCls(errors.country)} appearance-none pl-12 pr-12`}>
//                     <option value="">Select Country</option>
//                     {countries.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
//                   </select>
//                 )}
//                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4"
//                   style={{ color:R.primary }}>
//                   <Globe size={18} />
//                 </div>
//                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 group-hover:scale-110 transition-transform"
//                   style={{ color:R.primary }}>
//                   <ChevronDown size={18} />
//                 </div>
//               </div>
//               <ErrorMsg message={errors.country?.message} />
//             </div>

//             {/* City */}
//             <div className="flex flex-col gap-2">
//               <FieldLabel required>City / Province</FieldLabel>
//               <input type="text" placeholder="e.g. Madrid"
//                 {...register('city',{required:'City is required'})}
//                 className={fieldCls(errors.city)} />
//               <ErrorMsg message={errors.city?.message} />
//             </div>
//           </div>
//         </Card>

//         <SectionDivider label="Exchange Details" />

//         {/* ── Exchange type ── */}
//         <Card>
//           <CardHeader icon={ArrowLeftRight} title="Transaction Type" subtitle="Choose whether you are buying or selling foreign currency" />
//           <div className="px-6 py-6">
//             <input type="hidden" {...register('exchangeType',{required:'Please select an Exchange type'})} />
//             <div className="grid grid-cols-2 gap-3">
//               {exchangeTypes.map(({ key, label, Icon }) => {
//                 const active = exchangeType === key;
//                 return (
//                   <button key={key} type="button"
//                     onClick={() => setValue('exchangeType',key,{shouldValidate:true})}
//                     className="relative py-5 px-4 rounded-2xl font-bold text-sm transition-all flex flex-col items-center gap-2.5 border-2 overflow-hidden group"
//                     style={active
//                       ? { borderColor:R.primary, background:`${R.primary}08`, color:R.dark, boxShadow:`0 4px 20px ${R.primary}22` }
//                       : { borderColor:'#f3f4f6', background:'white', color:'#9ca3af' }}>
//                     {active && (
//                       <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
//                         style={{ background:R.primary }}>
//                         <CheckCircle2 size={11} className="text-white" strokeWidth={3} />
//                       </div>
//                     )}
//                     <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
//                       style={active
//                         ? { background:gradBtn, color:'white', boxShadow:`0 4px 12px ${R.primary}44` }
//                         : { background:'#f9fafb', color:'#d1d5db' }}>
//                       <Icon size={20} strokeWidth={2} />
//                     </div>
//                     <span className={`font-black text-sm ${active ? '' : 'text-gray-400'}`}
//                       style={active ? { color:R.dark } : {}}>
//                       {label}
//                     </span>
//                   </button>
//                 );
//               })}
//             </div>
//             <ErrorMsg message={errors.exchangeType?.message} />
//           </div>
//         </Card>

//         {/* ── Currency & Amount ── */}
//         <Card>
//           <CardHeader icon={Coins} title="Currency & Amount" subtitle="Enter the transaction amount and select currency" />
//           <div className="px-6 py-6 flex flex-col gap-5">

//             {/* Rate badge */}
//             {effectiveRate && toCurrency && (
//               <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
//                 style={{ background:R.soft, border:`1px solid ${R.muted}` }}>
//                 <div className="w-8 h-8 rounded-xl flex items-center justify-center"
//                   style={{ background:gradBtn }}>
//                   <TrendingUp size={14} className="text-white" />
//                 </div>
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <span className="text-xs font-bold text-gray-500">Exchange Rate</span>
//                   <span className="font-black text-sm" style={{ color:R.dark }}>
//                     1 {toCurrency.code} = {FJD.symbol}{effectiveRate}
//                   </span>
//                   <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase"
//                     style={{ background:R.muted, color:R.primary }}>
//                     {exchangeType === 'BUY' ? 'Buy Rate' : 'Sell Rate'}
//                   </span>
//                 </div>
//               </div>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               {/* ── Give side ── */}
//               <div className="flex flex-col gap-3">
//                 <FieldLabel required icon={Coins}>
//                   {exchangeType==='SELL'
//                     ? `Customer Gives (${toCurrency?.code??'Foreign'})`
//                     : `Customer Gets (${toCurrency?.code??'Foreign'})`}
//                 </FieldLabel>

//                 {/* Currency selector */}
//                 {rateError ? (
//                   <div className="flex items-center gap-2 px-4 py-3 bg-[#E00000]/5 border border-[#E00000]/20 rounded-2xl text-red-600 text-xs font-bold">
//                     <AlertCircle size={13} />{rateError}
//                   </div>
//                 ) : ratesLoading ? (
//                   <div className="h-14 rounded-2xl animate-pulse" style={{ background:R.soft }} />
//                 ) : availableCurrencies.length===0 ? (
//                   <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-xs font-bold">
//                     <AlertCircle size={13} />No rates for today — enter manually below
//                   </div>
//                 ) : (
//                   <div className="relative group">
//                     <select
//                       className={`${inputBase} border-gray-100 appearance-none pr-12`}
//                       value={toCurrency?.code??''}
//                       onChange={e => {
//                         const found = availableCurrencies.find(c=>c.code===e.target.value);
//                         setToCurrency(found??null);
//                         if (!useManualRate) setManualRate('');
//                       }}>
//                       {availableCurrencies.map(c => (
//                         <option key={c.code} value={c.code}>
//                           {c.code} — {exchangeType==='BUY'?`Buy: ${c.buyingRate??'—'}`:`Sell: ${c.sellingRate??'—'}`}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 group-hover:scale-110 transition-transform"
//                       style={{ color:R.primary }}>
//                       <ChevronDown size={18} />
//                     </div>
//                   </div>
//                 )}

//                 {/* Amount input */}
//                 <div className="relative">
//                   <input type="number" min="0" step="any" value={sendAmount}
//                     onChange={e => {
//                       const val=parseFloat(e.target.value)||0;
//                       setSendAmount(val);
//                       setSendAmountError(val>0?'':'Please enter a valid send amount');
//                     }}
//                     placeholder="0.00"
//                     className={`${inputBase} text-xl font-black pr-20 ${
//                       sendAmountError ? 'border-[#E00000] bg-[#E00000]/5 focus:ring-red-200' : 'border-gray-100'
//                     }`} />
//                   <div className="absolute inset-y-0 right-0 flex items-center pr-4">
//                     <span className="text-xs font-black px-2 py-1 rounded-xl"
//                       style={{ background:R.soft, color:R.dark }}>
//                       {toCurrency?.code??'---'}
//                     </span>
//                   </div>
//                 </div>
//                 {sendAmountError && <ErrorMsg message={sendAmountError} />}
//               </div>

//               {/* ── Receive side ── */}
//               <div className="flex flex-col gap-3">
//                 <FieldLabel icon={Wallet}>
//                   {exchangeType==='SELL'
//                     ? `Customer Receives (${FJD.code})`
//                     : `Customer Pays (${FJD.code})`}
//                 </FieldLabel>

//                 {/* Converted amount display */}
//                 <div className="relative">
//                   <div className="w-full h-14 rounded-2xl flex items-center px-5 pr-20 text-xl font-black shadow-sm"
//                     style={{
//                       background: exchangePreview ? `${R.primary}08` : '#f9fafb',
//                       border: `1.5px solid ${exchangePreview ? R.primary+'33' : '#f3f4f6'}`,
//                       color: exchangePreview ? R.dark : '#9ca3af',
//                     }}>
//                     {ratesLoading ? (
//                       <span className="text-sm font-bold text-gray-400 animate-pulse">Loading rates…</span>
//                     ) : exchangePreview ? (
//                       <span>{FJD.symbol}{exchangePreview.formatted}</span>
//                     ) : (
//                       <span className="text-sm font-bold text-gray-300">—</span>
//                     )}
//                   </div>
//                   <div className="absolute inset-y-0 right-0 flex items-center pr-4">
//                     <span className="text-xs font-black px-2 py-1 rounded-xl"
//                       style={{ background:R.soft, color:R.dark }}>
//                       {FJD.code}
//                     </span>
//                   </div>
//                 </div>

//                 {/* FJD label pill */}
//                 <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border"
//                   style={{ background:'white', borderColor:R.muted }}>
//                   <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
//                     style={{ background:R.soft }}>🇫🇯</div>
//                   <div>
//                     <p className="text-xs font-black" style={{ color:R.dark }}>Fijian Dollar</p>
//                     <p className="text-[10px] text-gray-400 font-medium">FJD · Local Currency</p>
//                   </div>
//                   {exchangePreview && (
//                     <div className="ml-auto flex items-center gap-1 text-xs font-black"
//                       style={{ color:R.primary }}>
//                       <CheckCircle2 size={13} strokeWidth={3} /> Calculated
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>

//         <SectionDivider label="Cash Denomination Counts" />

//         {/* ── Denomination Panels ── */}
//         <div className="flex flex-col gap-3">
//           <div className="flex items-center gap-3 px-1">
//             <div className="w-8 h-8 rounded-xl flex items-center justify-center"
//               style={{ background:gradBtn }}>
//               <Banknote size={15} className="text-white" />
//             </div>
//             <div>
//               <p className="font-black text-sm text-gray-800">Cash Denomination Counts</p>
//               <p className="text-xs text-gray-400">Counter staff: count and confirm notes for both sides.</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
//             {/* Sender panel */}
//             {senderInfo ? (
//               <DenominationPanel
//                 title="Sender Pays — Cash In" subtitle="Cash received from customer"
//                 flag={senderInfo.flag} symbol={senderInfo.symbol} currency={senderInfo.currency}
//                 notes={senderInfo.notes} coins={senderInfo.coins}
//                 targetAmount={exchangeType==='BUY'?receiverGets:sendAmount}
//                 onRowsChange={rows => { senderDenomRowsRef.current=rows; }}
//                 accentColor={R.orange}
//               />
//             ) : (
//               <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/50 flex flex-col items-center justify-center p-10 gap-3 text-center">
//                 <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-orange-100">
//                   <Banknote size={20} className="text-orange-400" />
//                 </div>
//                 <p className="font-black text-gray-400 text-sm">FJD denomination data not found</p>
//                 <p className="text-xs text-gray-300">Add Fiji to DENOMINATION_DATA</p>
//               </div>
//             )}

//             {/* Receiver panel */}
//             {denomLoading ? (
//               <div className="rounded-2xl border flex flex-col items-center justify-center p-10 gap-3"
//                 style={{ borderColor:R.muted, background:R.soft }}>
//                 <RefreshCw size={24} className="animate-spin" style={{ color:R.bright }} />
//                 <p className="font-black text-gray-400 text-sm">Loading denomination data…</p>
//               </div>
//             ) : denomError ? (
//               <div className="rounded-2xl border border-[#E00000]/20 bg-[#E00000]/5 flex items-center justify-center p-8 text-center">
//                 <p className="font-black text-[#E00000] text-sm">{denomError}</p>
//               </div>
//             ) : receiverInfo ? (
//               <DenominationPanel
//                 title="Receiver Gets — Cash Out"
//                 subtitle={`Cash to disburse to ${selectedDenomCountry??''}`}
//                 flag={receiverInfo.flag} symbol={receiverInfo.symbol} currency={receiverInfo.currency}
//                 notes={receiverInfo.notes} coins={receiverInfo.coins}
//                 targetAmount={exchangeType==='BUY'?sendAmount:receiverGets}
//                 onRowsChange={rows => { receiverDenomRowsRef.current=rows; }}
//                 accentColor={R.primary}
//               />
//             ) : (
//               <div className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-10 gap-3 text-center"
//                 style={{ borderColor:R.muted, background:R.soft }}>
//                 <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background:R.muted }}>
//                   <Globe size={20} style={{ color:R.bright }} />
//                 </div>
//                 <p className="font-black text-gray-400 text-sm">No denomination configured</p>
//                 <p className="text-xs text-gray-300">Select a supported destination country</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Rate error banner */}
//         {(!effectiveRate||effectiveRate<=0) && !ratesLoading && (
//           <div className="flex items-start gap-3 px-5 py-4 rounded-2xl border"
//             style={{ background:'#fff1f2', borderColor:'#fecaca' }}>
//             <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
//               style={{ background:R.soft }}>
//               <AlertCircle size={16} style={{ color:R.primary }} />
//             </div>
//             <div>
//               <p className="font-black text-sm" style={{ color:R.dark }}>Exchange Rates Unavailable</p>
//               <p className="text-xs text-[#E00000] font-medium mt-0.5">
//                 No rates found for today. Please upload rates in Currency Master Data before proceeding.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* ── Action bar ── */}
//         <div className="flex items-center justify-between pt-2 pb-6">
//           <button type="button" onClick={onBack}
//             className="flex items-center gap-2 text-sm font-black transition-all px-6 py-3 rounded-2xl hover:bg-[#E00000]/5 uppercase tracking-widest"
//             style={{ color:'#9ca3af' }}
//             onMouseEnter={e => { e.currentTarget.style.color=R.primary; }}
//             onMouseLeave={e => { e.currentTarget.style.color='#9ca3af'; }}>
//             ← Back
//           </button>

//           <button type="submit"
//             disabled={!effectiveRate||effectiveRate<=0||ratesLoading}
//             className="flex items-center gap-3 rounded-2xl text-white text-base font-black h-14 px-10 transition-all active:scale-95 group disabled:opacity-40 disabled:cursor-not-allowed"
//             style={{
//               background: gradBtn,
//               boxShadow: `0 8px 32px ${R.primary}55`,
//             }}>
//             <span>Continue</span>
//             <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
//           </button>
//         </div>

//       </form>
//     </div>
//   );
// };












import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  UserPlus, Globe, ChevronDown, ArrowRight,
  Coins, RefreshCw, Banknote, AlertCircle,
  CheckCircle2, MinusCircle, PlusCircle, X, ShieldCheck,
  Upload, FileText, CreditCard, Store, Sparkles,
  TrendingUp, ArrowLeftRight, BadgeCheck, Wallet
} from 'lucide-react';
import { DENOMINATION_DATA, SUPPORTED_COUNTRIES } from '../hooks/Denomination';
import { useERPNextRates }   from '../hooks/useERPNextRates';
import { useCountries }      from '../hooks/useCountry';
import { useCustomers }      from '../hooks/useCustomer';
import { useBaseCurrency, useDenomination } from '../hooks/useDenomination';
import { useExchange }       from '../context/ExchangeContext';


// ─── Tiny utilities ───────────────────────────────────────────────────────────
const inputBase =
  'w-full rounded-lg border border-gray-200 bg-white h-12 px-4 text-sm text-gray-800 ' +
  'focus:outline-none placeholder:text-gray-400 transition-colors ' +
  'focus:ring-2 focus:ring-red-100 focus:border-[#E00000]';

const fieldCls = (err) =>
  `${inputBase} ${err ? 'border-[#E00000]/30 bg-[#E00000]/5 focus:ring-red-100 focus:border-[#E00000]' : ''}`;

const ErrorMsg = ({ message }) =>
  message ? (
    <p className="flex items-center gap-1 text-[#E00000] text-xs mt-1">
      <AlertCircle size={11} strokeWidth={2.5} /> {message}
    </p>
  ) : null;

const SectionDivider = ({ label }) => (
  <div className="flex items-center gap-3 my-2">
    <div className="flex-1 h-px bg-gray-100" />
    <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 px-1">
      {label}
    </span>
    <div className="flex-1 h-px bg-gray-100" />
  </div>
);

const FieldLabel = ({ children, required, icon: Icon }) => (
  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
    {Icon && <Icon size={11} className="text-[#E00000]" />}
    {children}
    {required && <span className="text-[#E00000]">*</span>}
  </label>
);

// ─── buildRows — LOGIC UNCHANGED ──────────────────────────────────────────────
function buildRows(amount, denoms) {
  const rows = [];
  if (!amount || !denoms?.length) return rows;
  let remaining = Math.round(parseFloat(amount) * 100);
  const sortedDenoms = [...denoms].map(d => Math.round(d * 100)).sort((a, b) => b - a);
  for (let i = 0; i < sortedDenoms.length; i++) {
    const dc    = sortedDenoms[i];
    const count = Math.floor(remaining / dc);
    rows.push({ id: `${dc}-${i}`, denom: dc / 100, count: count > 0 ? count : 0 });
    remaining -= count * dc;
  }
  return rows;
}


// ─── DenominationPanel — LOGIC UNCHANGED ──────────────────────────────────────
const DenominationPanel = ({
  title, subtitle, flag, symbol, currency, notes, coins,
  targetAmount, onRowsChange, accentColor = '#dc2626',
}) => {
  const [rows, setRows]               = useState([]);
  const [customDenom, setCustomDenom] = useState('');
  const [showCustom,  setShowCustom]  = useState(false);
  const prevKey = useRef('');

  useEffect(() => {
    const key = `${currency}:${targetAmount}:${(notes||[]).length}:${(coins||[]).length}`;
    if (prevKey.current !== key) {
      prevKey.current = key;
      setRows(buildRows(targetAmount, [...(notes||[]), ...(coins||[])]));
    }
  }, [currency, targetAmount, notes, coins]);

  useEffect(() => { onRowsChange?.(rows); }, [rows]);

  const totalDispensed = useMemo(() => rows.reduce((s,r) => s + r.denom*r.count, 0), [rows]);
  const difference     = totalDispensed - (targetAmount || 0);
  const isBalanced     = Math.abs(difference) < 0.01;
  const isOver         = difference > 0.01;

  const updateCount = useCallback((id,val) =>
    setRows(p => p.map(r => r.id===id ? {...r, count:Math.max(0,parseInt(val)||0)} : r)), []);
  const step = useCallback((id,d) =>
    setRows(p => p.map(r => r.id===id ? {...r, count:Math.max(0,r.count+d)} : r)), []);
  const removeRow = useCallback((id) => setRows(p => p.filter(r => r.id!==id)), []);
  const reset = () => setRows(buildRows(targetAmount, [...(notes||[]), ...(coins||[])]));

  const activeDenomSet = new Set(rows.map(r => r.denom));
  const addablePresets = [...(notes||[]), ...(coins||[])].filter(d => !activeDenomSet.has(d));
  const addPreset  = (d) => setRows(p => [...p, { id:d, denom:d, count:0 }]);
  const addCustom  = () => {
    const v = parseFloat(customDenom);
    if (!v || v <= 0) return;
    setRows(p => [...p, { id:Date.now(), denom:v, count:0 }]);
    setCustomDenom(''); setShowCustom(false);
  };

  const statusLabel = isBalanced
    ? 'Balanced'
    : isOver
      ? `Over ${symbol}${Math.abs(difference).toFixed(2)}`
      : `Short ${symbol}${Math.abs(difference).toFixed(2)}`;

  const statusColor = isBalanced ? accentColor : isOver ? '#d97706' : '#dc2626';

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{flag}</span>
          <div>
            <p className="text-sm font-semibold text-gray-800">{title}</p>
            <p className="text-xs text-gray-400">{subtitle}</p>
          </div>
        </div>
        {targetAmount > 0 && (
          <span className="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md">
            {symbol}{targetAmount.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} {currency}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 bg-gray-50/50">
        {[
          { label:'Expected', val: targetAmount||0, color:'#6b7280' },
          { label:'Counted',  val: totalDispensed,  color: accentColor },
          { label: isBalanced ? 'Balanced' : isOver ? 'Overage' : 'Shortfall',
            val: Math.abs(difference), color: statusColor,
            prefix: isBalanced ? '' : isOver ? '+' : '-' },
        ].map(({ label, val, color, prefix='' }) => (
          <div key={label} className="flex flex-col items-center py-2.5 px-2">
            <span className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">{label}</span>
            <span className="text-sm font-semibold" style={{ color }}>
              {prefix}{symbol}{val.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
            </span>
          </div>
        ))}
      </div>

      {/* Status + reset */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: statusColor }}>
          {isBalanced
            ? <CheckCircle2 size={12} strokeWidth={2.5} />
            : <AlertCircle size={12} strokeWidth={2.5} />}
          {statusLabel}
        </div>
        <button onClick={reset} type="button"
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#E00000] transition-colors">
          <RefreshCw size={11} strokeWidth={2} /> Reset
        </button>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-12 gap-2 px-4 py-1.5 border-b border-gray-100 bg-gray-50/30">
        {[['col-span-3','Denomination'],['col-span-5','Count'],['col-span-3 text-right','Subtotal'],['col-span-1','']].map(([cls,h]) => (
          <div key={h} className={`${cls} text-[9px] font-semibold text-gray-400 uppercase tracking-wider`}>{h}</div>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {rows.length === 0 && (
          <div className="px-4 py-8 text-center">
            <Banknote size={20} className="mx-auto mb-2 text-gray-200" />
            <p className="text-gray-400 text-sm">No denominations yet.</p>
          </div>
        )}
        {rows.map(row => {
          const subtotal = row.denom * row.count;
          const active   = row.count > 0;
          return (
            <div key={row.id}
              className="grid grid-cols-12 gap-2 items-center px-4 py-2 transition-colors group hover:bg-gray-50/50"
              style={active ? { background: `${accentColor}06` } : {}}>
              {/* Denom badge */}
              <div className="col-span-3">
                <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded-md border text-xs font-semibold transition-colors"
                  style={active
                    ? { background:`${accentColor}10`, borderColor:`${accentColor}30`, color:accentColor }
                    : { borderColor:'#e5e7eb', color:'#374151' }}>
                  <span className="opacity-50 text-[10px]">{symbol}</span>
                  {row.denom < 1 ? row.denom.toFixed(2) : row.denom.toLocaleString()}
                </span>
              </div>
              {/* Stepper */}
              <div className="col-span-5 flex items-center gap-1">
                <button type="button" onClick={() => step(row.id,-1)}
                  className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-300 hover:text-[#E00000] hover:border-[#E00000]/20 transition-colors">
                  <MinusCircle size={14} strokeWidth={1.5} />
                </button>
                <input type="number" min="0" value={row.count}
                  onChange={e => updateCount(row.id, e.target.value)}
                  className="w-14 h-7 rounded border text-center text-sm font-semibold focus:outline-none transition-colors"
                  style={active
                    ? { borderColor:`${accentColor}50`, background:`${accentColor}06` }
                    : { borderColor:'#e5e7eb' }} />
                <button type="button" onClick={() => step(row.id,1)}
                  className="w-7 h-7 rounded border flex items-center justify-center transition-colors"
                  style={active
                    ? { color:accentColor, borderColor:`${accentColor}40`, background:`${accentColor}08` }
                    : { color:'#d1d5db', borderColor:'#e5e7eb' }}>
                  <PlusCircle size={14} strokeWidth={1.5} />
                </button>
              </div>
              {/* Subtotal */}
              <div className="col-span-3 text-right">
                <span className="text-sm font-semibold transition-colors"
                  style={{ color: active ? accentColor : '#e5e7eb' }}>
                  {symbol}{subtotal.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
                </span>
              </div>
              {/* Remove */}
              <div className="col-span-1 flex justify-end">
                <button type="button" onClick={() => removeRow(row.id)}
                  className="w-6 h-6 rounded flex items-center justify-center text-gray-200 hover:text-[#E00000] transition-colors opacity-0 group-hover:opacity-100">
                  <X size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer total */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          {rows.filter(r=>r.count>0).length} denominations · {rows.reduce((s,r)=>s+r.count,0)} notes
        </div>
        <div className="text-right">
          <span className="text-lg font-bold" style={{ color: accentColor }}>
            {symbol}{totalDispensed.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
          </span>
          <span className="text-xs text-gray-400 ml-1.5">{currency}</span>
        </div>
      </div>
    </div>
  );
};


// ─── GovernmentIdSection — LOGIC UNCHANGED ────────────────────────────────────
const GovernmentIdSection = ({ register, errors, setValue, watch, governmentId }) => {
  const [dragOver,    setDragOver]    = useState(false);
  const [previewUrl,  setPreviewUrl]  = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  // const idType = watch('idType');

 useEffect(() => {
  setPreviewUrl(null);
  setPreviewFile(null);
}, [governmentId]);

  register('docFile', { validate: v => !!v || 'Please upload a government document' });

  const fetchCustomerById = async (idNumber) => {
    if (!idNumber || idNumber.length < 3) return;
    try {
      const res = await fetch(
        `http://182.71.135.110:82/api/resource/Customer/${idNumber}`,
        { method:'GET', headers:{ Authorization:'token 661457e17b8612a:32a5ddcc5a9c177' } }
      );
      if (!res.ok) { console.log('Customer not found'); return; }
      const { data: c } = await res.json();
      setValue('firstName', c.custom_first_name || '');
      setValue('lastName',  c.custom_last_name  || '');
      setValue('country',   c.custom_country    || '');
      setValue('city',      c.custom_city       || '');
      setValue('government_id', c.custom_government_id   || '');
      console.log('Customer found...', c);
      if (c.image) {
        const url = c.image.startsWith('http') ? c.image : `http://182.71.135.110:82${c.image}`;
        setPreviewUrl(url); setPreviewFile(null);
        setValue('docFile', url, { shouldValidate:true });
      }
    } catch (e) { console.error('Error fetching customer:', e); }
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!['image/jpeg','image/png','image/webp','application/pdf'].includes(file.type))
      { alert('Please upload a JPG, PNG, WEBP, or PDF file.'); return; }
    if (file.size > 10*1024*1024) { alert('File must be under 10 MB.'); return; }
    setValue('docFile', file, { shouldValidate:true });
    setPreviewFile(file); setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop  = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };
  const removeFile  = () => { setValue('docFile',null,{shouldValidate:true}); setPreviewFile(null); setPreviewUrl(null); };

  const idTypes = [
    { key:'PASSPORT',      label:'Passport',      Icon:FileText   },
    { key:'GOVERNMENT_ID', label:'Government ID', Icon:CreditCard },
  ];
  const placeholders = { PASSPORT:'e.g. A12345678', GOVERNMENT_ID:'e.g. 987654321' };

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
        <ShieldCheck size={16} className="text-[#E00000] flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-gray-800">ID Verification</p>
          <p className="text-xs text-gray-400">Required for compliance — data is encrypted and secure</p>
        </div>
        <span className="ml-auto text-[10px] font-semibold text-[#E00000] bg-[#E00000]/5 border border-[#E00000]/10 px-2 py-0.5 rounded">
          ID Check
        </span>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">

        

        {/* Gov ID sub-type */}
        <div>
            <FieldLabel icon={FileText}>ID Type</FieldLabel>
            <div className="relative mt-1">
              <select className={`${inputBase} appearance-none pr-10`}
                {...register('government_id')}>
                <option>Driver's Licence</option>
                <option>Voter ID Card</option>
                <option>Passport</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

        {/* ID Number */}
        <div>
          <FieldLabel required icon={BadgeCheck}>
            {/* {idType==='PASSPORT' ? 'Passport Number' : 'ID Number'} */}
            ID Number
          </FieldLabel>
          <input type="text" placeholder={placeholders[governmentId]}
            {...register('idNumber',{
              required:'ID number is required',
              minLength:{value:3,message:'ID number is too short'},
              onBlur:(e) => { fetchCustomerById(e.target.value); },
            })}
            className={`${fieldCls(errors.idNumber)} mt-1`} />
          <ErrorMsg message={errors.idNumber?.message} />
        </div>

        {/* Document Upload */}
        <div>
          <FieldLabel required icon={Upload}>
            {governmentId==='PASSPORT' ? 'Passport Photo / Scan' : 'Government ID Photo / Scan'}
          </FieldLabel>
          <div className="mt-1">
            {previewUrl ? (
              <div className={`rounded-lg border overflow-hidden ${errors.docFile ? 'border-[#E00000]/30' : 'border-gray-200'}`}>
                {previewFile?.type === 'application/pdf' ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-white">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#E00000]/5">
                      <FileText size={16} className="text-[#E00000]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{previewFile.name}</p>
                      <p className="text-xs text-gray-400">{(previewFile.size/1024).toFixed(1)} KB · PDF</p>
                    </div>
                    <button type="button" onClick={removeFile}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#E00000] hover:bg-[#E00000]/5 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <img src={previewUrl} alt="ID" className="w-full max-h-48 object-contain p-3 bg-gray-50" />
                    <button type="button" onClick={removeFile}
                      className="absolute top-2 right-2 w-7 h-7 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center text-gray-400 hover:text-[#E00000] transition-colors">
                      <X size={13} />
                    </button>
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-green-50 border-t border-green-100 text-xs font-medium text-green-700">
                      <CheckCircle2 size={11} strokeWidth={2.5} /> Document uploaded
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <label
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-3 py-8 px-5 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
                  dragOver
                    ? 'border-[#E00000] bg-[#E00000]/5'
                    : errors.docFile
                      ? 'border-[#E00000]/30 bg-[#E00000]/5/50'
                      : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50'
                }`}>
                <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="hidden" onChange={e => handleFile(e.target.files[0])} />
                <Upload size={20} className={dragOver ? 'text-[#E00000]' : errors.docFile ? 'text-[#E00000]' : 'text-gray-300'} strokeWidth={1.5} />
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Drop here or <span className="text-[#E00000] underline underline-offset-2">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP or PDF · Max 10 MB</p>
                </div>
              </label>
            )}
          </div>
          <ErrorMsg message={errors.docFile?.message} />
        </div>
      </div>
    </div>
  );
};


// ─── ReceiverForm — ALL LOGIC UNCHANGED ───────────────────────────────────────
export const ReceiverForm = ({
  initialData,
  sendAmount: externalSendAmount,
  onContinue,
  onBack,
  onSummaryChange,
}) => {
  const { register, handleSubmit, setValue, watch, formState:{ errors } } = useForm({
    defaultValues: {
      country     : initialData?.country   ?? 'India',
      firstName   : initialData?.firstName ?? '',
      lastName    : initialData?.lastName  ?? '',
      city        : initialData?.city      ?? '',
      idType      : 'PASSPORT',
      idNumber    : '',
      docFile     : null,
      pastReceiver: 'New Receiver',
      exchangeType: 'BUY',
    },
  });

  const { receiverGets, sendAmount:ctxSendAmount, serviceFee, gstAmount, total } = useExchange();

  const roundToNearestFiveCents = (amount) => {
    if (!amount) return 0;
    return Math.round(amount / 0.05) * 0.05;
  };
  const roundedTotal = roundToNearestFiveCents(total);

  const exchangeType  = watch('exchangeType');
  const exchangeTypes = [
    { key:'BUY',  label:'Buy Foreign',  Icon:TrendingUp  },
    { key:'SELL', label:'Sell Foreign', Icon:ArrowLeftRight },
  ];

  const {
    rates:erpRates, availableCurrencies, loading:ratesLoading,
    error:rateError, rateDate, noDataForToday, showUploadModal, setShowUploadModal,
  } = useERPNextRates();

  const { countries, loading:countryLoading, error:countryError } = useCountries();
  const customerList = useCustomers();

  const FJD = { code:'FJD', symbol:'FJ$', name:'Fijian Dollar' };

  const [toCurrency,      setToCurrency]      = useState(null);
  const [manualRate,      setManualRate]      = useState('');
  const [useManualRate,   setUseManualRate]   = useState(false);
  const [sendAmount,      setSendAmount]      = useState(externalSendAmount ?? 1000);
  const [sendAmountError, setSendAmountError] = useState('');

  const senderDenomRowsRef   = useRef([]);
  const receiverDenomRowsRef = useRef([]);

  useEffect(() => {
    if (availableCurrencies.length && !toCurrency) setToCurrency(availableCurrencies[0]);
  }, [availableCurrencies]);

  useEffect(() => { if (noDataForToday) setUseManualRate(true); }, [noDataForToday]);

  const effectiveRate = useMemo(() => {
    if (!toCurrency) return null;
    console.log('toooo currency', toCurrency);
    if (useManualRate) { const m=parseFloat(manualRate); return !isNaN(m)&&m>0?m:null; }
    if (exchangeType==='SELL') return toCurrency.sellingRate ?? null;
    if (exchangeType==='BUY')  return toCurrency.buyingRate  ?? null;
    return null;
  }, [toCurrency, exchangeType, useManualRate, manualRate]);

  const exchangePreview = useMemo(() => {
    if (!effectiveRate||effectiveRate<=0) return null;
    if (!sendAmount   ||sendAmount   <=0) return null;
    let receiverAmount = 0;
    if (exchangeType==='BUY')  { console.log('send amount',sendAmount); console.log('effective rate',effectiveRate); receiverAmount=sendAmount*effectiveRate; }
    if (exchangeType==='SELL') { receiverAmount=sendAmount*effectiveRate; }
    receiverAmount = Math.round((receiverAmount+Number.EPSILON)*100)/100;
    return { rate:effectiveRate, rawAmount:receiverAmount,
      formatted:receiverAmount.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}) };
  }, [effectiveRate, sendAmount, exchangeType]);

  const watchedCountry = watch('country');

  useEffect(() => {
    if (!onSummaryChange) return;
    onSummaryChange({
      sendAmount, currency:FJD.code,
      exchangeRate:exchangePreview?.rate??0, receiverGets:exchangePreview?.rawAmount??0,
      receiverCurrency:toCurrency?.code??'', exchangeType,
    });
  }, [sendAmount, toCurrency, exchangePreview]);

  const { data:baseCurrencyInfo } = useBaseCurrency();
  const selectedDenomCountry = toCurrency?.country ?? null;
  const { data:foreignCurrencyInfo, loading:denomLoading, error:denomError } = useDenomination(selectedDenomCountry);

  const senderInfo   = exchangeType==='BUY' ? baseCurrencyInfo    : foreignCurrencyInfo;
  const receiverInfo = exchangeType==='BUY' ? foreignCurrencyInfo : baseCurrencyInfo;

  console.log('Sender info', senderInfo);
  console.log('Receiver Info', receiverInfo);

  const onSubmit = (data) => {
    if (!sendAmount||sendAmount<=0)       { setSendAmountError('Please enter a valid send amount'); return; }
    if (!effectiveRate||effectiveRate<=0) return;
    if (useManualRate&&(!manualRate||parseFloat(manualRate)<=0)) return;
    setSendAmountError('');

    const getDenomType = (denom,notesArr=[],coinsArr=[]) => {
      if (notesArr.includes(denom)) return 'Note';
      if (coinsArr.includes(denom)) return 'Coin';
      return denom>=1?'Note':'Coin';
    };

    onContinue?.({
      ...data,
      sender_notes:senderInfo?.notes??[], sender_notes_name:senderInfo?.notes_name??[],
      sender_coins:senderInfo?.coins??[], sender_coins_name:senderInfo?.coins_name??[],
      notes:receiverInfo?.notes??[], notes_name:receiverInfo?.notes_name??[],
      coins:receiverInfo?.coins??[], coins_name:receiverInfo?.coins_name??[],
      sendAmount, senderCurrency:toCurrency?.code, receiverCurrency:toCurrency?.code??'',
      exchangeRate:exchangePreview?.rate??0, receiverGets:exchangePreview?.rawAmount??0,
      rateSource:useManualRate?'manual':'erpnext', rateDate:useManualRate?null:rateDate,
      senderDenominationRows: senderDenomRowsRef.current.filter(r=>r.count>0).map(r=>({
        denomination_value:r.denom,
        denomination_type:getDenomType(r.denom,senderInfo?.notes,senderInfo?.coins),
        count:r.count, subtotal:r.denom*r.count,
      })),
      receiverDenominationRows: receiverDenomRowsRef.current.filter(r=>r.count>0).map(r=>({
        denomination_value:r.denom,
        denomination_type:getDenomType(r.denom,receiverInfo?.notes,receiverInfo?.coins),
        count:r.count, subtotal:r.denom*r.count,
      })),
    });
  };

  const governmentId = watch("government_id");

useEffect(() => {
  if (!governmentId) return;

  setValue("firstName", "");
  setValue("lastName", "");
  setValue("country", "");
  setValue("city", "");
  setValue("idNumber", "");
  setValue("docFile", null);

}, [governmentId]);

  

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Upload modal — logic unchanged */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-7 max-w-sm w-full mx-4 text-center">
            <div className="text-4xl mb-4">📂</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No Exchange Rates Found</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Upload exchange rates in <strong>Currency Master Data</strong> first.
            </p>
            <button type="button" onClick={() => setShowUploadModal(false)}
              className="w-full bg-[#E00000] hover:bg-[#B70000] text-white font-semibold text-sm py-2.5 rounded-xl transition-colors">
              OK, Got it
            </button>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="bg-[#B70000] px-6 sm:px-10 py-7">
        <div className="max-w-5xl mx-auto flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <UserPlus size={18} className="text-white" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-white font-semibold text-xl">Customer Details</h1>
              <p className="text-[#b5f000] text-sm mt-0.5">Currency Exchange Transaction</p>
            </div>
          </div>

          {toCurrency && effectiveRate && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-2 rounded-lg">
                <span className="text-[#b5f000] text-xs">Live Rate</span>
                <span className="text-white text-sm font-semibold">
                  1 {toCurrency.code} = {FJD.symbol}{effectiveRate} {FJD.code}
                </span>
              </div>
              <span className="text-xs font-medium bg-white/10 border border-white/20 text-yellow-200 px-2.5 py-1.5 rounded-lg uppercase tracking-wide">
                {exchangeType === 'BUY' ? '🟢 Buying' : '🔴 Selling'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-4 sm:px-8 lg:px-12 py-8 flex flex-col gap-5 max-w-5xl mx-auto" noValidate>

        {/* Government ID */}
        <GovernmentIdSection register={register} errors={errors} setValue={setValue} watch={watch} governmentId={watch("government_id")} />

        <SectionDivider label="Personal Information" />

        {/* Name */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
            <UserPlus size={15} className="text-[#E00000]" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Customer Name</p>
              <p className="text-xs text-gray-400">Enter the customer's legal name as on ID</p>
            </div>
          </div>
          <div className="px-5 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['firstName','First Name','e.g. Maria',{ required:'First name is required', minLength:{value:2,message:'Too short'} }],
              ['lastName', 'Last Name', 'e.g. Garcia',{ required:'Last name is required',  minLength:{value:2,message:'Too short'} }],
            ].map(([name,label,ph,rules]) => (
              <div key={name}>
                <FieldLabel required>{label}</FieldLabel>
                <input type="text" placeholder={ph} {...register(name,rules)} className={fieldCls(errors[name])} />
                <ErrorMsg message={errors[name]?.message} />
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
            <Globe size={15} className="text-[#E00000]" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Location</p>
              <p className="text-xs text-gray-400">Customer's country and city of residence</p>
            </div>
          </div>
          <div className="px-5 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel required icon={Globe}>Country</FieldLabel>
              {countryError ? (
                <p className="text-[#E00000] text-sm font-medium mt-1">Failed to load countries</p>
              ) : countryLoading ? (
                <div className="h-12 rounded-lg animate-pulse bg-gray-100 mt-1" />
              ) : (
                <div className="relative mt-1">
                  <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select {...register('country',{required:'Please select a country'})}
                    className={`${fieldCls(errors.country)} appearance-none pl-9 pr-9`}>
                    <option value="">Select Country</option>
                    {countries.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              )}
              <ErrorMsg message={errors.country?.message} />
            </div>
            <div>
              <FieldLabel required>City / Province</FieldLabel>
              <input type="text" placeholder="e.g. Madrid"
                {...register('city',{required:'City is required'})}
                className={`${fieldCls(errors.city)} mt-1`} />
              <ErrorMsg message={errors.city?.message} />
            </div>
          </div>
        </div>

        <SectionDivider label="Exchange Details" />

        {/* Transaction Type */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
            <ArrowLeftRight size={15} className="text-[#E00000]" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Transaction Type</p>
              <p className="text-xs text-gray-400">Choose whether you are buying or selling foreign currency</p>
            </div>
          </div>
          <div className="px-5 py-5">
            <input type="hidden" {...register('exchangeType',{required:'Please select an Exchange type'})} />
            <div className="grid grid-cols-2 gap-3">
              {exchangeTypes.map(({ key, label, Icon }) => {
                const active = exchangeType === key;
                return (
                  <button key={key} type="button"
                    onClick={() => setValue('exchangeType',key,{shouldValidate:true})}
                    className={`relative py-4 px-4 rounded-xl border-2 text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                      active
                        ? 'border-[#E00000] bg-[#E00000]/5 text-[#B70000]'
                        : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                    }`}>
                    {active && (
                      <CheckCircle2 size={13} className="absolute top-2.5 right-2.5 text-[#E00000]" strokeWidth={2.5} />
                    )}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      active ? 'bg-[#E00000] text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon size={17} strokeWidth={1.75} />
                    </div>
                    <span className={active ? 'text-[#B70000] font-semibold' : 'text-gray-400'}>{label}</span>
                  </button>
                );
              })}
            </div>
            <ErrorMsg message={errors.exchangeType?.message} />
          </div>
        </div>

        {/* Currency & Amount */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
            <Coins size={15} className="text-[#E00000]" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Currency & Amount</p>
              <p className="text-xs text-gray-400">Enter the transaction amount and select currency</p>
            </div>
          </div>

          <div className="px-5 py-5 flex flex-col gap-4">
            {/* Rate badge */}
            {effectiveRate && toCurrency && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm">
                <TrendingUp size={13} className="text-[#E00000] flex-shrink-0" />
                <span className="text-gray-500 text-xs">Rate:</span>
                <span className="font-semibold text-gray-800 text-xs">
                  1 {toCurrency.code} = {FJD.symbol}{effectiveRate}
                </span>
                <span className="ml-auto text-[10px] font-medium text-[#E00000] bg-[#E00000]/5 border border-[#E00000]/10 px-1.5 py-0.5 rounded uppercase tracking-wide">
                  {exchangeType === 'BUY' ? 'Buy Rate' : 'Sell Rate'}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Give side */}
              <div className="flex flex-col gap-2">
                <FieldLabel required icon={Coins}>
                  {exchangeType==='SELL'
                    ? `Customer Gives (${toCurrency?.code??'Foreign'})`
                    : `Customer Gets (${toCurrency?.code??'Foreign'})`}
                </FieldLabel>

                {rateError ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-[#E00000]/5 border border-[#E00000]/20 rounded-lg text-red-600 text-xs">
                    <AlertCircle size={12} />{rateError}
                  </div>
                ) : ratesLoading ? (
                  <div className="h-12 rounded-lg animate-pulse bg-gray-100" />
                ) : availableCurrencies.length===0 ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs">
                    <AlertCircle size={12} />No rates for today — enter manually below
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      className={`${inputBase} appearance-none pr-9`}
                      value={toCurrency?.code??''}
                      onChange={e => {
                        const found = availableCurrencies.find(c=>c.code===e.target.value);
                        setToCurrency(found??null);
                        if (!useManualRate) setManualRate('');
                      }}>
                      {availableCurrencies.map(c => (
                        <option key={c.code} value={c.code}>
                          {c.code} — {exchangeType==='BUY'?`Buy: ${c.buyingRate??'—'}`:`Sell: ${c.sellingRate??'—'}`}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                )}

                <div className="relative">
                  <input type="number" min="0" step="any" value={sendAmount}
                    onChange={e => {
                      const val=parseFloat(e.target.value)||0;
                      setSendAmount(val);
                      setSendAmountError(val>0?'':'Please enter a valid send amount');
                    }}
                    placeholder="0.00"
                    className={`${inputBase} text-lg font-semibold pr-16 ${
                      sendAmountError ? 'border-[#E00000]/30 bg-[#E00000]/5' : ''
                    }`} />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-medium text-gray-400">
                    {toCurrency?.code??'---'}
                  </span>
                </div>
                {sendAmountError && <ErrorMsg message={sendAmountError} />}
              </div>

              {/* Receive side */}
              <div className="flex flex-col gap-2">
                <FieldLabel icon={Wallet}>
                  {exchangeType==='SELL'
                    ? `Customer Receives (${FJD.code})`
                    : `Customer Pays (${FJD.code})`}
                </FieldLabel>

                <div className="relative">
                  <div className={`w-full h-12 rounded-lg flex items-center px-4 pr-16 text-lg font-semibold border transition-colors ${
                    exchangePreview
                      ? 'bg-[#E00000]/5 border-[#E00000]/20 text-red-800'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}>
                    {ratesLoading ? (
                      <span className="text-sm font-normal text-gray-400 animate-pulse">Loading…</span>
                    ) : exchangePreview ? (
                      <span>{FJD.symbol}{exchangePreview.formatted}</span>
                    ) : (
                      <span className="text-gray-300 text-sm font-normal">—</span>
                    )}
                  </div>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-medium text-gray-400">
                    {FJD.code}
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50">
                  <span className="text-base">🇫🇯</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">Fijian Dollar</p>
                    <p className="text-[10px] text-gray-400">FJD · Local Currency</p>
                  </div>
                  {exchangePreview && (
                    <div className="ml-auto flex items-center gap-1 text-xs font-medium text-green-600">
                      <CheckCircle2 size={11} strokeWidth={2.5} /> Calculated
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <SectionDivider label="Cash Denomination Counts" />

        {/* Denomination panels */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5 px-1">
            <Banknote size={16} className="text-[#E00000] flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Cash Denomination Counts</p>
              <p className="text-xs text-gray-400">Counter staff: count and confirm notes for both sides.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {senderInfo ? (
              <DenominationPanel
                title="Sender Pays — Cash In" subtitle="Cash received from customer"
                flag={senderInfo.flag} symbol={senderInfo.symbol} currency={senderInfo.currency}
                notes={senderInfo.notes} coins={senderInfo.coins}
                targetAmount={exchangeType==='BUY'?receiverGets:sendAmount}
                onRowsChange={rows => { senderDenomRowsRef.current=rows; }}
                accentColor="#f97316"
              />
            ) : (
              <div className="rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/40 flex flex-col items-center justify-center p-8 gap-2 text-center">
                <Banknote size={18} className="text-orange-300" />
                <p className="font-medium text-gray-400 text-sm">FJD denomination data not found</p>
                <p className="text-xs text-gray-300">Add Fiji to DENOMINATION_DATA</p>
              </div>
            )}

            {denomLoading ? (
              <div className="rounded-xl border border-gray-200 flex flex-col items-center justify-center p-8 gap-2 bg-gray-50">
                <RefreshCw size={18} className="animate-spin text-[#E00000]/80" />
                <p className="font-medium text-gray-400 text-sm">Loading denomination data…</p>
              </div>
            ) : denomError ? (
              <div className="rounded-xl border border-[#E00000]/20 bg-[#E00000]/5 flex items-center justify-center p-7">
                <p className="font-medium text-[#E00000] text-sm text-center">{denomError}</p>
              </div>
            ) : receiverInfo ? (
              <DenominationPanel
                title="Receiver Gets — Cash Out"
                subtitle={`Cash to disburse to ${selectedDenomCountry??''}`}
                flag={receiverInfo.flag} symbol={receiverInfo.symbol} currency={receiverInfo.currency}
                notes={receiverInfo.notes} coins={receiverInfo.coins}
                targetAmount={exchangeType==='BUY'?sendAmount:receiverGets}
                onRowsChange={rows => { receiverDenomRowsRef.current=rows; }}
                accentColor="#dc2626"
              />
            ) : (
              <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-8 gap-2 text-center">
                <Globe size={18} className="text-gray-300" />
                <p className="font-medium text-gray-400 text-sm">No denomination configured</p>
                <p className="text-xs text-gray-300">Select a supported destination country</p>
              </div>
            )}
          </div>
        </div>

        {/* Rate error banner */}
        {(!effectiveRate||effectiveRate<=0) && !ratesLoading && (
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-[#E00000]/20 bg-[#E00000]/5">
            <AlertCircle size={15} className="text-[#E00000] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-red-800">Exchange Rates Unavailable</p>
              <p className="text-xs text-[#E00000] mt-0.5">
                No rates found for today. Please upload rates in Currency Master Data before proceeding.
              </p>
            </div>
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <button type="button" onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors px-4 py-2.5 rounded-lg hover:bg-gray-100">
            ← Back
          </button>

          <button type="submit"
            disabled={!effectiveRate||effectiveRate<=0||ratesLoading}
            className="flex items-center gap-2 bg-[#E00000] hover:bg-[#B70000] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold h-11 px-8 rounded-xl transition-colors group">
            Continue
            <ArrowRight size={16} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </form>
    </div>
  );
};