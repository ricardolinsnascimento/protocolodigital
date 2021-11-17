const usuariosDAO = require('../models/usuariosDAO');

module.exports.index = function(application, req, res){	
	if (req.session.autorizado){
		var email = req.session.email_usuario;		
		res.render('index', {email: email, validacao: {}, dadosForm:{}});
	}else{		
		res.render('index', {email: {}, dadosForm:{}, validacao:{} });		
	}	
}

module.exports.painel = function(application, req, res){	
	if (req.session.autorizado){
		var id_usuario = req.session.id_usuario;
		var email = req.session.email_usuario;
		var nome = req.session.nome_usuario;
		var perfil = req.session.perfil;
		var status = req.session.status_usuario;
		var id_escola = req.session.id_escola;

		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.listaEscolas(req.session.id_usuario, function(error,result){
			connection.end();
			if(error){
				console.log(error);
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{
				escolas = result;
				res.render("painel", {id_escola: id_escola, id_usuario: id_usuario, status:status, msg:{}, email:email, perfil:perfil, escolas:escolas})
			}
		});
		res.render("painel", {id_escola: id_escola,  id_usuario: id_usuario, status:status, msg: {}, nome: nome, email:email, perfil:perfil})
	}else{		
		res.render('index', {email: {}, dadosForm:{}, validacao:{}});		
	}	
}

module.exports.login = function(application, req, res){	
	res.render('login', {validacao: {}, msg:{}});
}


module.exports.logout = function(application, req, res){
	req.session.destroy( function(err){		
		res.render("index", {email:{}, dadosForm:{}, validacao:{}});
	});
	
}

module.exports.autenticar = function(application, req, res){
	var dadosForm = req.body;
	if (req.session.autorizado || req.session.email_usuario == dadosForm.email_usuario){
		var id_usuario = req.session.id_usuario;
		var email = req.session.email_usuario;
		var perfil = req.session.perfil;
		var plano = req.session.plano_usuario;
		var status = req.session.status_usuario;
		
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);
		usuariosModel.listaEscolas(req.session.id_usuario, function(error,result){
			connection.end();
			if(error){
				console.log(error);
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{
				escolas = result;
				res.render("painel", {id_escola: 0, id_usuario: id_usuario, status:status, msg:{}, email:email, perfil:perfil, escolas:escolas})
			}
		});
	}else{		
		
		req.assert('email_usuario', 'O e-mail não pode ser vazio').notEmpty();
		req.assert('senha_usuario', 'Senha não pode ser vazia').notEmpty();
		var erros = req.validationErrors();
		if(erros){			
			res.render("login", {validacao:erros, msg:{}});
			return;
		}
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);
		
		usuariosModel.autenticar(dadosForm, function(error,result){
			if(error){
				connection.end();
				console.log(error);
				var erros = [{
					msg: "O sistema está indisponível no momento. tente novamente mais tarde"
				}];

				res.render('login', {validacao:erros, msg:{}})
				
			}else{
				if (result.length == 0){
					connection.end();
					var erros = [{
						msg: "E-mail ou senha inválidos. Tente novamente"
					}];
					res.render('login', {validacao:erros, msg:{}})
				}else{
					
					if (result[0].status_usuario == 'desativado'){
						connection.end();
						var erros = [{
							msg: "Login indisponível. Sua conta está desativada. Entre em contato com a equipe "
						}];
						res.render('login', {validacao:erros})
					}else{
						req.session.autorizado = true;
						req.session.id_usuario = result[0].id_usuario,
						req.session.status_usuario = result[0].status_usuario;						
						req.session.nome_usuario = result[0].nome_usuario;
						req.session.email_usuario = result[0].email_usuario;
						req.session.perfil = result[0].perfil;			
						req.session.id_escola = 0;								
						nome = req.session.nome_usuario;		
						usuariosModel.listaEscolas(req.session.id_usuario, function(error,result){
							connection.end();
							if(error){
								console.log(error);
								res.send("O sistema está indisponível no momento. tente novamente mais tarde")
							}else{	
								escolas = result;
								res.render('painel',{id_escola: req.session.id_escola, id_usuario:id_usuario, status: req.session.status_usuario, perfil: req.session.perfil, msg: {}, nome:nome, escolas:escolas})
							}
						});
					}
				}
			}
		})
	}
}

