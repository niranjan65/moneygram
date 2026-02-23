import React, { useState } from 'react';
import {
  Check,
  Copy,
  LayoutDashboard,
  FileText,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

const PRIMARY      = '#30e87a';
const PRIMARY_DARK = '#24b35f';

/**
 * TransferSuccess
 *
 * Props:
 *  data — the transferPayload from ReceiverForm / MoneyExchange:
 *    {
 *      sendAmount, senderCurrency,
 *      receiverGets, receiverCurrency,
 *      exchangeRate,
 *      firstName, lastName,
 *      totalDispensed,       // cash pickup only
 *    }
 *  transactionId    — string, e.g. '#TRX-882910' (auto-generated if omitted)
 *  estimatedArrival — string, e.g. 'Today by 5:00 PM'
 *  onDashboard      — () => void
 *  onDownloadReceipt— () => void
 */
export const TransferSuccess = ({
  data = {},
  transactionId,
  estimatedArrival = 'Today by 5:00 PM',
  onDashboard,
  onDownloadReceipt,
}) => {
  const {
    sendAmount       = 0,
    senderCurrency   = 'USD',
    receiverGets     = 0,
    receiverCurrency = 'EUR',
    exchangeRate     = 0,
    firstName        = '',
    lastName         = '',
    totalDispensed,
  } = data;

  // Auto-generate a transaction ID if none provided
  const txId = transactionId ?? `#TRX-${Math.floor(100000 + Math.random() * 900000)}`;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(txId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (val, decimals = 2) =>
    Number(val).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const recipientName = `${firstName} ${lastName}`.trim() || 'the recipient';
  const finalAmount   = totalDispensed ?? receiverGets;

  // Currency symbol helper
  const symMap = { USD:'$', EUR:'€', GBP:'£', INR:'₹', PHP:'₱', MXN:'$', JPY:'¥' };
  const toSym  = symMap[receiverCurrency] ?? '';

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden relative border border-gray-100">

        {/* Decorative top glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 rounded-full pointer-events-none"
          style={{ background: `${PRIMARY}18`, filter: 'blur(60px)' }}
        />

        <div className="relative flex flex-col items-center p-8 sm:p-12 text-center">

          {/* Success Icon */}
          <div className="mb-8 relative">
            <div
              className="absolute inset-0 rounded-full blur-xl scale-75"
              style={{ background: `${PRIMARY}33` }}
            />
            <div
              className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: PRIMARY,
                boxShadow: `0 8px 32px ${PRIMARY}55`,
                animation: 'successBounce 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
              }}
            >
              <Check size={40} strokeWidth={3.5} className="text-white" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Transfer Successful
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-md">
            Your money is securely on its way to{' '}
            <span className="font-bold text-gray-900">{recipientName}</span>.
          </p>

          {/* Transaction ID chip */}
          <button
            onClick={handleCopy}
            className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full border transition-all group"
            style={{
              background: '#f6f8f7',
              borderColor: copied ? PRIMARY : '#e5e7eb',
            }}
            title="Click to copy"
          >
            <span className="text-sm font-semibold text-gray-500">Transaction ID:</span>
            <span className="text-sm font-bold text-gray-900 font-mono tracking-wide">{txId}</span>
            {copied
              ? <Check size={16} strokeWidth={3} style={{ color: PRIMARY }} />
              : <Copy size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            }
          </button>

          {/* Details Card */}
          <div className="mt-10 w-full bg-gray-50 rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">

            {/* Amount Sent */}
            <div className="flex justify-between items-center p-5">
              <span className="text-gray-500 font-medium">Amount Sent</span>
              <span className="text-gray-900 font-bold text-lg">
                {fmt(sendAmount)} {senderCurrency}
              </span>
            </div>

            {/* Exchange Rate */}
            <div className="flex justify-between items-center p-5">
              <div className="flex flex-col items-start">
                <span className="text-gray-500 font-medium">Exchange Rate</span>
                <span className="text-xs text-gray-400">Includes fees</span>
              </div>
              <span className="text-gray-900 font-semibold flex items-center gap-1.5">
                <TrendingUp size={14} style={{ color: PRIMARY }} />
                1 {senderCurrency} = {exchangeRate > 0 ? exchangeRate.toFixed(4) : '–'} {receiverCurrency}
              </span>
            </div>

            {/* Total to Receiver — highlighted */}
            <div
              className="flex justify-between items-center p-6"
              style={{ background: `${PRIMARY}0d` }}
            >
              <span className="font-bold" style={{ color: PRIMARY_DARK }}>
                Total to Receiver
              </span>
              <span className="text-2xl font-extrabold" style={{ color: PRIMARY_DARK }}>
                {toSym}{fmt(finalAmount)} {receiverCurrency}
              </span>
            </div>
          </div>

          {/* Arrival estimate */}
          <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
              style={{ background: `${PRIMARY}22`, color: PRIMARY_DARK }}
            >
              {firstName?.[0]?.toUpperCase() ?? '?'}
            </div>
            <p>
              Estimated arrival:{' '}
              <span className="font-semibold text-gray-900">{estimatedArrival}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={onDashboard}
              className="flex-1 max-w-xs h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-base transition-all active:scale-95 hover:opacity-90"
              style={{
                background: PRIMARY,
                color: '#111',
                boxShadow: `0 8px 24px ${PRIMARY}44`,
              }}
            >
              <LayoutDashboard size={18} strokeWidth={2.5} />
              Go to Dashboard
            </button>
            <button
              onClick={onDownloadReceipt}
              className="flex-1 max-w-xs h-12 flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 text-gray-900 font-bold text-base transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-95 bg-white"
            >
              <FileText size={18} strokeWidth={2.5} />
              Download Receipt
            </button>
          </div>

          {/* Support link */}
          <div className="mt-8">
            <a
              href="#"
              className="text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1 group"
            >
              <HelpCircle size={16} className="group-hover:scale-110 transition-transform" />
              Need help with this transaction?
            </a>
          </div>
        </div>
      </div>

      {/* Bounce keyframe */}
      <style>{`
        @keyframes successBounce {
          0%   { transform: scale(0.3); opacity: 0; }
          50%  { transform: scale(1.1); opacity: 1; }
          70%  { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};