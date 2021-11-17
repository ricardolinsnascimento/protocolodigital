/*importar o módulo do crypto */
var crypto = require('crypto');

function usuariosDAO(connection){
    conn = connection;

    this.verificaCadastro = function(usuario, callback){		
		conn.query("select * from usuarios where email_usuario = '" + usuario.email_usuario  + "'", callback)
    }

    this.retornaUsuario = function(email, callback){
		conn.query("select * from usuarios where email_usuario = '" + email + "'",callback )
	
	}
    
    this.salvarUsuario = function(usuario, callback){
		var senha_criptografada = crypto.createHash("md5").update(usuario.senha_usuario).digest("hex");
		usuario.senha_usuario = senha_criptografada;

		conn.query('insert into usuarios set ?', usuario, callback)
    }
    
    this.autenticar = function(usuario,callback){
		var senha_criptografada = crypto.createHash("md5").update(usuario.senha_usuario).digest("hex");
		usuario.senha_usuario = senha_criptografada;

		conn.query("select * from usuarios where email_usuario = '" + usuario.email_usuario + "' and senha_usuario ='" + usuario.senha_usuario +"'", callback);
		
    }
    
    this.registraLogUsuario = function(log_usuario, callback){
		conn.query("insert into log_usuarios set ?", log_usuario, callback)	  		
    } 
    
    this.atualizaToken = function(usuario,callback){		
		conn.query("update usuarios set token = '" + usuario.token + "' where email_usuario = '" + usuario.email_usuario + "'",callback )		
    }
    
    this.verificaToken = function(usuario, callback){
		conn.query("select * from usuarios where email_usuario = '" + usuario.email_usuario + "' and token ='" + usuario.token +"'", callback);
    }

    this.atualizaSenha = function(usuario, callback){			
		var senha_criptografada = crypto.createHash("md5").update(usuario.senha_usuario).digest("hex");
		conn.query("update usuarios set senha_usuario = '" + senha_criptografada + "' where email_usuario = '" + usuario.email_usuario + "'",callback )		
    }
    
    this.retornaUsuarioporEmail = function(email, callback){
		conn.query("select *  from usuarios where email_usuario = '" + email + "'",callback )	
    }
    
    this.salvaAtualizacao = function(usuario, callback){
		conn.query("update usuarios set  cidade_usuario = '" + usuario.cidade_usuario + "',  estado_usuario = '" + usuario.estado_usuario + "', telefone_usuario = '" + usuario.telefone_usuario + "', interesse_usuario = '" + usuario.interesse_usuario + "' where email_usuario = '" + usuario.email_usuario + "'" ,callback )		
	}

	this.listaEscolas = function(id_usuario, callback){
		conn.query("select id_escola, nome_escola from escolas where id_usuario_escola = " + id_usuario, callback)
	}

	
	this.getUsuarios = function(callback){
		conn.query("select * from usuarios order by id_usuario desc",callback )	
	}

	this.buscaUsuario = function(pesquisa, callback){
		conn.query("select * from usuarios where nome_usuario like '%" + pesquisa + "%' order by id_usuario desc",callback )	
	}

	this.autorizaUsuario = function(id, callback){
		conn.query("update usuarios set status_usuario = 'autorizado' where id_usuario = " + id ,callback )	
	}

	this.suspendeUsuario = function(id, callback){
		conn.query("update usuarios set status_usuario = 'suspenso' where id_usuario = " + id ,callback )	
	}

	this.reativaUsuario = function(id, callback){
		conn.query("update usuarios set status_usuario = 'reativado' where id_usuario = " + id ,callback )
	}

	this.logUsuarios = function(pesquisa, callback){
		if (pesquisa.id_usuario.length > 0){
			var sql = "select log_usuarios.id_log_usuario, log_usuarios.id_usuario_log, log_usuarios.data_log, log_usuarios.hora_log, log_usuarios.id_tipo_log, log_usuarios.historico_log, tipo_log_usuarios.descricao_tipo_log_usuarios, usuarios.nome_usuario from log_usuarios, tipo_log_usuarios, usuarios where (log_usuarios.id_tipo_log = tipo_log_usuarios.id_tipo_log_usuarios and log_usuarios.id_usuario_log = usuarios.id_usuario) and (log_usuarios.id_usuario_log = " + pesquisa.id_usuario + ") order by log_usuarios.id_log_usuario desc"

		}else{
			var sql = "select log_usuarios.id_log_usuario, log_usuarios.id_usuario_log, log_usuarios.data_log, log_usuarios.hora_log, log_usuarios.id_tipo_log, log_usuarios.historico_log, tipo_log_usuarios.descricao_tipo_log_usuarios, usuarios.nome_usuario from log_usuarios, tipo_log_usuarios, usuarios where (log_usuarios.id_tipo_log = tipo_log_usuarios.id_tipo_log_usuarios and log_usuarios.id_usuario_log = usuarios.id_usuario) order by log_usuarios.id_log_usuario desc"

		}
		conn.query(sql,callback)		
	}

	this.verificaEscola = function(pesquisa, callback){
		conn.query("select nome_escola from escolas where nome_escola = '" + pesquisa.nome_escola + "'", callback)
	}

	this.salvaEscola = function(escola, callback){
		conn.query('insert into escolas set ?', escola, callback)
	}

	this.avaliacoes = function(id_usuario, id_escola,  callback){		
		conn.query("select * from avaliacoes where id_usuario_avaliacao = " + id_usuario + " and id_escola_avaliacao = " + id_escola, callback)
	}

	this.retornaNomeEscola = function(id_escola, callback){
		conn.query("select nome_escola from escolas where id_escola = " + id_escola,callback)
	}
	this.numeroAvaliacao = function(id_usuario, id_escola, callback){
		conn.query("select id_avaliacao from avaliacoes where id_usuario_avaliacao = " + id_usuario + " and id_escola_avaliacao = " + id_escola, callback);
	}

	this.incluiAvaliacao = function(id_usuario, id_escola, nome_avaliacao, data, callback){
		var sql = "insert into avaliacoes (id_usuario_avaliacao, id_escola_avaliacao, nome_avaliacao, data_cadastro) values (" + id_usuario + "," + id_escola + ",'" + nome_avaliacao + "','" + data + "')"
		
		conn.query(sql,callback);
	} 

	this.getEscolas = function(pesquisa, perfil, id_usuario, callback){
		if (perfil == "Administrador"){
			var sql = "select escolas.id_escola, escolas.nome_escola, escolas.cep_escola, escolas.rua_escola, escolas.numero_escola, escolas.complemento_escola, escolas.cidade_escola, escolas.estado_escola, escolas.telefone_escola, escolas.responsavel_escola, escolas.id_usuario_escola, usuarios.nome_usuario from escolas join usuarios on escolas.id_usuario_escola = usuarios.id_usuario where escolas.nome_escola like '%" + pesquisa.nome_escola + "%'";
		}else{
			var sql = "select escolas.id_escola, escolas.nome_escola, escolas.cep_escola, escolas.rua_escola, escolas.numero_escola, escolas.complemento_escola, escolas.cidade_escola, escolas.estado_escola, escolas.telefone_escola, escolas.responsavel_escola, escolas.id_usuario_escola, usuarios.nome_usuario from escolas join usuarios on escolas.id_usuario_escola = usuarios.id_usuario where id_usuario_escola = " + id_usuario + " and escolas.nome_escola like '%" + pesquisa.nome_escola + "%'";
		}
		conn.query(sql, callback);
	}

	this.editaEscola = function(escola, callback){
		var sql = "update escolas set nome_escola = '" + escola.nome_escola + "', cep_escola = '" + escola.cep_escola + "', rua_escola = '" + escola.rua_escola + "', numero_escola = '" + escola.numero_escola + "', complemento_escola = '" + escola.complemento_escola + "', cidade_escola = '" + escola.cidade_escola + "', estado_escola = '" + escola.estado_escola + "', telefone_escola = '" + escola.telefone_escola + "', responsavel_escola = '" + escola.responsavel_escola + "' where id_escola = " + escola.id_escola;
		conn.query(sql,callback);
	}

	this.temAvaliacoes = function(id_escola, callback){
		var sql = "select id_avaliacao from avaliacoes where id_escola_avaliacao = " + id_escola;
		conn.query(sql, callback);
	}

	this.excluiEscola = function(id_escola, callback){
		var sql = "delete from escolas where id_escola = " + id_escola ;
		conn.query(sql,callback);
	}

	this.abreAvaliacao = function(id_avaliacao, callback){
		var sql = "select * from avaliacoes where id_avaliacao = " + id_avaliacao;
		conn.query(sql, callback);
	}

	this.abreRotas = function(id_avaliacao, callback){
		var sql = "select * from rotas where id_avaliacao = " + id_avaliacao;
		conn.query(sql, callback);
	}

	this.criaRota = function(id_avaliacao, tipo_rota, nome_rota, callback){
		var sql = "insert into rotas (id_avaliacao, tipo_rota, nome_rota) values (" + id_avaliacao + "," + tipo_rota + ",'" + nome_rota + "')";
		conn.query(sql,callback);
	}
	
	this.verificaPontos = function(dados, callback){
		var sql = "select * from pontos where id_avaliacao = " + dados.id_avaliacao + " and tabela = '" + dados.tabela + "' and item = " + dados.item;
		conn.query(sql, callback);
	}

	this.atualizaPontos = function(dados, callback){
		var sql = "update pontos set pontos = " + dados.pontos + ", media = " + dados.media + " where id_avaliacao = " + dados.id_avaliacao + " and tabela = '" + dados.tabela + "' and item = " + dados.item;
		conn.query(sql, callback);
	}

	this.atualizaMedia = function(dados, media, callback){
		var sql = "update pontos set media = " + media + " where id_avaliacao = " + dados.id_avaliacao + " and tabela = '" + dados.tabela + "' and item = " + dados.item;
		conn.query(sql, callback);
	}

	this.incluiPontos = function(dados, callback){
		var sql = "insert into pontos (id_avaliacao, tabela, pontos, item, vale, soma_total, media) values (" + dados.id_avaliacao + ",'" + dados.tabela + "'," + dados.pontos + "," + dados.item + "," + dados.vale + ",'" + dados.soma_total + "'," + dados.media + ")";
		conn.query(sql, callback);
	}

	this.somaTotal = function(dados, callback){
		var sql = "select sum(pontos) as total from pontos where id_avaliacao = " + dados.id_avaliacao + " and tabela = '" + dados.tabela + "' and soma_total = 'S'";
		conn.query(sql, callback);
	}

	this.abreTabela = function(dados, callback){
		var sql = "select * from pontos where tabela = '" + dados.tabela + "'";
		conn.query(sql, callback);
	}

	
	this.somaMediaTotal = function(dados, callback){
		var sql = "select sum(media) as media_total from pontos where id_avaliacao = " + dados.id_avaliacao + " and tabela = '" + dados.tabela + "'";
		conn.query(sql, callback);
	}

	this.verificaTotal = function(dados, callback){
		var sql = "select * from pontos_total where id_avaliacao = " + dados.id_avaliacao + " and tabela = '" + dados.tabela + "'";
		conn.query(sql, callback);
	}

	this.incluiTotal = function(dados, pontos_total, media_total, callback){
		var sql = "insert into  pontos_total (id_avaliacao, tabela, pontos_total, media_total) values (" +  dados.id_avaliacao + ",'" + dados.tabela  + "',"  + pontos_total + "," + media_total + ")";
		conn.query(sql, callback);
	}

	this.atualizaTotal = function(dados, pontos_total, media_total, callback){
		var sql = "update pontos_total set pontos_total = " + pontos_total + ", media_total = " + media_total + " where id_avaliacao = " + dados.id_avaliacao + " and tabela  = '" + dados.tabela + "'";
		conn.query(sql, callback); 
	}

	this.atualizaMediaTotal = function(dados, media_total, callback){
		var sql = "update pontos_total set media_total = " + media_total + " where id_avaliacao = " + dados.id_avaliacao + " and tabela  = '" + dados.tabela + "'";
		conn.query(sql, callback); 
	}

	this.carregaPontos = function(id_avaliacao, callback){
		var sql = "select * from pontos where id_avaliacao = " + id_avaliacao + " order by tabela"
		conn.query(sql, callback); 
	}
	this.carregaPontosTotal = function(id_avaliacao, callback){
		var sql = "select distinct tabela, pontos_total, id_avaliacao, media_total from pontos_total where id_avaliacao = " + id_avaliacao
		conn.query(sql, callback); 
	}

	this.verificaEspelhoEscada = function(dados, callback){		
		var sql = "select * from espelho_escada where id_avaliacao = " + dados.id_avaliacao + " and rota = " + dados.rota + " and escada = " + dados.escada + " and degrau = " + dados.degrau + " and tipo = '" + dados.tipo + "'";
		conn.query(sql, callback); 
	}

	this.atualizaEspelhoEscada = function(dados, callback){		
		var sql = "update espelho_escada set  medida = " + dados.medida  + " where id_avaliacao = " + dados.id_avaliacao + " and rota = " + dados.rota + " and escada = " + dados.escada + " and degrau = " + dados.degrau + " and tipo = '" + dados.tipo + "'";
		conn.query(sql, callback); 
	}

	this.gravaEspelhoEscada = function(dados, callback){
		var sql = "insert into espelho_escada (id_avaliacao, escada, rota, degrau, tipo, medida) values (" + dados.id_avaliacao + "," + dados.escada + "," + dados.rota + "," + dados.degrau + ",'" + dados.tipo + "'," + dados.medida + ")";
		conn.query(sql, callback); 
	}

	this.carregaEspelhoEscada = function(id_avaliacao, callback){
		var sql = "select * from espelho_escada where id_avaliacao = " + id_avaliacao;
		conn.query(sql, callback); 
	}
	
	this.verificaCorrimao = function(dados, callback){		
		var sql = "select * from corrimao where id_avaliacao = " + dados.id_avaliacao + " and rota = " + dados.rota + " and escada = " + dados.escada + " and tipo = '" + dados.tipo + "'";
		conn.query(sql, callback); 
	}
	
	this.atualizaCorrimao = function(dados, callback){		
		var sql = "update corrimao set  medida = " + dados.medida  + " where id_avaliacao = " + dados.id_avaliacao + " and rota = " + dados.rota + " and escada = " + dados.escada + " and tipo = '" + dados.tipo + "'";
		conn.query(sql, callback); 
	}

	this.gravaCorrimao = function(dados, callback){
		var sql = "insert into corrimao (id_avaliacao, rota, escada, tipo, medida) values (" + dados.id_avaliacao + "," + dados.rota + "," + dados.escada +  ",'" + dados.tipo + "'," + dados.medida + ")";
		conn.query(sql, callback); 
	}

	this.carregaCorrimao = function(id_avaliacao, callback){
		var sql = "select * from corrimao where id_avaliacao = " + id_avaliacao;
		conn.query(sql, callback); 
	}

	this.verificaRampa = function(dados, callback){		
		var sql = "select * from rampas where id_avaliacao = " + dados.id_avaliacao + " and rota = " + dados.rota + " and rampa = " + dados.rampa + " and tipo = '" + dados.tipo + "'";
		conn.query(sql, callback); 
	}
	
	this.atualizaRampa = function(dados, callback){		
		var sql = "update rampas set medida = " + dados.medida  + " where id_avaliacao = " + dados.id_avaliacao + " and rota = " + dados.rota + " and rampa = " + dados.rampa + " and tipo = '" + dados.tipo + "'";
		conn.query(sql, callback); 
	}

	this.gravaRampa = function(dados, callback){
		var sql = "insert into rampas (id_avaliacao, rota, rampa, tipo, medida) values (" + dados.id_avaliacao + "," + dados.rota +  "," + dados.rampa + ",'" + dados.tipo + "'," + dados.medida + ")";
		conn.query(sql, callback); 
	}

	this.carregaRampa = function(id_avaliacao, callback){
		var sql = "select * from rampas where id_avaliacao = " + id_avaliacao;
		conn.query(sql, callback); 
	}

	this.verificaCorrimaoRampa = function(dados, callback){		
		var sql = "select * from corrimao_rampa where id_avaliacao = " + dados.id_avaliacao + " and rota = " + dados.rota + " and rampa = " + dados.rampa + " and tipo = '" + dados.tipo + "'";
		conn.query(sql, callback); 
	}
	
	this.atualizaCorrimaoRampa = function(dados, callback){		
		var sql = "update corrimao_rampa set  medida = " + dados.medida  + " where id_avaliacao = " + dados.id_avaliacao + " and rota = " + dados.rota + " and rampa = " + dados.rampa + " and tipo = '" + dados.tipo + "'";
		conn.query(sql, callback); 
	}

	this.gravaCorrimaoRampa = function(dados, callback){
		var sql = "insert into corrimao_rampa (id_avaliacao, rota, rampa, tipo, medida) values (" + dados.id_avaliacao + "," + dados.rota + "," + dados.rampa +  ",'" + dados.tipo + "'," + dados.medida + ")";
		conn.query(sql, callback); 
	}

	this.carregaCorrimaoRampa = function(id_avaliacao, callback){
		var sql = "select * from corrimao_rampa where id_avaliacao = " + id_avaliacao;
		conn.query(sql, callback); 
	}

	
	this.verificaPorta = function(dados, callback){		
		var sql = "select * from portas where id_avaliacao = " + dados.id_avaliacao + " and porta = " + dados.porta + " and tipo_medida = '" + dados.tipo_medida + "'";
		conn.query(sql, callback); 
	}
	
	this.atualizaPorta = function(dados, callback){		
		var sql = "update portas set  medida = " + dados.medida  + " where id_avaliacao = " + dados.id_avaliacao + " and porta = " + dados.porta + " and tipo_medida = '" + dados.tipo_medida + "'";
		conn.query(sql, callback); 
	}

	this.gravaPorta = function(dados, callback){
		var sql = "insert into portas (id_avaliacao, porta, tipo_medida, medida) values (" + dados.id_avaliacao + "," + dados.porta +  ",'" + dados.tipo_medida + "'," + dados.medida + ")";
		conn.query(sql, callback); 
	}

	this.carregaPorta = function(id_avaliacao, callback){
		var sql = "select * from portas where id_avaliacao = " + id_avaliacao;
		conn.query(sql, callback); 
	}

	this.verificaBarras = function(dados, callback){		
		var sql = "select * from banheiros where id_avaliacao = " + dados.id_avaliacao + " and tipo = '" + dados.tipo + "' and item = '" + dados.item + "'";
		conn.query(sql, callback); 
	}
	
	this.atualizaBarras = function(dados, callback){		
		var sql = "update banheiros set  valor = '" + dados.valor  + "' where id_avaliacao = " + dados.id_avaliacao + " and tipo = '" + dados.tipo + "' and item = '" + dados.item + "'";
		conn.query(sql, callback); 
	}

	this.gravaBarras = function(dados, callback){
		var sql = "insert into banheiros (id_avaliacao, tipo, item, valor) values (" + dados.id_avaliacao + ",'" + dados.tipo +  "','" + dados.item + "','" + dados.valor + "')";
		conn.query(sql, callback); 
	}

	this.carregaBarras = function(id_avaliacao, callback){
		var sql = "select * from banheiros where id_avaliacao = " + id_avaliacao;
		conn.query(sql, callback); 
	}

	this.verificaBalcao = function(dados, callback){		
		var sql = "select * from balcao where id_avaliacao = " + dados.id_avaliacao + " and tipo = '" + dados.tipo + "'";
		conn.query(sql, callback); 
	}
	
	this.atualizaBalcao = function(dados, callback){		
		var sql = "update balcao set  medida = " + dados.medida  + " where id_avaliacao = " + dados.id_avaliacao + " and tipo = '" + dados.tipo + "'";
		conn.query(sql, callback); 
	}

	this.gravaBalcao = function(dados, callback){
		var sql = "insert into balcao (id_avaliacao, tipo, medida) values (" + dados.id_avaliacao + ",'" + dados.tipo +  "'," + dados.medida + ")";
		conn.query(sql, callback); 
	}

	this.carregaBalcao = function(id_avaliacao, callback){
		var sql = "select * from balcao where id_avaliacao = " + id_avaliacao;
		conn.query(sql, callback); 
	}

	this.excluiCorrimao = function(registro, callback){
		var sql = "delete from corrimao where id_avaliacao = " + registro.id_avaliacao + " and rota = " + registro.rota + " and escada = " + registro.escada + " and tipo = '" + registro.tipo + "'";
		conn.query(sql, callback); 
	}

	this.excluiCorrimaoRampa = function(registro, callback){
		var sql = "delete from corrimao_rampa where id_avaliacao = " + registro.id_avaliacao + " and rota = " + registro.rota + " and rampa = " + registro.rampa + " and tipo = '" + registro.tipo + "'";
		conn.query(sql, callback); 
	}

	this.excluiEspelhoEscada = function(registro, callback){
		var sql = "delete from espelho_escada where id_avaliacao = " + registro.id_avaliacao + " and rota = " + registro.rota + " and escada = " + registro.escada + " and degrau = " + registro.degrau + " and tipo = '" + registro.tipo + "'";
		conn.query(sql, callback); 
	}

	this.excluiRampa = function(registro, callback){
		var sql = "delete from rampas where id_avaliacao = " + registro.id_avaliacao + " and rota = " + registro.rota + " and rampa = " + registro.rampa + " and tipo = '" + registro.tipo + "'";
		conn.query(sql, callback); 
	}

	this.zeraPontosCorrimao = function(registro, callback){		
		var sql = "update pontos set valor = 0 where id_avaliacao = " + registro.id_avaliacao + " and tabela = '" + registro.tabela + "' and item > 2";
		conn.query(sql, callback); 
	}

	this.contaEscadas = function(registro,callback){
		var sql = "select count(distinct escada) as escadas from espelho_escada where id_avaliacao = " + registro.id_avaliacao + " and rota = " + registro.rota + " and tipo = 'p'";
		conn.query(sql, callback); 
	}

	this.contaDegraus = function(registro, callback){		
		var sql = "select count(degrau) as degraus from espelho_escada where id_avaliacao = " + registro.id_avaliacao + " and rota = " + registro.rota + " and tipo = 'p'";
		conn.query(sql, callback); 
	}

	this.contaRampas = function(registro, callback){		
		var sql = "select count(distinct rampa) as rampas from rampas where id_avaliacao = " + registro.id_avaliacao + " and rota = " + registro.rota + " and tipo = 'd'";
		conn.query(sql, callback); 
	}

	this.excluiMudancaNiveis = function(registro, callback){
		if (registro.rota == '1'){
			var sql = "delete from pontos where id_avaliacao = " + registro.id_avaliacao + " and tabela = '1.7.4'"; 
		}else{
			var sql = "delete from pontos where id_avaliacao = " + registro.id_avaliacao + " and tabela = '" + registro.rota +".6.4'"; 
		}
		conn.query(sql, callback);
	}

	this.excluiMudancaNiveisTotal = function(registro, callback){
		if (registro.rota == '1'){
			var sql = "delete from pontos_total where id_avaliacao = " + registro.id_avaliacao + " and tabela = '1.7.4'"; 
		}else{
			var sql = "delete from pontos_total where id_avaliacao = " + registro.id_avaliacao + " and tabela = '" + registro.rota +".6.4'"; 
		}
		conn.query(sql, callback);
	}
}


module.exports = usuariosDAO;