const express = require('express')
const AuthorController = require('../controllers/author')

const router = express.Router()

router.route('/')
  .post(AuthorController.createAuthor)
  .get(AuthorController.getAllAuthors)

router.route('/:id')
  .get(AuthorController.getAuthorByID)
  .patch(AuthorController.updateAuthor)
  .delete(AuthorController.deleteAuthor)

module.exports = router
