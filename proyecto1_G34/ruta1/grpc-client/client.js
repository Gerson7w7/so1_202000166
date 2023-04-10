var PROTO_PATH = './proto/voto.proto';

var parseArgs = require('minimist');
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

function main() {
    var argv = parseArgs(process.argv.slice(2), {
        string: 'target'
    });
    var target;
    if (argv.target) {
        target = argv.target;
    } else {
        target = 'localhost:50051';
    }

    var client = new voto_proto.Votos(target, grpc.credentials.createInsecure());
    
    var sede, municipio, departamento, papeleta, partido;
    
    if (argv._.length > 0) {
        sede = argv._[0];
        municipio = argv._[1];
        departamento = argv._[2];
        papeleta = argv._[3];
        partido = argv._[4];

        client.Votos({ sede: sede, municipio: municipio, departamento: departamento, papeleta: papeleta, partido: partido }, function(err, response){
            console.log('Respuesta:', response.message);
        });
    }
}