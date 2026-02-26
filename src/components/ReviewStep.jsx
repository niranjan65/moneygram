// import React from 'react';
// import {
//   Check,
//   Edit2,
//   TrendingUp,
//   Info,
//   Landmark,
//   Clock,
//   Lock,
//   ArrowRight,
// } from 'lucide-react';

// const PRIMARY = '#30e87a';
// const PRIMARY_DARK = '#25b660';

// /**
//  * ReviewStep
//  *
//  * Props:
//  *  data — the payload from ReceiverForm's onContinue:
//  *    {
//  *      sendAmount, senderCurrency, receiverCurrency,
//  *      exchangeRate, receiverGets,
//  *      firstName, lastName,
//  *      bankName, accountNumber,
//  *      deliveryMethod,          // 'BANK_DEPOSIT' | 'CASH_PICKUP'
//  *      country,
//  *      totalDispensed,          // only for CASH_PICKUP
//  *      denominationRows,        // only for CASH_PICKUP
//  *    }
//  *  senderName   — string, e.g. "John Doe"
//  *  paymentLabel — string, e.g. "Visa •••• 4242"
//  *  fee          — number (transfer fee in sender currency), default 4.99
//  *  onEdit       — () => void  — called when any Edit button is clicked
//  *  onCancel     — () => void
//  *  onConfirm    — () => void
//  */
// export const ReviewStep = ({
//   data = {},
//   senderName = 'John Doe',
//   paymentLabel = 'Visa •••• 4242',
//   fee = 4.99,
//   onEdit,
//   onCancel,
//   onConfirm,
// }) => {
//   const {
//     sendAmount = 1000,
//     senderCurrency = 'USD',
//     receiverCurrency = 'EUR',
//     exchangeRate = 0,
//     receiverGets = 0,
//     firstName = '',
//     lastName = '',
//     bankName = '',
//     accountNumber = '',
//     deliveryMethod = 'BANK_DEPOSIT',
//     country = '',
//     totalDispensed,
//     denominationRows = [],
//   } = data;

//   // const totalToPay = (parseFloat(sendAmount) + fee).toFixed(2);
//   const isCash     = deliveryMethod === 'CASH_PICKUP';
//   const maskedAcct = accountNumber
//     ? `•••• ${String(accountNumber).slice(-4)}`
//     : '•••• ––';

//   const fmt = (val, decimals = 2) =>
//     Number(val).toLocaleString(undefined, {
//       minimumFractionDigits: decimals,
//       maximumFractionDigits: decimals,
//     });

//     const SERVICE_RATE = 0.02;   // 2%
// const GST_RATE = 0.15;       // 15%

// const serviceFee = receiverGets * SERVICE_RATE;
// const gstAmount  = serviceFee * GST_RATE;

// const totalToPay = (
//   parseFloat(sendAmount) +
//   serviceFee +
//   gstAmount
// ).toFixed(2);

//   return (
//     <div className="flex flex-col gap-8">

//       {/* Header */}
//       <div className="text-center space-y-2">
//         <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
//           Review transfer details
//         </h2>
//         <p className="text-gray-500">Please review the details below before confirming.</p>
//       </div>

//       {/* Main Card */}
//       <div className="bg-white rounded-2xl shadow-[0_0_1px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden border border-gray-100">

