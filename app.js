const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const User = require('./models/User')

require('./config/mongoose')

const app = express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const { email, password } = req.body
  User.findOne({
    $and: [{ email: email }, { password: password }],
  })
    .lean()
    .then((user) => {
      if (!user) {
        const msg = 'The email or password you entered is incorrect' 
        res.render('index', { msg })
        return
      }
      res.render('login_success', { user })
    })
})

app.listen(3000, () => {
  console.log('Express is listening on http://localhost:3000')
})
