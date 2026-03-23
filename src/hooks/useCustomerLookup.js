import { useState } from "react";

export const useCustomerLookup = (setValue) => {
  const [loading, setLoading] = useState(false);

  const fetchCustomer = async (idNumber) => {
    if (!idNumber || idNumber.length < 3) return;

    try {
      setLoading(true);

      const res = await fetch(
        `http://192.168.101.182:81/api/resource/Customer/${idNumber}`,
        {
          headers: {
            Authorization:
              "token 661457e17b8612a:32a5ddcc5a9c177",
          },
        }
      );

      if (!res.ok) return;

      const { data } = await res.json();

      setValue("firstName", data.custom_first_name || "");
      setValue("lastName", data.custom_last_name || "");
      setValue("country", data.custom_country || "");
      setValue("city", data.custom_city || "");

      if (data.image) {
        const url = data.image.startsWith("http")
          ? data.image
          : `http://192.168.101.182:81${data.image}`;

        setValue("docFile", url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { fetchCustomer, loading };
};