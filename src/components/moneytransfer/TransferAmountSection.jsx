import React from "react";
import CurrencyDropdown from "../home/CurrencyDropdown";

const TransferAmountSection = ({
  sendAmount,
  setSendAmount,
  fromCurrency,
  setFromCurrency,
  toCurrency,
  setToCurrency,
  receiveAmount,
  onConfirm
}) => {
  return (
    <div className="bg-green-50 p-6 rounded-2xl space-y-6">
      
      <h3 className="font-semibold text-lg">
        Transfer Amount
      </h3>

      <div className="grid md:grid-cols-2 gap-6 items-end">

        {/* Send Amount */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            You Send
          </label>

          <input
            type="number"
            min="0"
            placeholder="0.00"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />

          {/* Same CurrencyDropdown used in Hero */}
          <CurrencyDropdown
            selected={fromCurrency}
            onSelect={setFromCurrency}
          />
        </div>

        {/* Receive Amount */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Receiver Gets
          </label>

          <input
            type="text"
            value={receiveAmount}
            readOnly
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg bg-gray-100 text-gray-700"
          />

          <CurrencyDropdown
            selected={toCurrency}
            onSelect={setToCurrency}
          />
        </div>

      </div>

      <p className="text-xs text-gray-500">
        Exchange rate applied automatically.
      </p>

      <button
        onClick={onConfirm}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg transition"
      >
        Confirm and Proceed
      </button>
    </div>
  );
};

export default TransferAmountSection;