//         {/* Hero — Recipient Receives */}
//         <div className="p-8 bg-gradient-to-br from-green-50 to-white border-b border-gray-100 relative">
//           <div className="absolute top-6 right-6">
//             <button
//               onClick={onEdit}
//               className="text-sm font-bold flex items-center gap-1 transition-colors hover:opacity-75"
//               style={{ color: PRIMARY }}
//             >
//               <Edit2 size={16} strokeWidth={2.5} />
//               Edit
//             </button>
//           </div>
//           <div className="flex flex-col items-center justify-center text-center gap-1">
//             <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
//               Recipient Receives
//             </span>
//             <div className="flex items-baseline gap-2">
//               <span className="text-5xl font-extrabold text-gray-900 tracking-tight">
//                 {fmt(isCash ? totalDispensed ?? receiverGets : receiverGets)}
//               </span>
//               <span className="text-2xl font-bold text-gray-400">{receiverCurrency}</span>
//             </div>
//             {exchangeRate > 0 && (
//               <div
//                 className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
//                 style={{ background: `${PRIMARY}22`, color: PRIMARY_DARK }}
//               >
//                 <TrendingUp size={13} className="mr-1" />
//                 <div>
//   Rate: 1 {senderCurrency} = {exchangeRate.toFixed(4)} {receiverCurrency}
// </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Transaction Breakdown */}
//         <div className="p-6 md:p-8 space-y-6">

//           {/* Cost Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pb-6 border-b border-gray-100">
//             <div className="space-y-3">
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-gray-500">Send Amount</span>
//                 <span className="font-bold text-gray-900">
//                   {fmt(sendAmount)} {senderCurrency}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-gray-500 flex items-center gap-1">
//                   Transfer Fee
//                   <span title="Standard processing fee">
//                     <Info size={14} className="text-gray-400 cursor-help" />
//                   </span>
//                 </span>
//                 <span className="font-bold text-gray-900">
//                   +{fmt(serviceFee)} {senderCurrency}
//                 </span>
//               </div>

//               <div className="flex justify-between items-center text-sm">
//   <span className="text-gray-500">GST (15%)</span>
//   <span className="font-bold text-gray-900">
//     +{fmt(gstAmount)} {senderCurrency}
//   </span>
// </div>
//             </div>
            
//             <div className="space-y-3">
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-gray-500">Total to Pay</span>
//                 <span className="font-extrabold text-lg text-gray-900">
//                   {totalToPay} {senderCurrency}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-gray-500">Delivery Method</span>
//                 <span className="font-bold text-gray-900 flex items-center gap-1">
//                   <Landmark size={16} style={{ color: PRIMARY }} />
//                   {isCash ? 'Cash Pickup' : 'Bank Deposit'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Cash denomination table — only for Cash Pickup */}
//           {isCash && denominationRows.length > 0 && (
//             <div className="pb-6 border-b border-gray-100">
//               <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
//                 Cash Denomination Breakdown
//               </h3>
//               <div className="rounded-xl border border-gray-100 overflow-hidden">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
//                       <th className="px-4 py-2.5 text-left">Denomination</th>
//                       <th className="px-4 py-2.5 text-center">Count</th>
//                       <th className="px-4 py-2.5 text-right">Subtotal</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-50">
//                     {denominationRows.map((row, i) => (
//                       <tr key={i} className="bg-white">
//                         <td className="px-4 py-2.5 font-bold text-gray-900">
//                           {row.denomination_value < 1
//                             ? row.denomination_value.toFixed(2)
//                             : row.denomination_value.toLocaleString()}
//                         </td>
//                         <td className="px-4 py-2.5 text-center text-gray-600 font-semibold">
//                           × {row.count}
//                         </td>
//                         <td className="px-4 py-2.5 text-right font-bold" style={{ color: PRIMARY_DARK }}>
//                           {fmt(row.subtotal)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot>
//                     <tr className="bg-gray-50 border-t-2 border-gray-200">
//                       <td className="px-4 py-3 font-black text-gray-900 text-sm" colSpan={2}>
//                         Total Dispensed
//                       </td>
//                       <td className="px-4 py-3 text-right font-black text-base" style={{ color: PRIMARY_DARK }}>
//                         {fmt(totalDispensed ?? receiverGets)} {receiverCurrency}
//                       </td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Sender & Recipient Details */}
//           {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
//                   Sender Details
//                 </h3>
//                 <button
//                   onClick={onEdit}
//                   className="text-xs font-bold transition-colors hover:opacity-75"
//                   style={{ color: PRIMARY }}
//                 >
//                   Edit
//                 </button>
//               </div>
//               <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
//                 <div className="bg-white p-2 rounded-lg shadow-sm flex-shrink-0">
//                   <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-bold text-gray-900">{senderName}</p>
//                   <p className="text-sm text-gray-500">{paymentLabel}</p>
//                   <p className="text-xs text-gray-400 mt-1">Debit Card</p>
//                 </div>
//               </div>
//             </div>

            
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
//                   Recipient Details
//                 </h3>
//                 <button
//                   onClick={onEdit}
//                   className="text-xs font-bold transition-colors hover:opacity-75"
//                   style={{ color: PRIMARY }}
//                 >
//                   Edit
//                 </button>
//               </div>
//               <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
//                 <div className="bg-white p-2 rounded-lg shadow-sm flex-shrink-0">
//                   <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-bold text-gray-900">
//                     {firstName} {lastName}
//                   </p>
//                   {isCash ? (
//                     <>
//                       <p className="text-sm text-gray-500">{country}</p>
//                       <p className="text-xs text-gray-400 mt-1">Cash Pickup</p>
//                     </>
//                   ) : (
//                     <>
//                       <p className="text-sm text-gray-500">{bankName}</p>
//                       <p className="text-xs text-gray-400 mt-1">IBAN: {maskedAcct}</p>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div> */}

