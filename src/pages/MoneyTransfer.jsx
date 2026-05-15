//MoneyTransfer.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useERPFileUpload } from "../hooks/useERPFileUpload";
import { useUser } from "../context/UserContext";
import { getCustomerById, createCustomer } from "../features/exchange/api/customer";
import FileUploadBox from "../features/exchange/config/FileUploadBox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, CheckCircle2 } from "lucide-react";
import { createMoneyTransfer } from "../features/exchange/api/createMoneyTransfer";
import TransferAmountSection from "../features/exchange/components/TransferAmountSection";
import { DenominationPanel } from "../features/exchange/components/sections/DenominationPanel";
import { useBaseCurrency } from "../hooks/useDenomination";
import { getBaseURL, getHeaders, ERP_ENV } from "../features/exchange/config/erpConfig";

const MoneyTransfer = () => {
  const { uploadFile } = useERPFileUpload();
  const { user } = useUser();
  const loginUser =  user ;
  const [metaFields, setMetaFields] = useState([]);
  const [form, setForm] = useState({});
  const [currencyDenominationRows, setCurrencyDenominationRows] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);
  const { data: baseCurrencyData, loading: baseDenomLoading, error: baseDenomError } = useBaseCurrency();

  // console.log("Current User:", loginUser);
  

const usableFields = metaFields.filter(
  (f) =>
    !f.hidden &&
    !["Section Break", "Column Break"].includes(f.fieldtype)
);


  const inputStyle =
  "w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E00000] focus:bg-white transition-all duration-200";
  
  const labelStyle =
    "text-xs uppercase font-bold text-gray-400 mb-2 block";

  const handleChange = (key, value) => {
  setForm((prev) => ({
    ...prev,
    [key]: value,
  }));
};

  useEffect(() => {
  const fetchMeta = async () => {
  try {
    const baseURL = getBaseURL(ERP_ENV.DEMO);
    // const headers = getHeaders(loginUser.api_key, loginUser.api_secret);
    const headers = getHeaders(loginUser, ERP_ENV.PROD);

    const url = `${baseURL}/api/resource/DocType/${encodeURIComponent("Money Transfer")}`;

    console.log("🔥 Fetching URL:", url);
    console.log("🔥 Headers:", headers);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        ...headers,
        Accept: "application/json",
      },
    });

    const data = await res.json();

    console.log("🔥 FULL RESPONSE STATUS:", res.status);
    console.log("🔥 FULL DOCTYPE RESPONSE:", data);

    if (!res.ok) {
      console.error("❌ Meta fetch failed:", data);
      return;
    }

    if (!data?.data?.fields) {
      console.error("❌ Invalid meta response:", data);
      return;
    }

    setMetaFields(data.data.fields);

    console.log("✅ FIELDS:", data.data.fields);
  } catch (err) {
    console.error("❌ Meta fetch error:", err);
  }
};

  fetchMeta();
}, [loginUser]);



useEffect(() => {
  const amount = parseFloat(form.amount || 0);
  const fee = parseFloat(form.transfer_fee || 0);

  setForm(prev => ({
    ...prev,
    total_amount: amount + fee
  }));
}, [form.amount, form.transfer_fee]);

const getOptions = (fieldname) => {
  const field = metaFields.find(f => f.fieldname === fieldname);
  if (!field || !field.options) return [];

  return field.options.split("\n").map(opt => ({
    label: opt,
    value: opt,
  }));
};



