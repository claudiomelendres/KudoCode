var redis = require('redis');
//creamos un cliente
var redisClient = redis.createClient(6379,'127.0.0.1');
redisClient.on('connect', function() {
    console.log('Conectado a Redis Server');
});
redisClient.set("key1", "hola mundo1");
redisClient.set("key2", "hola mundo2");
redisClient.set("key3", "hola mundo2");
redisClient.get("key1", function(err, value) {
    // retornara null si la key no existe
    console.log(value);
});

//redisClient.hmset('frameworks', 'javascript', 'AngularJS', 'css', 'Bootstrap', 'node', 'Express');
redisClient.hmset('frameworks', 'a', '{"titulo":"Felicidades","detalle":"para ti"}', 'b', '{"titulo":"maldiciones","detalle":"para tu"}', 'c', '{"titulo":"morite","detalle":"para nadie"}');


redisClient.hgetall('frameworks', function(err, object) {
    console.log(object);
});