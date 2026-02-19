import { useState } from "react";
import { currencies } from "../../data/currencies.js";

export default function CurrencyDropdown({ selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="currency-dropdown">
      {/* Selected Currency */}
      <div
        className="currency-selected"
        onClick={() => setOpen(!open)}
      >
        <img src={selected.flag} alt={selected.code} />
        <span>{selected.code} - {selected.name}</span>
        <span className="arrow">▾</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="currency-menu">
          <input
            type="text"
            placeholder="Search currency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="currency-search"
          />

          <div className="currency-list">
            {filtered.map((currency) => (
              <div
                key={currency.code}
                className="currency-item"
                onClick={() => {
                  onSelect(currency);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <img src={currency.flag} alt={currency.code} />
                <span>{currency.code} {currency.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
