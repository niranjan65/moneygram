import { useState, useEffect } from "react";

export function useCountries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCountries() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "http://192.168.101.182:81/api/resource/Country?fields=[\"name\",\"country_name\",\"code\"]&limit_page_length=300",
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
          throw new Error("Failed to fetch countries");
        }

        const data = await response.json();

        setCountries(data.data || []);
      } catch (err) {
        console.error("[useERPNextCountries]", err);
        setError(err.message ?? "Failed to load countries");
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, []);

  return { countries, loading, error };
}