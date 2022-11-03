const express = require('express')
const BookController = require('../controllers/book')

const router = express.Router()

router.route('/')
  .post(BookController.createBook)
  .get(BookController.getAllBooks)

router.route('/:id')
  .get(BookController.getBookByID)
  .patch(BookController.updateBook)
  .delete(BookController.deleteBook)

module.exports = router
