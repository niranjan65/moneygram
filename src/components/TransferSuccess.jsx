// import React, { useState } from 'react';
// import {
//   Check,
//   Copy,
//   LayoutDashboard,
//   FileText,
//   HelpCircle,
//   TrendingUp,
//   Info,
// } from 'lucide-react';
// import { useExchange } from '../context/ExchangeContext';

// const PRIMARY = '#30e87a';
// const PRIMARY_DARK = '#24b35f';

// /**
//  * TransferSuccess
//  *
//  * Props:
//  *  data — the transferPayload from ReceiverForm / MoneyExchange:
//  *    {
//  *      sendAmount, senderCurrency,
//  *      receiverGets, receiverCurrency,
//  *      exchangeRate,
//  *      firstName, lastName,
//  *      totalDispensed,       // cash pickup only
//  *    }
//  *  apiDoc — the created Currency Exchange For Customer doc from ERPNext API
//  *  transactionId    — string, e.g. '#TRX-882910' (auto-generated if omitted)
//  *  estimatedArrival — string, e.g. 'Today by 5:00 PM'
//  *  onDashboard      — () => void
//  *  onDownloadReceipt— () => void
//  */
// export const TransferSuccess = ({
//   data = {},
//   apiDoc,
//   transactionId,
//   estimatedArrival = 'Today by 5:00 PM',
//   onDashboard,
//   onDownloadReceipt,
// }) => {

//   console.log("transfer successfull ", apiDoc)

//   // Pull calculated exchange values from ExchangeContext
//   const exchange = useExchange();
//   // Prefer API doc values, fall back to local data
//   const sendAmount = apiDoc?.you_send ?? apiDoc?.send_amount ?? data.sendAmount ?? 0;
//   const senderCurrency = apiDoc?.you_send_currency_type ?? data.senderCurrency ?? 'USD';
//   const receiverGets = apiDoc?.they_receive ?? data.receiverGets ?? 0;
//   const receiverCurrency = apiDoc?.they_receive_currency_type ?? data.receiverCurrency ?? 'EUR';
//   const exchangeRate = apiDoc?.exchange_rate ?? data.exchangeRate ?? 0;
//   const firstName = apiDoc?.first_name ?? data.firstName ?? '';
//   const lastName = apiDoc?.last_name ?? data.lastName ?? '';
//   const totalDispensed = data.totalDispensed;
//   const transferFee = apiDoc?.transfer_fee ?? 0;
//   const totalAmount = apiDoc?.total_amount ?? 0;
//   const docName = apiDoc?.name ?? null;

//   // Use doc name as reference, or transactionId prop, or auto-generate
//   const txId = docName || transactionId || `#TRX-${Math.floor(100000 + Math.random() * 900000)}`;

//   const [copied, setCopied] = useState(false);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(txId).catch(() => { });
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const fmt = (val, decimals = 2) =>
//     Number(val).toLocaleString(undefined, {
//       minimumFractionDigits: decimals,
//       maximumFractionDigits: decimals,
//     });

//   const recipientName = `${firstName} ${lastName}`.trim() || 'the recipient';
//   const finalAmount = totalDispensed ?? receiverGets;

//   // Currency symbol helper
//   const symMap = { USD: '$', EUR: '€', GBP: '£', INR: '₹', PHP: '₱', MXN: '$', JPY: '¥' };
//   const toSym = symMap[receiverCurrency] ?? '';

//   return (
//     <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6">
//       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden relative border border-gray-100">

//         {/* Decorative top glow */}
//         <div
//           className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 rounded-full pointer-events-none"
//           style={{ background: `${PRIMARY}18`, filter: 'blur(60px)' }}
//         />

//         <div className="relative flex flex-col items-center p-8 sm:p-12 text-center">

//           {/* Success Icon */}
//           <div className="mb-8 relative">
//             <div
//               className="absolute inset-0 rounded-full blur-xl scale-75"
//               style={{ background: `${PRIMARY}33` }}
//             />
//             <div
//               className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
//               style={{
//                 background: PRIMARY,
//                 boxShadow: `0 8px 32px ${PRIMARY}55`,
//                 animation: 'successBounce 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
//               }}
//             >
//               <Check size={40} strokeWidth={3.5} className="text-white" />
//             </div>
//           </div>

//           {/* Heading */}
//           <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
//             Transfer Successful
//           </h1>
//           <p className="text-gray-500 text-lg font-medium max-w-md">
//             Your money is securely on its way to{' '}
//             <span className="font-bold text-gray-900">{recipientName}</span>.
//           </p>

