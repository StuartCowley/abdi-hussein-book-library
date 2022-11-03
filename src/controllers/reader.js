const { createItem, getAllItems, getItemById, updateItem, deleteItem } = require('./helpers')

const createReader = (req, res) => createItem(res, 'reader', req.body)

const findAllReaders = (req, res) => getAllItems(res, 'reader')

const findReadersById = (req, res) => getItemById(res, 'reader', req.params.id)

const updateReaders = (req, res) => updateItem(res, 'reader', req.body, req.params.id)

const deleteReader = (req, res) => deleteItem(res, 'reader', req.params.id)

module.exports = {
  createReader,
  findAllReaders,
  findReadersById,
  updateReaders,
  deleteReader
}
