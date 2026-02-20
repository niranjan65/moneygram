// //MoneyTransfer.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../components/layout/Navbar";
// import Footer from "../components/layout/Footer";
// import Select from "react-select";
// import { getNames } from "country-list";

// const MoneyTransfer = () => {
//   const [sendAmount, setSendAmount] = useState("");
//   const [fromCurrency, setFromCurrency] = useState("USD");
//   const [toCurrency, setToCurrency] = useState("EUR");
//   const [receiveAmount, setReceiveAmount] = useState("");
//   const [exchangeRates, setExchangeRates] = useState({});

//   // Sender
//   const [customerName, setCustomerName] = useState("");
//   const [payMode, setPayMode] = useState("Cash to Bank");
//   const [transferDate, setTransferDate] = useState("");

//   // Receiver
//   const [receiverName, setReceiverName] = useState("");
//   const [receiverEmail, setReceiverEmail] = useState("");
//   const [receiverPhone, setReceiverPhone] = useState("");
//   const [receiverCountry, setReceiverCountry] = useState("");

//   const countryOptions = getNames().map(country => ({
//   label: country,
//   value: country
// }));

//   const [step, setStep] = useState("form");
//   const [previewData, setPreviewData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [responseMessage, setResponseMessage] = useState("");

//   // Sender Bank Details
// const [senderBankName, setSenderBankName] = useState("");
// const [senderAccountNumber, setSenderAccountNumber] = useState("");
// const [senderIFSC, setSenderIFSC] = useState("");

// // Receiver Bank Details
// const [receiverBankName, setReceiverBankName] = useState("");
// const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
// const [receiverIFSC, setReceiverIFSC] = useState("");


//   const API_KEY = "YOUR_API_KEY";
//   const ERPNEXT_API_URL =
//     "http://182.71.135.110:8998/api/resource/Money Transfer";
//   const AUTH_TOKEN = "YOUR_AUTH_TOKEN";

//   const currencies = [
//     { code: "USD" },
//     { code: "EUR" },
//     { code: "GBP" },
//     { code: "INR" },
//   ];

//   const getTodayDate = () =>
//     new Date().toISOString().split("T")[0];

//   useEffect(() => {
//     setTransferDate(getTodayDate());
//   }, []);

//   const getExchangeRates = async (baseCurrency) => {
//     try {
//       const response = await fetch(
//         `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`
//       );
//       const data = await response.json();
//       if (data.result === "success") {
//         setExchangeRates(data.conversion_rates);
//       }
//     } catch {
//       setExchangeRates({ USD: 1, EUR: 0.85, GBP: 0.73, INR: 74 });
//     }
//   };

//   useEffect(() => {
//     getExchangeRates(fromCurrency);
//   }, [fromCurrency]);

//   useEffect(() => {
//     if (sendAmount && exchangeRates[toCurrency]) {
//       const rate = exchangeRates[toCurrency];
//       setReceiveAmount(
//         (parseFloat(sendAmount) * rate).toFixed(2)
//       );
//     } else {
//       setReceiveAmount("");
//     }
//   }, [sendAmount, toCurrency, exchangeRates]);

//   const handleSendAmountChange = (e) => {
//     const value = e.target.value.replace(/[^0-9.]/g, "");
//     setSendAmount(value);
//   };

//   const serviceFee = sendAmount
//     ? (parseFloat(sendAmount) * 0.02).toFixed(2)
//     : "0";

//   const gstTax = sendAmount
//     ? (parseFloat(sendAmount) * 0.15).toFixed(2)
//     : "0";

//   const totalPayable = sendAmount
//     ? (
//         parseFloat(sendAmount) +
//         parseFloat(serviceFee) +
//         parseFloat(gstTax)
//       ).toFixed(2)
//     : "0";

//   const handlePreview = () => {
//   if (!customerName) return alert("Enter sender name");
//   if (!receiverName) return alert("Enter receiver name");
//   if (!sendAmount) return alert("Enter amount");

//   // Bank to Bank validation
//   if (payMode === "Bank to Bank") {
//     if (!senderBankName || !senderAccountNumber || !senderIFSC)
//       return alert("Enter all sender bank details");
//   }

//   // Receiver bank details required always
//   if (!receiverBankName || !receiverAccountNumber || !receiverIFSC)
//     return alert("Enter all receiver bank details");

