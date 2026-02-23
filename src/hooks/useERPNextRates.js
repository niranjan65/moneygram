import { useState, useEffect } from 'react';

export function useERPNextRates() {
  const [rates, setRates] = useState({});
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rateDate, setRateDate] = useState(null);
  const [noDataForToday, setNoDataForToday] = useState(false);

  useEffect(() => {
    async function fetchRates() {
      try {
        setLoading(true);
        setError(null);
        setNoDataForToday(false);

        const today = new Date().toISOString().split("T")[0];

        const response = await fetch(
          "http://192.168.101.182:81/api/method/moneygram.api.get_currency_exchange_rate",
          {
            method: "POST", // ERPNext whitelisted methods require POST
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // IMPORTANT if using session login
            body: JSON.stringify({
              today_date: today,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates");
        }

        const data = await response.json();

        // ERPNext returns response inside `message`
        const result = data.message;

        if (!result || !result.name) {
          setNoDataForToday(true);
          setRates({});
          setAvailableCurrencies([]);
          return;
        }

        setRateDate(result.date);

        const rows = result.table_luxr ?? [];

        const ratesMap = {};
        const currencyList = [];

        for (const row of rows) {
          const code = row.currency_name;
          const sellingRate = parseFloat(row.selling_price);
          const buyingRate = parseFloat(row.buying_price);

          if (code && !isNaN(sellingRate) && sellingRate > 0) {
            ratesMap[code] = sellingRate;
            currencyList.push({
              code,
              sellingRate,
              buyingRate: !isNaN(buyingRate) ? buyingRate : null,
            });
          }
        }

        setRates(ratesMap);
        setAvailableCurrencies(
          currencyList.sort((a, b) => a.code.localeCompare(b.code))
        );
      } catch (err) {
        console.error("[useERPNextRates]", err);
        setError(err.message ?? "Failed to load exchange rates");
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
  }, []);

  return {
    rates,
    availableCurrencies,
    loading,
    error,
    rateDate,
    noDataForToday,
  };
}