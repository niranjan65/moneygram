// services/exchangeRateService.js

export const getExchangeRates = async () => {
  try {
    const response = await fetch(
      "http://182.71.135.110:82/api/method/moneygram.api.get_currency_exchange_rate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          today_date: new Date().toISOString().split("T")[0],
        }),
      }
    );

    const result = await response.json();

    console.log("ERP Response:", result);

    return result?.message?.table_luxr || [];

  } catch (error) {
    console.error("Exchange Rate API Error:", error);
    throw error;
  }
};