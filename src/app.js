const express = require('express')
const readerModel = require('../src/routes/reader')
const bookModel = require('../src/routes/book')
const authorModel = require('../src/routes/author')
const genreModel = require('../src/routes/genre')

const app = express()

app.use(express.json())

app.get('/', (_, res) => {
  res.status(200).json({ result: 'Welcome to Book Library app! Use /books, /authors, /genres and /readers paths to see what is available.' })
})

app.use('/readers', readerModel)
app.use('/books', bookModel)
app.use('/authors', authorModel)
app.use('/genres', genreModel)

module.exports = app
