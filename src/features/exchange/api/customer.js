
//customer.js
const BASE_URL = "http://192.168.101.182:81";
export const getCustomerById = async (idNumber, loginUser) => {
  
  if (!idNumber || idNumber.length < 3) return null;
  try {
    const res = await fetch(
      `http://192.168.101.182:81/api/resource/Customer/${idNumber}`,
      {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ab5bd602e5f2950:d5f1770a2ce69e2`,
        },
      }
    );
    
    if (!res.ok) {
      console.log('Customer not found');
      return null;
    }
    
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
};


export const createCustomer = async (form, documentUrl) => {

  
  try {
    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().split("T")[0];
    };

    const cleanName = form.full_name.trim().replace(/\s+/g, " ");
    const customerId = `${cleanName}_${formatDate(form.dob)}`;
    const govIdType = (form.government_id || "")
  .toLowerCase()
  .replace(/['’]/g, "") // normalize apostrophe
  .trim();

  const normalizeGovId = (type) => {
  if (!type) return "";

  const map = {
    "Driver's License": "Driver's Licence", // ✅ FIX
    "Driver's Licence": "Driver's Licence",
    "TIN Card": "TIN Card",
    "Voter ID Card": "Voter ID Card",
    "Passport": "Passport",
  };

  return map[type] || type;
};

if (govIdType === "drivers licence" || govIdType === "drivers license") {
  payload.custom_drivers_license_number = form.id_number;
}

if (govIdType === "tin card") {
  payload.custom_tin_number = form.id_number;
}

if (govIdType === "voter id card") {
  payload.custom_voter_id_number = form.id_number;
}

//   const payload = {
//   customer_name: customerId,
//   customer_type: "Individual",
//   customer_group: "All Customer Groups",
//   territory: "All Territories",

//   custom_full_name: form.full_name,
//   custom_date_of_birth: form.dob,
//   custom_government_id: form.government_id_type, // ✅ IMPORTANT
//   custom_passport_number: form.passport_number,
//   custom_government_document: documentUrl,
// };
const normalizedGovId = normalizeGovId(form.government_id_type);

const payload = {
  customer_name: customerId,
  customer_type: "Individual",
  customer_group: "All Customer Groups",
  territory: "All Territories",

  custom_full_name: form.full_name,
  custom_date_of_birth: form.dob,
  custom_government_id: normalizedGovId, // ✅ FIXED
  custom_passport_number: form.passport_number,
  custom_government_document: documentUrl,
};

// ✅ SINGLE SOURCE OF TRUTH
const idNumber = form.government_id_number;

if (normalizedGovId === "Driver's Licence") {
  payload.custom_drivers_license_number = idNumber;
}

if (normalizedGovId === "TIN Card") {
  payload.custom_tin_number = idNumber;
}

if (normalizedGovId === "Voter ID Card") {
  payload.custom_voter_id_number = idNumber;
}
    console.log("Creating Customer:", payload);
   console.log({
  government_id_type: form.government_id_type,
  government_id_number: form.government_id_number
});

    const res = await fetch(
      "http://192.168.101.182:81/api/resource/Customer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ab5bd602e5f2950:d5f1770a2ce69e2`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Create customer failed:", data);
      throw new Error(data?.message || "Customer creation failed");
    }

    return data.data;
  } catch (err) {
    console.error("Error creating customer:", err);
    throw err;
  }
};



// import { getBaseURL, getHeaders } from "../config/erpConfig";

// // ✅ GET CUSTOMER
// export const getCustomerById = async (idNumber, loginUser) => {
//   if (!idNumber || idNumber.length < 3) return null;

//   try {
//     const res = await fetch(
//       `${getBaseURL(ERP_ENV.PROD)}/api/resource/Customer/${idNumber}`,
//       {
//         method: "GET",
//         headers: getHeaders(loginUser, ERP_ENV.PROD),
//       }
//     );

//     if (!res.ok) {
//       console.log("Customer not found");
//       return null;
//     }

//     const { data } = await res.json();
//     return data;

//   } catch (error) {
//     console.error("Error fetching customer:", error);
//     return null;
//   }
// };

// // ✅ CREATE CUSTOMER
// export const createCustomer = async (form, file, loginUser, uploadFile) => {
//   try {
//     const formatDate = (date) => {
//       const d = new Date(date);
//       return d.toISOString().split("T")[0];
//     };

//     const cleanName = form.full_name.trim().replace(/\s+/g, " ");
//     const customerId = `${cleanName}_${formatDate(form.date_of_birth)}`;

//     let documentUrl = "";

//     if (file) {
//       documentUrl = await uploadFile(file, { isPrivate: 1 });
//     }

//     const payload = {
//       customer_name: customerId,
//       customer_type: "Individual",
//       customer_group: "All Customer Groups",
//       territory: "All Territories",

//       custom_full_name: form.full_name,
//       custom_date_of_birth: form.date_of_birth,
//       custom_government_id: form.government_id,
//       custom_passport_number: form.passport_number,
//       custom_drivers_license_number: form.id_number,
//       custom_government_document: documentUrl,
//     };

//     const res = await fetch(
//       `${getBaseURL(ERP_ENV.DEMO)}/api/resource/Customer`,
//       {
//         method: "POST",
//         headers: getHeaders(loginUser, ERP_ENV.DEMO),
//         body: JSON.stringify(payload),
//       }
//     );

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data?.message || "Customer creation failed");
//     }

//     return data.data;

//   } catch (err) {
//     console.error("Error creating customer:", err);
//     throw err;
//   }
// };