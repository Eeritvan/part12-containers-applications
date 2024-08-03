import axios from 'axios'
let baseUrl

if (window.location.hostname === 'localhost') {
    const PORT = 8080
    baseUrl = `http://localhost:${PORT}/api/persons`
} else {
    baseUrl = `${window.location.origin}/api/persons`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const add = newPerson => axios
                           .post(baseUrl, newPerson).then(x => x.data.id)
                           .catch(error => {throw error.response.data.error})

const deletePerson = id => axios.delete(`${baseUrl}/${id}`)

const uploadUpdate = updated => axios
                                  .put(`${baseUrl}/${updated.id}`, updated)
                                  .catch(error => {throw error.response.data.error})

export default { getAll, add, deletePerson, uploadUpdate }