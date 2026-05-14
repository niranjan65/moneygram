
// customer.js
import { getBaseURL, getHeaders, ERP_ENV } from "../config/erpConfig";

// Always use DEMO server URL, but authenticate using loginUser.api_key and loginUser.api_secret
const BASE_URL = getBaseURL(ERP_ENV.DEMO);

/**
 * Fetch Customer by ID
 */
export const getCustomerById = async (idNumber, loginUser) => {
  if (!idNumber || idNumber.length < 3) return null;

  try {
    const res = await fetch(
      `${BASE_URL}/api/resource/Customer/${encodeURIComponent(idNumber)}`,
      {
        method: "GET",
        headers: getHeaders(loginUser, ERP_ENV.PROD), // Uses loginUser.api_key/api_secret
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        console.log("Customer not found");
        return null;
      }

      const errorData = await res.json().catch(() => ({}));
      console.error("Error fetching customer:", errorData);
      return null;
    }

    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
};

/**
 * Create Customer
 */
export const createCustomer = async (form, documentUrl, loginUser) => {
  try {
    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().split("T")[0];
    };

    const normalizeGovId = (type) => {
      if (!type) return "";

      const map = {
        
        "Driver's Licence": "Driver's Licence",
        "TIN Card": "TIN Card",
        "Voter ID Card": "Voter ID Card",
        Passport: "Passport",
      };

      return map[type] || type;
    };

    // Generate Customer ID
    const cleanName = form.full_name.trim().replace(/\s+/g, " ");
    const customerId = `${cleanName}_${formatDate(form.dob)}`;

    // Normalize Government ID type
    const normalizedGovId = normalizeGovId(form.government_id_type);

    // Base payload
    const payload = {
      customer_name: customerId,
      customer_type: "Individual",
      customer_group: "All Customer Groups",
      territory: "All Territories",

      custom_full_name: form.full_name,
      custom_date_of_birth: form.dob,
      custom_government_id: normalizedGovId,
      custom_passport_number: form.passport_number,
      custom_government_document: documentUrl,
    };

    // Government ID Number Mapping
    const idNumber = form.government_id_number;

    if (normalizedGovId === "Driver's Licence") {
      payload.custom_drivers_licence_number = idNumber;
    }

    if (normalizedGovId === "TIN Card") {
      payload.custom_tin_number = idNumber;
    }

    if (normalizedGovId === "Voter ID Card") {
      payload.custom_voter_id_number = idNumber;
    }

    console.log("Creating Customer:", payload);
    console.log("Using loginUser credentials:", {
      api_key: loginUser?.api_key,
      api_secret: loginUser?.api_secret,
    });

    const res = await fetch(`${BASE_URL}/api/resource/Customer`, {
      method: "POST",
      headers: getHeaders(loginUser, ERP_ENV.PROD), 
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Create customer failed:", data);
      throw new Error(
        data?.exception ||
          data?.message ||
          data?._server_messages ||
          "Customer creation failed"
      );
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