//           {/* Reference / Transaction ID chip */}
//           {/* <button
//             onClick={handleCopy}
//             className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full border transition-all group"
//             style={{
//               background: '#f6f8f7',
//               borderColor: copied ? PRIMARY : '#e5e7eb',
//             }}
//             title="Click to copy"
//           >
//             <span className="text-sm font-semibold text-gray-500">
//               {docName ? 'Reference No:' : 'Transaction ID:'}
//             </span>
//             <span className="text-sm font-bold text-gray-900 font-mono tracking-wide">{txId}</span>
//             {copied
//               ? <Check size={16} strokeWidth={3} style={{ color: PRIMARY }} />
//               : <Copy size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
//             }
//           </button> */}

//           {/* Details Card */}
//           <div className="mt-10 w-full bg-gray-50 rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">

//             {/* Receiver Gets */}
//             <div className="flex justify-between items-center p-5">
//               <span className="text-gray-500 font-medium">Receiver Gets</span>
//               <span className="text-gray-900 font-bold text-lg">
//                 {receiverCurrency} {fmt(exchange.receiverGets)}
//               </span>
//             </div>

//             {/* Service Fee */}
//             <div className="flex justify-between items-center p-5">
//               <span className="text-gray-500 font-medium flex items-center gap-1.5">
//                 Service Fee ({(exchange.serviceRate * 100).toFixed(0)}%)
//                 <Info size={14} className="text-gray-400" />
//               </span>
//               <span className="text-gray-900 font-bold text-lg">
//                 {receiverCurrency} {fmt(exchange.serviceFee)}
//               </span>
//             </div>

//             {/* GST */}
//             <div className="flex justify-between items-center p-5">
//               <span className="text-gray-500 font-medium">
//                 GST ({(exchange.gstRate * 100).toFixed(0)}%)
//               </span>
//               <span className="text-gray-900 font-bold text-lg">
//                 {receiverCurrency} {fmt(exchange.gstAmount)}
//               </span>
//             </div>

//             {/* Total to Pay */}
//             <div className="flex justify-between items-center p-5 border-t border-gray-200">
//               <span className="text-gray-900 font-extrabold text-lg">Total to Pay</span>
//               <span className="text-gray-900 font-extrabold text-2xl">
//                 {receiverCurrency} {fmt(exchange.total)}
//               </span>
//             </div>

//             {/* Final Amount — highlighted */}
//             <div
//               className="mx-4 mb-4 rounded-xl px-6 py-5 text-center"
//               style={{ background: PRIMARY }}
//             >
//               <p className="text-xs font-black uppercase tracking-[0.15em] text-gray-900 mb-1 opacity-80">
//                 FINAL AMOUNT
//               </p>
//               <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
//                 {receiverCurrency} {fmt(exchange.total)}
//               </p>
//             </div>
//           </div>

//           {/* Arrival estimate */}
//           <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
//             <div
//               className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
//               style={{ background: `${PRIMARY}22`, color: PRIMARY_DARK }}
//             >
//               {firstName?.[0]?.toUpperCase() ?? '?'}
//             </div>
//             <p>
//               Estimated arrival:{' '}
//               <span className="font-semibold text-gray-900">{estimatedArrival}</span>
//             </p>
//           </div>

//           {/* Action Buttons */}
//           <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
//             <button
//               onClick={onDashboard}
//               className="flex-1 max-w-xs h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-base transition-all active:scale-95 hover:opacity-90"
//               style={{
//                 background: PRIMARY,
//                 color: '#111',
//                 boxShadow: `0 8px 24px ${PRIMARY}44`,
//               }}
//             >
//               <LayoutDashboard size={18} strokeWidth={2.5} />
//               New Exchange
//             </button>
//             <button
//               onClick={onDownloadReceipt}
//               className="flex-1 max-w-xs h-12 flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 text-gray-900 font-bold text-base transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-95 bg-white"
//             >
//               <FileText size={18} strokeWidth={2.5} />
//               Download Receipt
//             </button>
//           </div>

//           {/* Support link */}
//           <div className="mt-8">
//             <a
//               href="#"
//               className="text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1 group"
//             >
//               <HelpCircle size={16} className="group-hover:scale-110 transition-transform" />
//               Need help with this transaction?
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Bounce keyframe */}
//       <style>{`
//         @keyframes successBounce {
//           0%   { transform: scale(0.3); opacity: 0; }
//           50%  { transform: scale(1.1); opacity: 1; }
//           70%  { transform: scale(0.95); }
//           100% { transform: scale(1); }
//         }
//       `}</style>
//     </div>
//   );
// };








