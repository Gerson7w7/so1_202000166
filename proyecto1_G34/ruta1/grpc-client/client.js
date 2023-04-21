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

var argv = parseArgs(process.argv.slice(2), {
    string: 'target'
});
var target;
if (argv.target) {
    target = argv.target;
} else {
    target = 'grpc-server:50051';
}
var client = new voto_proto.Votos(target, grpc.credentials.createInsecure());

//API
const express = require('express');
var cors = require('cors');
const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Server Status: OK");
});

app.post('/add-voto', function (req, res) {
    const data_voto = {
        sede : req.body.sede,
        municipio : req.body.municipio,
        departamento : req.body.departamento,
        papeleta : req.body.papeleta,
        partido : req.body.partido
    };
    
    client.AddVoto(data_voto, function(err, response) {
        res.status(200).json({message: response.message})
    });
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));