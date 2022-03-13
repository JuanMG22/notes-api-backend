const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

// Conexión a MongoDB
mongoose.connect(connectionString)
  .then(() => {
    console.log('database connected')
  })
  .catch((err) => {
    console.error(err)
  })