
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  UserPlus, Globe, ChevronDown, ArrowRight,
  Coins, RefreshCw, Banknote, Plus, AlertCircle,
  CheckCircle2, MinusCircle, PlusCircle, X, ShieldCheck,
  Upload, FileText, CreditCard,
  Store
} from 'lucide-react';
import { DENOMINATION_DATA, SUPPORTED_COUNTRIES } from '../hooks/Denomination';
import { useERPNextRates } from '../hooks/useERPNextRates';
import { useCountries } from '../hooks/useCountry';
import { useCustomers } from '../hooks/useCustomer';
import { useDenomination } from '../hooks/useDenomination';

const PRIMARY = '#30e87a';

const inputBase =
  'w-full rounded-xl border bg-gray-50 h-14 px-5 text-base font-bold focus:outline-none placeholder:text-gray-400 transition-all';

const fieldCls = (error) =>
  `${inputBase} ${error ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-200'}`;

const ErrorMsg = ({ message }) =>
  message ? (
    <p className="flex items-center gap-1 text-red-500 text-xs font-bold mt-1">
      <AlertCircle size={11} strokeWidth={3} /> {message}
    </p>
  ) : null;




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



const DenominationPanel = ({
  title, subtitle, flag, symbol, currency, notes, coins,
  targetAmount, onRowsChange, accentColor = PRIMARY,
}) => {
  const [rows, setRows] = useState(() => buildRows(targetAmount, notes));
  const [customDenom, setCustomDenom] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const prevKey = useRef(`${currency}:${targetAmount}`);

  useEffect(() => {
    const key = `${currency}:${targetAmount}`;
    if (prevKey.current !== key) {
      prevKey.current = key;
      setRows(buildRows(targetAmount, notes));
    }
  }, [currency, targetAmount, notes]);

  useEffect(() => { onRowsChange?.(rows); }, [rows]);

  const totalDispensed = useMemo(() => rows.reduce((s, r) => s + r.denom * r.count, 0), [rows]);
  const difference = totalDispensed - (targetAmount || 0);
  const isBalanced = Math.abs(difference) < 0.01;
  const isOver = difference > 0.01;

  const updateCount = useCallback((id, val) =>
    setRows(p => p.map(r => r.id === id ? { ...r, count: Math.max(0, parseInt(val) || 0) } : r)), []);
  const step = useCallback((id, d) =>
    setRows(p => p.map(r => r.id === id ? { ...r, count: Math.max(0, r.count + d) } : r)), []);
  const removeRow = useCallback((id) => setRows(p => p.filter(r => r.id !== id)), []);
  const reset = () => setRows(buildRows(targetAmount, notes));

  const activeDenomSet = new Set(rows.map(r => r.denom));
  const addablePresets = [...notes, ...coins].filter(d => !activeDenomSet.has(d));
  const addPreset = (d) => setRows(p => [...p, { id: d, denom: d, count: 0 }]);
  const addCustom = () => {
    const v = parseFloat(customDenom);
    if (!v || v <= 0) return;
    setRows(p => [...p, { id: Date.now(), denom: v, count: 0 }]);
    setCustomDenom(''); setShowCustom(false);
  };

  return (
    <div style={{ borderColor: `${accentColor}33` }} className="rounded-2xl border overflow-hidden">
      <div style={{ background: `${accentColor}0d` }} className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl leading-none">{flag}</span>
            <div>
              <div style={{ color: accentColor }} className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                <Banknote size={13} strokeWidth={3} /> {title}
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>
            </div>
          </div>
          {targetAmount > 0 && (
            <div style={{ borderColor: `${accentColor}55`, color: accentColor }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black bg-white">
              <RefreshCw size={10} strokeWidth={3} />
              {symbol}{targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-5 flex-wrap">
          {[
            { label: 'Expected', val: targetAmount || 0, col: '#6b7280' },
            { label: 'Counted', val: totalDispensed, col: accentColor },
            {
              label: isBalanced ? 'Balanced' : isOver ? 'Overage' : 'Shortfall',
              val: Math.abs(difference),
              col: isBalanced ? accentColor : isOver ? '#d97706' : '#dc2626',
              prefix: isBalanced ? '' : isOver ? '+' : '-',
            },
          ].map(({ label, val, col, prefix = '' }) => (
            <div key={label} className="flex flex-col">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
              <span style={{ color: col }} className="text-sm font-black leading-tight">
                {prefix}{symbol}{val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
          <div style={isBalanced
            ? { background: `${accentColor}18`, borderColor: `${accentColor}55`, color: accentColor }
            : isOver
              ? { background: '#fef3c722', borderColor: '#fcd34d88', color: '#92400e' }
              : { background: '#fee2e222', borderColor: '#fca5a588', color: '#b91c1c' }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-black">
            {isBalanced ? <CheckCircle2 size={11} strokeWidth={3} /> : <AlertCircle size={11} strokeWidth={3} />}
            {isBalanced ? 'Balanced' : isOver ? `Over ${symbol}${Math.abs(difference).toFixed(2)}` : `Short ${symbol}${Math.abs(difference).toFixed(2)}`}
          </div>
        </div>
        <button onClick={reset} type="button"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-black text-gray-400 hover:text-gray-700 transition-colors">
          <RefreshCw size={11} strokeWidth={2.5} /> Reset
        </button>
      </div>

      <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-gray-50 border-b border-gray-100">
        {['Note / Coin', 'Count', 'Subtotal', ''].map((h, i) => (
          <div key={i} className={`text-[10px] font-black text-gray-400 uppercase tracking-widest ${i === 0 ? 'col-span-3' : i === 1 ? 'col-span-5' : i === 2 ? 'col-span-3 text-right' : 'col-span-1'}`}>{h}</div>
        ))}
      </div>

      <div className="divide-y divide-gray-50 bg-white">
        {rows.length === 0 && (
          <div className="px-5 py-8 text-center text-gray-400 text-sm font-bold">No denominations. Add from presets below.</div>
        )}
        {rows.map(row => {
          const subtotal = row.denom * row.count;
          const active = row.count > 0;
          return (
            <div key={row.id} style={active ? { background: `${accentColor}07` } : {}}
              className="grid grid-cols-12 gap-2 items-center px-5 py-2.5 transition-colors group">
              <div className="col-span-3">
                <div style={active
                  ? { background: `${accentColor}18`, borderColor: `${accentColor}55`, color: accentColor }
                  : { borderColor: '#e5e7eb', color: '#374151' }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-black transition-all">
                  <span className="text-[10px] opacity-50">{symbol}</span>
                  {row.denom < 1 ? row.denom.toFixed(2) : row.denom.toLocaleString()}
                </div>
              </div>
              <div className="col-span-5 flex items-center gap-2">
                <button type="button" onClick={() => step(row.id, -1)}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-300 hover:text-red-400 hover:border-red-300 transition-colors">
                  <MinusCircle size={16} strokeWidth={2} />
                </button>
                <input type="number" min="0" value={row.count}
                  onChange={e => updateCount(row.id, e.target.value)}
                  style={active ? { borderColor: `${accentColor}77`, background: `${accentColor}08` } : {}}
                  className="w-16 h-8 rounded-xl border border-gray-200 text-center text-sm font-black focus:outline-none transition-all" />
                <button type="button" onClick={() => step(row.id, 1)}
                  style={active ? { color: accentColor, borderColor: `${accentColor}66` } : {}}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-300 transition-colors">
                  <PlusCircle size={16} strokeWidth={2} />
                </button>
              </div>
              <div className="col-span-3 text-right">
                <span style={{ color: active ? accentColor : '#d1d5db' }} className="text-sm font-black transition-colors">
                  {symbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="col-span-1 flex justify-end">
                <button type="button" onClick={() => removeRow(row.id)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-gray-200 hover:text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                  <X size={13} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-4 border-t border-gray-100 bg-white flex flex-col gap-3">
        {/* {addablePresets.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0 mr-1">Add:</span>
            {addablePresets.slice(0, 12).map(d => (
              <button key={d} type="button" onClick={() => addPreset(d)}
                style={{ borderColor: `${accentColor}44`, color: accentColor }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-black hover:opacity-75 transition-opacity bg-white">
                <Plus size={9} strokeWidth={3} />
                {symbol}{d < 1 ? d.toFixed(2) : d.toLocaleString()}
              </button>
            ))}
            <button type="button" onClick={() => setShowCustom(v => !v)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-gray-300 text-xs font-black text-gray-400 hover:text-gray-600 transition-colors">
              <Plus size={9} strokeWidth={3} /> Custom
            </button>
          </div>
        )}
        {showCustom && (
          <div className="flex items-center gap-2">
            <div style={{ borderColor: `${accentColor}55` }} className="flex items-center rounded-xl border bg-white overflow-hidden">
              <span className="pl-4 text-gray-400 font-black text-sm">{symbol}</span>
              <input type="number" min="0.01" step="0.01" placeholder="e.g. 500"
                value={customDenom} onChange={e => setCustomDenom(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom()}
                className="h-10 px-3 w-32 text-sm font-bold focus:outline-none bg-transparent" autoFocus />
            </div>
            <button type="button" onClick={addCustom}
              style={{ background: accentColor, color: '#111' }}
              className="h-10 px-4 rounded-xl text-xs font-black hover:opacity-90 transition-opacity">Add</button>
            <button type="button" onClick={() => { setShowCustom(false); setCustomDenom(''); }}
              className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
              <X size={14} />
            </button>
          </div>
        )} */}
        <div style={{ background: `${accentColor}0d`, borderColor: `${accentColor}33` }}
          className="flex items-center justify-between rounded-2xl border px-5 py-4">
          <div className="flex items-center gap-3">
            <div style={{ background: `${accentColor}22`, color: accentColor }}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
              <Banknote size={16} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Counted</div>
              <div className="text-xs text-gray-400 font-bold mt-0.5">
                {rows.filter(r => r.count > 0).length} denom · {rows.reduce((s, r) => s + r.count, 0)} notes
              </div>
            </div>
          </div>
          <div className="text-right">
            <div style={{ color: accentColor }} className="text-2xl font-black">
              {symbol}{totalDispensed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-400 font-bold">{currency}</div>
          </div>
        </div>
      </div>
    </div>
  );
};


const GovernmentIdSection = ({ register, errors, setValue, watch }) => {
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const idType = watch('idType');

  register('docFile', {
    validate: (val) => !!val || 'Please upload a government document',
  });

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type)) { alert('Please upload a JPG, PNG, WEBP, or PDF file.'); return; }
    if (file.size > 10 * 1024 * 1024) { alert('File must be under 10 MB.'); return; }
    setValue('docFile', file, { shouldValidate: true });
    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };

  const removeFile = () => {
    setValue('docFile', null, { shouldValidate: true });
    setPreviewFile(null); setPreviewUrl(null);
  };

  const idTypes = [
    { key: 'PASSPORT', label: 'Passport', Icon: FileText },
    { key: 'GOVERNMENT_ID', label: 'Government ID', Icon: CreditCard },
  ];
  const placeholders = { PASSPORT: 'e.g. A12345678', GOVERNMENT_ID: 'e.g. 987654321' };

  return (
    <div style={{ borderColor: `${PRIMARY}33` }} className="rounded-2xl border overflow-hidden">
      <div style={{ background: `${PRIMARY}0d` }} className="px-6 py-4 flex items-center gap-3">
        <div style={{ background: `${PRIMARY}22`, color: PRIMARY }}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={16} strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ color: PRIMARY }} className="font-black text-xs uppercase tracking-widest">
            Government ID Verification
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">Required for compliance — data is encrypted and secure</p>
        </div>
      </div>

      <div className="bg-white px-6 py-5 flex flex-col gap-5">
        {/* ID Type toggle */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            ID Type <span className="text-red-400">*</span>
          </label>
          <input type="hidden" {...register('idType', { required: 'Please select an ID type' })} />
          <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-200">
            {idTypes.map(({ key, label, Icon }) => {
              const active = idType === key;
              return (
                <button key={key} type="button"
                  onClick={() => { setValue('idType', key, { shouldValidate: true }); removeFile(); }}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2.5 ${active
                    ? 'bg-white text-gray-900 shadow-lg shadow-black/5 ring-1 ring-black/5'
                    : 'text-gray-400 hover:text-gray-600'}`}>
                  <Icon size={16} style={active ? { color: PRIMARY } : {}} />
                  {label}
                </button>
              );
            })}
          </div>
          <ErrorMsg message={errors.idType?.message} />
        </div>

        {
          idType === 'GOVERNMENT_ID' &&
           <div className="relative group">
          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2.5">
            Government ID Type
          </label>
          <div className="relative">
            <select className={`${inputBase} border-gray-200 appearance-none pr-12`} {...register('government_id')}>
              <option>Driver’s Licence</option>
              <option>Voter ID Card</option>
              
            </select>
            <div style={{ color: PRIMARY }} className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 group-hover:scale-110 transition-transform">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>
        }

        {/* ID Number */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            {idType === 'PASSPORT' ? 'Passport Number' : 'ID Number'} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder={placeholders[idType]}
            {...register('idNumber', {
              required: 'ID number is required',
              minLength: { value: 3, message: 'ID number is too short' },
            })}
            className={fieldCls(errors.idNumber)}
          />
          <ErrorMsg message={errors.idNumber?.message} />
        </div>

        {/* Document Upload */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            {idType === 'PASSPORT' ? 'Passport Photo / Scan' : 'Government ID Photo / Scan'} <span className="text-red-400">*</span>
          </label>

          {previewUrl ? (
            <div style={{ borderColor: errors.docFile ? '#f87171' : `${PRIMARY}55` }}
              className="relative rounded-2xl border overflow-hidden bg-gray-50">
              {previewFile?.type === 'application/pdf' ? (
                <div className="flex items-center gap-3 px-5 py-4">
                  <div style={{ background: `${PRIMARY}22`, color: PRIMARY }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText size={18} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-gray-900 text-sm truncate">{previewFile.name}</p>
                    <p className="text-xs text-gray-400 font-bold">{(previewFile.size / 1024).toFixed(1)} KB · PDF</p>
                  </div>
                  <button type="button" onClick={removeFile}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <>
                  <img src={previewUrl} alt="ID document" className="w-full max-h-48 object-contain p-4" />
                  <button type="button" onClick={removeFile}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                    <X size={15} />
                  </button>
                  <div style={{ background: `${PRIMARY}18`, color: PRIMARY }}
                    className="flex items-center justify-center gap-2 py-2 text-[11px] font-black uppercase tracking-wider">
                    <CheckCircle2 size={12} strokeWidth={3} /> Document Uploaded
                  </div>
                </>
              )}
            </div>
          ) : (
            <label
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={dragOver
                ? { borderColor: PRIMARY, background: `${PRIMARY}0d` }
                : { borderColor: errors.docFile ? '#f87171' : '#e5e7eb' }}
              className="flex flex-col items-center justify-center gap-3 py-8 px-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all hover:border-gray-300 group">
              <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden" onChange={e => handleFile(e.target.files[0])} />
              <div style={dragOver
                ? { background: `${PRIMARY}22`, color: PRIMARY }
                : { background: errors.docFile ? '#fee2e2' : '#f3f4f6', color: errors.docFile ? '#ef4444' : '#9ca3af' }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110">
                <Upload size={20} strokeWidth={2} />
              </div>
              <div className="text-center">
                <p className="font-black text-gray-700 text-sm">
                  Drop file here or <span style={{ color: PRIMARY }}>browse</span>
                </p>
                <p className="text-xs text-gray-400 font-bold mt-1">JPG, PNG, WEBP or PDF · Max 10 MB</p>
              </div>
            </label>
          )}
          <ErrorMsg message={errors.docFile?.message} />
        </div>
      </div>
    </div>
  );
};


export const ReceiverForm = ({
  initialData,
  sendAmount: externalSendAmount,
  onContinue,
  onBack,
  onSummaryChange,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      country: initialData?.country ?? 'India',
      firstName: initialData?.firstName ?? '',
      lastName: initialData?.lastName ?? '',
      city: initialData?.city ?? '',
      idType: 'PASSPORT',
      idNumber: '',
      docFile: null,
      pastReceiver: 'New Receiver',
      exchangeType: "BUY"
    },
  });

  const exchangeType = watch('exchangeType');

  const exchangeTypes = [
    { key: 'BUY', label: 'Buy', Icon: Store },
    { key: 'SELL', label: 'Sell', Icon: CreditCard },
  ];

  /* ── ERPNext rates ── */
  const {
    rates: erpRates,
    availableCurrencies,
    loading: ratesLoading,
    error: rateError,
    rateDate,
    noDataForToday,
  } = useERPNextRates();

  

  // const countryList = useCountries();

const {
  countries,
  loading: countryLoading,
  error: countryError,
} = useCountries();
  const customerList = useCustomers();

 

 
  const FJD = { code: 'FJD', symbol: 'FJ$', name: 'Fijian Dollar' };

  
  const [toCurrency, setToCurrency] = useState(null);

 
  const [manualRate, setManualRate]       = useState('');
  const [useManualRate, setUseManualRate] = useState(false);

  
  const [sendAmount, setSendAmount]           = useState(externalSendAmount ?? 1000);
  const [sendAmountError, setSendAmountError] = useState('');

  
  const senderDenomRowsRef   = useRef([]);
  const receiverDenomRowsRef = useRef([]);

  
  useEffect(() => {
    if (availableCurrencies.length && !toCurrency) {
      setToCurrency(availableCurrencies[0]);
    }
  }, [availableCurrencies]);

  
  useEffect(() => {
    if (noDataForToday) setUseManualRate(true);
  }, [noDataForToday]);

  

  const effectiveRate = useMemo(() => {

  
  if (useManualRate) {
    const m = parseFloat(manualRate);
    return !isNaN(m) && m > 0 ? m : null;
  }

  if (!toCurrency) return null;

  
  if (exchangeType === "BUY") {
    return toCurrency.buyingRate ?? null;
  }

  if (exchangeType === "SELL") {
    return toCurrency.sellingRate ?? null;
  }

  return null;

}, [useManualRate, manualRate, toCurrency, exchangeType]);

  const exchangePreview = useMemo(() => {
    if (!effectiveRate || !sendAmount) return null;

    // const raw = sendAmount * effectiveRate;
    let raw;

    if (exchangeType === "SELL") {
      raw = sendAmount * effectiveRate;
    } else {
      raw = sendAmount * effectiveRate;
    }
    return {
      rate: effectiveRate,
      rawAmount: raw,
      formatted: raw.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    };
  }, [effectiveRate, sendAmount, toCurrency]);

  // console.log("Exchange rate value", exchangePreview)

  
  const watchedCountry = watch('country');

  useEffect(() => {
    if (!onSummaryChange) return;
    onSummaryChange({
      sendAmount,
      currency: FJD.code,
      exchangeRate: exchangePreview?.rate ?? 0,
      receiverGets: exchangePreview?.rawAmount ?? 0,
      receiverCurrency: toCurrency?.code ?? '',
      exchangeType,
    });
  }, [sendAmount, toCurrency, exchangePreview]);

  
  const senderInfo   = DENOMINATION_DATA['Fiji'] ?? null;   
  // const receiverInfo = DENOMINATION_DATA[watchedCountry] ?? null;

//   const {
//   data: receiverInfo,
//   loading: denomLoading,
//   error: denomError,
// } = useDenomination(watchedCountry);

const selectedDenomCountry = toCurrency?.country ?? null;

const {
  data: receiverInfo,
  loading: denomLoading,
  error: denomError,
} = useDenomination(selectedDenomCountry);


console.log("receiver info", receiverInfo)

  
  const onSubmit = (data) => {
    if (!sendAmount || sendAmount <= 0) {
      setSendAmountError('Please enter a valid send amount');
      return;
    }
    if (useManualRate && (!manualRate || parseFloat(manualRate) <= 0)) {
      return; 
    }
    setSendAmountError('');

    onContinue?.({
      ...data,
      notes: receiverInfo?.notes,
notes_name: receiverInfo?.notes_name,
coins: receiverInfo?.coins,
coins_name: receiverInfo?.coins_name,
      sendAmount,
      senderCurrency: FJD.code,
      receiverCurrency: toCurrency?.code ?? '',
      exchangeRate: exchangePreview?.rate ?? 0,
      receiverGets: exchangePreview?.rawAmount ?? 0,
      rateSource: useManualRate ? 'manual' : 'erpnext',
      rateDate: useManualRate ? null : rateDate,
      senderDenominationRows: senderDenomRowsRef.current
        .filter(r => r.count > 0)
        .map(r => ({ denomination_value: r.denom, denomination_type: r.denom >= 1 ? 'Note' : 'Coin', count: r.count, subtotal: r.denom * r.count })),
      receiverDenominationRows: receiverDenomRowsRef.current
        .filter(r => r.count > 0)
        .map(r => ({ denomination_value: r.denom, denomination_type: r.denom >= 1 ? 'Note' : 'Coin', count: r.count, subtotal: r.denom * r.count })),
    });
  };

  
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-10">
      <h3 className="text-gray-900 font-black text-xl mb-8 flex items-center gap-3">
        <UserPlus size={24} style={{ color: PRIMARY }} />
        Transfer & Receiver Details
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8" noValidate>

        {/* Government ID */}
        <GovernmentIdSection register={register} errors={errors} setValue={setValue} watch={watch} />

        {/* Past Receivers */}
        <div className="relative group">
          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2.5">
            Select a past receiver
          </label>
          <div className="relative">
            <select className={`${inputBase} border-gray-200 appearance-none pr-12`} {...register('pastReceiver')}>
              <option>New Receiver</option>
              <option>Sarah Connor (Spain)</option>
              <option>John Smith (United Kingdom)</option>
              <option>Maria Rodriguez (Mexico)</option>
            </select>
            <div style={{ color: PRIMARY }} className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 group-hover:scale-110 transition-transform">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="flex flex-col gap-2.5">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            EXCHANGE Type <span className="text-red-400">*</span>
          </label>
          <input type="hidden" {...register('exchangeType', { required: 'Please select an Exchange type' })} />
          <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-200">
            {exchangeTypes.map(({ key, label, Icon }) => {
              const active = exchangeType === key;
              return (
                <button key={key} type="button"
                  onClick={() => { setValue('exchangeType', key, { shouldValidate: true });  }}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2.5 ${active
                    ? 'bg-white text-gray-900 shadow-lg shadow-black/5 ring-1 ring-black/5'
                    : 'text-gray-400 hover:text-gray-600'}`}>
                  <Icon size={16} style={active ? { color: PRIMARY } : {}} />
                  {label}
                </button>
              );
            })}
          </div>
          <ErrorMsg message={errors.exchangeType?.message} />
        </div>

        {/* ── Currency & Amount ── */}
        <div className="flex flex-col gap-4">
          <div
            style={{ background: `${PRIMARY}0d`, borderColor: `${PRIMARY}22` }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border"
          >
            
            <div className="flex flex-col gap-2.5">
              <label style={{ color: PRIMARY }} className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Coins size={14} /> Total Foreign Currency <span className="text-red-400">*</span>
              </label>
              <input
                type="number" min="0" step="any" value={sendAmount}
                onChange={e => {
                  const val = parseFloat(e.target.value) || 0;
                  setSendAmount(val);
                  setSendAmountError(val > 0 ? '' : 'Please enter a valid send amount');
                }}
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition text-lg font-black h-14 ${
                  sendAmountError ? 'border-red-400 focus:ring-red-200' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {sendAmountError && <ErrorMsg message={sendAmountError} />}

              
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl">
                <span className="font-black text-gray-800">FJ$</span>
                <span className="text-gray-500 font-bold text-sm flex-1">Fijian Dollar</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 py-1 bg-gray-100 rounded-lg">
                  FJD 
                </span>
              </div>
            </div>

            
            <div className="flex flex-col gap-2.5">
              <label style={{ color: PRIMARY }} className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Coins size={14} /> {exchangeType == "SELL" ? "You Get" : "Need To Pay"}
              </label>

              {/* Converted amount */}
              <input
                type="text" readOnly
                value={
                  ratesLoading
                    ? 'Loading rates…'
                    : exchangePreview
                    ? exchangePreview.formatted
                    : '—'
                }
                className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-100 text-gray-700 font-black text-lg h-14"
              />

              {/* Currency dropdown */}
              {rateError ? (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold">
                  <AlertCircle size={13} /> {rateError}
                </div>
              ) : ratesLoading ? (
                <div className="h-12 bg-gray-100 rounded-xl border border-gray-200 animate-pulse" />
              ) : availableCurrencies.length === 0 ? (
                <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-bold">
                  <AlertCircle size={13} /> No rates found for today — please enter manually below
                </div>
              ) : (
                <div className="relative group">
                        <select
                          className={`${inputBase} border-gray-200 appearance-none pr-12`}
                          value={toCurrency?.code ?? ''}
                          onChange={e => {
                            const found = availableCurrencies.find(c => c.code === e.target.value);
                            setToCurrency(found ?? null);
                            if (!useManualRate) setManualRate('');
                          }}
                        >
                          {availableCurrencies.map(c => (
                            <option key={c.code} value={c.code}>
                              {c.code} — {exchangeType === "BUY"
                                ? `Buy: ${c.buyingRate?.toFixed(2) ?? '—'}`
                                : `Sell: ${c.sellingRate?.toFixed(2) ?? '—'}`
                              }
                            </option>
                          ))}
                        </select>
                  <div style={{ color: PRIMARY }} className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 group-hover:scale-110 transition-transform">
                    <ChevronDown size={20} />
                  </div>
                </div>
              )}
            </div>
          </div>

          
        </div>

        {/* Name fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            ['firstName', 'First Name', 'e.g. Maria', { required: 'First name is required', minLength: { value: 2, message: 'Too short' } }],
            ['lastName',  'Last Name',  'e.g. Garcia', { required: 'Last name is required',  minLength: { value: 2, message: 'Too short' } }],
          ].map(([name, label, ph, rules]) => (
            <div key={name} className="flex flex-col gap-2.5">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">
                {label} <span className="text-red-400">*</span>
              </label>
              <input type="text" placeholder={ph} {...register(name, rules)} className={fieldCls(errors[name])} />
              <ErrorMsg message={errors[name]?.message} />
            </div>
          ))}
        </div>

        {/* Country & City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <div className="flex flex-col gap-2.5">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">
              Destination Country <span className="text-red-400">*</span>
            </label>
            <div className="relative group">
              <select
                {...register('country', { required: 'Please select a country' })}
                className={`${fieldCls(errors.country)} appearance-none pl-12 pr-12`}>
                {SUPPORTED_COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <div style={{ color: PRIMARY }} className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4"><Globe size={20} /></div>
              <div style={{ color: PRIMARY }} className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 group-hover:scale-110 transition-transform"><ChevronDown size={20} /></div>
            </div>
            <ErrorMsg message={errors.country?.message} />
          </div> */}

          <div className="flex flex-col gap-2.5">
  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">
    Destination Country <span className="text-red-400">*</span>
  </label>

  <div className="relative group">
    {countryError ? (
      <div className="text-red-500 text-sm font-bold">
        Failed to load countries
      </div>
    ) : countryLoading ? (
      <div className="h-14 bg-gray-100 animate-pulse rounded-xl" />
    ) : (
      <select
        {...register('country', { required: 'Please select a country' })}
        className={`${fieldCls(errors.country)} appearance-none pl-12 pr-12`}
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country.name} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>
    )}

    <div
      style={{ color: PRIMARY }}
      className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4"
    >
      <Globe size={20} />
    </div>

    <div
      style={{ color: PRIMARY }}
      className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 group-hover:scale-110 transition-transform"
    >
      <ChevronDown size={20} />
    </div>
  </div>

  <ErrorMsg message={errors.country?.message} />
</div>
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">
              City / Province <span className="text-red-400">*</span>
            </label>
            <input type="text" placeholder="e.g. Madrid"
              {...register('city', { required: 'City is required' })}
              className={fieldCls(errors.city)} />
            <ErrorMsg message={errors.city?.message} />
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Denomination Panels */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Banknote size={14} style={{ color: PRIMARY }} /> Cash Denomination Counts
          </label>
          <p className="text-xs text-gray-400 font-bold -mt-1">
            Counter staff: count and confirm notes for both sides of the transaction.
          </p>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {senderInfo ? (
              <DenominationPanel
                title="Sender Pays — Cash In" subtitle="Cash received from customer"
                flag={senderInfo.flag} symbol={senderInfo.symbol} currency={senderInfo.currency}
                notes={senderInfo.notes} coins={senderInfo.coins} targetAmount={sendAmount}
                onRowsChange={rows => { senderDenomRowsRef.current = rows; }}
                accentColor="#3b82f6"
              />
            ) : (
              <div style={{ borderColor: '#3b82f633' }} className="rounded-2xl border bg-gray-50 flex items-center justify-center p-8 text-center">
                <p className="font-black text-gray-400 text-sm">FJD denomination data not found — add Fiji to DENOMINATION_DATA</p>
              </div>
            )}
            {/* {receiverInfo ? (
              <DenominationPanel
                title="Receiver Gets — Cash Out" subtitle={`Cash to disburse to ${watchedCountry}`}
                flag={receiverInfo.flag} symbol={receiverInfo.symbol} currency={receiverInfo.currency}
                notes={receiverInfo.notes} coins={receiverInfo.coins}
                targetAmount={exchangePreview?.rawAmount ?? 0}
                onRowsChange={rows => { receiverDenomRowsRef.current = rows; }}
                accentColor={PRIMARY}
              />
            ) : (
              <div style={{ borderColor: `${PRIMARY}33` }} className="rounded-2xl border bg-gray-50 flex items-center justify-center p-8 text-center">
                <p className="font-black text-gray-400 text-sm">Select a supported destination country to enable</p>
              </div>
            )} */}

            {denomLoading ? (
  <div className="rounded-2xl border bg-gray-50 flex items-center justify-center p-8 text-center">
    <p className="font-black text-gray-400 text-sm">Loading denomination…</p>
  </div>
) : denomError ? (
  <div className="rounded-2xl border bg-red-50 flex items-center justify-center p-8 text-center">
    <p className="font-black text-red-500 text-sm">{denomError}</p>
  </div>
) : receiverInfo ? (
  <DenominationPanel
    title="Receiver Gets — Cash Out"
    // subtitle={`Cash to disburse to ${watchedCountry}`}
    subtitle={`Cash to disburse to ${selectedDenomCountry ?? ''}`}
    flag={receiverInfo.flag}
    symbol={receiverInfo.symbol}
    currency={receiverInfo.currency}
    notes={receiverInfo.notes}
    coins={receiverInfo.coins}
    targetAmount={exchangePreview?.rawAmount ?? 0}
    onRowsChange={rows => {
      receiverDenomRowsRef.current = rows;
    }}
    accentColor={PRIMARY}
  />
) : (
  <div className="rounded-2xl border bg-gray-50 flex items-center justify-center p-8 text-center">
    <p className="font-black text-gray-400 text-sm">
      No denomination configured for this country
    </p>
  </div>
)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <button type="button" onClick={onBack}
            className="text-gray-400 hover:text-gray-600 font-black text-sm transition-colors px-6 py-2 uppercase tracking-widest">
            Back
          </button>
          <button type="submit"
            style={{ background: PRIMARY, boxShadow: `0 8px 24px ${PRIMARY}44` }}
            className="flex items-center justify-center gap-3 rounded-2xl text-gray-900 text-base font-black h-14 px-10 transition-all transform active:scale-95 hover:opacity-90 group">
            Continue <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </form>
    </div>
  );
};