import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useERPFileUpload } from "../hooks/useERPFileUpload";
import { useUser } from "../context/UserContext";
import {getCustomerById} from "../features/exchange/api/customer";

const MoneyTransfer = () => {
  const { uploadFile } = useERPFileUpload();
  const { user } = useUser();
  const loginUser = { user };
  const [metaFields, setMetaFields] = useState([]);

  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    id_type: "",
    government_id: "",
    customer: "",
    passport_number: "",
    id_number: "",
    transaction_id: "",
  });

  const [passportFile, setPassportFile] = useState(null);
  const [govtFile, setGovtFile] = useState(null);

  const inputStyle =
    "w-full border border-gray-200 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black transition";

  const labelStyle =
    "text-xs uppercase font-bold text-gray-400 mb-2 block";

  const handleChange = (key, value) => {
  setForm((prev) => {
    let updated = { ...prev, [key]: value };

    if (key === "id_type") {
      if (value === "PASSPORT") {
        updated.government_id = "";
      }
      if (value === "GOVERNMENT_ID") {
        updated.passport_number = "";
      }
    }

    return updated;
  });
};

  useEffect(() => {
  const fetchMeta = async () => {
    try {
      const res = await fetch(
        "http://192.168.101.182:81/api/resource/DocType/Money Transfer for Customer",
        {
          headers: {
            Authorization: "token ab5bd602e5f2950:b332725b466fc99",
          },
        }
      );

      const data = await res.json();
      setMetaFields(data.data.fields || []);

      console.log("ERP Fields:", data.data.fields);

    } catch (err) {
      console.error("Meta fetch error", err);
    }
  };

  fetchMeta();
}, []);

const getOptions = (fieldname) => {
  const field = metaFields.find(f => f.fieldname === fieldname);
  if (!field || !field.options) return [];

  return field.options.split("\n").map(opt => ({
    label: opt,
    value: opt,
  }));
};

const formatDate = (date) => { if (!date) return null; const dObj = new Date(date); if (isNaN(dObj.getTime())) return null; const y = dObj.getFullYear(); const m = String(dObj.getMonth() + 1).padStart(2, "0"); const d = String(dObj.getDate()).padStart(2, "0"); return `${y}-${m}-${d}`; };

