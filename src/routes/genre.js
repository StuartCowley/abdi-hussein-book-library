const express = require('express')
const GenreController = require('../controllers/genre')

const router = express.Router()

router.route('/')
  .post(GenreController.createGenre)
  .get(GenreController.getAllGenre)

router.route('/:id')
  .get(GenreController.getGenreByID)
  .patch(GenreController.updateGenre)
  .delete(GenreController.deleteGenre)

module.exports = router