import { useState, useEffect } from "react";

export function useDenomination(country) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!country) return;

    async function fetchDenomination() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "http://182.71.135.110:82/api/method/moneygram.moneygram.api.get_denomination.get_denomination",
          {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
              "Authorization": "token 661457e17b8612a:32a5ddcc5a9c177"
            },
            credentials: "include",
            body: JSON.stringify({ country }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch denomination");
        }

        const result = await response.json();

        const countryData = result?.message?.[country];

        if (!countryData) {
          setData(null);
          return;
        }

        // 🔥 Transform API response to match your UI format
        const transformDenomination = (arr = []) =>
          arr.map((item) => {
            if (item.includes("c")) {
              return parseFloat(item.replace("c", "")) / 100;
            }
            return parseFloat(item.replace("$", ""));
          }).sort((a, b) => b - a);

        setData({
          currency: countryData.currency,
          symbol: countryData.symbol,
          flag: countryData.flag || "",
          notes: transformDenomination(countryData.notes),
          coins: transformDenomination(countryData.coins),
          notes_name: countryData.notes_name,
          coins_name: countryData.coins_name,
          pickupNote: countryData.pickupNote,
        });

      } catch (err) {
        console.error("[useDenomination]", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDenomination();
  }, [country]);

  return { data, loading, error };
}