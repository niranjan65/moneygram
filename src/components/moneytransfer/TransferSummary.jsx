import React from "react";

export default function TransferSummary({ formData }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
      <h2 className="text-lg font-bold mb-6">Transfer Summary</h2>

      <div className="space-y-4 text-sm">

        <div>
          <p className="font-semibold">Transfer Type</p>
          <p className="capitalize">
            {formData.transferType.replaceAll("_", " ")}
          </p>
        </div>

        <div>
          <p className="font-semibold">Sender</p>
          <p>{formData.senderName || "-"}</p>
          <p>{formData.senderBank || "-"}</p>
        </div>

        <div>
          <p className="font-semibold">Receiver</p>
          <p>{formData.receiverName || "-"}</p>
          <p>{formData.receiverBank || "-"}</p>
        </div>

        <div className="border-t pt-4">
          <p className="font-semibold">Amount Sent</p>
          <p className="font-bold">
            {formData.amount} {formData.sendCurrency?.code || ""}
          </p>
        </div>

        <div>
          <p className="font-semibold">Receiver Gets In</p>
          <p className="font-bold">
            {formData.receiveCurrency?.code || "-"}
          </p>
        </div>

      </div>
    </div>
  );
}
