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
  const [customerName, setCustomerName] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const [receiverName, setReceiverName] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverCountry, setReceiverCountry] = useState("");

  const [step, setStep] = useState("form");
  const [previewData, setPreviewData] = useState(null);

  const API_KEY = "fc679603c7a8127080fa39ca";
  const ERPNEXT_API_URL =
    "http://182.71.135.110:8998/api/resource/Money Transfer";
  const AUTH_TOKEN = "aaf9b3999d2b28a:271e2a2685380db";

  const currencies = [
    { code: "USD", flag: "🇺🇸" },
    { code: "EUR", flag: "🇪🇺" },
    { code: "GBP", flag: "🇬🇧" },
    { code: "JPY", flag: "🇯🇵" },
    { code: "AUD", flag: "🇦🇺" },
    { code: "CAD", flag: "🇨🇦" },
    { code: "CHF", flag: "🇨🇭" },
    { code: "CNY", flag: "🇨🇳" },
    { code: "INR", flag: "🇮🇳" },
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
      setExchangeRates({
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110,
        AUD: 1.35,
        CAD: 1.25,
        CHF: 0.92,
        CNY: 6.45,
        INR: 74.5,
      });
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
    if (!customerName.trim()) return alert("Enter customer name");
    if (!receiverName.trim()) return alert("Enter receiver name");
    if (!sendAmount) return alert("Enter amount");

    setPreviewData({
      customer_name: customerName,
      receiver_name: receiverName,
      receiver_email: receiverEmail,
      receiver_phone: receiverPhone,
      receiver_country: receiverCountry,
      date: transferDate,
      local_currency: parseFloat(sendAmount),
      foreign_currency: parseFloat(receiveAmount),
      from_currency: fromCurrency,
      to_currency: toCurrency,
      service_fee: parseFloat(serviceFee),
      gst_tax: parseFloat(gstTax),
      total_payable: parseFloat(totalPayable),
    });

    setStep("preview");
  };

  const submitToERPNext = async () => {
    if (!previewData) return;

    setIsLoading(true);
    setResponseMessage("");

    try {
      const response = await axios.post(
        ERPNEXT_API_URL,
        {
          customer_name: previewData.customer_name,
          receiver_name: previewData.receiver_name,
          receiver_email: previewData.receiver_email,
          receiver_phone: previewData.receiver_phone,
          receiver_country: previewData.receiver_country,
          date: previewData.date,
          local_currency: previewData.local_currency,
          foreign_currency: previewData.foreign_currency,
          serviceplateform_charge: previewData.service_fee,
          tax_chargegst: previewData.gst_tax,
          total_payable: previewData.total_payable,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${AUTH_TOKEN}`,
          },
        }
      );

      if (response.status === 200) {
        setResponseMessage(
          `✅ Transfer created successfully! ID: ${
            response.data?.data?.name || "N/A"
          }`
        );
        resetForm();
        setStep("form");
      }
    } catch (error) {
      setResponseMessage(
        `❌ ${error instanceof Error ? error.message : "Network error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSendAmount("");
    setReceiveAmount("");
    setCustomerName("");
    setReceiverName("");
    setReceiverEmail("");
    setReceiverPhone("");
    setReceiverCountry("");
    setTransferDate(getTodayDate());
    setFromCurrency("USD");
    setToCurrency("EUR");
    setPreviewData(null);
  };

  const currentRate = exchangeRates[toCurrency] || 0;

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-[var(--color-background-light)] py-16 px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-10 space-y-8">

          {responseMessage && (
            <div className="p-4 rounded-xl bg-gray-100 text-sm">
              {responseMessage}
            </div>
          )}

          {step === "form" && (
            <>
              <h1 className="text-3xl font-bold">
                Send Money
              </h1>

              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />

              {/* Receiver */}
              <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                <h3 className="font-semibold">
                  Receiver Details
                </h3>

                <input
                  type="text"
                  placeholder="Receiver Name"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3"
                />

                <input
                  type="email"
                  placeholder="Receiver Email"
                  value={receiverEmail}
                  onChange={(e) => setReceiverEmail(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3"
                />

                <input
                  type="text"
                  placeholder="Receiver Phone"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3"
                />

                <input
                  type="text"
                  placeholder="Receiver Country"
                  value={receiverCountry}
                  onChange={(e) => setReceiverCountry(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              {/* Send */}
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
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-600">
                1 {fromCurrency} ={" "}
                {currentRate.toFixed(4)} {toCurrency}
              </div>

              {/* Receive */}
              <div className="flex border rounded-xl overflow-hidden">
                <input
                  type="text"
                  value={receiveAmount}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50"
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
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fees */}
              <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Service Fee (2%)</span>
                  <span>
                    {serviceFee} {fromCurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (15%)</span>
                  <span>
                    {gstTax} {fromCurrency}
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total Payable</span>
                  <span>
                    {totalPayable} {fromCurrency}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePreview}
                className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl"
              >
                Preview Transfer
              </button>
            </>
          )}

          {step === "preview" && previewData && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                Confirm Transfer Details
              </h2>

              <div className="bg-gray-50 p-6 rounded-2xl space-y-2 text-sm">
                <p><strong>Customer:</strong> {previewData.customer_name}</p>
                <p><strong>Date:</strong> {previewData.date}</p>
                <p><strong>Receiver:</strong> {previewData.receiver_name}</p>
                <p><strong>Email:</strong> {previewData.receiver_email}</p>
                <p><strong>Phone:</strong> {previewData.receiver_phone}</p>
                <p><strong>Country:</strong> {previewData.receiver_country}</p>
                <p><strong>You Send:</strong> {previewData.local_currency} {previewData.from_currency}</p>
                <p><strong>Receiver Gets:</strong> {previewData.foreign_currency} {previewData.to_currency}</p>
                <p><strong>Total Payable:</strong> {previewData.total_payable} {previewData.from_currency}</p>
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
                  className="flex-1 bg-[var(--color-primary)] text-white py-3 rounded-xl"
                >
                  {isLoading ? "Processing..." : "Confirm & Send"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default MoneyTransfer;
