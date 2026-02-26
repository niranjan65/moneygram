// pages/MoneyTransfer.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Select from "react-select";
import { getNames } from "country-list";
import FormInput from "../components/FormInput";
import { calculateTransfer } from "../utils/transferCalculator";
import { validateStepOne } from "../utils/validateStepOne";


const MoneyTransfer = () => {
  const Step = {
    DETAILS: 1,
    AMOUNT: 2,
    PREVIEW: 3,
  };

  const [currentStep, setCurrentStep] = useState(Step.DETAILS);

  // ======================
  // SENDER DETAILS
  // ======================
  const [senderFullName, setSenderFullName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderCountry, setSenderCountry] = useState("");

  const [payMode, setPayMode] = useState("Cash to Bank");
  const [transferDate, setTransferDate] = useState("");

  const [senderBankName, setSenderBankName] = useState("");
  const [senderAccountNumber, setSenderAccountNumber] = useState("");
  const [senderSwiftCode, setSenderSwiftCode] = useState("");

  const [senderDocType, setSenderDocType] = useState("");
  const [senderDocNumber, setSenderDocNumber] = useState("");
  const [senderDocFile, setSenderDocFile] = useState(null);

  // ======================
  // RECEIVER DETAILS
  // ======================
  const [receiverFullName, setReceiverFullName] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverCountry, setReceiverCountry] = useState("");

  const [receiverBankName, setReceiverBankName] = useState("");
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [receiverSwiftCode, setReceiverSwiftCode] = useState("");

  const [receiverDocType, setReceiverDocType] = useState("");
  const [receiverDocNumber, setReceiverDocNumber] = useState("");
  const [receiverDocFile, setReceiverDocFile] = useState(null);

  const [senderOtherDocType, setSenderOtherDocType] = useState("");
const [receiverOtherDocType, setReceiverOtherDocType] = useState("");

const [senderFileName, setSenderFileName] = useState("");
const [receiverFileName, setReceiverFileName] = useState("");


  // ======================
  // AMOUNT
  // ======================
  const [sendAmount, setSendAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [gstRate, setGstRate] = useState(0);

  const countryOptions = getNames().map((country) => ({
    label: country,
    value: country,
  }));

 
    const documentOptions = [ 
     { label: "Passport", value: "Passport" },
    { label: "Government ID", value: "Government ID" },
    { label: "Driver's License", value: "Driver's License" },
    { label: "Voter ID Card", value: "Voter ID Card" }, 
   ];

  const payModeOptions = [
  { label: "Cash to Bank", value: "Cash to Bank" },
  { label: "Bank to Bank", value: "Bank to Bank" },
  { label: "Cash to Cash", value: "Cash to Cash" },
];

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    setTransferDate(getTodayDate());
  }, []);

  useEffect(() => {
  const fetchGST = async () => {
    try {
      const response = await fetch(
        "http://192.168.101.182:81/api/method/moneygram.api.get_tax_template_for_company",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company: "MH Money Express",
          }),
        }
      );

      const result = await response.json();
      // console.log("GST API FULL RESPONSE:", result);

      const taxRate =
        result?.message?.taxes?.[0]?.tax_rate ?? 0;

      setGstRate(Number(taxRate));

    } catch (error) {
      console.error("GST fetch error:", error);
      setGstRate(0);
    }
  };

  fetchGST();
}, []);

  const STATIC_RATES = {
    USD: { USD: 1, INR: 83, AUD: 1.5, EUR: 0.92 },
    INR: { USD: 0.012, INR: 1, AUD: 0.018, EUR: 0.011 },
    AUD: { USD: 0.67, INR: 55, AUD: 1, EUR: 0.61 },
    EUR: { USD: 1.09, INR: 90, AUD: 1.63, EUR: 1 },
  };


  const {
  serviceFee,
  subTotal,
  gst,
  totalToPay,
  receiveAmount,
} = calculateTransfer({
  sendAmount,
  fromCurrency,
  toCurrency,
  rates: STATIC_RATES,
  gstPercent: gstRate,   
});

