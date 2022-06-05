const User = require('../User.js')
const userList = require('./user.json').results

const db = require('../../config/mongoose')

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('Seeding: userSeeder ... ')
  User.create(userList)
    .then(() => {
      console.log('Database seeding completed successfully.')
      db.close()
    })
    .catch((err) => console.log(err))
})