//   setPreviewData({
//     customerName,
//     payMode,
//     senderBankName,
//     senderAccountNumber,
//     senderIFSC,
//     receiverName,
//     receiverEmail,
//     receiverPhone,
//     receiverCountry,
//     receiverBankName,
//     receiverAccountNumber,
//     receiverIFSC,
//     transferDate,
//     sendAmount,
//     receiveAmount,
//     totalPayable,
//   });

//   setStep("preview");
// };


//   const submitToERPNext = async () => {
//     if (!previewData) return;
//     setIsLoading(true);

//     try {
//       await axios.post(
//         ERPNEXT_API_URL,
//         {
//           customer_name: previewData.customerName,
//           pay_mode: previewData.payMode,
//           receiver_name: previewData.receiverName,
//           receiver_email: previewData.receiverEmail,
//           receiver_phone: previewData.receiverPhone,
//           receiver_country: previewData.receiverCountry,
//           date: previewData.transferDate,
//           local_currency: previewData.sendAmount,
//           foreign_currency: previewData.receiveAmount,
//           total_payable: previewData.totalPayable,
//         },
//         {
//           headers: {
//             Authorization: `token ${AUTH_TOKEN}`,
//           },
//         }
//       );

//       setResponseMessage("✅ Transfer Successful!");
//       setStep("form");
//     } catch {
//       setResponseMessage("❌ Failed to submit transfer");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />

//      <section className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6">
//   <div className="max-w-6xl mx-auto">

//     <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">

//       {/* LEFT SIDE - FORM */}
//       <div className="lg:col-span-2 space-y-6">

//         {step === "form" && (
//           <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">

//             <div className="flex flex-col gap-3">
//   <h1 className="text-gray-900 dark:text-white text-3xl sm:text-5xl font-black tracking-tight leading-none">
//     Send <span className="text-green-500 italic">money</span> safely and instantly
//   </h1>
//   <p className="text-green-500 font-black text-sm uppercase tracking-widest opacity-80">
//     Step 1: Sender & Receiver Details
//   </p>
// </div>


        

//             {/* Sender Details */}
//             <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
//               <h3 className="font-semibold text-lg">
//                 Sender Details
//               </h3>

//               <input
//                 type="text"
//                 placeholder="Sender Name"
//                 value={customerName}
//                 onChange={(e) => setCustomerName(e.target.value)}
//                 className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400"
//               />

//               <select
//                 value={payMode}
//                 onChange={(e) => setPayMode(e.target.value)}
//                 className="w-full border rounded-xl px-4 py-3"
//               >
//                 <option>Cash to Bank</option>
//                 <option>Bank to Bank</option>
//               </select>

//               {payMode === "Bank to Bank" && (
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     placeholder="Sender Bank Name"
//                     value={senderBankName}
//                     onChange={(e) => setSenderBankName(e.target.value)}
//                     className="border rounded-xl px-4 py-3"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Sender Account Number"
//                     value={senderAccountNumber}
//                     onChange={(e) => setSenderAccountNumber(e.target.value)}
//                     className="border rounded-xl px-4 py-3"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Sender IFSC"
//                     value={senderIFSC}
//                     onChange={(e) => setSenderIFSC(e.target.value)}
//                     className="border rounded-xl px-4 py-3 md:col-span-2"
//                   />
//                 </div>
//               )}

//               <input
//                 type="date"
//                 value={transferDate}
//                 onChange={(e) => setTransferDate(e.target.value)}
//                 className="w-full border rounded-xl px-4 py-3"
//               />
//             </div>

//             {/* Receiver Details */}
//             <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
//               <h3 className="font-semibold text-lg">
//                 Receiver Details
//               </h3>

//               <input
//                 type="text"
//                 placeholder="Receiver Name"
//                 value={receiverName}
//                 onChange={(e) => setReceiverName(e.target.value)}
//                 className="w-full border rounded-xl px-4 py-3"
//               />

//               <div className="grid md:grid-cols-2 gap-4">
//                 <input
//                   type="email"
//                   placeholder="Receiver Email"
//                   value={receiverEmail}
//                   onChange={(e) => setReceiverEmail(e.target.value)}
//                   className="border rounded-xl px-4 py-3"
//                 />

//                 <input
//                   type="text"
//                   placeholder="Receiver Phone"
//                   value={receiverPhone}
//                   onChange={(e) => setReceiverPhone(e.target.value)}
//                   className="border rounded-xl px-4 py-3"
//                 />
//               </div>

             
//               <Select
//   options={countryOptions}
//   value={countryOptions.find(c => c.value === receiverCountry)}
//   onChange={(selected) => setReceiverCountry(selected.value)}
//   placeholder="Select Receiver Country"
// />

