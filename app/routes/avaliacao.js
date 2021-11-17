module.exports = function(application){

    const avaliacaoController = require('../controllers/avaliacao')

    application.get('/incluiEscola', function(req, res){ 
        avaliacaoController.incluiEscola(application, req, res);
    });

    application.post('/salvaEscola', function(req, res){ 
        avaliacaoController.salvaEscola(application, req, res);
    });

    application.get('/avaliacoes', function(req, res){ 
        avaliacaoController.avaliacoes(application, req, res);
    });

    application.get('/incluiAvaliacao', function(req, res){
        avaliacaoController.incluiAvaliacao(application, req, res);
    });

    application.get('/escolas', function(req, res){ 
        avaliacaoController.escolas(application, req, res);
    });

    application.post('/editaEscola', function(req, res){ 
        avaliacaoController.editaEscola(application, req, res);
    });

    application.get('/excluirEscola', function(req, res){
        avaliacaoController.excluirEscola(application, req, res);
    });

    application.get('/buscaEscola', function(req, res){ 
        avaliacaoController.buscaEscola(application, req, res);
    });

    application.get('/abreAvaliacao', function(req, res){
        avaliacaoController.abreAvaliacao(application, req, res);
    });

    application.get('/gravaPontos', function(req, res){         
        avaliacaoController.gravaPontos(application, req, res);
    });

    application.get('/carregaPontos', function(req, res){         
        avaliacaoController.carregaPontos(application, req, res);
    });

    application.get('/carregaPontosTotal', function(req, res){         
        avaliacaoController.carregaPontosTotal(application, req, res);
    });

    application.get('/gravaEspelhoEscada', function(req, res){         
        avaliacaoController.gravaEspelhoEscada(application, req, res);
    });

    application.get('/excluiEspelhoEscada', function(req, res){         
        avaliacaoController.excluiEspelhoEscada(application, req, res);
    });

    application.get('/carregaEspelhoEscada', function(req, res){         
        avaliacaoController.carregaEspelhoEscada(application, req, res);
    });

    application.get('/gravaCorrimao', function(req, res){         
        avaliacaoController.gravaCorrimao(application, req, res);
    });

    application.get('/carregaCorrimao', function(req, res){         
        avaliacaoController.carregaCorrimao(application, req, res);
    });

    application.get('/gravaRampa', function(req, res){         
        avaliacaoController.gravaRampa(application, req, res);
    });

    application.get('/excluiRampa', function(req, res){         
        avaliacaoController.excluiRampa(application, req, res);
    });

    application.get('/carregaRampa', function(req, res){         
        avaliacaoController.carregaRampa(application, req, res);
    });

    application.get('/gravaCorrimaoRampa', function(req, res){         
        avaliacaoController.gravaCorrimaoRampa(application, req, res);
    });

    application.get('/carregaCorrimaoRampa', function(req, res){         
        avaliacaoController.carregaCorrimaoRampa(application, req, res);
    });

    application.get('/gravaPorta', function(req, res){         
        avaliacaoController.gravaPorta(application, req, res);
    });

    application.get('/gravaBarras', function(req, res){         
        avaliacaoController.gravaBarras(application, req, res);
    });

    application.get('/gravaBalcao', function(req, res){         
        avaliacaoController.gravaBalcao(application, req, res);
    });

    application.get('/carregaPorta', function(req, res){         
        avaliacaoController.carregaPorta(application, req, res);
    });

    application.get('/carregaBarras', function(req, res){         
        avaliacaoController.carregaBarras(application, req, res);
    });

    application.get('/carregaBalcao', function(req, res){         
        avaliacaoController.carregaBalcao(application, req, res);
    });

    application.get('/excluiCorrimao', function(req, res){         
        avaliacaoController.excluiCorrimao(application, req, res);
    });

    application.get('/excluiCorrimaoRampa', function(req, res){         
        avaliacaoController.excluiCorrimaoRampa(application, req, res);
    });

    application.get('/zeraPontosCorrimao', function(req, res){         
        avaliacaoController.zeraPontosCorrimao(application, req, res);
    });

    application.get('/tabelaMudancaNiveis', function(req, res){         
        avaliacaoController.tabelaMudancaNiveis(application, req, res);
    });
      
}