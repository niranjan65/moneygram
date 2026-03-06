export const getGSTRate = async () => {
  try {
    const response = await fetch(
      "http://192.168.101.182:81/api/method/moneygram.api.get_tax_template_for_company",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: "MH Money Express",
        }),
      }
    );

    const result = await response.json();

    const taxRate =
      result?.message?.taxes?.[0]?.tax_rate ?? 0;

    return Number(taxRate);

  } catch (error) {
    console.error("GST fetch error:", error);
    return 0;
  }
};