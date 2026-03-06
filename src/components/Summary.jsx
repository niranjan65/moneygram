
// import React from 'react';
// import { Info, ShieldCheck, Zap, TrendingUp } from 'lucide-react';

// export const Summary = ({ summary }) => {
//   console.log("summary", summary);

//   const receiverGets = summary.receiverGets || 0;

//   // 🔹 CONFIGURABLE RATES
//   const SERVICE_RATE = 0.02; // 5% Service Fee
//   const GST_RATE = 0.15;     // 15% GST on Service Fee

//   // 🔹 Calculations
//   const serviceFee = receiverGets * SERVICE_RATE;
//   const gstAmount = serviceFee * GST_RATE;

//   const total =
//     summary.exchangeType === "BUY"
//       ? receiverGets + serviceFee + gstAmount
//       : receiverGets - serviceFee - gstAmount;

//   return (
//     <div className="sticky top-24 flex flex-col gap-5">
//       <div className="rounded-2xl border border-gray-200 bg-white shadow-xl shadow-primary/5 overflow-hidden">
        
//         {/* Header */}
//         <div className="bg-primary/5 p-5 border-b border-primary/10">
//           <h4 className="text-gray-900 font-extrabold text-lg flex items-center gap-2">
//             Summary
//           </h4>
//         </div>

//         <div className="p-6 flex flex-col gap-5">

//           {/* Breakdown */}
//           <div className="flex flex-col gap-3 pb-4 border-b border-dashed border-gray-200">

//             {/* Receiver Gets */}
//             <div className="flex justify-between items-center">
//               <span className="text-gray-500 text-sm font-semibold">
//                 Receiver Gets
//               </span>
//               <span className="font-bold text-sm">
//                 {receiverGets.toLocaleString('en-US', {
//                   style: 'currency',
//                   currency: summary.currency,
//                 })}
//               </span>
//             </div>

//             {/* Service Fee */}
//             <div className="flex justify-between items-center">
//               <span className="text-gray-500 text-sm font-semibold flex items-center gap-1">
//                 Service Fee (2%)
//                 <Info size={14} className="text-gray-400" />
//               </span>
//               <span className="font-bold text-sm">
//                 {serviceFee.toLocaleString('en-US', {
//                   style: 'currency',
//                   currency: summary.currency,
//                 })}
//               </span>
//             </div>

//             {/* GST */}
//             <div className="flex justify-between items-center">
//               <span className="text-gray-500 text-sm font-semibold">
//                 GST (15%)
//               </span>
//               <span className="font-bold text-sm">
//                 {gstAmount.toLocaleString('en-US', {
//                   style: 'currency',
//                   currency: summary.currency,
//                 })}
//               </span>
//             </div>

//             {/* Exchange Rate */}
//             <div className="flex justify-between items-center pt-2 border-t border-gray-100">
//               <div className="flex items-center gap-1.5 text-gray-500 text-sm">
//                 <span>Exchange Rate</span>
//                 <TrendingUp size={14} className="text-primary" />
//               </div>
//               <span className="text-primary font-bold text-xs bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
//                 {summary.exchangeType === "SELL" ? (
//                   <>
//                     1 {summary.currency} = {summary.exchangeRate} {summary.receiverCurrency}
//                   </>
//                 ) : (
//                   <>
//                     1 {summary.receiverCurrency} = {summary.exchangeRate} {summary.currency}
//                   </>
//                 )}
//               </span>
//             </div>

//           </div>

//           {/* Total */}
//           <div className="flex justify-between items-end pb-2">
//             <span className="text-gray-900 text-base font-extrabold">
//               {summary.exchangeType === "BUY"
//                 ? "Total to Pay"
//                 : "Total Customer Gets"}
//             </span>
//             <span className="text-gray-900 text-2xl font-black">
//               {Math.abs(total).toLocaleString('en-US', {
//                 style: 'currency',
//                 currency: summary.currency,
//               })}
//             </span>
//           </div>

