// import { useEffect, useState } from "react";

// export default function RatesSection() {
//   const [rates, setRates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const baseCurrency = "USD";
//   const currenciesToShow = ["EUR", "INR", "GBP", "JPY", "AUD", "CAD"];

//   useEffect(() => {
//     const fetchRates = async () => {
//       try {
//         setLoading(true);

//         const response = await fetch(
//           `https://open.er-api.com/v6/latest/${baseCurrency}`
//         );

//         const data = await response.json();

//         if (data.result !== "success") {
//           throw new Error("API Error");
//         }

//         const formattedRates = currenciesToShow.map((currency) => ({
//           currency,
//           rate: data.rates[currency],
//         }));

//         setRates(formattedRates);
//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch exchange rates.");
//         setLoading(false);
//       }
//     };

//     fetchRates();
//   }, []);

//   return (
//     <section className="section rates-section">
//       <div className="container">
//         <h2>Live Exchange Rates</h2>

//         {loading && <p>Loading live rates...</p>}
//         {error && <p>{error}</p>}

//         {!loading && !error && (
//           <div className="rates-table-wrapper">
//             <table className="rates-table">
//               <thead>
//                 <tr>
//                   <th>Currency</th>
//                   <th>1 {baseCurrency} equals</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {rates.map((item) => (
//                   <tr key={item.currency}>
//                     <td>{item.currency}</td>
//                     <td>{item.rate.toFixed(4)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
import { useEffect, useState, useRef } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";

const currencyFlags = {
  USD: "us",
  EUR: "eu",
  INR: "in",
  GBP: "gb",
  JPY: "jp",
  AUD: "au",
  CAD: "ca",
  CNY: "cn",
  CHF: "ch",
};

export default function RatesSection() {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [rates, setRates] = useState({});
  const [previousRates, setPreviousRates] = useState({});
  const [history, setHistory] = useState({});
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  const currenciesToShow = Object.keys(currencyFlags);
  const intervalRef = useRef(null);

  const fetchRates = async () => {
    try {
      const response = await fetch(
        `https://open.er-api.com/v6/latest/${baseCurrency}`
      );
      const data = await response.json();

      if (data.result !== "success") return;

      setPreviousRates(rates);
      setRates(data.rates);
      setLastUpdated(new Date());
      setLoading(false);

      // Update sparkline history
      setHistory((prev) => {
        const updated = { ...prev };
        currenciesToShow.forEach((cur) => {
          const value = data.rates[cur];
          if (!updated[cur]) updated[cur] = [];
          updated[cur] = [...updated[cur].slice(-9), value];
        });
        return updated;
      });
    } catch (err) {
      console.error("Error fetching rates:", err);
    }
  };

  useEffect(() => {
    fetchRates();

    intervalRef.current = setInterval(fetchRates, 60000);

    return () => clearInterval(intervalRef.current);
  }, [baseCurrency]);

  const filteredCurrencies = currenciesToShow.filter((cur) =>
    cur.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="section rates-section">
      <div className="container">
        <h2>Live Exchange Rates</h2>

        {/* Base Currency Selector */}
        <div className="rates-controls">
          <div>
            <label>Base Currency: </label>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
            >
              {currenciesToShow.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search currency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <p>Loading rates...</p>}

        {!loading && (
          <>
            <table className="rates-table">
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>Rate</th>
                  <th>Trend</th>
                  <th>Chart</th>
                </tr>
              </thead>
              <tbody>
                {filteredCurrencies.map((cur) => {
                  const rate = rates[cur];
                  const previous = previousRates[cur];

                  const change =
                    previous && rate
                      ? rate > previous
                        ? "up"
                        : rate < previous
                        ? "down"
                        : "same"
                      : null;

                  return (
                    <tr key={cur}>
                      <td>
                        <img
                          src={`https://flagcdn.com/w40/${currencyFlags[cur]}.png`}
                          alt={cur}
                          style={{ marginRight: "8px", width: "24px" }}
                        />
                        {cur}
                      </td>

                      <td>{rate?.toFixed(4)}</td>

                      <td>
                        {change === "up" && (
                          <span style={{ color: "green" }}>▲</span>
                        )}
                        {change === "down" && (
                          <span style={{ color: "red" }}>▼</span>
                        )}
                        {change === "same" && <span>–</span>}
                      </td>

                      <td>
                        {history[cur] && (
                          <Sparklines data={history[cur]} width={100} height={30}>
                            <SparklinesLine />
                          </Sparklines>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Last Updated */}
            <p style={{ marginTop: "20px", fontSize: "14px" }}>
              Last updated at:{" "}
              {lastUpdated &&
                lastUpdated.toLocaleTimeString()}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
