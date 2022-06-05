const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const User = require('./models/User')
var session = require('express-session')

require('./config/mongoose')

const app = express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: 'vm,61j4j06kx7',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 1000 },
  })
)

app.get('/', (req, res) => {
  if (req.session.user) {
    return res.render('login_success', {name : req.session.user})
  }
  res.render('index')
})

app.post('/', (req, res) => {
  const { email, password } = req.body
  if (email === '' || password === '') {
    const msg = 'Please enter your email & password'
    return res.render('index', { msg })
  }

  User.findOne({
    $and: [{ email: email }, { password: password }],
  })
    .lean()
    .then((user) => {
      if (!user) {
        const msg = 'The email or password you entered is incorrect' 
        return res.render('index', { msg })
      }
      const name = user.firstName
      req.session.user = name
      return res.render('login_success', { name })
    })
})

app.listen(3000, () => {
  console.log('Express is listening on http://localhost:3000')
})
