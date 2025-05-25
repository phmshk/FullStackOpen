import React from "react";

const CountrySearch = ({ countryName, handleCountryChange, disabled }) => {
  return (
    <label>
      Find country:{" "}
      <input
        disabled={disabled}
        type="text"
        placeholder="Enter the name of country"
        value={countryName}
        onChange={handleCountryChange}
      />
    </label>
  );
};

export default CountrySearch;
