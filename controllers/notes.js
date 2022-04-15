const notesRouter = require('express').Router()
const Note = require('../models/Note')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
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

notesRouter.post('/', async (request, response, next) => {
  const { content, important } = request.body

  if (!content) {
    return response.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const newNote = new Note({
    content: content,
    date: new Date(),
    important: important || false
  })

  try {
    const savedNote = await newNote.save()
    response.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
})

notesRouter.delete('/:id', (request, response, next) => {
  const { id } = request.params

  Note.findByIdAndDelete(id)
    .then(() => response.status(204).end())
    .catch(next)
})

notesRouter.put('/:id', (request, response) => {
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
