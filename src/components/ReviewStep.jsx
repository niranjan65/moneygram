
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
                {fmt(total)} {senderCurrency}
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

            {/* <div className="space-y-3">
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
            </div> */}
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