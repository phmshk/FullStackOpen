import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import phonebookServie from "./services/contacts";
import Button from "./components/Button";
import genUid from "light-uid";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchText, setSearchText] = useState("");
  const [notification, setNotification] = useState({ text: "", type: null });

  useEffect(() => {
    phonebookServie.getAll().then((data) => setPersons(data));
  }, []);

  const handleChange = (e) => {
    switch (e.target.name) {
      case "name":
        setNewName(e.target.value);
        break;
      case "number":
        setNewNumber(e.target.value);
        break;
      case "search":
        setSearchText(e.target.value);
        break;
      default:
        return;
    }
  };

  const showNotification = (text, type) => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification({ text: "", type: null });
    }, 5000);
  };

  const handleClick = (id) => {
    if (window.confirm(`Delete ${persons.find((p) => p.id === id).name}?`)) {
      phonebookServie.deleteItem(id);
      setPersons(persons.filter((person) => person.id !== id));
      const notificationText = `${
        persons.find((p) => p.id === id).name
      } was successfully removed from the contact list`;
      showNotification(notificationText, "success");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const containsName = (name) => {
      return persons.reduce(
        (acc, curr) =>
          (acc =
            acc || curr.name.toLocaleLowerCase() === name.toLocaleLowerCase()),
        false
      );
    };

    if (containsName(newName)) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        const existingContact = persons.find(
          (person) =>
            person.name.toLocaleLowerCase() === newName.toLocaleLowerCase()
        );

        phonebookServie
          .update(existingContact.id, {
            ...existingContact,
            number: newNumber,
          })
          .then((res) => {
            setPersons(
              persons.map((person) => (person.id === res.id ? res : person))
            );
            const notificationText = "Old number was successfuly replaced.";
            showNotification(notificationText, "success");
          })
          .catch(() => {
            const notificationText = `Information of ${newName} has already been removed from server.`;
            showNotification(notificationText, "error");
            setPersons(
              persons.filter(
                (person) =>
                  person.name.toLocaleLowerCase() !==
                  newName.toLocaleLowerCase()
              )
            );
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
        id: genUid(8),
      };
      const newPersons = persons.concat(newPerson);
      setPersons(newPersons);
      phonebookServie.create(newPerson);
      const notificationText = `Added ${newPerson.name}`;
      showNotification(notificationText, "success");
    }
    setNewName("");
    setNewNumber("");
  };

  const showAll = (arr) => {
    return arr.map((person) => (
      <div key={person.id}>
        <p>
          {person.name} {person.number}{" "}
          <Button handleClick={() => handleClick(person.id)} text="delete" />
        </p>
      </div>
    ));
  };

  const filterAll = () => {
    const clearedSearch = searchText.toLocaleLowerCase().trim();

    const filteredPersons = clearedSearch
      ? persons.filter((person) =>
          //According to the screenshot from the task, search has to be implemented only by part of the first or last name
          //In case if search by name/surname was needed, following code could have been used:

          //Filtering by first name:
          // const substring = person.name
          //   .toLocaleLowerCase()
          //   .slice(0, searchText.length);
          // return substring === searchText.toLocaleLowerCase();

          //Filtering by last name:
          // const substring = person.name
          //   .toLocaleLowerCase()
          //   .split(" ")[1]
          //   .slice(0, searchText.length);

          person.name.toLocaleLowerCase().includes(clearedSearch)
        )
      : persons;

    return showAll(filteredPersons);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter handleChange={handleChange} searchText={searchText} />

      <h2>Add new Contact</h2>
      <PersonForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        newName={newName}
        newNumber={newNumber}
      />

      <h2>Numbers</h2>
      {persons.length > 0 ? <Persons list={filterAll} /> : null}
    </div>
  );
};

export default App;
