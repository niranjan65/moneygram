import React from "react";

export default function SenderDetails({ formData, updateField }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold mb-4">Sender Details</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Sender Name"
          value={formData.senderName}
          onChange={(e) => updateField("senderName", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="email"
          placeholder="Sender Email"
          value={formData.senderEmail}
          onChange={(e) => updateField("senderEmail", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />

        {/* Show bank only if sender sends from bank */}
        {formData.transferType === "bank_to_bank" && (
          <input
            type="text"
            placeholder="Sender Bank Name"
            value={formData.senderBank}
            onChange={(e) => updateField("senderBank", e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        )}
      </div>
    </div>
  );
}
