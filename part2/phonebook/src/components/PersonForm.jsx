import React from "react";

const PersonForm = ({ handleChange, handleSubmit, newName, newNumber }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        Name:{" "}
        <input onChange={handleChange} value={newName} name="name" required />
      </div>
      <div>
        Number:{" "}
        <input
          onChange={handleChange}
          value={newNumber}
          name="number"
          required
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
