const { createItem, getAllItems, getItemById, updateItem, deleteItem } = require('../controllers/helpers')

const createBook = (req, res) => createItem(res, 'book', req.body)

const getAllBooks = (req, res) => getAllItems(res, 'book')

const getBookByID = (req, res) => getItemById(res, 'book', req.params.id)

const updateBook = (req, res) => updateItem(res, 'book', req.body, req.params.id)

const deleteBook = (req, res) => deleteItem(res, 'book', req.params.id)

module.exports = {
  createBook,
  getAllBooks,
  getBookByID,
  updateBook,
  deleteBook
}
