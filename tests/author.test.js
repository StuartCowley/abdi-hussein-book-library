const { expect } = require('chai')
const request = require('supertest')
const { Author } = require('../src/models')
const app = require('../src/app')

describe('/authors', () => {
  before(async () => Author.sequelize.sync())

  beforeEach(async () => {
    await Author.destroy({ where: {} })
  })

  describe('with no records in the database', () => {
    describe('POST /Author', () => {
      it('creates a new Author in the database', async () => {
        const response = await request(app).post('/authors').send({
          author: 'Best Author'
        })
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true
        })

        expect(response.status).to.equal(201)
        expect(response.body.author).to.equal('Best Author')
        expect(newAuthorRecord.author).to.equal('Best Author')
      })
      it('does not create a new author in the database--no title', async () => {
        const response = await request(app).post('/authors').send({
          author: ''
        })
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true
        })

        expect(response.status).to.equal(404)
        expect(newAuthorRecord).to.equal(null)
        expect(response.body.errors.toString()).to.equal('Insert author name')
      })
      it('does not create a new Author in the database--NULL', async () => {
        const response = await request(app).post('/authors').send({
          author: null
        })
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true
        })

        expect(response.status).to.equal(404)
        expect(newAuthorRecord).to.equal(null)
        expect(response.body.errors.toString()).to.equal('We need author name')
      })
    })
  })

  describe('with records in the database', () => {
    let authors

    beforeEach(async () => {
      authors = await Promise.all([
        Author.create({
          author: 'Best Author2'
        }),
        Author.create({
          author: 'Best Author3'
        }),
        Author.create({
          author: 'Best Author4'
        })
      ])
    })

    describe('GET /authors', () => {
      it('gets all author records with books', async () => {
        const response = await request(app).get('/authors')

        expect(response.status).to.equal(200)
        expect(response.body.length).to.equal(3)

        response.body.forEach((authorItem) => {
          const expected = authors.find((a) => a.id === authorItem.id)
          const getBooks = response.body.map((e) => e.Books)

          expect(authorItem.author).to.equal(expected.author)
          expect(getBooks).to.not.equal(undefined)
        })
      })
    })

    describe('GET /authors/:id', () => {
      it('gets authors record by id with books', async () => {
        const authorItem = authors[0]
        const response = await request(app).get(`/authors/${authorItem.id}`)

        expect(response.status).to.equal(200)
        expect(response.body.author).to.equal(authorItem.author)
        expect(response.body.Books).to.not.equal(undefined)
      })

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app).get('/authors/12345')

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal('The author could not be found.')
      })
    })

    describe('PATCH /authors/:id', () => {
      it('updates authors name by id', async () => {
        const authorItem = authors[0]
        const response = await request(app)
          .patch(`/authors/${authorItem.id}`)
          .send({ author: 'UpdatedAuthor' })
        const updatedAuthorRecord = await Author.findByPk(authorItem.id, {
          raw: true
        })

        expect(response.status).to.equal(200)
        expect(updatedAuthorRecord.author).to.equal('UpdatedAuthor')
      })

      it('returns a 404 if the author does not exist', async () => {
        const response = await request(app)
          .patch('/authors/12345')
          .send({ author: 'UpdatedAuthor' })

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal('The author could not be found.')
      })
    })

    describe('DELETE /authors/:id', () => {
      it('deletes author record by id', async () => {
        const authorItem = authors[0]
        const response = await request(app).delete(`/authors/${authorItem.id}`)
        const deletedAuthor = await Author.findByPk(authorItem.id, { raw: true })

        expect(response.status).to.equal(204)
        expect(deletedAuthor).to.equal(null)
      })

      it('returns a 404 if the author does not exist', async () => {
        const response = await request(app).delete('/authors/12345')
        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal('The author could not be found.')
      })
    })
  })
})
