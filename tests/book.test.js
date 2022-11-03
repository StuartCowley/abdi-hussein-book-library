const { expect } = require('chai')
const request = require('supertest')
const { Book } = require('../src/models')
const app = require('../src/app')

describe('/books', () => {
  before(async () => Book.sequelize.sync())

  beforeEach(async () => {
    await Book.destroy({ where: {} })
  })

  describe('with no records in the database', () => {
    describe('POST /Book', () => {
      it('creates a new Book in the database', async () => {
        const response = await request(app).post('/books').send({
          title: 'Best Story',
          author: 'Best Author',
          ISBN: '111-11111-1-111'
        })
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true
        })

        expect(response.status).to.equal(201)
        expect(response.body.title).to.equal('Best Story')
        expect(newBookRecord.title).to.equal('Best Story')
        expect(newBookRecord.ISBN).to.equal('111-11111-1-111')
      })
      it('does not create a new Book in the database--no title', async () => {
        const response = await request(app).post('/books').send({
          title: '',
          author: 'Best Author',
          ISBN: '111-11111-1-111'
        })
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true
        })

        expect(response.status).to.equal(404)
        expect(newBookRecord).to.equal(null)
        expect(response.body.errors.toString()).to.equal('Insert title name')
      })
      it('does not create a new Book in the database--NULL', async () => {
        const response = await request(app).post('/books').send({
          title: null,
          author: 'Best author',
          ISBN: '111-11111-1-111'
        })
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true
        })

        expect(response.status).to.equal(404)
        expect(newBookRecord).to.equal(null)
        expect(response.body.errors.toString()).to.equal('We need a book title')
      })
    })
  })

  describe('with records in the database', () => {
    let books

    beforeEach(async () => {
      books = await Promise.all([
        Book.create({
          title: 'Best Story2',
          author: 'Best Author2',
          ISBN: '111-11111-1-112'
        }),
        Book.create({
          title: 'Best Story3',
          author: 'Best Author3',
          ISBN: '111-11111-1-113'
        }),
        Book.create({
          title: 'Best Story4',
          author: 'Best Author4',
          ISBN: '111-11111-1-114'
        })
      ])
    })

    describe('GET /books', () => {
      it('gets all book records', async () => {
        const response = await request(app).get('/books')

        expect(response.status).to.equal(200)
        expect(response.body.length).to.equal(3)

        response.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id)

          expect(book.title).to.equal(expected.title)
          expect(book.ISBN).to.equal(expected.ISBN)
          expect(book.Genre).to.equal(null)
          expect(book.GenreId).to.equal(null)
        })
      })
    })

    describe('GET /books/:id', () => {
      it('gets books record by id', async () => {
        const book = books[0]
        const response = await request(app).get(`/books/${book.id}`)

        expect(response.status).to.equal(200)
        expect(response.body.title).to.equal(book.title)
        expect(response.body.ISBN).to.equal(book.ISBN)
        expect(response.body.Genre).to.equal(null)
        expect(response.body.GenreId).to.equal(null)
      })

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).get('/books/12345')

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal('The book could not be found.')
      })
    })

    describe('PATCH /books/:id', () => {
      it('updates books isbn by id', async () => {
        const book = books[0]
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ ISBN: '111-11100-0-002' })
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true
        })

        expect(response.status).to.equal(200)
        expect(updatedBookRecord.ISBN).to.equal('111-11100-0-002')
      })

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app)
          .patch('/books/12345')
          .send({ ISBN: '111-11100-0-002' })

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal('The book could not be found.')
      })
    })

    describe('DELETE /books/:id', () => {
      it('deletes book record by id', async () => {
        const book = books[0]
        const response = await request(app).delete(`/books/${book.id}`)
        const deletedBook = await Book.findByPk(book.id, { raw: true })

        expect(response.status).to.equal(204)
        expect(deletedBook).to.equal(null)
      })

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).delete('/books/12345')
        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal('The book could not be found.')
      })
    })
  })
})