module.exports.gravarCadastro = function(application, req, res){	
	
	if (req.session.autorizado){
		var email = req.session.email_usuario;		
	}else{
		var email = "";		
	}
	var dadosForm = req.body;
	
	req.assert('nome_usuario', 'O nome deve ter entre 10 e 100 caracteres').len(10,100);	
	req.assert('email_usuario', 'E-mail inválido').notEmpty();	
	req.assert('telefone_usuario', 'O telefone não pode ser vazio').notEmpty();	
	req.assert('senha_usuario', 'A senha deve ter pelo menos 6 caracteres').len(6,100);
	req.assert('senha_usuario', 'Confirmação de senha não coincide').equals(req.body.senha_usuario2);		
	req.assert('cep_usuario', 'O CEP não pode ser vazio').notEmpty();	
	
	var erros = req.validationErrors();

	if(erros){
		res.render('index', {email: email, validacao: erros, dadosForm: dadosForm});
		return;
	}

	var connection = application.config.dbConnection();
	var usuariosModel = new usuariosDAO(connection);

	usuariosModel.verificaCadastro(dadosForm, function(error, result){
		if (error){
			connection.end();
			var erros = {
				msg: "O sistema está indisponível no momento. tente novamente mais tarde"
			};
			res.render('index', {email: email, validacao: erros, dadosForm: dadosForm});
		}else{			
			if (result.length > 0){
				connection.end();
				var erros = [{
					msg: "O E-mail informado já está cadastrados"
				}];
				res.render('index', {email: email, validacao: erros, dadosForm: dadosForm});
			}else{
				
				//Inclui a data de cadastro
				var data = new Date();
				var moment = require('moment');
				var hora = moment().format("HH:mm:ss")

				var data_log = data;
				dadosForm.data_cadastro = data;
				dadosForm.status_usuario = 'cadastrado';
				dadosForm.perfil = 'usuário';
				delete dadosForm.senha_usuario2;
				
				usuariosModel.salvarUsuario(dadosForm,  function(error, result){			
					if (error){		
						connection.end();		
						console.log(error);
						res.send("Houve um problema interno ao salvar o usuário. Este recurso está indisponível momentaneamente")
					}else{
						usuariosModel.retornaUsuario(dadosForm.email_usuario, function(error,result){
							if(error){
								connection.end();
								console.log(error);
								
								res.send("Houve um problema interno ao retornar os dados do usuário. Este recurso está indisponível momentaneamente")
							}else{
								
								var log_usuario = {
									id_usuario_log: result[0].id_usuario,
									data_log:data_log,
									hora_log: hora,
									id_tipo_log: 1,
									historico_log: dadosForm.nome_usuario,
								};
								
								usuariosModel.registraLogUsuario(log_usuario, function(error,result){
									connection.end();
									if(error){
										console.log(error);
										res.send("Houve um problema interno ao registrar o cadastro do usuário. Este recurso está indisponível momentaneamente")
									}else{
										var msg = "Cadastro realizado com sucesso. Faça seu login para entrar no sistema"										
										res.render('login', {msg: msg, validacao:{}});	
									}
									
								})
							}
						})
									
					}			
				});
			}
		}
	})
}

module.exports.mudaSenha = function(application, req, res){
	var dadosForm = req.query;

	if (req.session.autorizado){
		dadosForm.email_usuario = req.session.email_usuario;
		var perfil = req.session.perfil;
	}else{
		var perfil = " "
	}

	var connection = application.config.dbConnection();
	var usuariosModel = new usuariosDAO(connection);	
	dadosForm.token = "interno";
	usuariosModel.atualizaToken(dadosForm, function(error,result){
		connection.end();
		res.render('novasenha', {perfil: perfil, email: dadosForm.email_usuario, token:dadosForm.token, validacao:{}, status:req.session.status });	
	})
	
}


