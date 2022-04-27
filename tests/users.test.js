const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { server } = require('../index')
const User = require('../models/User')
const { api, getUsers, getNewUser, getTakenUser } = require('./helpers')

describe('CREATE a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({
      name: 'Juan', email: 'juan@gmail.com', passwordHash
    })

    await user.save()
  })

  test('Works as expected creating a user with a fresh email', async () => {
    const usersAtStart = await getUsers()

    const newUser = getNewUser()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const emails = usersAtEnd.map(e => e.email)
    expect(emails).toContain(newUser.email)
  })

  test('Creation fails with proper statuscode and message if email is already taken', async () => {
    const usersAtStart = await getUsers()

    const newUser = getTakenUser()

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const { error } = result.body
    expect(error).toContain('user already exists')

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})
