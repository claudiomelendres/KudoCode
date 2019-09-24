const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');
const uuidv4 = require('uuid/v4')
const clientRCP = require('../KudosCode/utils/client');


// Create Redis Client
let client = redis.createClient();

client.on('connect', function(){
  console.log('Connected to Redis...');
});

// Set Port
const port = 5001;

// Init app
const app = express();

// View Engine\
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// methodOverride
app.use(methodOverride('_method'));

// Search Page
app.get('/', function(req, res, next){
  res.render('searchusers');
});

// Search processing
app.post('/user/search', function(req, res, next){
  let id = req.body.id;

  client.hgetall(id, function(err, obj){
    if(!obj){
      res.render('searchusers', {
        error: 'User does not exist'
      });
    } else {
      obj.id = id;
      res.render('details', {
        user: obj
      });
    }
  });
});


app.get('/kudo/keys', function(req, res, next){
    let destino="";
    if (req.body.destino) destino = req.body.destino;

    console.log(destino);
    client.keys(`*:kudo:${destino}*`, (err,reply)=> {
        if(err){
            console.log(err);
          } else {
                    //console.log(reply);
                    res.json({
                        keys: reply
                    });

                }
      });
});




app.get('/kudo/:id', function(req, res, next){
        let id = req.params.id
        client.hgetall(id, (err,kudo)=>{
            if(err){
                console.log(err);
                } else {
                res.json({
                    kudo: kudo
                });
            }
        });
});

// app.delete('/kudo/:id', function(req, res, next){
//   let id = req.params.id
//   client.del(id, (err,kudo)=>{
//       if(err){
//           console.log(err);
//           } else {
//           res.json({
//               kudo: kudo
//           });
//       }
//   });
// });


app.post('/kudo', function(req, res, next){
  
  let seed = uuid1 = uuidv4();
  
  let id = `${seed}:${req.body.fuente}:kudo:${req.body.destino}`;
  let fuente = req.body.fuente;
  let destino = req.body.destino;
  let tema = req.body.tema;
  let fecha = req.body.fecha;
  let lugar = req.body.lugar;
  let texto = req.body.texto;

  client.keys(`*kudo:${destino}*`,function(err, reply){
    console.log("/////////////////////");
    console.log(reply.length);
    let cantidadKudos = reply.length
      client.hmset(id, [
        'fuente', fuente,
        'destino', destino,
        'tema', tema,
        'fecha', fecha,
        'lugar', lugar,
        'texto', texto
      ], function(err, reply){
        if(err){
          console.log(err);
        } else {
                    
                    console.log(reply);
                    clientRCP.updateUser(destino, cantidadKudos).then(r=>{
                      console.log(`result:${r.toString()}:${cantidadKudos}`);
                      res.json({
                          ok: true,
                          kudo: reply
                      });

                    })
                }
      });
  })
});

// Delete User keys:[]
app.delete('/kudo', function(req, res, next){
  console.log(req.body.keys);
  if(req.body.keys.length!=0)
  {
    client.del(req.body.keys, (err, reply)=> {
      if(err){
        console.log(err);
      } else {
        console.log(reply);
        res.json({
          ok: true,
          kudo: reply
        });
      }
    });
  } else {
    res.json({
      ok: "Empty List"
    });
  }
  // res.json({
  //   ok:true
  // });
  
});


//Delete User
app.delete('/kudo/:id', function(req, res, next){
  console.log(req.params.id);
  client.del(req.params.id, (err, reply)=> {
    if(err){
        console.log(err);
      } else {
                console.log(reply);
                res.json({
                    ok: true,
                    kudo: reply
                });
            }
  });
  
});

app.listen(port, function(){
  console.log('Server started on port '+port);
});
