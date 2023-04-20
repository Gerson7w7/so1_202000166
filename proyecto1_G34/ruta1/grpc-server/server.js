const Conn = require('./conn');

var PROTO_PATH = './proto/voto.proto';

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

var voto_proto = grpc.loadPackageDefinition(packageDefinition).voto;

function AddVoto(call, callback) {
  const query = `INSERT INTO voto (sede, municipio, departamento, papeleta, partido)
    VALUES (${call.request.sede}, '${call.request.municipio}', '${call.request.departamento}',
           '${call.request.papeleta}', '${call.request.partido}');`;
  Conn.query(query, function(err, rows, fields) {
    if (err) throw err;
    callback(null, {message: 'Voto insertado en la base de datos por ruta 1'});
  });
}

function main() {
  var server = new grpc.Server();
  server.addService(voto_proto.Votos.service, { AddVoto: AddVoto });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('gRPC server on port 50051')
  });
}

main();