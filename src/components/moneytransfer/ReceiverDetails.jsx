import React from "react";

export default function ReceiverDetails({ formData, updateField }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold mb-4">Receiver Details</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Receiver Name"
          value={formData.receiverName}
          onChange={(e) => updateField("receiverName", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="email"
          placeholder="Receiver Email"
          value={formData.receiverEmail}
          onChange={(e) => updateField("receiverEmail", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />

        {/* Receiver Bank Required */}
        <input
          type="text"
          placeholder="Receiver Bank Name"
          value={formData.receiverBank}
          onChange={(e) => updateField("receiverBank", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>
    </div>
  );
}
