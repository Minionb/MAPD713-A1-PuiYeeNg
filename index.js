let SERVER_NAME = 'product-api'
let PORT = 5000;
let HOST = '127.0.0.1';
var getRequestCounter = 0;
var postRequestCounter = 0;
var deleteRequestCounter = 0;

let errors = require('restify-errors');
let restify = require('restify')

  // Get a persistence engine for the products
  , productsSave = require('save')('products')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('**** Resources: ****')
  console.log(' /products')
  console.log('**** Endpoints: ****')  
  console.log('%s/products method: GET, POST, DELETE', server.url)
})

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Create a new product
server.post('/products', function (req, res, next) {
  // log request information
  console.log('> products POST: received request');
  console.log('POST /products params=>' + JSON.stringify(req.params));
  console.log('POST /products body=>' + JSON.stringify(req.body));

  // log request counters
  postRequestCounter += 1
  console.log("Processed Request Count--> Get:" + getRequestCounter + ", Post:" + postRequestCounter + ", Delete:" + deleteRequestCounter)
  

  // validation of manadatory fields
  if (req.body.productId === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('productId must be supplied'))
  }
  if (req.body.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('name must be supplied'))
  }
  if (req.body.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('price must be supplied'))
  }
  if (req.body.quantity === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('quantity must be supplied'))
  }

  let newProduct = {
    productId: req.body.productId,
		name: req.body.name, 
    price: req.body.price,
    quantity: req.body.quantity
	}

  // Create the product using the persistence engine
  productsSave.create( newProduct, function (error, product) {

    // log response information
    console.log('< products POST: sending response');

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    // Send the product if no issues
    res.send(201, product)
  })
})

// Get all products in the system
server.get('/products', function (req, res, next) {
  // log request information
  console.log('> products GET: received request');
  console.log('GET /products params=>' + JSON.stringify(req.params));

  // log request counters
  getRequestCounter += 1
  console.log("Processed Request Count--> Get:" + getRequestCounter + ", Post:" + postRequestCounter + ", Delete:" + deleteRequestCounter)

  // Find every entity within the given collection
  productsSave.find({}, function (error, products) {
    // log response information
    console.log('< products GET: sending response');
    // Return all of the products in the system
    res.send(products)
  })
})




