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

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    important: 1,
    date: 1
  })

  response.status(200).json(users)
})

usersRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const user = await User.findById(id).populate('notes', {
      content: 1,
      important: 1,
      date: 1
    })
    if (user) {
      res.status(200).send(user)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
