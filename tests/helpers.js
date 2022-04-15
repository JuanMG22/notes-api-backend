const supertest = require('supertest')
const { app } = require('../index')
const User = require('../models/User')

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

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

const getNewUser = () => {
  return {
    email: 'user@gmail.com',
    name: 'Juan',
    password: '12342'
  }
}

const getTakenUser = () => {
  return {
    email: 'juan@gmail.com',
    name: 'Juan',
    password: '12342'
  }
}

module.exports = {
  initialNotes,
  api,
  getAllContentFromNotes,
  getUsers,
  getNewUser,
  getTakenUser
}