module.exports.atualizaSenha = function(application, req, res){
	var dadosForm = req.body;
	
	
	req.assert('senha_usuario', 'Senha não pode ser vazia').notEmpty();
	req.assert('senha_usuario', 'Senha não coincide').equals(req.body.senha_usuario2);

	var erros = req.validationErrors();

	if(erros){
		//console.log(erros)
		res.render('novasenha', {email: dadosForm.email_usuario, token:dadosForm.token, validacao:erros, status:req.session.status});	
		return;
	}
	const now = new Date();	
	dadosForm.hora = now;
	var connection = application.config.dbConnection();
	var usuariosModel = new usuariosDAO(connection);	

	var data = new Date();
	var moment = require('moment');
	var hora = moment().format("HH:mm:ss")

	var data_log = data;

	usuariosModel.verificaToken(dadosForm, function(error,result){
		if(error){
			connection.end();
			console.log(error);
			res.send("Não foi possível realizar a mudança de senha. Tente novamente mais tarde.")
		}else{			
			if (result.length > 0){
				usuariosModel.atualizaSenha(dadosForm, function(error,result){
					if(error){
						connection.end();
						var erros = [{
							msg: "Houve uma indisponibilida do sistema nesse momento. Refaça a operação"
						}];
						res.render('novasenha', {email: dadosForm.email_usuario, token:dadosForm.token, validacao:erros, status:req.session.status});			
					}else{					
						usuariosModel.retornaUsuarioporEmail(dadosForm.email_usuario, function(error,result){
							if(error){
								connection.end();
								console.log(error);					
								res.send("Houve um problema interno. Este recurso está indisponível momentaneamente")
							}else{
								var log_usuario = {
									id_usuario_log: result[0].id_usuario,
									data_log:data_log,
									hora_log: hora,
									id_tipo_log: 2,
									historico_log: result[0].nome_usuario,
								};
								usuariosModel.registraLogUsuario(log_usuario, function(error,result){
									connection.end();
									if (error){
										res.send("Ocorreu um erro interno")
										console.log(error)
									}else{
										req.session.destroy( function(err){
											res.render('senhaAlterada');
										})
									}
								})
							}
						});			
					}
				});

			}else{
				console.log("result vazio do verifica token")
				res.send("Não foi possível realizar a mudança de senha. Tente novamente mais tarde.")
			}			

		}
	});
	
}


module.exports.atualizarCadastro = function(application, req, res){	
	if (req.session.autorizado){
		var email_usuario = req.session.email_usuario;	
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);
		usuariosModel.retornaUsuarioporEmail(email_usuario, function(error,result){
			connection.end();
			if (error){
				console.log(error);
				res.send("Houve um erro interno. Tente novamente mais tarde")
			}else{
				var dadosForm = result[0];
				var email = req.session.email_usuario;			
				var perfil = req.session.perfil;
				res.render('atualizarCadastro', {perfil:perfil, email:email, validacao:{}, dadosForm:dadosForm , status:req.session.status})
			}
		})
	}else{
		var msg = "Faça seu login para continuar";
		res.render('login', {validacao:{}, msg:msg})		
	}	
}

module.exports.salvaAtualizacao = function(application, req, res){	
	
	var dadosForm = req.body;
	
	var perfil = req.session.perfil;
	var status = req.session.status_usuario;
	var id_usuario = req.session.id_usuario; 
		
	req.assert('cep_usuario', 'O CEP não pode ser vazio').notEmpty();	
	req.assert('telefone_usuario', 'O telefone não pode ser vazio').notEmpty();
	
	
	var erros = req.validationErrors();

	if(erros){
		res.render('AtualizarCadastro', {perfil: perfil, email: dadosForm.email_usuario, validacao: erros, dadosForm: dadosForm , status:req.session.status});
		return;
	}

	var connection = application.config.dbConnection();
	var usuariosModel = new usuariosDAO(connection);

	usuariosModel.salvaAtualizacao(dadosForm, function(error, result){
		connection.end();
		if (error){
			res.send("O sistema está indisponível no momento. Tente mais tarde")			
		}else{
			var msg = "O seu cadastro foi atualizado com sucesso"
			res.render("painel", {id_escola: req.session.id_escola, id_usuario: id_usuario, status: status, msg:msg, nome: dadosForm.nome_usuario, email:dadosForm.email_usuario, perfil:perfil})
			
		}
	})
	
}

module.exports.enviaContato = function(application, req, res){
	var dadosForm = req.body;
	var nome = dadosForm.nome;
	var email = dadosForm.email;
	var telefone = dadosForm.telefone;
	var mensagem = dadosForm.mensagem;

	var nodemailer = require('nodemailer');	//módulo para mandar e-mail automatico para o usuário
	var $usuario = 'contato@protocolodigital.net';
	var $copia = 'eduardo.manzini@unesp.br';
	var $senha = 'manzini.nascimento@';
				
	var transporter = nodemailer.createTransport({
		host: 'smtp.umbler.com',
		port: "587",	   
		auth: {
			user: $usuario,
			pass: $senha,
		},
		tls:{
			rejectUnauthorized: false,
		}, 
	});
	var $destinatario = email;
	var $corpoEmail = "\nEste é um e-mail automáticao do protocolodigital.net. Contato recebido \n\nNome: " + nome +"\nEmail: " + email + "\nTelefone: " + telefone + "\nMensagem: " + mensagem;

	var mailOptions = {
		from: $usuario,
		to: $destinatario,
		cc: $usuario,
		bcc: $copia,
		subject: 'E-mail automático do protocolodigital.net',
		text: $corpoEmail
	};
			
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
			res.send('houve um erro ao enviar o e-mail. Essa função está indisponível no momento');
		} else {
			res.render("contatoEnviado")
		}
	});

}



