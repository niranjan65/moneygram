import { useState, useEffect } from "react";
import CurrencyDropdown from "./CurrencyDropdown";
import { currencies } from "../../data/currencies";

export default function Hero() {
  const [activeTab, setActiveTab] = useState("convert");
  const [amount, setAmount] = useState(1);
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);

  const [fromCurrency, setFromCurrency] = useState(currencies[0]);
  const [toCurrency, setToCurrency] = useState(currencies[1]);

  // Fetch exchange rate
  useEffect(() => {
    const fetchRate = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://open.er-api.com/v6/latest/${fromCurrency.code}`
        );

        const data = await response.json();

        if (data.result === "success") {
          setRate(data.rates[toCurrency.code]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching rate:", error);
        setLoading(false);
      }
    };

    fetchRate();
  }, [fromCurrency, toCurrency]);

  const convertedAmount =
    rate && amount ? (amount * rate).toFixed(2) : "";

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <section className="hero-dark">
      <div className="container hero-content">
  <h1>Global Currency Exchange & International Money Transfers</h1>
  <p>
    Convert currencies at live market rates and send money worldwide 
    with secure transactions, low fees, and complete transparency.
  </p>
</div>


      <div className="hero-card container">

        {/* TABS */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "convert" ? "active" : ""}`}
            onClick={() => setActiveTab("convert")}
          >
            Convert
          </button>

          <button
            className={`tab ${activeTab === "send" ? "active" : ""}`}
            onClick={() => setActiveTab("send")}
          >
            Send
          </button>

          
        </div>

        {activeTab === "convert" && (
          <>
            <div className="convert-wrapper">

              {/* FROM */}
              <div className="convert-box">
                <span className="convert-label">From</span>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="amount-input"
                />

                <CurrencyDropdown
                  selected={fromCurrency}
                  onSelect={setFromCurrency}
                />
              </div>

              {/* SWAP BUTTON */}
              <div className="swap-btn" onClick={handleSwap}>
                ⇄
              </div>

              {/* TO */}
              <div className="convert-box">
                <span className="convert-label">To</span>

                <input
                  type="number"
                  value={loading ? "..." : convertedAmount}
                  readOnly
                  className="amount-input"
                />

                <CurrencyDropdown
                  selected={toCurrency}
                  onSelect={setToCurrency}
                />
              </div>
            </div>

            {/* RATE INFO */}
            <div className="rate-info">
              {rate && (
                <>
                  <h3>
                    1.00 {fromCurrency.code} = {rate.toFixed(6)}{" "}
                    {toCurrency.code}
                  </h3>
                  <p>
                    Mid-market rate • Updated just now
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
