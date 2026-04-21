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
import { getBaseURL, getHeaders, ERP_ENV } from "../features/exchange/config/erpConfig";

const MoneyTransfer = () => {
  const { uploadFile } = useERPFileUpload();
  const { user } = useUser();
  const loginUser =  user ;
  const [metaFields, setMetaFields] = useState([]);
  const [form, setForm] = useState({});
  

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
    const headers = getHeaders(loginUser, ERP_ENV.DEMO);

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
  const amount = parseFloat(form.sending_amount || 0);
  const fee = parseFloat(form.transfer_fee || 0);

  setForm(prev => ({
    ...prev,
    total_amount: amount + fee
  }));
}, [form.sending_amount, form.transfer_fee]);

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
  full_name: customer.custom_full_name || prev.full_name,
  dob: customer.custom_date_of_birth || prev.dob,
  government_id_number:
    customer.custom_drivers_license_number ||
    customer.custom_tin_number ||
    customer.custom_voter_id_number ||
    "",
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
  try {
    let documentUrl = "";

if (form.document_upload instanceof File) {
  documentUrl = await uploadFile(form.document_upload, { isPrivate: 1 });
}

    // ✅ Create / Fetch Customer
    const customer = await createCustomer(form, documentUrl);
    const customerId = customer.name;

    // ✅ Create Transaction
    const transfer = await createMoneyTransfer(
      form,
      customerId,
      loginUser,
      documentUrl
    );

    alert(`✅ Success!
Customer: ${customerId}
Transaction: ${transfer.name}`);
  } catch (err) {
    console.error(err);
    alert(err.message || "Error processing");
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
        <FileUploadBox
          key={field.fieldname}
          label={field.label}
          file={form[field.fieldname]}
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

          <div className="grid md:grid-cols-2 gap-6">
  {usableFields.map((field) => renderField(field))}
</div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            className="mt-10 w-full bg-[#E00000] hover:opacity-90 text-white rounded-2xl py-4 font-black transition"
          >
            Submit Transfer
          </button>
        </div>
      </div>
    </main>

    <Footer />
  </div>
);
};

export default MoneyTransfer;