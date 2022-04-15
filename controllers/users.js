const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body

  const saltRounds = 10

  try {
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const newUser = new User({ name, email, passwordHash })

    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
  } catch (error) {
    response.status(401).json(error)
  }
})

module.exports = usersRouter
