import { useState, useEffect } from 'react'
import interactions from './services/interactions'
import './index.css'

const Notification = ({message, color}) => {
    if (!message) { return null }
    return (
        <div className={color}>
            {message}
        </div>
    )
}

const Filter = ({newFilter, handleNewFilter}) => (
  <div>
    filter shown with <input value={newFilter} onChange={handleNewFilter}/>
  </div>
)

const PersonForm = ({addPerson, newName, handleNewValue, newNumber, handleNewNumber}) => (
  <form onSubmit={addPerson}>
    <div> name: <input value={newName} onChange={handleNewValue} /> </div>
    <div> number: <input value={newNumber} onChange={handleNewNumber} /></div>
    <div> <button type="submit"> add </button> </div>
  </form>
)

const Persons = ({personsToShow, deleteperson}) => (
  <div>
    {personsToShow().map(x => <DisplayPersons key={x.id} id={x.id} name={x.name} number={x.number} deleteperson={deleteperson} />)}
  </div>
)

const DisplayPersons = ({id, name, number, deleteperson}) => (
  <div>
    {name} {number}
    <button onClick={() => deleteperson(id, name)}> delete </button>
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState([])

  const handleNewValue = event => setNewName(event.target.value)
  const handleNewNumber = event => setNewNumber(event.target.value)
  const handleNewFilter = event => setNewFilter(event.target.value)

  const namelist = persons.map(x => x.name)

  useEffect(() => {
    interactions
      .getAll()
      .then(response => { setPersons(response) })
  }, [])

  const setNotification = (message, color) => {
    setErrorMessage([message, color])
    setTimeout(() => { setErrorMessage([])}, 5000)
  }

  const addPerson = event => {
    event.preventDefault()
  
    interactions.getAll().then(() => {
      const newPerson = {
        name: newName,
        number: newNumber
      }
    
      if (namelist.includes(newName)) {
        updatePerson()
        return
      }
  
      interactions.add(newPerson)
        .then(x => {
          newPerson.id = x
          setNotification(`added ${newName}`, 'green')
          setPersons(persons.concat(newPerson))
          setNewName("")
          setNewNumber("")
        })
        .catch(error => {
            setNotification(error, 'red')
        })
      })
    }

  const updatePerson = () => {
    if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const og = persons.find(x => x.name === newName)
      const updated = {...og, number: newNumber}
      interactions
        .uploadUpdate(updated)
        .then(() =>
          setPersons(persons.map(person => person.name === newName ? updated : person)),
          setNewName(''),
          setNewNumber(''))
          .catch(error => {
              if (!error) {
                  setNotification(`The following user was already deleted from the server: ${newName}`, 'red')
              } else {
                  setNotification(error, 'red')
              }
              return
           })

      setNotification(`Updated ${newName}`, 'green')
    }
  }

  const deletePerson = (id, name) => {
    if (confirm(`"Delete" ${name} ?`)) {
      interactions
        .deletePerson(id)
        setPersons(persons.filter(x => x.id !== id))
        setNotification(`Deleted ${name}`, 'red')
    }
  }

  const personsToShow = () => (
    persons.filter(x => x.name.toLowerCase().includes(newFilter.toLowerCase()))
  )


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage[0]} color={errorMessage[1]} />
      <Filter newfilter={newFilter} handleNewFilter={handleNewFilter} />
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson}
                  newName={newName}
                  handleNewValue={handleNewValue}
                  newNumber={newNumber}
                  handleNewNumber={handleNewNumber}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deleteperson={deletePerson} />
    </div>
  )
}

export default App