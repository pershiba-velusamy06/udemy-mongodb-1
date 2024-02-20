const Router = require('express').Router;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = Router();

const mongoDb = require('mongodb');


const db = require('../db')


const createToken = () => {
  return jwt.sign({}, 'secret', { expiresIn: '1h' });
};

router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;


  db.getDb().db().collection('users').findOne({
    email: email
  }).then((result) => {
    console.log(result)
    if(!result){
      throw Error()
    }
    return bcrypt.compare(pw, result.password)}).then(()=>{
    const token = createToken();
    res
      .status(200)
      .json({  message: 'Authentication succeeded',token: token });
  }).catch(() => {
    res
    .status(401)
    .json({ message: 'Authentication failed, invalid username or password.' });
  })


});

router.post('/signup', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  bcrypt
    .hash(pw, 12)
    .then(hashedPW => {
      db.getDb().db().collection('users').insertOne({
        email: email,
        password: hashedPW
      }).then((result) => {
        console.log(hashedPW);
        const token = createToken();
        res
          .status(201)
          .json({ token: token, user: { email: email } });
      }).catch(() => {
        res.status(500).json({ message: 'Creating the user failed.' });
      })

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Creating the user failed.' });
    });
});

module.exports = router;
