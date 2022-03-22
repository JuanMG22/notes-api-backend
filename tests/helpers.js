const supertest = require('supertest')
const { app } = require('../index')

const api = supertest(app)

const initialNotes = [
  {
    content: 'Aprendiendo FullStack Js con Midu',
    important: true,
    date: new Date()
  },
  {
    content: 'Nota numero dos',
    important: true,
    date: new Date()
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response
  }
}

module.exports = { initialNotes, api, getAllContentFromNotes }
