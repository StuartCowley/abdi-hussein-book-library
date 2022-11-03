const { expect } = require('chai')
const request = require('supertest')
const { Genre } = require('../src/models')
const app = require('../src/app')

describe('/genre', () => {
  before(async () => Genre.sequelize.sync())

  beforeEach(async () => {
    await Genre.destroy({ where: {} })
  })

  describe('with no records in the database', () => {
    describe('POST /Genres', () => {
      it('creates a new Genre in the database', async () => {
        const response = await request(app).post('/genres').send({
          genre: 'Fiction'
        })
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true
        })

        expect(response.status).to.equal(201)
        expect(response.body.genre).to.equal('Fiction')
        expect(newGenreRecord.genre).to.equal('Fiction')
      })
      it('does not create a new genre in the database--no title', async () => {
        const response = await request(app).post('/genres').send({
          genre: ''
        })
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true
        })

        expect(response.status).to.equal(404)
        expect(newGenreRecord).to.equal(null)
        expect(response.body.errors.toString()).to.equal('Insert genre name')
      })
      it('does not create a new genre in the database--NULL', async () => {
        const response = await request(app).post('/genres').send({
          genre: null
        })
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true
        })

        expect(response.status).to.equal(404)
        expect(newGenreRecord).to.equal(null)
        expect(response.body.errors.toString()).to.equal('We need a genre name')
      })
    })
  })

  describe('with records in the database', () => {
    let genreArray

    beforeEach(async () => {
      genreArray = await Promise.all([
        Genre.create({
          genre: 'sci-fi'
        }),
        Genre.create({
          genre: 'factual'
        }),
        Genre.create({
          genre: 'mystery'
        })
      ])
    })

    describe('GET /genre', () => {
      it('gets all genre records with related books', async () => {
        const response = await request(app).get('/genres')

        const getBooks = response.body.map((e) => e.Books)

        expect(response.status).to.equal(200)
        expect(response.body.length).to.equal(3)
        expect(getBooks).to.not.equal(undefined)

        response.body.forEach((genreType) => {
          const expected = genreArray.find((a) => a.id === genreType.id)

          expect(genreType.genre).to.equal(expected.genre)
        })
      })
    })

    describe('GET /genre/:id', () => {
      it('gets genre record by id with related books', async () => {
        const genreItem = genreArray[0]
        const response = await request(app).get(`/genres/${genreItem.id}`)
        expect(response.status).to.equal(200)
        expect(response.body.genre).to.equal(genreItem.genre)
        expect(response.body.Books).to.not.equal(undefined)
      })

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app).get('/genres/12345')

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal('The genre could not be found.')
      })
    })

    describe('PATCH /genre/:id', () => {
      it('updates genre name by id', async () => {
        const genreItem = genreArray[0]
        const response = await request(app)
          .patch(`/genres/${genreItem.id}`)
          .send({ genre: 'UpdatedGenre' })
        const updatedGenreRecord = await Genre.findByPk(genreItem.id, {
          raw: true
        })

        expect(response.status).to.equal(200)
        expect(updatedGenreRecord.genre).to.equal('UpdatedGenre')
      })

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app)
          .patch('/genres/12345')
          .send({ genre: 'UpdatedGenre' })

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal('The genre could not be found.')
      })
    })

    describe('DELETE /genre/:id', () => {
      it('deletes genre record by id', async () => {
        const genreItem = genreArray[0]
        const response = await request(app).delete(`/genres/${genreItem.id}`)
        const deletedGenre = await Genre.findByPk(genreItem.id, { raw: true })

        expect(response.status).to.equal(204)
        expect(deletedGenre).to.equal(null)
      })

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app).delete('/genres/12345')
        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal('The genre could not be found.')
      })
    })
  })
})
