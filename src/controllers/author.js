const { createItem, getAllItems, getItemById, updateItem, deleteItem } = require('../controllers/helpers')

const createAuthor = (req, res) => createItem(res, 'author', req.body)

const getAllAuthors = (req, res) => getAllItems(res, 'author')

const getAuthorByID = (req, res) => getItemById(res, 'author', req.params.id)

const updateAuthor = (req, res) => updateItem(res, 'author', req.body, req.params.id)

const deleteAuthor = (req, res) => deleteItem(res, 'author', req.params.id)

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorByID,
  updateAuthor,
  deleteAuthor
}