const stepLabels = {
  [Step.DETAILS]: "Sender and Receiver Details",
  [Step.AMOUNT]: "Transfer Amount",
  [Step.PREVIEW]: "Preview",
};


  const inputStyle =
    "w-full border border-gray-200 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary transition-all";

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "1rem",
      padding: "6px 10px",
      borderColor: state.isFocused ? "#000" : "#e5e7eb",
      boxShadow: "none",
      fontSize: "14px",
      fontWeight: 600,
    }),
    singleValue: (base) => ({
      ...base,
      color: "#000",
      fontWeight: 600,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#f3f4f6" : "white",
      color: "#000",
      fontWeight: 600,
    }),
  };

  const handleNextToAmount = () => {
  const error = validateStepOne({
    payMode,

    senderFullName,
    senderEmail,
    senderPhone,
    senderCountry,
    senderBankName,
    senderAccountNumber,
    senderSwiftCode,
    senderDocType,
    senderOtherDocType,
    senderDocNumber,
    senderDocFile,

    receiverFullName,
    receiverEmail,
    receiverPhone,
    receiverCountry,
    receiverBankName,
    receiverAccountNumber,
    receiverSwiftCode,
    receiverDocType,
    receiverOtherDocType,
    receiverDocNumber,
    receiverDocFile,
  });

  if (error) {
    return alert(error);
  }

  setCurrentStep(Step.AMOUNT);
};


  const handlePreview = () => {
    if (!sendAmount) return alert("Enter transfer amount");
    setCurrentStep(Step.PREVIEW);
  };

 
 const handleConfirm = async () => {
  try {
    const payload = {
      data: {
        // ======================
        // SENDER
        // ======================
        sender_full_name: senderFullName,
        sender_phone_number: senderPhone,
        sender_payment_mode: payMode,
        sender_document_type: senderDocType,
        sender_document_number: senderDocNumber,
        sender_email_address: senderEmail,
        sender_country: senderCountry,
        sender_transfer_date: transferDate,
        sender_bank_name: senderBankName || "",
        sender_account_number: senderAccountNumber || "",
        sender_swift_code: senderSwiftCode || "",

        // ======================
        // RECEIVER
        // ======================
        receiver_full_name: receiverFullName,
        receiver_phone_number: receiverPhone,
        receiver_doc_type: receiverDocType,
        receiver_document_number: receiverDocNumber,
        receiver_email_address: receiverEmail,
        receiver_country: receiverCountry,
        receiver_bank_name: receiverBankName || "",
        receiver_account_number: receiverAccountNumber || "",
        receiver_swift_code: receiverSwiftCode || "",

        // ======================
        // AMOUNTS
        // ======================
        sending_amount: Number(sendAmount),
        receiving_amount: Number(receiveAmount),

        sending_currency: fromCurrency,
        receiving_currency: toCurrency,
        sending_amount_summary: Number(sendAmount),
        service_fee: Number(serviceFee),
        sub_total: Number(subTotal),
        taxes: Number(gst),
        total_to_pay: Number(totalToPay),
      },
    };

    const response = await fetch(
      "http://192.168.101.182:81/api/method/moneygram.moneygram.api.money_exchange.create_money_transfer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (response.ok) {
      alert("Money Transfer Created Successfully ✅");
      console.log("Payload Sent:", payload);
      console.log("Server Response:", result);
      setCurrentStep(Step.DETAILS);
    } else {
      console.error("Error:", result);
      alert(result.message?.message || "Failed to create transfer");
    }
  } catch (error) {
    console.error("API Error:", error);
    alert("Something went wrong while creating transfer.");
  }
};

  return (
  <div className="min-h-screen flex flex-col">
    <Navbar />

    <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 flex flex-col gap-10">

          {/* HEADER */}
          <div>
            <h1 className="text-3xl sm:text-5xl font-black">
              Who are you sending{" "}
              <span className="text-primary italic">money</span> to?
            </h1>

            <div className="mt-4">
              <p className="text-xs text-gray-500 font-semibold">
                Step {currentStep} of 3
              </p>
              <p className="text-primary font-black text-lg">
                {stepLabels[currentStep]}
              </p>
            </div>
          </div>

          {/* ================= STEP 1 ================= */}
         {currentStep === Step.DETAILS && (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-10 space-y-12">

    {/* ================= SENDER ================= */}
    <div className="space-y-8">
      <h3 className="text-xl font-black">Sender Details</h3>

      {/* Pay Mode + Date */}
      

      <FormInput
  placeholder="Full Name"
  value={senderFullName}
  onChange={(e) => setSenderFullName(e.target.value)}
/>

      <div className="grid md:grid-cols-2 gap-6">
        <FormInput
          placeholder="Email Address"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
          
        />
        <FormInput
          placeholder="Phone Number"
          value={senderPhone}
          onChange={(e) => setSenderPhone(e.target.value)}
          
        />
      </div>

      <Select
        options={countryOptions}
        styles={customSelectStyles}
        value={countryOptions.find(o => o.value === senderCountry)}
        onChange={(selected) => setSenderCountry(selected.value)}
        placeholder="Country"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs uppercase font-bold text-gray-400 mb-2 block">
            Payment Mode
          </label>
          <Select
            options={payModeOptions}
            value={payModeOptions.find(opt => opt.value === payMode)}
            onChange={(selected) => setPayMode(selected.value)}
            styles={customSelectStyles}
            placeholder="Select Payment Mode"
          />
        </div>

        <div>
          <label className="text-xs uppercase font-bold text-gray-400 mb-2 block">
            Transfer Date
          </label>
          <input
            type="date"
            value={transferDate}
            readOnly
            className={`${inputStyle} bg-gray-50 cursor-not-allowed`}
          />
        </div>
      </div>

      {/* ================= SENDER BANK DETAILS ================= */}
{(payMode === "Bank to Bank") && (
  <div className="space-y-6 border-t pt-8">
    <h4 className="text-xl font-black">Sender Bank Details</h4>

    <FormInput
      placeholder="Bank Name"
      value={senderBankName}
      onChange={(e) => setSenderBankName(e.target.value)}
      
    />

    <FormInput
      placeholder="Account Number"
      value={senderAccountNumber}
      onChange={(e) => setSenderAccountNumber(e.target.value)}
      
    />

    <FormInput
      placeholder="SWIFT Code"
      value={senderSwiftCode}
      onChange={(e) => setSenderSwiftCode(e.target.value)}
      
    />
  </div>
)}


      {/* Identity */}
      <div className="space-y-6">
        <h4 className="text-xl font-semibold">Identity Document</h4>

        <Select
          options={documentOptions}
          value={documentOptions.find(opt => opt.value === senderDocType)}
          onChange={(selected) => {
            setSenderDocType(selected.value);
            if (selected.value !== "Other") {
              setSenderOtherDocType("");
            }
          }}
          placeholder="Document Type"
          styles={customSelectStyles}
        />

        {senderDocType === "Government ID" && (
  <input
    placeholder="Enter Government ID Type"
    value={senderOtherDocType}
    onChange={(e) => setSenderOtherDocType(e.target.value)}
    className={inputStyle}
  />
)}

        <input
          placeholder="Document Number"
          value={senderDocNumber}
          onChange={(e) => setSenderDocNumber(e.target.value)}
          className={inputStyle}
        />

        <div className="flex items-center gap-4">
          <label className="bg-primary text-white px-6 py-3 rounded-2xl cursor-pointer font-semibold text-sm hover:opacity-90 transition">
            Choose File
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                setSenderDocFile(file);
                setSenderFileName(file ? file.name : "");
              }}
            />
          </label>

          <span className="text-sm font-semibold text-gray-600">
            {senderFileName || "No file chosen"}
          </span>
        </div>
      </div>
    </div>

    

    {/* ================= RECEIVER ================= */}
    <div className="space-y-8 border-t pt-10">
      <h3 className="text-xl font-black">Receiver Details</h3>

      <input
        placeholder="Full Name"
        value={receiverFullName}
        onChange={(e) => setReceiverFullName(e.target.value)}
        className={inputStyle}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <input
          placeholder="Email Address"
          value={receiverEmail}
          onChange={(e) => setReceiverEmail(e.target.value)}
          className={inputStyle}
        />
        <input
          placeholder="Phone Number"
          value={receiverPhone}
          onChange={(e) => setReceiverPhone(e.target.value)}
          className={inputStyle}
        />
      </div>

      <Select
        options={countryOptions}
        styles={customSelectStyles}
        value={countryOptions.find(o => o.value === receiverCountry)}
        onChange={(selected) => setReceiverCountry(selected.value)}
        placeholder="Country"
      />
      {/* ================= RECEIVER BANK DETAILS ================= */}
{(payMode === "Cash to Bank" || payMode === "Bank to Bank") && (
  <div className="space-y-6 border-t pt-8">
    <h4 className="text-xl font-black">Receiver Bank Details</h4>

    <input
      placeholder="Bank Name"
      value={receiverBankName}
      onChange={(e) => setReceiverBankName(e.target.value)}
      className={inputStyle}
    />

    <input
      placeholder="Account Number"
      value={receiverAccountNumber}
      onChange={(e) => setReceiverAccountNumber(e.target.value)}
      className={inputStyle}
    />

    <input
      placeholder="SWIFT Code"
      value={receiverSwiftCode}
      onChange={(e) => setReceiverSwiftCode(e.target.value)}
      className={inputStyle}
    />
  </div>
)}


      <div className="space-y-6">
        <h4 className="text-xl font-semibold">Identity Document</h4>

        <Select
          options={documentOptions}
          value={documentOptions.find(opt => opt.value === receiverDocType)}
          onChange={(selected) => {
            setReceiverDocType(selected.value);
            if (selected.value !== "Other") {
              setReceiverOtherDocType("");
            }
          }}
          placeholder="Document Type"
          styles={customSelectStyles}
        />

        {receiverDocType === "Government ID" && (
  <input
    placeholder="Enter Government ID Type"
    value={receiverOtherDocType}
    onChange={(e) => setReceiverOtherDocType(e.target.value)}
    className={inputStyle}
  />
)}

        <input
          placeholder="Document Number"
          value={receiverDocNumber}
          onChange={(e) => setReceiverDocNumber(e.target.value)}
          className={inputStyle}
        />

        <div className="flex items-center gap-4">
          <label className="bg-primary text-white px-6 py-3 rounded-2xl cursor-pointer font-semibold text-sm hover:opacity-90 transition">
            Choose File
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                setReceiverDocFile(file);
                setReceiverFileName(file ? file.name : "");
              }}
            />
          </label>

          <span className="text-sm font-semibold text-gray-600">
            {receiverFileName || "No file chosen"}
          </span>
        </div>
      </div>
    </div>

    <button
      onClick={handleNextToAmount}
      className="w-full bg-[var(--color-primary)] text-black rounded-2xl py-4 font-black hover:opacity-90 transition"

    >
      Next: Transfer Amount
    </button>

  </div>
)}


          {/* ================= STEP 2 ================= */}
          {currentStep === Step.AMOUNT && (
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-10 space-y-8">

              <h3 className="text-xl font-black">Transfer Amount</h3>

              <div className="grid md:grid-cols-2 gap-6">

                {/* You Send */}
                <div>
                  <label className="text-xs uppercase font-bold text-gray-400">
                    You Send
                  </label>

                  <div className="flex border border-gray-200 rounded-2xl overflow-hidden">
                    <input
                      type="number"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      className="flex-1 px-5 py-4 font-semibold outline-none"
                    />
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="px-4 border-l border-gray-200 font-semibold bg-white text-black"
                    >
                      <option>USD</option>
                      <option>INR</option>
                      <option>AUD</option>
                      <option>EUR</option>
                    </select>
                  </div>
                </div>

                {/* Receiver Gets */}
                <div>
                  <label className="text-xs uppercase font-bold text-gray-400">
                    Receiver Gets
                  </label>

                  <div className="flex border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
                    <input
                      type="number"
                      value={receiveAmount}
                      readOnly
                      className="flex-1 px-5 py-4 font-semibold bg-gray-50"
                    />
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="px-4 border-l border-gray-200 font-semibold bg-white text-black"
                    >
                      <option>EUR</option>
                      <option>USD</option>
                      <option>INR</option>
                      <option>AUD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
  <button
    onClick={() => setCurrentStep(Step.DETAILS)}
    className="w-1/3 border border-gray-300 rounded-2xl py-4 font-black hover:bg-gray-50 transition"
  >
    ← Back
  </button>

  <button
    onClick={handlePreview}
    className="w-full bg-[var(--color-primary)] hover:brightness-95 text-black rounded-2xl py-4 font-black transition"

  >
    Preview Details
  </button>
</div>

            </div>
          )}

          {/* ================= STEP 3 ================= */}
          {currentStep === Step.PREVIEW && (
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-10 space-y-6">

              <div className="flex justify-between items-center">
  <h3 className="text-xl font-black">Review & Confirm</h3>

  <button
    onClick={() => setCurrentStep(Step.DETAILS)}
    className="flex items-center gap-2 text-sm font-bold text-primary hover:opacity-80 transition"
  >
    ✏️ Edit
  </button>
  

</div>


              <div className="space-y-3 text-sm font-semibold">
                <div><strong>Sender:</strong> {senderFullName}</div>
                <div><strong>Receiver:</strong> {receiverFullName}</div>
                <div>
                  <strong>Transfer:</strong> {sendAmount} {fromCurrency} → {receiveAmount} {toCurrency}
                </div>
                <div>
                  <strong>Total:</strong> {totalToPay} {fromCurrency}
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full bg-[var(--color-primary)] hover:brightness-95 text-black rounded-2xl py-4 font-black transition"

              >
                Confirm & Proceed
              </button>
             
            </div>
            
          )}

        </div>

        {/* ================= RIGHT SUMMARY ================= */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-10 space-y-6 lg:sticky lg:top-24">

            <h3 className="text-xl font-black">Summary</h3>

            <div className="space-y-4 text-sm font-semibold">

              <div className="flex justify-between">
                <span>Sending Amount</span>
                <span>{sendAmount || "0.00"} {fromCurrency}</span>
              </div>

              <div className="flex justify-between">
                <span>Service Fee (2%)</span>
                <span>{serviceFee} {fromCurrency}</span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subTotal} {fromCurrency}</span>
              </div>

              <div className="flex justify-between">
                <span>GST ({gstRate}%)</span>
                <span>{gst} {fromCurrency}</span>
              </div>

              <div className="border-t pt-4 flex justify-between font-black text-lg">
                <span>Total To Pay</span>
                <span>{totalToPay} {fromCurrency}</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-green-600 font-black">
                <span>Receiver Gets</span>
                <span>{receiveAmount} {toCurrency}</span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </main>

    <Footer />
  </div>
);
}
export default MoneyTransfer;
