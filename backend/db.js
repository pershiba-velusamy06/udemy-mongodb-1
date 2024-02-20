const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

let _db;
const initDb = callback => {
    if (_db) {
        return callback(null, _db)
    }
    MongoClient.connect('mongodb+srv://pershibavelusamy06:PERSHIBA06@cluster0.zkm26kx.mongodb.net/shop?retryWrites=true').then((client) => {
        console.log("connected Mongo db")
        _db = client
        callback(null, _db)
    }).catch((error) => {
        console.log(error, "error>>>>>>>>>>>>>>>>>>")
        callback(error)
    })
}

const getDb=()=>{
    if(!_db){
        throw Error('Database not initiated')
    }
    return _db
}

module.exports={
    initDb,
    getDb
}