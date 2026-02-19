
import React from 'react';
import { Info, ShieldCheck, Zap, TrendingUp } from 'lucide-react';



export const Summary = ({ summary }) => {
  const total = summary.sendAmount + summary.fee;

  return (
    // Fixed: changed 'class' to 'className' throughout the component
    <div className="sticky top-24 flex flex-col gap-5">
      <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-white/10 shadow-xl shadow-primary/5 overflow-hidden">
        <div className="bg-primary/5 p-5 border-b border-primary/10">
          <h4 className="text-gray-900 dark:text-white font-extrabold text-lg flex items-center gap-2">
            Summary
          </h4>
        </div>
        
        <div className="p-6 flex flex-col gap-5">
          {/* Main Amounts */}
          <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-200 dark:border-gray-800">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Send Amount</span>
            <span className="text-gray-900 dark:text-white font-extrabold text-lg">
              {summary.sendAmount.toLocaleString('en-US', { style: 'currency', currency: summary.currency })}
            </span>
          </div>

          <div className="flex flex-col gap-3 pb-4 border-b border-dashed border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
                <span>Transfer Fee</span>
                <Info size={14} className="text-gray-400 cursor-help" />
              </div>
              <span className="text-gray-900 dark:text-white font-bold text-sm">
                + {summary.fee.toLocaleString('en-US', { style: 'currency', currency: summary.currency })}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
                <span>Exchange Rate</span>
                <TrendingUp size={14} className="text-primary" />
              </div>
              <span className="text-primary font-bold text-xs bg-primary/10 dark:bg-primary/5 px-2.5 py-1 rounded-full border border-primary/20">
                1 {summary.currency} = {summary.exchangeRate} {summary.receiverCurrency}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-end pb-2">
            <span className="text-gray-900 dark:text-white text-base font-extrabold">Total to Pay</span>
            <span className="text-gray-900 dark:text-white text-2xl font-black">
              {total.toLocaleString('en-US', { style: 'currency', currency: summary.currency })}
            </span>
          </div>

          {/* Receiver Gets Highlight */}
          <div className="mt-2 rounded-2xl bg-primary p-5 text-gray-900 relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 opacity-10 transform -rotate-12 group-hover:scale-110 transition-transform duration-500">
              <Zap size={140} fill="currentColor" />
            </div>
            
            <span className="block text-xs font-black uppercase tracking-widest opacity-70 mb-1">Receiver Gets</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tighter">
                {summary.receiverCurrency === 'EUR' ? '€' : summary.receiverCurrency}
                {summary.receiverGets.toLocaleString('en-US')}
              </span>
              <span className="text-sm font-black">{summary.receiverCurrency}</span>
            </div>
            
            <div className="mt-4 pt-3 border-t border-black/10 text-xs font-bold opacity-80 flex items-center gap-2">
              <Zap size={16} strokeWidth={3} />
              Arrives by Tomorrow, 10:00 AM
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-semibold">
        <ShieldCheck size={16} className="text-primary" />
        Encrypted & Secure Transaction
      </div>
    </div>
  );
};
