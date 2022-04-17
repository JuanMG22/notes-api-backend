const notesRouter = require('express').Router()
const userExtractor = require('../middlewares/userExtractor')
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.status(200).json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id)
    .then(note => {
      if (note) {
        response.send(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => next(err))
})

notesRouter.post('/', userExtractor, async (request, response, next) => {
  const { content, important } = request.body

  const { userId } = request

  if (!content) {
    return response.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const user = await User.findById(userId)

  const newNote = new Note({
    content,
    important: important || false,
    date: new Date(),
    user: user._id
  })

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
})

notesRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params

  try {
    await Note.findByIdAndDelete(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', userExtractor, (request, response) => {
  const { id } = request.params
  const { content, important } = request.body

  const newNoteInfo = {
    content: content,
    important: important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => response.status(201).json(result))
})

module.exports = notesRouter
