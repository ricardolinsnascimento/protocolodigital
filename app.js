/* importar as configurações do servidor */
var app = require('./config/server');

/* parametrizar a porta de escuta */


const port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log('Servidor Protocolo Digital on utilizando a porta ' + port );
})