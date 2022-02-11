var mysql = require('mysql'); 

const port = process.env.PORT || 3000;

if (port == 3000){
	var connMySQL = function(){
		console.log('Conexão com o BD foi estabelecida');
		return mysql.createConnection({ 
			host:'localhost',
			user: 'root',
			password: 'password',
			database: 'protocolodigital'		
		});
	}
}else{
	var connMySQL = function(){
		console.log('Conexão com o BD Heroku');
		return mysql.createConnection({ 
			host: process.env.host,
			user: process.env.user,
			password: process.env.password,
			database: process.env.database
		});
	}
}

module.exports = function(){
	console.log('o autoload carregou o dbConnection')
	return connMySQL;
}



		