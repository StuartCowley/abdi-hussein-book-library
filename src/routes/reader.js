const express = require('express')
const readerController = require('../controllers/reader')

const router = express.Router()

router.route('/')
  .post(readerController.createReader)
  .get(readerController.findAllReaders)

router.route('/:id')
  .get(readerController.findReadersById)
  .patch(readerController.updateReaders)
  .delete(readerController.deleteReader)

module.exports = router
