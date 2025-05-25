import { useEffect, useState } from "react";
import CountrySearch from "./components/CountrySearch";
import countrySearchService from "./services/countrySearchService";
import SearchResults from "./components/SearchResults";

function App() {
  const [countriesList, setCountriesList] = useState(null);
  const [countryNameSearch, setCountryNameSearch] = useState("");

  const handleCountryChange = (e) => {
    setCountryNameSearch(e.target.value);
  };

  const matchingCountries = countryNameSearch
    ? countriesList.filter(
        (country) =>
          country.name.common.toLowerCase().includes(countryNameSearch) ||
          country.name.official.toLowerCase().includes(countryNameSearch)
      )
    : null;

  useEffect(() => {
    countrySearchService
      .getAll()
      .then((data) => setCountriesList(data))
      .catch((e) => alert(`An error occured: ${e.message}`));
  }, []);

  return (
    <div>
      <div>
        <CountrySearch
          countryName={countryNameSearch}
          handleCountryChange={handleCountryChange}
          disabled={!countriesList}
        />
        <SearchResults matches={matchingCountries} />
      </div>
    </div>
  );
}

export default App;
