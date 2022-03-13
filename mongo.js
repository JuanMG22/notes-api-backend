const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI || MONGO_DB_URI_HEROKU

// Conexión a MongoDB
mongoose.connect(connectionString)
  .then(() => {
    console.log('database connected')
  })
  .catch((err) => {
    console.error(err)
  })