//               <div className="grid md:grid-cols-2 gap-4">
//                 <input
//                   type="text"
//                   placeholder="Receiver Bank Name"
//                   value={receiverBankName}
//                   onChange={(e) => setReceiverBankName(e.target.value)}
//                   className="border rounded-xl px-4 py-3"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Receiver Account Number"
//                   value={receiverAccountNumber}
//                   onChange={(e) => setReceiverAccountNumber(e.target.value)}
//                   className="border rounded-xl px-4 py-3"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Receiver IFSC"
//                   value={receiverIFSC}
//                   onChange={(e) => setReceiverIFSC(e.target.value)}
//                   className="border rounded-xl px-4 py-3 md:col-span-2"
//                 />
//               </div>
//             </div>
//             {/* Amount Section */}
// <div className="bg-green-50 p-6 rounded-2xl space-y-4">

//   <h3 className="font-semibold text-lg">
//     Transfer Amount
//   </h3>

//   <div className="grid md:grid-cols-2 gap-4">

//     {/* Send Amount */}
//     <div>
//       <label className="text-sm text-gray-600">
//         You Send
//       </label>
//       <div className="flex border rounded-xl overflow-hidden">
//         <input
//           type="number"
//           placeholder="0.00"
//           value={sendAmount}
//           onChange={(e) => setSendAmount(e.target.value)}
//           className="flex-1 px-4 py-3 outline-none"
//         />
//         <select
//           value={fromCurrency}
//           onChange={(e) => setFromCurrency(e.target.value)}
//           className="px-4 bg-white border-l"
//         >
//           <option value="USD">USD</option>
//           <option value="INR">INR</option>
//           <option value="AUD">AUD</option>
//         </select>
//       </div>
//     </div>

//     {/* Receive Amount */}
//     <div>
//       <label className="text-sm text-gray-600">
//         Receiver Gets
//       </label>
//       <div className="flex border rounded-xl overflow-hidden bg-gray-100">
//         <input
//           type="number"
//           value={receiveAmount}
//           readOnly
//           className="flex-1 px-4 py-3 bg-gray-100"
//         />
//         <select
//           value={toCurrency}
//           onChange={(e) => setToCurrency(e.target.value)}
//           className="px-4 bg-white border-l"
//         >
//           <option value="INR">INR</option>
//           <option value="USD">USD</option>
//           <option value="AUD">AUD</option>
//         </select>
//       </div>
//     </div>

//   </div>

//   <p className="text-xs text-gray-500">
//     Exchange rate applied automatically.
//   </p>

//    {/* Transfer Button */}
//             <button
//               onClick={handlePreview}
//               className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg transition"
//             >
//               Preview Transfer
//             </button>

// </div>

//           </div>
//         )}
//       </div>

//       {/* RIGHT SIDE - SUMMARY */}
//       <div className="w-full">

//         <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 
//                         lg:sticky lg:top-24">

//           <h3 className="text-lg sm:text-xl font-semibold">
//             Summary
//           </h3>

//           <div className="space-y-3 text-sm sm:text-base">

//             <div className="flex justify-between">
//               <span>Send Amount</span>
//               <span className="font-semibold">
//   {sendAmount || "0.00"} {fromCurrency}
// </span>

//             </div>

//             <div className="flex justify-between">
//               <span>Service Fee</span>
//               <span>{serviceFee} {fromCurrency}</span>

//             </div>

//             <div className="flex justify-between">
//               <span>GST</span>
//               <span>{gstTax} {fromCurrency}</span>

//             </div>

//             <hr />

//             <div className="flex justify-between font-bold text-lg">
//               <span>Total to Pay</span>
//               <span>{totalPayable} {fromCurrency}</span>

//             </div>
//           </div>

//           <div className="bg-green-500 text-white rounded-2xl p-5 sm:p-6 text-center">
//             <p className="text-xs tracking-wide uppercase">
//               Receiver Gets
//             </p>
//             <p className="text-2xl sm:text-3xl font-bold">
//               {receiveAmount || "0.00"} {toCurrency}
//             </p>
//           </div>

//         </div>

//       </div>

//     </div>
//   </div>
// </section>


//       <Footer />
//     </>
//   );
// };

