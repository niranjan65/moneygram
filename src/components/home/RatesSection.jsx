
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

const SPREAD_PERCENT = 0.5; // 0.5% margin


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
  <section className="bg-background-light dark:bg-background-dark py-16 px-6 transition-colors">
    <div className="max-w-6xl mx-auto">

      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Live Exchange Rates
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Real-time mid-market currency rates
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div className="flex items-center gap-3">
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
    Base Currency:
  </label>

          <select
    value={baseCurrency}
    onChange={(e) => setBaseCurrency(e.target.value)}
    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10
      bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm
      focus:outline-none focus:ring-2 focus:ring-primary"
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
  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10
    bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm
    focus:outline-none focus:ring-2 focus:ring-primary md:w-64"
/>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading rates...
        </p>
      )}

      {/* Table */}
      {/* Table */}
{!loading && (
  <div className="overflow-x-auto bg-white dark:bg-background-dark rounded-2xl shadow-lg border border-gray-100 dark:border-white/10">

    <table className="w-full text-sm">
      <thead className="bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300">
        <tr>
          <th className="text-left px-6 py-4">Currency</th>
          <th className="text-left px-6 py-4">Mid</th>
          <th className="text-left px-6 py-4">Buy</th>
          <th className="text-left px-6 py-4">Sell</th>
          <th className="text-left px-6 py-4">Spread</th>
          <th className="text-left px-6 py-4">Trend</th>
          <th className="text-left px-6 py-4">Chart</th>
          <th className="text-left px-6 py-4">Suggestion</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100 dark:divide-white/5">
        {filteredCurrencies.map((cur) => {
          const midRate = rates[cur];
          const previousMid = previousRates[cur];

          const buyRate =
            midRate ? midRate * (1 - SPREAD_PERCENT / 100) : null;

          const sellRate =
            midRate ? midRate * (1 + SPREAD_PERCENT / 100) : null;

          const spread =
            midRate ? (sellRate - buyRate).toFixed(4) : null;

          // Trend logic
          let change = null;
          if (previousMid && midRate) {
            if (midRate > previousMid) change = "up";
            else if (midRate < previousMid) change = "down";
            else change = "same";
          }

          // Profit suggestion logic
          let profitSignal = "-";
          if (previousMid && midRate) {
            if (midRate > previousMid) {
              profitSignal = "Sell Today 📈";
            } else if (midRate < previousMid) {
              profitSignal = "Buy Today 📉";
            } else {
              profitSignal = "Stable";
            }
          }

          return (
            <tr
              key={cur}
              className="hover:bg-gray-50 dark:hover:bg-white/5 transition"
            >
              {/* Currency */}
              <td className="px-6 py-4 flex items-center gap-3">
                <img
                  src={`https://flagcdn.com/w40/${currencyFlags[cur]}.png`}
                  alt={cur}
                  className="w-6 h-4 object-cover rounded-sm"
                />
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {cur}
                </span>
              </td>

              {/* Mid */}
              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                {midRate?.toFixed(4)}
              </td>

              {/* Buy */}
              <td className="px-6 py-4 text-red-500 font-medium">
                {buyRate?.toFixed(4)}
              </td>

              {/* Sell */}
              <td className="px-6 py-4 text-green-500 font-medium">
                {sellRate?.toFixed(4)}
              </td>

              {/* Spread */}
              <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                {spread}
              </td>

              {/* Trend */}
              <td className="px-6 py-4">
                {change === "up" && (
                  <span className="text-green-500 font-semibold">▲</span>
                )}
                {change === "down" && (
                  <span className="text-red-500 font-semibold">▼</span>
                )}
                {change === "same" && (
                  <span className="text-gray-400">–</span>
                )}
              </td>

              {/* Chart */}
              <td className="px-6 py-4">
                {history[cur] && (
                  <Sparklines data={history[cur]} width={100} height={30}>
                    <SparklinesLine />
                  </Sparklines>
                )}
              </td>

              {/* Suggestion */}
              <td className="px-6 py-4 font-medium">
                {profitSignal === "Sell Today 📈" && (
                  <span className="text-green-500">{profitSignal}</span>
                )}
                {profitSignal === "Buy Today 📉" && (
                  <span className="text-red-500">{profitSignal}</span>
                )}
                {profitSignal === "Stable" && (
                  <span className="text-gray-400">{profitSignal}</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
)}


      {/* Last Updated */}
      {!loading && lastUpdated && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center">
          Last updated at {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  </section>
);

}
