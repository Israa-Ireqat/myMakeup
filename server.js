'use strict';

//Dependencies:
require('dotenv').config();
const app = express();
const express = require(express);
const cors = require (cors);
const superagent = require (superagent);
const pg = require (pg);
const methodOverride = require (method-override);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);
const PORT= process.env.PORT ||3000;

//const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
//const client = new pg.Client( { connectionString: process.env.DATABASE_URL, ssl: process.env.LOCALLY ? false : {rejectUnauthorized: false}} );


////////////////////////////////
//Home route and it's function:
///////////////////////////////
app.post('/',homeHandler);
function homeHandler(req,res){
  //let product = req.body.product;
  let lowerPrice = req.body.lowerPrice;
  let higherPrice = req.body.higherPrice;
  let url = `http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline&price_greater_than=${lowerPrice}&price_less_than=${higherPrice}`;
  superagent.get(url).then(data=>{
    res.render('pages/price',{data: data});

  }).catch(error=>{
    res.send(error);
  });

}

///////////////////////////////////////
//ALL Products route and it's function:
///////////////////////////////////////
app.get('/allProducts',allHandler);
function allHandler(req,res){
  let url = 'http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline';
  superagent.get(url).then(data=>{
    const myData= data.body.map(element=>{
      return new allConstructor(element);

    });res.render('pages/all',{data:myData});
  });
}
function allConstructor(data){
  this.image=data.body.image_link;
  this.product=data.body.name;
  this.price=data.body.price;
  this.description=data.body.description;
}

///////////////////////////////////
//My card route and it's function:
//////////////////////////////////
//1-Save Data to Database
app.post('/myCard',saveHandler);
function saveHandler(req,res){
  const {image,product,price,description}=req.body;
  const SQL= 'INSERT INTO make Where (image,product,price,description) VALUES ($1,$2,$3,$4)';
  const safeValues = [image,product,price,description];
  client.query(SQL,safeValues).then(()=>{
    res.redirect('pages/myCard');
  }).catch(error=>{
    res.send(error);
  });
}
//2-RenderData from Database




//listener:
client.listen(`listening on port ${PORT}`);
