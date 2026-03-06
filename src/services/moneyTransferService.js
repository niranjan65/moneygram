export const createMoneyTransfer = async (payload) => {
  try {
    const response = await fetch(
      "http://192.168.101.182:81/api/method/moneygram.moneygram.api.money_exchange.create_money_transfer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Transfer failed");
    }

    return result;

  } catch (error) {
    console.error("Create Transfer Error:", error);
    throw error;
  }
};