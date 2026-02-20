//MoneyTransfer.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MoneyTransfer = () => {
  const [sendAmount, setSendAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [exchangeRates, setExchangeRates] = useState({});

  // Sender
  const [customerName, setCustomerName] = useState("");
  const [payMode, setPayMode] = useState("Cash to Bank");
  const [transferDate, setTransferDate] = useState("");

  // Receiver
  const [receiverName, setReceiverName] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverCountry, setReceiverCountry] = useState("");

  const [step, setStep] = useState("form");
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  // Sender Bank Details
const [senderBankName, setSenderBankName] = useState("");
const [senderAccountNumber, setSenderAccountNumber] = useState("");
const [senderIFSC, setSenderIFSC] = useState("");

// Receiver Bank Details
const [receiverBankName, setReceiverBankName] = useState("");
const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
const [receiverIFSC, setReceiverIFSC] = useState("");


  const API_KEY = "YOUR_API_KEY";
  const ERPNEXT_API_URL =
    "http://182.71.135.110:8998/api/resource/Money Transfer";
  const AUTH_TOKEN = "YOUR_AUTH_TOKEN";

  const currencies = [
    { code: "USD" },
    { code: "EUR" },
    { code: "GBP" },
    { code: "INR" },
  ];

  const getTodayDate = () =>
    new Date().toISOString().split("T")[0];

  useEffect(() => {
    setTransferDate(getTodayDate());
  }, []);

  const getExchangeRates = async (baseCurrency) => {
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`
      );
      const data = await response.json();
      if (data.result === "success") {
        setExchangeRates(data.conversion_rates);
      }
    } catch {
      setExchangeRates({ USD: 1, EUR: 0.85, GBP: 0.73, INR: 74 });
    }
  };

  useEffect(() => {
    getExchangeRates(fromCurrency);
  }, [fromCurrency]);

  useEffect(() => {
    if (sendAmount && exchangeRates[toCurrency]) {
      const rate = exchangeRates[toCurrency];
      setReceiveAmount(
        (parseFloat(sendAmount) * rate).toFixed(2)
      );
    } else {
      setReceiveAmount("");
    }
  }, [sendAmount, toCurrency, exchangeRates]);

  const handleSendAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setSendAmount(value);
  };

  const serviceFee = sendAmount
    ? (parseFloat(sendAmount) * 0.02).toFixed(2)
    : "0";

  const gstTax = sendAmount
    ? (parseFloat(sendAmount) * 0.15).toFixed(2)
    : "0";

  const totalPayable = sendAmount
    ? (
        parseFloat(sendAmount) +
        parseFloat(serviceFee) +
        parseFloat(gstTax)
      ).toFixed(2)
    : "0";

  const handlePreview = () => {
  if (!customerName) return alert("Enter sender name");
  if (!receiverName) return alert("Enter receiver name");
  if (!sendAmount) return alert("Enter amount");

  // Bank to Bank validation
  if (payMode === "Bank to Bank") {
    if (!senderBankName || !senderAccountNumber || !senderIFSC)
      return alert("Enter all sender bank details");
  }

  // Receiver bank details required always
  if (!receiverBankName || !receiverAccountNumber || !receiverIFSC)
    return alert("Enter all receiver bank details");

  setPreviewData({
    customerName,
    payMode,
    senderBankName,
    senderAccountNumber,
    senderIFSC,
    receiverName,
    receiverEmail,
    receiverPhone,
    receiverCountry,
    receiverBankName,
    receiverAccountNumber,
    receiverIFSC,
    transferDate,
    sendAmount,
    receiveAmount,
    totalPayable,
  });

  setStep("preview");
};


  const submitToERPNext = async () => {
    if (!previewData) return;
    setIsLoading(true);

    try {
      await axios.post(
        ERPNEXT_API_URL,
        {
          customer_name: previewData.customerName,
          pay_mode: previewData.payMode,
          receiver_name: previewData.receiverName,
          receiver_email: previewData.receiverEmail,
          receiver_phone: previewData.receiverPhone,
          receiver_country: previewData.receiverCountry,
          date: previewData.transferDate,
          local_currency: previewData.sendAmount,
          foreign_currency: previewData.receiveAmount,
          total_payable: previewData.totalPayable,
        },
        {
          headers: {
            Authorization: `token ${AUTH_TOKEN}`,
          },
        }
      );

      setResponseMessage("✅ Transfer Successful!");
      setStep("form");
    } catch {
      setResponseMessage("❌ Failed to submit transfer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="min-h-screen py-8 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-lg space-y-8">

          {responseMessage && (
            <div className="p-4 bg-gray-100 rounded-xl">
              {responseMessage}
            </div>
          )}

          {step === "form" && (
            <>
              <h1 className="text-3xl font-bold">
                Money Transfer
              </h1>

              {/* Sender Details */}
              <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                <h3 className="font-semibold text-lg">
                  Sender Details
                </h3>

                <input
                  type="text"
                  placeholder="Sender Name"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(e.target.value)
                  }
                  className="w-full border rounded-xl px-4 py-3"
                />

                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3"
                >
                  <option>Cash to Bank</option>
                  <option>Bank to Bank</option>
                </select>

                {payMode === "Bank to Bank" && (
  <div className="space-y-3">
    <input
      type="text"
      placeholder="Sender Bank Name"
      value={senderBankName}
      onChange={(e) => setSenderBankName(e.target.value)}
      className="w-full border rounded-xl px-4 py-3"
    />

    <input
      type="text"
      placeholder="Sender Account Number"
      value={senderAccountNumber}
      onChange={(e) => setSenderAccountNumber(e.target.value)}
      className="w-full border rounded-xl px-4 py-3"
    />

    <input
      type="text"
      placeholder="Sender IFSC Code"
      value={senderIFSC}
      onChange={(e) => setSenderIFSC(e.target.value)}
      className="w-full border rounded-xl px-4 py-3"
    />
  </div>
)}


                <input
                  type="date"
                  value={transferDate}
                  onChange={(e) =>
                    setTransferDate(e.target.value)
                  }
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              {/* Receiver Details */}
              <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                <h3 className="font-semibold text-lg">
                  Receiver Details
                </h3>

                <input
                  type="text"
                  placeholder="Receiver Name"
                  value={receiverName}
                  onChange={(e) =>
                    setReceiverName(e.target.value)
                  }
                  className="w-full border rounded-xl px-4 py-3"
                />

                <input
                  type="email"
                  placeholder="Receiver Email"
                  value={receiverEmail}
                  onChange={(e) =>
                    setReceiverEmail(e.target.value)
                  }
                  className="w-full border rounded-xl px-4 py-3"
                />

                <input
                  type="text"
                  placeholder="Receiver Phone"
                  value={receiverPhone}
                  onChange={(e) =>
                    setReceiverPhone(e.target.value)
                  }
                  className="w-full border rounded-xl px-4 py-3"
                />

                <input
                  type="text"
                  placeholder="Receiver Country"
                  value={receiverCountry}
                  onChange={(e) =>
                    setReceiverCountry(e.target.value)
                  }
                  className="w-full border rounded-xl px-4 py-3"
                />

                <div className="space-y-3">
  <input
    type="text"
    placeholder="Receiver Bank Name"
    value={receiverBankName}
    onChange={(e) => setReceiverBankName(e.target.value)}
    className="w-full border rounded-xl px-4 py-3"
  />

  <input
    type="text"
    placeholder="Receiver Account Number"
    value={receiverAccountNumber}
    onChange={(e) => setReceiverAccountNumber(e.target.value)}
    className="w-full border rounded-xl px-4 py-3"
  />

  <input
    type="text"
    placeholder="Receiver IFSC Code"
    value={receiverIFSC}
    onChange={(e) => setReceiverIFSC(e.target.value)}
    className="w-full border rounded-xl px-4 py-3"
  />
</div>

              </div>

              {/* Transfer Details */}
              <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                <h3 className="font-semibold text-lg">
                  Transfer Details
                </h3>

                <div className="flex border rounded-xl overflow-hidden">
                  <input
                    type="text"
                    value={sendAmount}
                    onChange={handleSendAmountChange}
                    className="flex-1 px-4 py-3"
                    placeholder="You Send"
                  />
                  <select
                    value={fromCurrency}
                    onChange={(e) =>
                      setFromCurrency(e.target.value)
                    }
                    className="px-4 border-l"
                  >
                    {currencies.map((c) => (
                      <option key={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex border rounded-xl overflow-hidden">
                  <input
                    type="text"
                    value={receiveAmount}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-100"
                    placeholder="Receiver Gets"
                  />
                  <select
                    value={toCurrency}
                    onChange={(e) =>
                      setToCurrency(e.target.value)
                    }
                    className="px-4 border-l"
                  >
                    {currencies.map((c) => (
                      <option key={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Service Fee (2%)</span>
                    <span>{serviceFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (15%)</span>
                    <span>{gstTax}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total Payable</span>
                    <span>{totalPayable}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePreview}
                className="w-full bg-blue-600 text-white py-3 rounded-xl"
              >
                Preview All Details
              </button>
            </>
          )}

          {step === "preview" && previewData && (
            <>
            <p><strong>Pay Mode:</strong> {previewData.payMode}</p>

{previewData.payMode === "Bank to Bank" && (
  <>
    <p><strong>Sender Bank:</strong> {previewData.senderBankName}</p>
    <p><strong>Sender Account:</strong> {previewData.senderAccountNumber}</p>
    <p><strong>Sender IFSC:</strong> {previewData.senderIFSC}</p>
  </>
)}

<p><strong>Receiver Bank:</strong> {previewData.receiverBankName}</p>
<p><strong>Receiver Account:</strong> {previewData.receiverAccountNumber}</p>
<p><strong>Receiver IFSC:</strong> {previewData.receiverIFSC}</p>

              <h2 className="text-2xl font-bold">
                Confirm & Proceed
              </h2>

              <div className="bg-gray-50 p-6 rounded-2xl space-y-2 text-sm">
                {Object.entries(previewData).map(
                  ([key, value]) => (
                    <p key={key}>
                      <strong>{key}:</strong> {value}
                    </p>
                  )
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep("form")}
                  className="flex-1 border py-3 rounded-xl"
                >
                  Edit
                </button>

                <button
                  onClick={submitToERPNext}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl"
                >
                  {isLoading
                    ? "Processing..."
                    : "Confirm and Proceed"}
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default MoneyTransfer;
