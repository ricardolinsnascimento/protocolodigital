module.exports = function(application){

    const acessosController = require('../controllers/acesso')
	

    application.get('/', function(req, res){ //rota para página inicial
		  acessosController.index(application, req, res);
    });

    application.post('/gravarCadastro', function(req, res){ //rota para página inicial
		  acessosController.gravarCadastro(application, req, res);
    });

    application.get('/login', function(req, res){ //rota para chamar a tela de login
      acessosController.login(application, req, res);
    });

    application.post('/autenticar', function(req, res){	//rota para autenticar a partir do login
      acessosController.autenticar(application, req, res);
    });

    application.get('/painel', function(req, res){ //essa rota chama o painel 
      acessosController.painel(application, req, res);
    });

    application.get('/logout', function(req, res){ //essa rota vai para o controller alterar o status do usuario para confirmado
      acessosController.logout(application, req, res);
    });

    application.get('/mudaSenha', function(req, res){ //essa rota chama a tela para redefinir a senha 
      acessosController.mudaSenha(application, req, res);
    });

    application.post('/atualizaSenha', function(req, res){ //essa rota chama a tela para redefinir a senha 
      acessosController.atualizaSenha(application, req, res);
    });

    application.get('/atualizarCadastro', function(req, res){ //rota para abrir o formulário de atualização de cadastro 
      acessosController.atualizarCadastro(application, req, res);
    });

    application.post('/salvaAtualizacao', function(req, res){ //essa rota chama o controller para atualizar cadastro de usuários
      acessosController.salvaAtualizacao(application, req, res);
    });

    application.post('/enviaContato', function(req, res){ //Envia o contato, vai disparar email
      acessosController.enviaContato(application, req, res);
    });

}