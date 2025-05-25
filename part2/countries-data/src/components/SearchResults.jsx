import React, { useState } from "react";
import Country from "./Country";

const SearchResults = ({ matches }) => {
  const [shownCountries, setShownCountries] = useState({});

  const showCountryInfo = (cca2) => {
    setShownCountries({
      ...shownCountries,
      [cca2]: !shownCountries[cca2],
    });
  };

  if (!matches) return <p>Please, start typing.</p>;
  if (matches.length > 10)
    return <p>Too many matches, specify another filter</p>;
  if (matches.length === 0) return <p>No mathces found</p>;
  if (matches.length === 1) {
    const country = matches[0];
    return <Country country={country} />;
  }

  return (
    <ul>
      {matches.map((match) => (
        <li key={match.cca2}>
          {match.name.official}{" "}
          <button onClick={() => showCountryInfo(match.cca2)}>
            {shownCountries[match.cca2] ? "hide" : "show"}
          </button>
          {shownCountries[match.cca2] ? <Country country={match} /> : null}
        </li>
      ))}
    </ul>
  );
};

export default SearchResults;
