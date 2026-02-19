
import React, { useState, useMemo } from 'react';
import { UserPlus, Globe, Building, Landmark, Wallet, Lock, ChevronDown, ArrowRight, Coins, RefreshCw } from 'lucide-react';




const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToUsd: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToUsd: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rateToUsd: 0.79 },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', rateToUsd: 17.10 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', rateToUsd: 56.20 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateToUsd: 83.30 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$', rateToUsd: 1.35 },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$', rateToUsd: 1.52 },
];

export const ReceiverForm = ({ initialData, sendAmount, onContinue, onBack }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === 'senderCurrency' && (!prev.receiverCurrency || prev.receiverCurrency === prev.senderCurrency)) {
        newData.receiverCurrency = value;
      }
      
      return newData;
    });
  };

  const exchangePreview = useMemo(() => {
    const senderCurr = CURRENCIES.find(c => c.code === formData.senderCurrency);
    const receiverCurr = CURRENCIES.find(c => c.code === formData.receiverCurrency);
    
    if (!senderCurr || !receiverCurr) return null;

    // Cross-rate calculation: (USD / SenderRate) * ReceiverRate
    // But since our rates are already '1 USD = X Currency', 
    // to go Sender -> Receiver: Amount / SenderRate * ReceiverRate
    const exchangeRate = receiverCurr.rateToUsd / senderCurr.rateToUsd;
    const result = sendAmount * exchangeRate;

    return {
      rate: exchangeRate.toFixed(4),
      amount: result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      symbol: receiverCurr.symbol
    };
  }, [formData.senderCurrency, formData.receiverCurrency, sendAmount]);

  const toggleDelivery = (method) => {
    setFormData(prev => ({ ...prev, deliveryMethod: method }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue(formData);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-white/10 shadow-sm p-6 sm:p-10 transition-all">
      <h3 className="text-gray-900 dark:text-white font-black text-xl mb-8 flex items-center gap-3">
        <UserPlus size={24} className="text-primary" />
        Transfer & Receiver Details
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Past Receivers Select */}
        <div className="relative group">
          <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2.5">Select a past receiver</label>
          <div className="relative">
            <select 
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white h-14 px-5 pr-12 text-base font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all cursor-pointer"
              defaultValue="New Receiver"
            >
              <option>New Receiver</option>
              <option>Sarah Connor (Spain)</option>
              <option>John Smith (United Kingdom)</option>
              <option>Maria Rodriguez (Mexico)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-primary group-hover:scale-110 transition-transform">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />

        {/* Currency Selection Grid */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-primary/5 rounded-2xl border border-primary/10 relative">
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                <Coins size={14} />
                Sending Currency
              </label>
              <div className="relative group">
                <select 
                  name="senderCurrency"
                  value={formData.senderCurrency}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white h-14 px-5 text-base font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
                >
                  {CURRENCIES.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name} {curr.symbol}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-primary group-hover:scale-110 transition-transform">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                <Coins size={14} />
                Receiving Currency
              </label>
              <div className="relative group">
                <select 
                  name="receiverCurrency"
                  value={formData.receiverCurrency}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white h-14 px-5 text-base font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
                >
                  {CURRENCIES.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name} {curr.symbol}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-primary group-hover:scale-110 transition-transform">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Exchange Preview Bar */}
          {exchangePreview && (
            <div className="flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <RefreshCw size={14} className="text-primary animate-spin-slow" />
                Live Conversion Preview
              </div>
              <div className="text-sm font-black text-gray-900 dark:text-white">
                {sendAmount.toLocaleString()} {formData.senderCurrency} ≈ <span className="text-primary">{exchangePreview.symbol}{exchangePreview.amount}</span> {formData.receiverCurrency}
                <span className="ml-3 text-[10px] text-gray-400 font-bold opacity-60">1 {formData.senderCurrency} = {exchangePreview.rate} {formData.receiverCurrency}</span>
              </div>
            </div>
          )}
        </div>

        {/* Name Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">First Name</label>
            <input 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white h-14 px-5 text-base font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none placeholder:text-gray-400 transition-all"
              placeholder="e.g. Maria"
              type="text"
              required
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Last Name</label>
            <input 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white h-14 px-5 text-base font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none placeholder:text-gray-400 transition-all"
              placeholder="e.g. Garcia"
              type="text"
              required
            />
          </div>
        </div>

        {/* Country & City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Destination Country</label>
            <div className="relative group">
              <select 
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white h-14 pl-12 pr-12 text-base font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
              >
                <option value="Spain">Spain</option>
                <option value="Mexico">Mexico</option>
                <option value="Philippines">Philippines</option>
                <option value="India">India</option>
                <option value="Germany">Germany</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-primary">
                <Globe size={20} />
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-primary group-hover:scale-110 transition-transform">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">City / Province</label>
            <input 
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white h-14 px-5 text-base font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none placeholder:text-gray-400 transition-all"
              placeholder="e.g. Madrid"
              type="text"
              required
            />
          </div>
        </div>

        {/* Delivery Method Selection */}
        <div className="flex flex-col gap-4">
          <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Delivery Method</label>
          <div className="flex p-1.5 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800">
            <button 
              type="button"
              onClick={() => toggleDelivery('BANK_DEPOSIT')}
              className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2.5
                ${formData.deliveryMethod === 'BANK_DEPOSIT' 
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg shadow-black/5 ring-1 ring-black/5' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
            >
              <Landmark size={18} className={formData.deliveryMethod === 'BANK_DEPOSIT' ? 'text-primary' : ''} />
              Bank Deposit
            </button>
            <button 
              type="button"
              onClick={() => toggleDelivery('CASH_PICKUP')}
              className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2.5
                ${formData.deliveryMethod === 'CASH_PICKUP' 
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg shadow-black/5 ring-1 ring-black/5' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
            >
              <Wallet size={18} className={formData.deliveryMethod === 'CASH_PICKUP' ? 'text-primary' : ''} />
              Cash Pickup
            </button>
          </div>
        </div>

        {/* Conditional Bank Details */}
        {formData.deliveryMethod === 'BANK_DEPOSIT' && (
          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-widest">
              <Lock size={16} strokeWidth={3} />
              Bank details are encrypted and secure
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Bank Name</label>
                <input 
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white h-14 px-5 text-base font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none placeholder:text-gray-300 transition-all"
                  placeholder="e.g. Banco Santander"
                  type="text"
                  required
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">IBAN / Account Number</label>
                <input 
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white h-14 px-5 text-base font-mono font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none placeholder:text-gray-300 transition-all"
                  placeholder="ES00 0000 0000 0000 0000"
                  type="text"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4">
          <button 
            type="button"
            onClick={onBack}
            className="text-gray-500 font-black text-sm hover:text-primary transition-colors px-6 py-2 uppercase tracking-widest"
          >
            Back
          </button>
          <button 
            type="submit"
            className="flex items-center justify-center gap-3 rounded-2xl bg-primary hover:bg-primary/90 text-gray-900 text-base font-black h-14 px-10 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all transform active:scale-95 group"
          >
            Continue
            <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
};
