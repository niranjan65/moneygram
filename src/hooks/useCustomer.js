import { useState, useEffect } from "react";

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "http://182.71.135.110:82/api/resource/Customer?fields=[\"name\",\"customer_name\",\"customer_group\",\"territory\"]&limit_page_length=500",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "token 661457e17b8612a:32a5ddcc5a9c177"
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }

        const data = await response.json();

        setCustomers(data.data || []);
      } catch (err) {
        console.error("[useERPNextCustomers]", err);
        setError(err.message ?? "Failed to load customers");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  return { customers, loading, error };
}