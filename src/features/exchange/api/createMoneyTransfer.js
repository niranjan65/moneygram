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
  ...form,
  customer_id: customerId,
  document_upload: documentUrl || form.document_upload,
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