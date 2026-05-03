import { useEffect, useState, useRef } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef();
  const containerRef = useRef();

  // 🔹 Debounce
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const t = setTimeout(() => fetchCities(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  const fetchCities = async (q) => {
    setLoading(true);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}`
      );

      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }

    setLoading(false);
    setActiveIndex(-1);
  };

  // 🔹 Close on outside click (FIX)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Country flag emoji
  const getFlag = (country) =>
    country
      .toUpperCase()
      .replace(/./g, (c) =>
        String.fromCodePoint(127397 + c.charCodeAt())
      );

  // 🔹 Highlight match
  const highlight = (text) => {
    const i = text.toLowerCase().indexOf(query.toLowerCase());
    if (i === -1) return text;

    return (
      <>
        {text.slice(0, i)}
        <span className="text-indigo-500 font-semibold">
          {text.slice(i, i + query.length)}
        </span>
        {text.slice(i + query.length)}
      </>
    );
  };

  const handleSelect = (city) => {
    const name = `${city.name}, ${city.country}`;

    onSelect(city.name);

    const updated = [name, ...history.filter((h) => h !== name)].slice(0, 5);
    setHistory(updated);
    localStorage.setItem("history", JSON.stringify(updated));

    setShow(false);
    setQuery("");
  };

  // 🔹 Keyboard navigation
  const handleKeyDown = (e) => {
    if (!show) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      handleSelect(suggestions[activeIndex]);
    }

    if (e.key === "Escape") {
      setShow(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">

      {/* INPUT */}
      <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-transparent dark:border-gray-700 rounded-full shadow-md px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-400">

        <Search size={18} className="text-gray-500 dark:text-gray-400" />

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShow(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search city..."
          className="flex-1 px-2 bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />

        {query && (
          <X
            size={16}
            className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            onClick={() => setQuery("")}
          />
        )}
      </div>

      {/* DROPDOWN */}
      {show && (
        <div className="absolute w-full mt-2 bg-white/90 dark:bg-gray-800/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto">

          {/* Loading */}
          {loading && (
            <p className="p-3 text-sm text-gray-500 dark:text-gray-400">
              Searching...
            </p>
          )}

          {/* Suggestions */}
          {suggestions.map((city, i) => (
            <div
              key={i}
              onClick={() => handleSelect(city)}
              className={`px-4 py-2 cursor-pointer text-sm flex items-center gap-2 transition
                ${i === activeIndex
                  ? "bg-indigo-100 dark:bg-indigo-600/30"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700/70"
                }`}
            >
              <span>{getFlag(city.country)}</span>
              <span className="text-gray-800 dark:text-gray-100">
                {highlight(city.name)}, {city.country}
              </span>
            </div>
          ))}

          {/* History */}
          {!query && history.length > 0 && (
            <>
              <p className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 uppercase">
                Recent
              </p>

              {history.map((h, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onSelect(h.split(",")[0]);
                    setShow(false);
                  }}
                  className="px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-gray-700/70"
                >
                  {h}
                </div>
              ))}
            </>
          )}

          {/* Empty */}
          {!loading && query && suggestions.length === 0 && (
            <p className="p-3 text-sm text-gray-500 dark:text-gray-400">
              No results found
            </p>
          )}
        </div>
      )}
    </div>
  );
}