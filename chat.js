var net = require('net');
var stdin = process.openStdin();

var host = '127.0.0.1';
var port = 8080;
var clientes = [];
 
var server = net.createServer(function(socket) {
    console.log('Entrou no servidro: ' + socket.remoteAddress + ':' + socket.remotePort); 
    socket.write('Bem Vindo !' + socket.remoteAddress + ':' + socket.remotePort + '\n');
    clientes.push(socket);

    socket.on('data', function(data) {  //Cliente escreve mensagem
        if (data == 'Sair\n') {
            sair(socket);
            return;
        }
        broadcast(data, socket);
        console.log('Cliente' + ' ' + socket.remotePort + ': ' + data);

    });
 
    socket.on('end', function() { //Cliente se desconectou
        console.log('Saiu: ' + data + data.remoteAddress + ':' + data.remotePort + '\n');
        var index = clientes.indexOf(socket);
        if (index != -1) {
            delete clientes[index];
        }
    });
});

//Realiza o broadcast para outros clientes
function broadcast(mensagem, cliente){
    for (var i = 0; i < clientes.length; i ++) { 
        if (clientes[i] != cliente) {
            if (clientes[i]) {
                clientes[i].write(cliente.remotePort + ' diz:' + mensagem + '\n');
            }
        }
    }
}

function broadcastServerSide(mensagem){
    for (var i = 0; i < clientes.length; i ++) { 
            if (clientes[i]) {
                clientes[i].write('Server diz: ' + mensagem + '\n');
            }
    }
}

function sair(cliente){
    console.log('Deixando servidor: ' + cliente.remoteAddress + ':' + cliente.remotePort + '\n');
    cliente.destroy();
    var index = clientes.indexOf(cliente);
    if (index != -1) {
        delete clientes[index];
    }
}

stdin.addListener("data", function(d) {
    broadcastServerSide(d.toString().trim());       
  });

server.listen(port, host, function() {
    console.log("Server iniciado: "+ host + ':' + port);
});