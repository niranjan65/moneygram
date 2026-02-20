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

     <section className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6">
  <div className="max-w-6xl mx-auto">

    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">

      {/* LEFT SIDE - FORM */}
      <div className="lg:col-span-2 space-y-6">

        {step === "form" && (
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug">
              Who are you sending{" "}
              <span className="text-green-500 italic">money</span> to?
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
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400"
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
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Sender Bank Name"
                    value={senderBankName}
                    onChange={(e) => setSenderBankName(e.target.value)}
                    className="border rounded-xl px-4 py-3"
                  />
                  <input
                    type="text"
                    placeholder="Sender Account Number"
                    value={senderAccountNumber}
                    onChange={(e) => setSenderAccountNumber(e.target.value)}
                    className="border rounded-xl px-4 py-3"
                  />
                  <input
                    type="text"
                    placeholder="Sender IFSC"
                    value={senderIFSC}
                    onChange={(e) => setSenderIFSC(e.target.value)}
                    className="border rounded-xl px-4 py-3 md:col-span-2"
                  />
                </div>
              )}

              <input
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
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
                onChange={(e) => setReceiverName(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Receiver Email"
                  value={receiverEmail}
                  onChange={(e) => setReceiverEmail(e.target.value)}
                  className="border rounded-xl px-4 py-3"
                />

                <input
                  type="text"
                  placeholder="Receiver Phone"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="border rounded-xl px-4 py-3"
                />
              </div>

              <input
                type="text"
                placeholder="Receiver Country"
                value={receiverCountry}
                onChange={(e) => setReceiverCountry(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Receiver Bank Name"
                  value={receiverBankName}
                  onChange={(e) => setReceiverBankName(e.target.value)}
                  className="border rounded-xl px-4 py-3"
                />
                <input
                  type="text"
                  placeholder="Receiver Account Number"
                  value={receiverAccountNumber}
                  onChange={(e) => setReceiverAccountNumber(e.target.value)}
                  className="border rounded-xl px-4 py-3"
                />
                <input
                  type="text"
                  placeholder="Receiver IFSC"
                  value={receiverIFSC}
                  onChange={(e) => setReceiverIFSC(e.target.value)}
                  className="border rounded-xl px-4 py-3 md:col-span-2"
                />
              </div>
            </div>
            {/* Amount Section */}
<div className="bg-green-50 p-6 rounded-2xl space-y-4">

  <h3 className="font-semibold text-lg">
    Transfer Amount
  </h3>

  <div className="grid md:grid-cols-2 gap-4">

    {/* Send Amount */}
    <div>
      <label className="text-sm text-gray-600">
        You Send
      </label>
      <div className="flex border rounded-xl overflow-hidden">
        <input
          type="number"
          placeholder="0.00"
          value={sendAmount}
          onChange={(e) => setSendAmount(e.target.value)}
          className="flex-1 px-4 py-3 outline-none"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="px-4 bg-white border-l"
        >
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="AUD">AUD</option>
        </select>
      </div>
    </div>

    {/* Receive Amount */}
    <div>
      <label className="text-sm text-gray-600">
        Receiver Gets
      </label>
      <div className="flex border rounded-xl overflow-hidden bg-gray-100">
        <input
          type="number"
          value={receiveAmount}
          readOnly
          className="flex-1 px-4 py-3 bg-gray-100"
        />
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="px-4 bg-white border-l"
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="AUD">AUD</option>
        </select>
      </div>
    </div>

  </div>

  <p className="text-xs text-gray-500">
    Exchange rate applied automatically.
  </p>

   {/* Transfer Button */}
            <button
              onClick={handlePreview}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg transition"
            >
              Preview Transfer
            </button>

</div>

          </div>
        )}
      </div>

      {/* RIGHT SIDE - SUMMARY */}
      <div className="w-full">

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 
                        lg:sticky lg:top-24">

          <h3 className="text-lg sm:text-xl font-semibold">
            Summary
          </h3>

          <div className="space-y-3 text-sm sm:text-base">

            <div className="flex justify-between">
              <span>Send Amount</span>
              <span className="font-semibold">
                ${sendAmount || "0.00"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>${serviceFee}</span>
            </div>

            <div className="flex justify-between">
              <span>GST</span>
              <span>${gstTax}</span>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-lg">
              <span>Total to Pay</span>
              <span>${totalPayable}</span>
            </div>
          </div>

          <div className="bg-green-500 text-white rounded-2xl p-5 sm:p-6 text-center">
            <p className="text-xs tracking-wide uppercase">
              Receiver Gets
            </p>
            <p className="text-2xl sm:text-3xl font-bold">
              {receiveAmount || "0.00"} {toCurrency}
            </p>
          </div>

        </div>

      </div>

    </div>
  </div>
</section>


      <Footer />
    </>
  );
};

export default MoneyTransfer;
