const { createItem, getAllItems, getItemById, updateItem, deleteItem } = require('../controllers/helpers')

const createGenre = (req, res) => createItem(res, 'genre', req.body)

const getAllGenre = (req, res) => getAllItems(res, 'genre')

const getGenreByID = (req, res) => getItemById(res, 'genre', req.params.id)

const updateGenre = (req, res) => updateItem(res, 'genre', req.body, req.params.id)

const deleteGenre = (req, res) => deleteItem(res, 'genre', req.params.id)

module.exports = {
  createGenre,
  getAllGenre,
  getGenreByID,
  updateGenre,
  deleteGenre
}