import React, { useState, useEffect } from 'react';
import {
  Check,
  LayoutDashboard,
  FileText,
  HelpCircle,
  Info,
} from 'lucide-react';
import { io } from 'socket.io-client';
import { useExchange } from '../context/ExchangeContext';

const PRIMARY = '#30e87a';
const PRIMARY_DARK = '#24b35f';

// 🔌 Connect to your webhook server
const socket = io('http://192.168.101.172:5000', {
  transports: ['websocket'],
});

export const TransferSuccess = ({
  data = {},
  apiDoc,
  transactionId,
  estimatedArrival = 'Today by 5:00 PM',
  onDashboard,
  onDownloadReceipt,
}) => {

  const exchange = useExchange();

  // 🔄 New States
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState(null);

  // 🎧 Listen for socket event
  useEffect(() => {

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('new-sales-invoice', (payload) => {
      console.log('Invoice received from socket:', payload);

      setInvoiceData(payload);
      setIsLoading(false);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.off('new-sales-invoice');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  // ⏳ Loading Screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: `${PRIMARY}`, borderTopColor: 'transparent' }}
          />
          <p className="text-gray-600 font-semibold text-lg">
            Waiting for confirmation...
          </p>
        </div>
      </div>
    );
  }

  // Use socket data if available
  const finalData = invoiceData || apiDoc || data;

  const sendAmount = finalData?.you_send ?? data.sendAmount ?? 0;
  const senderCurrency = finalData?.you_send_currency_type ?? data.senderCurrency ?? 'USD';
  const receiverGets = finalData?.they_receive ?? data.receiverGets ?? 0;
  const receiverCurrency = finalData?.they_receive_currency_type ?? data.receiverCurrency ?? 'EUR';
  const firstName = finalData?.first_name ?? data.firstName ?? '';
  const lastName = finalData?.last_name ?? data.lastName ?? '';
  const recipientName = `${firstName} ${lastName}`.trim() || 'the recipient';

  const fmt = (val, decimals = 2) =>
    Number(val).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden relative border border-gray-100">

        <div className="relative flex flex-col items-center p-8 sm:p-12 text-center">

          {/* Success Icon */}
          <div className="mb-8 relative">
            <div
              className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: PRIMARY,
                boxShadow: `0 8px 32px ${PRIMARY}55`,
              }}
            >
              <Check size={40} strokeWidth={3.5} className="text-white" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Transfer Successful
          </h1>

          <p className="text-gray-500 text-lg font-medium max-w-md">
            Your money is securely on its way to{' '}
            <span className="font-bold text-gray-900">{recipientName}</span>.
          </p>

          {/* Details Card */}
          <div className="mt-10 w-full bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100">

            <div className="flex justify-between items-center p-5">
              <span className="text-gray-500 font-medium">Receiver Gets</span>
              <span className="text-gray-900 font-bold text-lg">
                {receiverCurrency} {fmt(receiverGets)}
              </span>
            </div>

            <div className="flex justify-between items-center p-5 border-t border-gray-200">
              <span className="text-gray-900 font-extrabold text-lg">Total to Pay</span>
              <span className="text-gray-900 font-extrabold text-2xl">
                {receiverCurrency} {fmt(exchange.total)}
              </span>
            </div>

            <div
              className="mx-4 mb-4 rounded-xl px-6 py-5 text-center"
              style={{ background: PRIMARY }}
            >
              <p className="text-xs font-black uppercase tracking-[0.15em] text-gray-900 mb-1 opacity-80">
                FINAL AMOUNT
              </p>
              <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {receiverCurrency} {fmt(exchange.total)}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={onDashboard}
              className="flex-1 max-w-xs h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-base"
              style={{
                background: PRIMARY,
                color: '#111',
              }}
            >
              <LayoutDashboard size={18} />
              New Exchange
            </button>

            <button
              onClick={onDownloadReceipt}
              className="flex-1 max-w-xs h-12 flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 text-gray-900 font-bold text-base bg-white"
            >
              <FileText size={18} />
              Download Receipt
            </button>
          </div>

          <div className="mt-8">
            <a
              href="#"
              className="text-sm font-medium text-gray-400 hover:text-gray-700 flex items-center gap-1"
            >
              <HelpCircle size={16} />
              Need help with this transaction?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};