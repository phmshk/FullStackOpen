import React from "react";

const Filter = ({ handleChange, searchText }) => {
  return (
    <div>
      Filter contacts:{" "}
      <input onChange={handleChange} value={searchText} name="search" />
    </div>
  );
};

export default Filter;
