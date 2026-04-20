//createMoneyTransfer.js
import { getBaseURL, getHeaders, ERP_ENV } from "../config/erpConfig";

// 👉 Always use DEMO for Money Transfer (as per your setup)
const MONEY_TRANSFER_ENV = ERP_ENV.DEMO;

export const createMoneyTransfer = async (
  form,
  customerId,
  loginUser,
  documentUrl
) => {
  try {
    const baseURL = getBaseURL(MONEY_TRANSFER_ENV);
    const headers = getHeaders(loginUser, MONEY_TRANSFER_ENV);

   const payload = {
  doctype: "Money Transfer",

  customer_id: customerId,
  full_name: form.full_name,
  dob: form.dob,

  document_type: form.document_type,
  passport_number: form.passport_number,

  government_id_type: form.government_id_type,
  government_id_number: form.government_id_number,

  document_upload: documentUrl || form.document_upload,
  transaction_id: form.transaction_id,

  sending_amount: form.sending_amount,
  transfer_fee: form.transfer_fee,
  total_amount: form.total_amount,
};

  

    console.log("Creating Money Transfer:", payload);

    const res = await fetch(
      `${baseURL}/api/resource/Money Transfer`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Creation failed");
    }

    return data.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};