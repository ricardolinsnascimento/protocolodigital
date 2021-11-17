
module.exports = function(application){

    const administracaoController = require('../controllers/administracao')

    application.get('/usuarios', function(req, res){ //rota para abrir o formulário de atualização de cadastro 
        administracaoController.usuarios(application, req, res);
    });

    application.get('/buscaUsuario', function(req,res){		
		administracaoController.buscaUsuario(application, req, res);
    });

    application.get('/autorizarUsuario', function(req,res){		
		administracaoController.autorizarUsuario(application, req, res);
    });

    application.get('/suspendeUsuario', function(req,res){		
		administracaoController.suspendeUsuario(application, req, res);
    });

    application.get('/reativaUsuario', function(req,res){		
		administracaoController.reativaUsuario(application, req, res);
    });

    application.get('/logUsuario', function(req, res){ //rota para log de usuários
		administracaoController.logUsuarios(application, req, res);
	});
    
}