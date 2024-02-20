const Router = require('express').Router;
const mongoDb = require('mongodb');

const Decimal128 = mongoDb.Decimal128;
const ObjectId = mongoDb.ObjectId
const db = require('../db')
const router = Router();


router.get('/', (req, res, next) => {
  const queryPage= req.query.page;
  const pageSize =1
  const Products = []
  db.getDb().db().collection('products').find().sort({price:-1})
  // .skip((queryPage-1)*pageSize).limit(pageSize)
  .forEach((prodDocs) => {
    prodDocs.price = prodDocs.price.toString()
    Products.push(prodDocs)
  }).then((result) => {
    res.status(200).json(Products);
  }).catch((err) => {
    res.status(500).json({ message: 'An error occured' });
  })
})



router.get('/:id', (req, res, next) => {
  db.getDb().db().collection('products').findOne({ _id: new ObjectId( req.params.id) }).then((result) => {
    let data = result;
    data.price = result.price.toString()
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({ message: 'An error occured' });
  })
})


router.post('', (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };
  db.getDb().db().collection('products').insertOne(newProduct).then((result) => {
    console.log(result, "result>>>>>>>>>")
    res.status(201).json({ message: 'Product added', productId: result.insertedId });
  }).catch((err) => {
    console.log(err, "error>>>>>>>>>>>>>>>>>>")
    res.status(500).json({ message: 'An error occured' });
  })
});


router.patch('/:id', (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()),
    image: req.body.image
  };
  db.getDb().db().collection('products').updateOne({_id: new ObjectId( req.params.id)},{$set:updatedProduct}).then((result) => {
    res.status(200).json({ message: 'Product added', productId: req.params.id });
  }).catch((err) => {
    res.status(500).json({ message: 'An error occured' });
  })


});


router.delete('/:id', (req, res, next) => {
  db.getDb().db().collection('products').deleteOne({ _id: new ObjectId( req.params.id) }).then((result) => {
    res.status(200).json({ message: 'Product deleted' });
  }).catch((err) => {
    res.status(500).json({ message: 'An error occured' });
  })
});

module.exports = router;