//           {/* Arrival Estimate */}
//           <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
//             <Clock size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
//             <div>
//               <p className="text-sm font-bold text-blue-900">
//                 Estimated Arrival: 1–2 Business Days
//               </p>
//               <p className="text-xs text-blue-700 mt-1">
//                 Funds are typically available within 24 hours depending on the receiving bank's processing times.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Footer Actions */}
//         <div className="bg-gray-50 px-6 py-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100">
//           <div className="flex items-center gap-2 text-xs text-gray-500">
//             <Lock size={14} className="text-green-600" />
//             <span>Encrypted &amp; Secure Transaction</span>
//           </div>
//           <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
//             <button
//               onClick={onCancel}
//               className="px-6 py-3 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors w-full md:w-auto"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onConfirm}
//               className="px-8 py-3 rounded-xl text-sm font-bold text-black w-full md:w-auto flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
//               style={{
//                 background: `linear-gradient(to right, ${PRIMARY}, ${PRIMARY_DARK})`,
//                 boxShadow: `0 8px 24px ${PRIMARY}44`,
//               }}
//             >
//               Confirm &amp; Send
//               <ArrowRight size={18} strokeWidth={2.5} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Disclaimer */}
//       <p className="text-center text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed">
//         By clicking "Confirm &amp; Send", you agree to our{' '}
//         <a href="#" className="underline hover:text-gray-600">Terms of Service</a> and{' '}
//         <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
//         Exchange rates are subject to change until the transaction is confirmed.
//       </p>
//     </div>
//   );
// };






import React from 'react';
import {
  Edit2,
  TrendingUp,
  Info,
  Landmark,
  Clock,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useExchange } from '../context/ExchangeContext';

const PRIMARY = '#30e87a';
const PRIMARY_DARK = '#25b660';