useEffect(() => {
  const fetchCustomer = async () => {
    if (!form.full_name || !form.date_of_birth) return;

    const formattedDate = formatDate(form.date_of_birth);
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
          date_of_birth: customer.custom_date_of_birth || prev.date_of_birth,
          government_id: customer.custom_government_id || "",
          passport_number: customer.custom_passport_number || "",
          id_type: customer.custom_passport_number ? "PASSPORT" : "GOVERNMENT_ID",
          id_number:
            customer.custom_drivers_license_number ||
            customer.custom_tin_number ||
            customer.custom_voter_id_number ||
            customer.custom_passport_number ||
            "",
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
}, [form.full_name, form.date_of_birth]);
  const handleSubmit = async () => {
    let customerId = form.customer;

if (!customerId) {
  const newCustomer = await createCustomer(form, user, uploadFile);
  customerId = newCustomer.name;
}
    try {
      let passportUrl = "";
      let govtUrl = "";

      if (passportFile) {
        passportUrl = await uploadFile(passportFile, { isPrivate: 1 });
      }

      if (govtFile) {
        govtUrl = await uploadFile(govtFile, { isPrivate: 1 });
      }

      const payload = {
        doc: {
          ...form,
          passport_photo_scan: passportUrl,
          government_id_photo_scan: govtUrl,
        },
      };

      const res = await fetch(
        "http://192.168.101.182:81/api/resource/Money Transfer for Customer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${user?.api_key}:${user?.api_secret}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(`Created: ${data.data.name}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    }
  };

  

//  useEffect(() => {
//   const fetchCustomer = async () => {
//     if (!form.full_name || !form.date_of_birth) return;

//     try {
//       const query = encodeURIComponent(
//         JSON.stringify([
//           ["full_name", "=", form.full_name],
//           ["date_of_birth", "=", form.date_of_birth],
//         ])
//       );

//       const res = await fetch(
//   `http://192.168.101.182:81/api/resource/Money Transfer for Customer?filters=${query}&limit_page_length=1&order_by=creation desc`,
//   {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "Accept": "application/json",
//       "Authorization": "token ab5bd602e5f2950:b332725b466fc99",
//     },
//     credentials: "include",
//   }
// );

//       if (!res.ok) {
//         throw new Error("API failed");
//       }

//       const data = await res.json();
//       const record = data.data?.[0];

//       if (record) {
//         console.log("Auto-filled:", record);

//         setForm((prev) => ({
//           ...prev,
//           id_type: record.id_type || "",
//           government_id: record.government_id || "",
//           customer: record.customer || "",
//           passport_number: record.passport_number || "",
//           id_number: record.id_number || "",
//           transaction_id: record.transaction_id || "",
//         }));
//       }
//     } catch (err) {
//       console.error("Auto-fill error:", err);
//     }
//   };

//   const delay = setTimeout(fetchCustomer, 500);
//   return () => clearTimeout(delay);
// }, [form.full_name, form.date_of_birth]);

const shouldShowField = (fieldname) => {
  const field = metaFields.find(f => f.fieldname === fieldname);

  if (!field || !field.depends_on) return true;

  try {
    const condition = field.depends_on.replace("eval:", "");
    const jsCondition = condition.replace(/doc\./g, "form.");
    return eval(jsCondition);
  } catch {
    return true;
  }
};

const FileUploadBox = ({ label, onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleBrowse = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div>
      <label className="text-xs uppercase font-bold text-gray-400 mb-2 block">
        {label}
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`w-full border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition
          ${isDragging ? "border-black bg-gray-100" : "border-gray-300"}
        `}
      >
        <input
          type="file"
          className="hidden"
          id={label}
          onChange={handleBrowse}
        />

        <label htmlFor={label} className="cursor-pointer block">
          <p className="text-sm font-semibold text-gray-700">
            Drag & drop file here
          </p>
          <p className="text-xs text-gray-400 mt-1">
            or <span className="underline">browse</span>
          </p>

          {fileName && (
            <p className="mt-3 text-xs text-green-600 font-semibold">
              {fileName}
            </p>
          )}
        </label>
      </div>
    </div>
  );
};

 return (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />

    <main className="flex-grow py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        {/* HEADER */}
        <div>
          <h1 className="text-gray-900 text-3xl sm:text-5xl font-black tracking-tight leading-none">
            Customer{" "}
            <span className="text-[#E00000] italic">
              Money Transfer
            </span>
          </h1>

          <p className="text-xs font-semibold text-gray-400 mt-2">
            Fill customer details for transfer
          </p>
        </div>

        {/* FORM CARD */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-10">

          <div className="grid md:grid-cols-2 gap-10">

            {/* LEFT */}
            <div className="space-y-6">
              <div>
                <label className={labelStyle}>Full Name</label>
                <input
                  className={inputStyle}
                  value={form.full_name}
                  onChange={(e) =>
                    handleChange("full_name", e.target.value)
                  }
                />
              </div>

              <div>
                <label className={labelStyle}>Date of Birth</label>
                <input
                  type="date"
                  className={inputStyle}
                  value={form.date_of_birth}
                  onChange={(e) =>
                    handleChange("date_of_birth", e.target.value)
                  }
                />
              </div>

              <div>
                <label className={labelStyle}>ID Type</label>
                <select
                  className={inputStyle}
                  value={form.id_type}
                  onChange={(e) =>
                    handleChange("id_type", e.target.value)
                  }
                >
                  <option value="">Select ID Type</option>
                  {getOptions("id_type").map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {shouldShowField("government_id") && (
                <div>
                  <label className={labelStyle}>Government ID</label>
                  <select
                    className={inputStyle}
                    value={form.government_id}
                    onChange={(e) =>
                      handleChange("government_id", e.target.value)
                    }
                  >
                    <option value="">Select Government ID</option>
                    {getOptions("government_id").map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className={labelStyle}>Customer ID</label>
                <input
                  className={inputStyle}
                  value={form.customer}
                  onChange={(e) =>
                    handleChange("customer", e.target.value)
                  }
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">

              {shouldShowField("passport_number") && (
                <div>
                  <label className={labelStyle}>Passport Number</label>
                  <input
                    className={inputStyle}
                    value={form.passport_number}
                    onChange={(e) =>
                      handleChange("passport_number", e.target.value)
                    }
                  />
                </div>
              )}

              <div>
                <label className={labelStyle}>ID Number</label>
                <input
                  className={inputStyle}
                  value={form.id_number}
                  onChange={(e) =>
                    handleChange("id_number", e.target.value)
                  }
                />
              </div>

              {shouldShowField("passport_photo_scan") && (
                <div>
                  <label className={labelStyle}>Passport Upload</label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setPassportFile(e.target.files[0])
                    }
                  />
                </div>
              )}

              {shouldShowField("government_id_photo_scan") && (
                <div>
                  <label className={labelStyle}>
                    Government ID Upload
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setGovtFile(e.target.files[0])
                    }
                  />
                </div>
              )}

              <div>
                <label className={labelStyle}>Transaction ID</label>
                <input
                  className={inputStyle}
                  value={form.transaction_id}
                  onChange={(e) =>
                    handleChange("transaction_id", e.target.value)
                  }
                />
              </div>
            </div>
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