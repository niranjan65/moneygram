import React from "react";
import CurrencyDropdown from "../home/CurrencyDropdown";

export default function TransferDetails({ formData, updateField }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold mb-4">Transfer Details</h2>

      <div className="space-y-4">

        {/* Transfer Type */}
        <select
          value={formData.transferType}
          onChange={(e) => updateField("transferType", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="bank_to_bank">Bank to Bank</option>
          <option value="cash_to_bank">Cash to Bank</option>
        </select>

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) => updateField("amount", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />

        {/* Sending Currency */}
        <div>
          <p className="text-sm font-medium mb-2">Sending Currency</p>
          <CurrencyDropdown
            selected={formData.sendCurrency}
            onSelect={(currency) => updateField("sendCurrency", currency)}
          />
        </div>

        {/* Receiving Currency */}
        <div>
          <p className="text-sm font-medium mb-2">Receiving Currency</p>
          <CurrencyDropdown
            selected={formData.receiveCurrency}
            onSelect={(currency) => updateField("receiveCurrency", currency)}
          />
        </div>

      </div>
    </div>
  );
}