const formatLocalDate = (date) => {
  if (!date) return "";

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

const formatDate = (date) => {
  if (!date) return null;

  const d = new Date(date);

  if (isNaN(d.getTime())) {
    console.error("❌ Invalid date:", date);
    return null;
  }

  return d.toISOString().split("T")[0];
};
useEffect(() => {
  const fetchCustomer = async () => {
    if (!form.full_name || !form.dob) return;

    const formattedDate = formatDate(form.dob);
    if (!formattedDate) return;

    const cleanName = form.full_name.trim().replace(/\s+/g, " ");
    const customerId = `${cleanName}_${formattedDate}`;

    console.log("Searching customer:", customerId);

    try {
      const customer = await getCustomerById(customerId, loginUser);

      if (customer) {
        console.log("Customer Auto-filled:", customer);

       setForm((prev) => ({
  ...prev,
  full_name: customer.custom_full_name || customer.full_name || prev.full_name,
  custom_full_name: customer.custom_full_name || customer.full_name || "",
  dob: customer.custom_date_of_birth || customer.dob || prev.dob,
  custom_date_of_birth: customer.custom_date_of_birth || customer.dob || "",
  passport_number: customer.custom_passport_number || customer.passport_number || "",
  custom_passport_number: customer.custom_passport_number || customer.passport_number || "",
  document_upload:
    customer.custom_government_document || customer.document_upload || "",
  custom_government_document: customer.custom_government_document || "",

  government_id_type: customer.custom_government_id || customer.government_id_type || "",
  custom_government_id: customer.custom_government_id || customer.government_id_type || "",

  government_id_number:
    customer.custom_drivers_licence_number ||
    customer.custom_tin_number ||
    customer.custom_voter_id_number ||
    prev.government_id_number || "",
  custom_drivers_licence_number: customer.custom_drivers_licence_number || "",
  custom_tin_number: customer.custom_tin_number || "",
  custom_voter_id_number: customer.custom_voter_id_number || "",

  document_type: customer.custom_passport_number
    ? "Passport"
    : "Government ID",

  customer: customer.name || "",
}));
      } else {
        console.log("Customer not found");
      }
    } catch (err) {
      console.error("Customer fetch error:", err);
    }
  };

  const delay = setTimeout(fetchCustomer, 500);
  return () => clearTimeout(delay);
}, [form.full_name, form.dob]);
 

const handleSubmit = async () => {
  setIsSubmitting(true);
  setSuccessInfo(null);

  try {
    let documentUrl = "";

    if (form.document_upload instanceof File) {
      documentUrl = await uploadFile(form.document_upload, { isPrivate: 1 });
    }

    console.log("Using loginUser for createCustomer:", loginUser);
    console.log("Currency Denomination Rows:", currencyDenominationRows);

    // Create / Fetch Customer
    const customer = await createCustomer(form, documentUrl, loginUser);
    const customerId = customer.name;

    // Create Transaction
    const transfer = await createMoneyTransfer(
      form,
      customerId,
      loginUser,
      documentUrl,
      currencyDenominationRows
    );

    // Premium success info (rendered in-page)
    setSuccessInfo({
      customer: customerId,
      transaction: transfer.name,
      amount: Number(form.amount || 0),
      message: `Your transfer of ${Number(form.amount || 0)} has been securely processed. Your transaction ${transfer.name} is confirmed `,
    });

    resetForm();
    setCurrencyDenominationRows([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error(err);
    alert(err.message || "Error processing");
  } finally {
    setIsSubmitting(false);
  }
};
const shouldShowField = (field) => {
  if (!field.depends_on) return true;

  try {
    const condition = field.depends_on.replace("eval:", "");
    const fn = new Function("doc", `return ${condition}`);
    return fn(form);
  } catch (e) {
    console.warn("depends_on error:", field.fieldname);
    return true;
  }
};

const resetForm = () => {
  setForm({});
};

const renderField = (field) => {
  if (!shouldShowField(field)) return null;

  const commonProps = {
    className: inputStyle,
    value: form[field.fieldname] || "",
    onChange: (e) =>
      handleChange(field.fieldname, e.target.value),
  };

  switch (field.fieldtype) {
    case "Data":
      return (
        <div key={field.fieldname}>
          <label className={labelStyle}>{field.label}</label>
          <input {...commonProps} />
        </div>
      );

    case "Date":
  return (
    <div key={field.fieldname}>
      <label className={labelStyle}>{field.label}</label>
      <DatePicker
        selected={
          form[field.fieldname]
            ? new Date(form[field.fieldname])
            : null
        }
        onChange={(date) =>
          handleChange(field.fieldname, formatLocalDate(date))
        }
        className={inputStyle}
        dateFormat="yyyy-MM-dd"

        // ✅ KEY FIXES
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"

        // ✅ Open to past (DOB friendly)
        maxDate={new Date()} // no future dates
        yearDropdownItemNumber={100} // last 100 years
        scrollableYearDropdown

        // ✅ Optional: open calendar around 2000 instead of today
        openToDate={new Date(2000, 0, 1)}
      />
    </div>
  );

    case "Select":
      const options = field.options?.split("\n") || [];

      return (
        <div key={field.fieldname}>
          <label className={labelStyle}>{field.label}</label>
          <select {...commonProps}>
            <option value="">Select {field.label}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );

    case "Attach":
      return (
        // <FileUploadBox
        //   key={field.fieldname}
        //   label={field.label}
        //   file={form[field.fieldname]}
        //   setFile={(file) =>
        //     handleChange(field.fieldname, file)
        //   }
        // />
        <FileUploadBox
  key={field.fieldname}
  label={field.label}
  file={form[field.fieldname]}
  existingFileUrl={
    typeof form[field.fieldname] === "string"
      ? form[field.fieldname]
      : null
  }
  setFile={(file) =>
    handleChange(field.fieldname, file)
  }
/>
      );

    case "Section Break":
      return (
        <div key={field.fieldname} className="col-span-2 mt-6">
          <h3 className="text-lg font-bold text-gray-700">
            {field.label}
          </h3>
        </div>
      );

    default:
      return null;
  }
};



 return (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />

    <main className="flex-grow py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
     

        {/* HEADER */}
       <div>
  <h1 className="text-gray-900 text-3xl sm:text-5xl font-black tracking-tight leading-none">
    Money{" "}
    <span className="text-[#E00000] italic">
      Transfer
    </span>
  </h1>
{/* 
  <p className="text-xs font-semibold text-gray-400 mt-2">
    Enter customer details to securely send or receive funds
  </p> */}
</div>

        {/* FORM CARD */}
        <div className="rounded-3xl border border-gray-100 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-8 sm:p-10">

          {successInfo && (
            <div className="mb-6 rounded-2xl border border-green-100 bg-gradient-to-r from-white to-green-50 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="text-green-600 text-3xl">✓</div>
                <div className="flex-1">
                  <h2 className="text-lg font-extrabold text-gray-800">Transfer Complete</h2>
                  <p className="text-sm text-gray-600 mt-1">{successInfo.message}</p>
                  <p className="mt-3 text-sm text-gray-700">
                    <strong>Customer:</strong> {successInfo.customer} &nbsp;•&nbsp; <strong>Transaction:</strong> {successInfo.transaction}
                  </p>
                </div>
                <button
                  onClick={() => setSuccessInfo(null)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
  {usableFields.map((field) => renderField(field))}
</div>

          {/* CURRENCY DENOMINATION PANEL */}
          <div className="mt-8 col-span-2">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-700">
                Currency Denomination
              </h3>
            </div>

            {baseDenomLoading ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-500">
                Loading denomination panel...
              </div>
            ) : baseDenomError ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
                {baseDenomError}
              </div>
            ) : baseCurrencyData ? (
              <DenominationPanel
                title="Local FJD Denomination"
                subtitle="Enter note counts for Fiji Dollars"
                flag={baseCurrencyData.flag}
                symbol={baseCurrencyData.symbol}
                currency={baseCurrencyData.currency}
                notes={baseCurrencyData.notes}
                coins={baseCurrencyData.coins}
                targetAmount={parseFloat(form.amount || 0)}
               onRowsChange={(rows) => {
  setCurrencyDenominationRows(
    rows
      .filter((row) => row.count > 0)
      .map((row) => ({
        // Must match ERPNext Item Code exactly
        denomination: `FJD $${row.denom}`,

        qty: Number(row.count),
        amount: Number(row.denom) * Number(row.count),
      }))
  );
}}
                accentColor="#E00000"
              />
            ) : (
              <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-500">
                Fiji denomination data is not available.
              </div>
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`mt-10 w-full bg-[#E00000] ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'} text-white rounded-2xl py-4 font-black transition`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Processing Transfer...
              </span>
            ) : (
              'Submit Transfer'
            )}
          </button>
        </div>
      </div>
    </main>

    <Footer />
  </div>
);
};

export default MoneyTransfer;