//           {/* Highlight Box */}
//           <div className="mt-2 rounded-2xl bg-primary p-5 text-gray-900 relative overflow-hidden group">
//             <div className="absolute -right-6 -bottom-6 opacity-10 transform -rotate-12 group-hover:scale-110 transition-transform duration-500">
//               <Zap size={140} fill="currentColor" />
//             </div>

//             <span className="block text-xs font-black uppercase tracking-widest opacity-70 mb-1">
//               {summary.exchangeType === "SELL"
//                 ? "Receiver Gets"
//                 : "Customer Needs to Pay"}
//             </span>

//             <div className="flex items-baseline gap-2">
//               <span className="text-3xl font-black tracking-tighter">
//                 {Math.abs(total).toLocaleString('en-US', {
//                 style: 'currency',
//                 currency: summary.currency,
//               })}
//               </span>
//               <span className="text-sm font-black">
//                 {summary.receiverCurrency}
//               </span>
//             </div>

//             <div className="mt-4 pt-3 border-t border-black/10 text-xs font-bold opacity-80 flex items-center gap-2">
//               <Zap size={16} strokeWidth={3} />
//               Arrives by Tomorrow, 10:00 AM
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Security Footer */}
//       <div className="flex items-center justify-center gap-2 text-gray-500 text-xs font-semibold">
//         <ShieldCheck size={16} className="text-primary" />
//         Encrypted & Secure Transaction
//       </div>
//     </div>
//   );
// };









import React from 'react';
import { Info, ShieldCheck, Zap, TrendingUp } from 'lucide-react';
import { useExchange } from '../context/ExchangeContext';


export const Summary = () => {
  const {
    receiverGets,
    serviceFee,
    gstAmount,
    total,
    serviceRate,
    gstRate,
    exchangeType,
  } = useExchange();

  const roundToNearestFiveCents = (amount) => {
  if (!amount) return 0;
  return Math.round(amount / 0.05) * 0.05;
};

  const roundedTotal = roundToNearestFiveCents(total);

  return (
    <div className="sticky top-24 flex flex-col gap-5">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xl shadow-primary/5 overflow-hidden">
        
        <div className="bg-primary/5 p-5 border-b border-primary/10">
          <h4 className="text-gray-900 font-extrabold text-lg">
            Summary
          </h4>
        </div>

        <div className="p-6 flex flex-col gap-5">

          <div className="flex flex-col gap-3 pb-4 border-b border-dashed border-gray-200">

            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm font-semibold">
                Receiver Gets
              </span>
              <span className="font-bold text-sm">
                {receiverGets.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'FJD',
                })}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm font-semibold flex items-center gap-1">
                Service Fee ({serviceRate * 100}%)
                <Info size={14} className="text-gray-400" />
              </span>
              <span className="font-bold text-sm">
                {serviceFee.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'FJD',
                })}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm font-semibold">
                GST ({gstRate * 100}%)
              </span>
              <span className="font-bold text-sm">
                {gstAmount.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'FJD',
                })}
              </span>
            </div>

          </div>

          <div className="flex justify-between items-end pb-2">
            <span className="text-gray-900 text-base font-extrabold">
              {exchangeType === "BUY"
                ? "Total to Pay"
                : "Total Customer Gets"}
            </span>
            <span className="text-gray-900 text-2xl font-black">
              {Math.abs(total).toLocaleString('en-US', {
                style: 'currency',
                currency: 'FJD',
              })}
            </span>
          </div>

          <div className="mt-2 rounded-2xl bg-primary p-5 text-gray-900">
            <span className="block text-xs font-black uppercase tracking-widest opacity-70 mb-1">
              Final Amount
            </span>

            <div className="text-3xl font-black tracking-tighter">
              {Math.abs(roundedTotal).toLocaleString('en-US', {
                style: 'currency',
                currency: 'FJD',
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-gray-500 text-xs font-semibold">
        <ShieldCheck size={16} className="text-primary" />
        Encrypted & Secure Transaction
      </div>
    </div>
  );
};