export const ReviewStep = ({
  data = {},
  senderName = 'John Doe',
  paymentLabel = 'Visa •••• 4242',
  onEdit,
  onCancel,
  onConfirm,
}) => {
  const {
    serviceFee,
    gstAmount,
    total,
    serviceRate,
    gstRate,
  } = useExchange();

  const {
    sendAmount = 0,
    senderCurrency = 'USD',
    receiverCurrency = 'EUR',
    exchangeRate = 0,
    receiverGets = 0,
    firstName = '',
    lastName = '',
    bankName = '',
    accountNumber = '',
    deliveryMethod = 'BANK_DEPOSIT',
    country = '',
    totalDispensed,
    denominationRows = [],
  } = data;

  const isCash = deliveryMethod === 'CASH_PICKUP';

  const maskedAcct = accountNumber
    ? `•••• ${String(accountNumber).slice(-4)}`
    : '•••• ––';

  const fmt = (val, decimals = 2) =>
    Number(val).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Review transfer details
        </h2>
        <p className="text-gray-500">
          Please review the details below before confirming.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">

        {/* Recipient Receives Section */}
        <div className="p-8 bg-gradient-to-br from-green-50 to-white border-b border-gray-100 relative">
          <div className="absolute top-6 right-6">
            <button
              onClick={onEdit}
              className="text-sm font-bold flex items-center gap-1 hover:opacity-75"
              style={{ color: PRIMARY }}
            >
              <Edit2 size={16} />
              Edit
            </button>
          </div>

          <div className="text-center space-y-2">
            <span className="text-sm uppercase tracking-wider text-gray-500">
              Recipient Receives
            </span>

            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-extrabold text-gray-900">
                {fmt(isCash ? totalDispensed ?? receiverGets : receiverGets)}
              </span>
              <span className="text-2xl font-bold text-gray-400">
                {receiverCurrency}
              </span>
            </div>

            {exchangeRate > 0 && (
              <div
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: `${PRIMARY}22`, color: PRIMARY_DARK }}
              >
                <TrendingUp size={13} className="mr-1" />
                Rate: 1 {senderCurrency} = {exchangeRate.toFixed(4)} {receiverCurrency}
              </div>
            )}
          </div>
        </div>

        {/* Breakdown */}
        <div className="p-6 md:p-8 space-y-6">

          {/* Cost Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pb-6 border-b border-gray-100">

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Send Amount</span>
                <span className="font-bold text-gray-900">
                  {fmt(sendAmount)} {senderCurrency}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1">
                  Service Fee ({serviceRate * 100}%)
                  <Info size={14} className="text-gray-400" />
                </span>
                <span className="font-bold text-gray-900">
                  +{fmt(serviceFee)} {senderCurrency}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  GST ({gstRate * 100}%)
                </span>
                <span className="font-bold text-gray-900">
                  +{fmt(gstAmount)} {senderCurrency}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total to Pay</span>
                <span className="font-extrabold text-lg text-gray-900">
                  {fmt(total)} {senderCurrency}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Method</span>
                <span className="font-bold flex items-center gap-1">
                  <Landmark size={16} style={{ color: PRIMARY }} />
                  {isCash ? 'Cash Pickup' : 'Bank Deposit'}
                </span>
              </div>
            </div>
          </div>

          {/* Cash Breakdown */}
          {isCash && denominationRows.length > 0 && (
            <div className="pb-6 border-b border-gray-100">
              <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">
                Cash Denomination Breakdown
              </h3>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs uppercase text-gray-400">
                      <th className="px-4 py-2 text-left">Denomination</th>
                      <th className="px-4 py-2 text-center">Count</th>
                      <th className="px-4 py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {denominationRows.map((row, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-4 py-2 font-bold">
                          {row.denomination_value}
                        </td>
                        <td className="px-4 py-2 text-center">
                          × {row.count}
                        </td>
                        <td className="px-4 py-2 text-right font-bold">
                          {fmt(row.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Arrival Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
            <Clock size={18} className="text-blue-600" />
            <div>
              <p className="text-sm font-bold text-blue-900">
                Estimated Arrival: 1–2 Business Days
              </p>
              <p className="text-xs text-blue-700">
                Funds are typically available within 24 hours depending on bank processing.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-6 flex justify-between items-center border-t">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Lock size={14} className="text-green-600" />
            Encrypted & Secure Transaction
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-3 rounded-xl text-sm font-bold text-gray-600 bg-white border hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="px-8 py-3 rounded-xl text-sm font-bold text-black flex items-center gap-2 hover:opacity-90"
              style={{
                background: `linear-gradient(to right, ${PRIMARY}, ${PRIMARY_DARK})`,
              }}
            >
              Confirm & Send
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};