// export default MoneyTransfer;
// pages/MoneyTransfer.jsx
// pages/MoneyTransfer.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Select from "react-select";
import { getNames } from "country-list";

const MoneyTransfer = () => {
  const Step = {
    DETAILS: 1,
    AMOUNT: 2,
    PREVIEW: 3
  };

  const [currentStep, setCurrentStep] = useState(Step.DETAILS);

  // Sender & Receiver
  const [customerName, setCustomerName] = useState("");
  const [payMode, setPayMode] = useState("Cash to Bank");
  const [transferDate, setTransferDate] = useState("");

  const [receiverName, setReceiverName] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverCountry, setReceiverCountry] = useState("");

  // Bank Details
  const [senderBankName, setSenderBankName] = useState("");
  const [senderAccountNumber, setSenderAccountNumber] = useState("");
  const [senderIFSC, setSenderIFSC] = useState("");
  const [receiverBankName, setReceiverBankName] = useState("");
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [receiverIFSC, setReceiverIFSC] = useState("");

  // Amount
  const [sendAmount, setSendAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [receiveAmount, setReceiveAmount] = useState("");
  // const [exchangeRates, setExchangeRates] = useState({});

  const countryOptions = getNames().map((country) => ({
    label: country,
    value: country,
  }));

  

  const getTodayDate = () => new Date().toISOString().split("T")[0];
  useEffect(() => setTransferDate(getTodayDate()), []);

  const getExchangeRates = async (baseCurrency) => {
    try {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`
      );
      const data = await res.json();
      if (data.result === "success") setExchangeRates(data.conversion_rates);
    } catch {
      setExchangeRates({ USD: 1, EUR: 0.85, GBP: 0.73, INR: 74 });
    }
  };

  // Hardcoded Exchange Rates
const STATIC_RATES = {
  USD: { USD: 1, INR: 83, AUD: 1.5, EUR: 0.92 },
  INR: { USD: 0.012, INR: 1, AUD: 0.018, EUR: 0.011 },
  AUD: { USD: 0.67, INR: 55, AUD: 1, EUR: 0.61 },
  EUR: { USD: 1.09, INR: 90, AUD: 1.63, EUR: 1 },
};


 useEffect(() => {
  if (sendAmount && STATIC_RATES[fromCurrency][toCurrency]) {
    const rate = STATIC_RATES[fromCurrency][toCurrency];
    setReceiveAmount((parseFloat(sendAmount) * rate).toFixed(2));
  } else {
    setReceiveAmount("");
  }
}, [sendAmount, fromCurrency, toCurrency]);


  const serviceFee = sendAmount ? (parseFloat(sendAmount) * 0.02).toFixed(2) : "0";
  const gstTax = sendAmount ? (parseFloat(sendAmount) * 0.15).toFixed(2) : "0";
  const totalPayable = sendAmount
    ? (parseFloat(sendAmount) + parseFloat(serviceFee) + parseFloat(gstTax)).toFixed(2)
    : "0";

  const handleNextToAmount = () => {
    if (!customerName || !receiverName) return alert("Please fill all required fields");
    setCurrentStep(Step.AMOUNT);
  };

  const handlePreview = () => {
    if (!sendAmount) return alert("Enter send amount");
    setCurrentStep(Step.PREVIEW);
  };

  const handleConfirm = () => {
    const finalData = {
      sender: {
        name: customerName,
        payMode,
        bankName: senderBankName,
        accountNumber: senderAccountNumber,
        IFSC: senderIFSC,
        date: transferDate,
      },
      receiver: {
        name: receiverName,
        email: receiverEmail,
        phone: receiverPhone,
        country: receiverCountry,
        bankName: receiverBankName,
        accountNumber: receiverAccountNumber,
        IFSC: receiverIFSC,
      },
      transfer: {
        sendAmount,
        fromCurrency,
        toCurrency,
        receiveAmount,
        serviceFee,
        gstTax,
        totalPayable,
      },
    };
    console.log("Final Transfer Data:", finalData);
    alert("Check console for the final transfer data!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 flex flex-col gap-10">

            {/* Step 1: Details */}
            {currentStep !== Step.PREVIEW && (
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
                <h1 className="text-gray-900 text-3xl sm:text-5xl font-black">
                  Step 1: Sender & Receiver Details
                </h1>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Sender Details</h3>
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

                  <h3 className="font-semibold text-lg pt-4">Receiver Details</h3>
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
                  <Select
                    options={countryOptions}
                    value={countryOptions.find(c => c.value === receiverCountry)}
                    onChange={(selected) => setReceiverCountry(selected.value)}
                    placeholder="Select Receiver Country"
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

                  <button
                    onClick={handleNextToAmount}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg transition"
                  >
                    Next: Transfer Amount
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Amount */}
            {currentStep === Step.AMOUNT && (
              <div className="bg-green-50 p-6 rounded-2xl space-y-4">
                <h1 className="text-gray-900 text-3xl sm:text-5xl font-black">
                  Step 2: Transfer Amount
                </h1>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">You Send</label>
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
                  <div>
                    <label className="text-sm text-gray-600">Receiver Gets</label>
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
                <p className="text-xs text-gray-500">Exchange rate applied automatically.</p>
                <button
                  onClick={handlePreview}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg transition"
                >
                  Preview Details
                </button>
              </div>
            )}

            {/* Step 3: Preview */}
            {currentStep === Step.PREVIEW && (
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
                <h1 className="text-gray-900 text-3xl sm:text-5xl font-black">
                  Step 3: Review & Confirm
                </h1>

                <div className="space-y-3 text-sm">
                  <div><strong>Sender:</strong> {customerName} ({payMode})</div>
                  {payMode === "Bank to Bank" && (
                    <div>Bank: {senderBankName}, Account: {senderAccountNumber}, IFSC: {senderIFSC}</div>
                  )}
                  <div><strong>Receiver:</strong> {receiverName}, Email: {receiverEmail}, Phone: {receiverPhone}, Country: {receiverCountry}</div>
                  <div>Bank: {receiverBankName}, Account: {receiverAccountNumber}, IFSC: {receiverIFSC}</div>
                  <div><strong>Transfer Amount:</strong> {sendAmount} {fromCurrency} → {receiveAmount} {toCurrency}</div>
                  <div>Service Fee: {serviceFee} {fromCurrency}, GST: {gstTax} {fromCurrency}, Total: {totalPayable} {fromCurrency}</div>
                </div>

                <button
                  onClick={handleConfirm}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg transition"
                >
                  Confirm & Proceed
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 lg:sticky lg:top-24">
              <h3 className="text-lg sm:text-xl font-semibold">Summary</h3>

              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span>Send Amount</span>
                  <span className="font-semibold">{sendAmount || "0.00"} {fromCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>{serviceFee} {fromCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST</span>
                  <span>{gstTax} {fromCurrency}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total to Pay</span>
                  <span>{totalPayable} {fromCurrency}</span>
                </div>
              </div>

              <div className="bg-green-500 text-white rounded-2xl p-5 sm:p-6 text-center">
                <p className="text-xs tracking-wide uppercase">Receiver Gets</p>
                <p className="text-2xl sm:text-3xl font-bold">{receiveAmount || "0.00"} {toCurrency}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MoneyTransfer;

// pages/MoneyTransfer.jsx
// import React, { useState } from "react";
// import Navbar from "../components/layout/Navbar";
// import Footer from "../components/layout/Footer";
// import SenderDetails from "../components/moneytransfer/SenderDetails";
// import ReceiverDetails from "../components/moneytransfer/ReceiverDetails";
// import TransferDetails from "../components/moneytransfer/TransferDetails";
// import TransferSummary from "../components/moneytransfer/TransferSummary";

// export default function MoneyTransfer() {
//   const [formData, setFormData] = useState({
//     senderName: "",
//     senderEmail: "",
//     receiverName: "",
//     receiverEmail: "",

//     transferType: "bank_to_bank",

//     senderBank: "",
//     receiverBank: "",

//     amount: "",
//     sendCurrency: null,
//     receiveCurrency: null,
//   });

//   const updateField = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   return (
//     <>
//   <Navbar />

//   <div className="flex flex-col min-h-screen">
//     {/* Main content */}
//     <main className="flex-1 bg-gray-50 px-6 py-10">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* LEFT */}
//         <div className="space-y-8">
//           <SenderDetails formData={formData} updateField={updateField} />
//           <ReceiverDetails formData={formData} updateField={updateField} />
//           <TransferDetails formData={formData} updateField={updateField} />
//         </div>

//         {/* RIGHT */}
//         <TransferSummary formData={formData} />
//       </div>
//     </main>

    
//   </div>
//   <Footer />
// </>

//   );
// }
