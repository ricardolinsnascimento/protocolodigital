const usuariosDAO = require('../models/usuariosDAO');
const avaliacaoController = require('../controllers/avaliacao')

const avaliacao = require('../routes/avaliacao');

module.exports.incluiEscola = function(application, req, res){	
	if (req.session.autorizado){              
        res.render('incluiEscola', {dadosForm:{}, validacao:{}, perfil: req.session.perfil, msg: {}, status:req.session.status})
        
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}	
}

module.exports.escolas = function(application, req, res){	
	if (req.session.autorizado){ 

		nome_escola = '';		
		var pesquisa = {nome_escola:nome_escola}
		
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);
		usuariosModel.getEscolas(pesquisa, req.session.perfil, req.session.id_usuario, function(error, result){
			if(error){
				connection.end();		
				console.log(error);
				res.send("O sistema está indisponível no momento. tente novamente mais tarde");
			}else{
				var escolas = result;
				res.render("escolas", {id_usuario:req.session.id_usuario, registros:escolas,  busca:{},  msg:{}, status:req.session.status, perfil:req.session.perfil});	
			}
		})
        
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}	
}

module.exports.buscaEscola = function(application, req, res){	
	if (req.session.autorizado){ 
		if (req.query.nome_escola){
			nome_escola = req.query.nome_escola;
		}else{
			nome_escola = '';
		}
		var pesquisa = {nome_escola:nome_escola}

		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);
		usuariosModel.getEscolas(pesquisa, req.session.perfil, req.session.id_usuario, function(error, result){
			if(error){
				connection.end();		
				console.log(error);
				res.send("O sistema está indisponível no momento. tente novamente mais tarde");
			}else{
				var escolas = result;
				res.render("escolas", {id_usuario:req.session.id_usuario, registros:escolas,  busca:pesquisa,  msg:{}, status:req.session.status, perfil:req.session.perfil});	
			}
		})
        
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}	
}

module.exports.salvaEscola = function(application, req, res){		
	if (req.session.autorizado){	
		var dadosForm = req.body; 
		var email = req.session.email_usuario;
		var id_usuario = req.session.id_usuario;
		dadosForm.numero_escola = parseInt(dadosForm.numero_escola);
		if (isNaN(dadosForm.numero_escola)){
			dadosForm.numero_escola = 0;
		}	
		req.assert('nome_escola', 'O nome da escola não pode ser vazio').notEmpty();					
		req.assert('cep_escola', 'O CEP não pode ser vazio').notEmpty();			
		var erros = req.validationErrors();
		if(erros){
			res.render('incluiEscola', {dadosForm:dadosForm, validacao:erros, perfil: req.session.perfil, msg: {}, status:req.session.status})
			return;
		}

		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.verificaEscola(dadosForm, function(error, result){
			if (error){
				console.log(error);
				connection.end();
				var erros = {
					msg: "O sistema está indisponível no momento. tente novamente mais tarde"
				};
				res.render('index', {email: email, validacao: erros, dadosForm: dadosForm});
			}else{			
				if (result.length > 0){
					
					var erros = [{
						msg: "A escola informada já está cadastrada"
					}];
					res.render('incluiEscola', {dadosForm:dadosForm, validacao:erros, perfil: req.session.perfil, msg: {}, status:req.session.status})
				}else{
					
					//Inclui a data de cadastro
					var data = new Date();
					var moment = require('moment');
					var hora = moment().format("HH:mm:ss")
					var data_log = data;
					dadosForm.data_cadastro = data;
					dadosForm.id_usuario_escola = req.session.id_usuario; 
					
					usuariosModel.salvaEscola(dadosForm,  function(error, result){			
						if (error){		
							connection.end();		
							console.log(error);
							res.send("Houve um problema interno ao salvar o usuário. Este recurso está indisponível momentaneamente")
						}else{
							usuariosModel.listaEscolas(req.session.id_usuario, function(error,result){
								connection.end();
								if(error){
									console.log(error);
									res.send("O sistema está indisponível no momento. tente novamente mais tarde")
								}else{
									var msg = "Escola incluída com sucesso"
									escolas = result;
									
									res.render("painel", {id_escola: req.session.id_escola, id_usuario: id_usuario, status:req.session.status, msg:msg, email:email, perfil:req.session.perfil, escolas:escolas})
								}
							});
										
						}			
					});
				}
			}
		})
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.avaliacoes = function(application, req, res){		
	if (req.session.autorizado){
		var id_escola = req.query.id_escola;
		var id_usuario = req.session.id_usuario;
		var email = req.session.email_usuario;
		var perfil = req.session.perfil; 

		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.avaliacoes(id_usuario, id_escola,  function(error, result){	
			if(error){				
				req.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{				
				avaliacoes = result;
				
				usuariosModel.listaEscolas(req.session.id_usuario, function(error,result){
					connection.end();
					if(error){
						console.log(error);
						res.send("O sistema está indisponível no momento. tente novamente mais tarde");
					}else{											
						escolas = result;						
						res.render("painel", {id_escola: id_escola, avaliacoes: avaliacoes, id_usuario: id_usuario, status:req.session.status, msg:{}, email:email, perfil:perfil, escolas:escolas})
					}
				});
			}
		})		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.incluiAvaliacao = function(application, req, res){	
	if (req.session.autorizado){            

		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);
		var id_escola = req.query.id_escola;	
		var moment = require('moment');
        var data =  moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
      
		usuariosModel.retornaNomeEscola(id_escola, function(error,result){
			if(error){
				connection.end();
				console.log(error);
				res.send("O sistema está indisponível no momento. tente novamente mais tarde");
			}else{
				var nome_escola = result[0].nome_escola;
				usuariosModel.numeroAvaliacao(req.session.id_usuario, id_escola, function(error,result){
					if(error){
						connection.end();
						console.log(error);
						res.send("O sistema está indisponível no momento. tente novamente mais tarde");
					}else{						
						var nome_avaliacao = nome_escola+"-"+ (result.length  + 1);
						usuariosModel.incluiAvaliacao(req.session.id_usuario, id_escola, nome_avaliacao, data, function(error,result){	
							connection.end();				
							if(error){
								console.log(error);
								res.send("O sistema está indisponível no momento. tente novamente mais tarde");
							}else{
								res.redirect("avaliacoes?id_escola="+id_escola)		
							}
						});

					}
				})
			}
		})      
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}	
}

module.exports.editaEscola = function(application, req, res){	
	
	if (req.session.autorizado){	
		var dadosForm = req.body; 		
		dadosForm.numero_escola = parseInt(dadosForm.numero_escola);
		if (isNaN(dadosForm.numero_escola)){
			dadosForm.numero_escola = 0;
		}

		nome_escola = '';		
		var pesquisa = {nome_escola:nome_escola}
	
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.editaEscola(dadosForm,  function(error, result){			
			if (error){		
				connection.end();		
				console.log(error);
				res.send("Houve um problema interno ao salvar o usuário. Este recurso está indisponível momentaneamente")
			}else{
				usuariosModel.getEscolas(pesquisa, req.session.perfil, req.session.id_usuario, function(error, result){
					if(error){
						connection.end();		
						console.log(error);
						res.send("O sistema está indisponível no momento. tente novamente mais tarde");
					}else{
						var escolas = result;
						var msg = "Cadastro alterado com sucesso"
						res.render("escolas", {id_usuario:req.session.id_usuario, registros:escolas,  busca:{},  msg:msg, status:req.session.status, perfil:req.session.perfil});	
					}
				})
							
			}			
		});
				
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.excluirEscola = function(application, req, res){	
	
	if (req.session.autorizado){	
		var id_escola = req.query.id_escola; 	

		nome_escola = '';		
		var pesquisa = {nome_escola:nome_escola}
		
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		//Verifica se tem avaliacoes vinculadas a escola

		usuariosModel.temAvaliacoes(id_escola, function(error, result){
			if(error){
				connection.end();		
				console.log(error);
				res.send("Houve um problema interno ao salvar o usuário. Este recurso está indisponível momentaneamente")
			}else{
				if (result.length > 0){					
					usuariosModel.getEscolas(pesquisa, req.session.perfil, req.session.id_usuario, function(error, result){
						connection.end();		
						if(error){							
							console.log(error);
							res.send("O sistema está indisponível no momento. tente novamente mais tarde");
						}else{
							var escolas = result;
							msg = "Não é possível excluir a escola, pois existem avaliações vinculadas"
							res.render("escolas", {id_usuario:req.session.id_usuario, registros:escolas,  busca:{},  msg:msg, status:req.session.status, perfil:req.session.perfil});	
						}
					})
				}else{
					usuariosModel.excluiEscola(id_escola, function(error,result){
						if(error){
							connection.end();		
							console.log(error);
							res.send("O sistema está indisponível no momento. tente novamente mais tarde");
						}else{
							usuariosModel.getEscolas(pesquisa, req.session.perfil, req.session.id_usuario, function(error, result){
								connection.end();	
								if(error){										
									console.log(error);
									res.send("O sistema está indisponível no momento. tente novamente mais tarde");
								}else{
									var escolas = result;
									msg = "Escola excluída com sucesso"
									res.render("escolas", {id_usuario:req.session.id_usuario, registros:escolas,  busca:{},  msg:msg, status:req.session.status, perfil:req.session.perfil});	
								}
							})

						}

					});
				}
			}
		})		
				
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.abreAvaliacao = function(application, req, res){		
	if (req.session.autorizado){
		//console.log(req.query)
		
		var id_avaliacao = req.query.id_avaliacao;
		var perfil = req.session.perfil; 
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);
		
		usuariosModel.abreAvaliacao(id_avaliacao,  function(error, result){	
			if(error){		
				connection.end();	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{				
				var avaliacao = result[0];
				usuariosModel.abreRotas(id_avaliacao, function(error,result){
					if(error){
						connection.end();	
						res.send("O sistema está indisponível no momento. tente novamente mais tarde")
					}else{
						if (result.length == 0){
							for(var i=1; i<=7; i++){
								var nome_rota;
								switch(i){
									case 1: nome_rota = '1. Entrada de Alunos para salas de aula 1'; break;
									case 2: nome_rota = '2. Salas de aula 1 para conjunto de salas de aulas 2'; break;
									case 3: nome_rota = '3. Salas de aula para outros blocos de salas de aula'; break;
									case 4: nome_rota = '4. Salas de aula 1 para banheiros'; break;
									case 5: nome_rota = '5. Salas de aula 1 para bebedouros'; break;
									case 6: nome_rota = '6. Salas de aula 1 para secretaria'; break;
									case 7: nome_rota = '7. Salas de aula 1 para quadra esportiva'; break;
								}
								usuariosModel.criaRota(id_avaliacao, i, nome_rota, function(error,result){
									if(error){
										connection.end();
										res.send("Houve um erro ao criar as rotas dessa avaliação")
									}
								})
							}
							usuariosModel.abreRotas(id_avaliacao, function(error,result){
								connection.end();
								if(error){									
									res.send("O sistema está indisponível no momento. tente novamente mais tarde");
								}else{
									rotas = result;
									res.render("avaliacao", {avaliacao:avaliacao, rotas:rotas, id_usuario: req.query.id_usuario, status:req.session.status, msg:{}, email:req.session.email_usuario, perfil:req.session.perfil})						
								}
							});
						}else{
							connection.end();
							rotas = result;
							res.render("avaliacao", {avaliacao:avaliacao, rotas:rotas, id_usuario: req.query.id_usuario, status:req.session.status, msg:{}, email:req.session.email_usuario, perfil:req.session.perfil})						
						}
					}

				})				
			}
		})
				
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.gravaPontos = function(application, req, res){		
	if (req.session.autorizado){
		
		var dados = req.query;
		
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);
		
		usuariosModel.verificaPontos(dados,  function(error, result){	
			if(error){		
				connection.end();	
				console.log(error)
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{				
				if (result.length > 0){
					usuariosModel.atualizaPontos(dados, function(error,result){
						connection.end();	
						if(error){			
							console.log(error)				
							res.send("O sistema está indisponível no momento. tente novamente mais tarde")
							
						}else{						
							avaliacaoController.atualizaTotal(application, req, res);
						}
					})
				}else{
					usuariosModel.incluiPontos(dados, function(error,result){
						connection.end();
						if(error){			
							console.log(error)					
							res.send("O sistema está indisponível no momento. tente novamente mais tarde")							
						}else{							
							avaliacaoController.atualizaTotal(application, req, res);
						}

					})
				}				
			}
		})
				
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.atualizaTotal = function(application, req, res){		
	if (req.session.autorizado){		
		
		var dados = req.query;		
		//console.log("Atualiza Total")
		//console.log(dados);
		
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.somaTotal(dados, function(error,result){
			if(error){			
				connection.end();				
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{
				var pontos_total = result[0].total;
				//console.log("Pontos_total: " + pontos_total);

				usuariosModel.somaMediaTotal(dados, function(error,result){
					if(error){			
						connection.end();				
						console.log(error)	
						res.send("O sistema está indisponível no momento. tente novamente mais tarde")
					}else{
						var media_total = result[0].media_total;
						usuariosModel.verificaTotal(dados, function(error,result){
							if(error){			
								connection.end();	
								console.log(error)				
								res.send("O sistema está indisponível no momento. tente novamente mais tarde")
							}else{
								if (result.length > 0){
									//console.log("Vai atualizar")
									usuariosModel.atualizaTotal(dados, pontos_total, media_total,  function(error,result){
										connection.end();	
										if(error){																
											console.log(error)		
											res.send("O sistema está indisponível no momento. tente novamente mais tarde")
										}else{
											res.send({});									
										}
									})

								}else{
									//console.log("Não Vai atualizar")
									usuariosModel.incluiTotal(dados, pontos_total, media_total, function(error,result){
										connection.end();		
										if(error){			
											console.log(error)			
											res.send("O sistema está indisponível no momento. tente novamente mais tarde")
										}else{
											res.send({});	
										}
									})

								}

							}

						})	
					}
				})			
			}
		})
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}


module.exports.carregaPontos = function(application, req, res){		
	if (req.session.autorizado){
		
		var id_avaliacao = req.query.id_avaliacao;		
		
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.carregaPontos(id_avaliacao, function(error,result){
			connection.end();
			if(error){			
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{								
				pontos = result;				
				res.send(pontos);				
			}
		})
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.carregaPontosTotal = function(application, req, res){		
	if (req.session.autorizado){
		
		var id_avaliacao = req.query.id_avaliacao;		
		
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.carregaPontosTotal(id_avaliacao, function(error,result){
			connection.end();		
			if(error){									
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{								
				var pontos_total = result;
				res.send(pontos_total);
			}
		})
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.gravaEspelhoEscada = function(application, req, res){		
	if (req.session.autorizado){		
		var dados = req.query;		
		//console.log(dados)
		//console.log("Entrou no GravaEspelhoEscada")
		dados.medida = dados.medida.replace(",", ".");		
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.verificaEspelhoEscada(dados, function(error,result){
			if(error){			
				connection.end();				
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{
				if (result.length > 0){
					usuariosModel.atualizaEspelhoEscada(dados, function(error,result){
						connection.end();
						if(error){														
							console.log(error)	
							res.send("O sistema está indisponível no momento. tente novamente mais tarde")
						}else{
							res.send({})
						}
					})
				}else{
					
					usuariosModel.gravaEspelhoEscada(dados, function(error,result){						
						connection.end();	
						if(error){													
							console.log(error)	
							res.send("O sistema está indisponível no momento. tente novamente mais tarde")
						}else{
							res.send({})
						}
					})

				}
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.carregaEspelhoEscada = function(application, req, res){		
	if (req.session.autorizado){
		
		var id_avaliacao = req.query.id_avaliacao;				
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.carregaEspelhoEscada(id_avaliacao, function(error,result){
			connection.end();	
			if(error){										
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{				
				res.send(result)						
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.gravaCorrimao = function(application, req, res){		
	if (req.session.autorizado){		
		var dados = req.query;		
		//console.log(dados)
		dados.medida = dados.medida.replace(",", ".");		
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.verificaCorrimao(dados, function(error,result){
			if(error){			
				connection.end();				
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{
				if (result.length > 0){
					usuariosModel.atualizaCorrimao(dados, function(error,result){
						connection.end();
						if(error){														
							console.log(error)	
							res.send("O sistema está indisponível no momento. tente novamente mais tarde")
						}else{
							res.send(result)
						}
					})
				}else{
					
					usuariosModel.gravaCorrimao(dados, function(error,result){						
						connection.end();	
						if(error){													
							console.log(error)	
							res.send("O sistema está indisponível no momento. tente novamente mais tarde")
						}else{
							res.send(result)
						}
					})

				}
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.carregaCorrimao = function(application, req, res){		
	if (req.session.autorizado){
		
		var id_avaliacao = req.query.id_avaliacao;				
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.carregaCorrimao(id_avaliacao, function(error,result){
			connection.end();			
			if(error){								
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{				
				res.send(result)						
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.gravaRampa = function(application, req, res){		
	if (req.session.autorizado){		
		var dados = req.query;		
		//console.log(dados)
		dados.medida = dados.medida.replace(",", ".");		
		var connection = application.config.dbConnection();
		var usuariosModel = new application.app.models.usuariosDAO(connection);

		usuariosModel.verificaRampa(dados, function(error,result){
			if(error){			
				connection.end();				
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{
				if (result.length > 0){
					usuariosModel.atualizaRampa(dados, function(error,result){
						connection.end();
						if(error){														
							console.log(error)	
							res.send("O sistema está indisponível no momento. tente novamente mais tarde")
						}else{
							res.send(result)
						}
					})
				}else{
					
					usuariosModel.gravaRampa(dados, function(error,result){						
						connection.end();	
						if(error){													
							console.log(error)	
							res.send("O sistema está indisponível no momento. tente novamente mais tarde")
						}else{
							res.send(result)
						}
					})

				}
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.carregaRampa = function(application, req, res){		
	if (req.session.autorizado){
		
		var id_avaliacao = req.query.id_avaliacao;				
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.carregaRampa(id_avaliacao, function(error,result){
			connection.end();
			if(error){			
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{				
				res.send(result)						
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.gravaCorrimaoRampa = function(application, req, res){		
	if (req.session.autorizado){		
		var dados = req.query;		
		//console.log(dados)
		dados.medida = dados.medida.replace(",", ".");		
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.verificaCorrimaoRampa(dados, function(error,result){
			if(error){			
				connection.end();				
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{
				if (result.length > 0){
					usuariosModel.atualizaCorrimaoRampa(dados, function(error,result){
						connection.end();
						if(error){														
							console.log(error)	
							res.send("O sistema está indisponível no momento. tente novamente mais tarde")
						}else{
							res.send(result)
						}
					})
				}else{
					
					usuariosModel.gravaCorrimaoRampa(dados, function(error,result){						
						connection.end();	
						if(error){													
							console.log(error)	
							res.send("O sistema está indisponível no momento. tente novamente mais tarde")
						}else{
							res.send(result)
						}
					})

				}
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.carregaCorrimaoRampa = function(application, req, res){		
	if (req.session.autorizado){
		
		var id_avaliacao = req.query.id_avaliacao;				
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.carregaCorrimaoRampa(id_avaliacao, function(error,result){
			connection.end();		
			if(error){									
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{				
				res.send(result)						
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}


module.exports.gravaPorta = function(application, req, res){		
	if (req.session.autorizado){		
		var dados = req.query;		
		
		dados.medida = dados.medida.replace(",", ".");		
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.verificaPorta(dados, function(error,result){
			if(error){			
				connection.end();				
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{
				if (result.length > 0){
					if (dados.medida){
						usuariosModel.atualizaPorta(dados, function(error,result){
							connection.end();
							if(error){														
								console.log(error)	
								res.send("O sistema está indisponível no momento. tente novamente mais tarde")
							}else{
								res.send(result)
							}
						})
					}else{
						usuariosModel.excluiPorta(dados, function(error,result){
							connection.end();
							if(error){														
								console.log(error)	
								res.send("O sistema está indisponível no momento. tente novamente mais tarde")
							}else{
								res.send(result)
							}
						})
					}
					
				}else{
					
					usuariosModel.gravaPorta(dados, function(error,result){						
						connection.end();	
						if(error){													
							console.log(error)	
							res.send("O sistema está indisponível no momento. tente novamente mais tarde")
						}else{
							res.send(result)
						}
					})

				}
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.gravaBarras = function(application, req, res){		
	if (req.session.autorizado){		
		var dados = req.query;		
		//console.log(dados)
		
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.verificaBarras(dados, function(error,result){
			if(error){			
				connection.end();				
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{
				if (result.length > 0){
					usuariosModel.atualizaBarras(dados, function(error,result){
						connection.end();
						if(error){														
							console.log(error)	
							res.send("O sistema está indisponível no momento. tente novamente mais tarde")
						}else{
							res.send(result)
						}
					})
				}else{
					
					usuariosModel.gravaBarras(dados, function(error,result){						
						connection.end();	
						if(error){													
							console.log(error)	
							res.send("O sistema está indisponível no momento. tente novamente mais tarde")
						}else{
							res.send(result)
						}
					})

				}
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}


module.exports.carregaPorta = function(application, req, res){		
	if (req.session.autorizado){
		
		var id_avaliacao = req.query.id_avaliacao;				
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.carregaPorta(id_avaliacao, function(error,result){
			connection.end();
			if(error){			
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{				
				res.send(result)						
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.carregaBarras = function(application, req, res){		
	if (req.session.autorizado){
		
		var id_avaliacao = req.query.id_avaliacao;				
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.carregaBarras(id_avaliacao, function(error,result){
			connection.end();
			if(error){			
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{				
				res.send(result)						
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.gravaBalcao = function(application, req, res){		
	if (req.session.autorizado){		
		var dados = req.query;		
		//console.log(dados)
		
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.verificaBalcao(dados, function(error,result){
			if(error){			
				connection.end();				
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{
				if (result.length > 0){
					usuariosModel.atualizaBalcao(dados, function(error,result){
						connection.end();
						if(error){														
							console.log(error)	
							res.send("O sistema está indisponível no momento. tente novamente mais tarde")
						}else{
							res.send(result)
						}
					})
				}else{
					
					usuariosModel.gravaBalcao(dados, function(error,result){						
						connection.end();	
						if(error){													
							console.log(error)	
							res.send("O sistema está indisponível no momento. tente novamente mais tarde")
						}else{
							res.send(result)
						}
					})

				}
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.carregaBalcao = function(application, req, res){		
	if (req.session.autorizado){
		
		var id_avaliacao = req.query.id_avaliacao;				
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.carregaBalcao(id_avaliacao, function(error,result){
			connection.end();
			if(error){			
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{				
				res.send(result)						
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}


module.exports.excluiCorrimao = function(application, req, res){		
	if (req.session.autorizado){
		
		var registro = req.query;				
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.excluiCorrimao(registro, function(error,result){
			connection.end();
			if(error){			
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{				
				res.send(result)						
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.excluiCorrimaoRampa = function(application, req, res){		
	if (req.session.autorizado){
		
		var registro = req.query;				
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.excluiCorrimaoRampa(registro, function(error,result){
			connection.end();
			if(error){			
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{				
				res.send(result)						
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.excluiEspelhoEscada = function(application, req, res){		
	if (req.session.autorizado){

		//console.log("Entrou no ExcluiEspelhoEscada")
		
		var registro = req.query;				
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.excluiEspelhoEscada(registro, function(error,result){
			connection.end();
			if(error){			
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{				
				res.send({})						
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}


module.exports.excluiRampa = function(application, req, res){		
	if (req.session.autorizado){
		
		var registro = req.query;				
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.excluiRampa(registro, function(error,result){
			connection.end();
			if(error){			
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{				
				res.send({})						
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.zeraPontosCorrimao = function(application, req, res){		
	if (req.session.autorizado){
		
		var registro = req.query;				
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.zeraPontosCorrimao(registro, function(error,result){
			connection.end();
			if(error){			
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{				
				res.send({})						
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.tabelaMudancaNiveis = function(application, req, res){		
	if (req.session.autorizado){
		
		var registro = req.query;	
		//console.log("Entrou no tabelaMudancaNiveis")
		//console.log(registro)			
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);
		var degraus;
		var rampas;
		var escadas;

		usuariosModel.excluiMudancaNiveis(registro, function(error,result){
			if(error){	
				connection.end();						
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{
				//console.log("passou do excluiMudancaNiveis")
				usuariosModel.excluiMudancaNiveisTotal(registro, function(error,result){
					if(error){	
						connection.end();		
						console.log(error)	
						res.send("O sistema está indisponível no momento. tente novamente mais tarde")
					}else{
						//console.log("passou do excluiMudancaNiveisTotal")
						usuariosModel.contaDegraus(registro, function(error,result){			
							if(error){	
								connection.end();		
								console.log(error)	
								res.send("O sistema está indisponível no momento. tente novamente mais tarde")
							}else{	
								//console.log("passou do contaDegraus")
								degraus = result[0].degraus;
								usuariosModel.contaEscadas(registro, function(error,result){			
									if(error){	
										connection.end();		
										console.log(error)	
										res.send("O sistema está indisponível no momento. tente novamente mais tarde")
									}else{
										//console.log("passou do contaEscadas")
										escadas = result[0].escadas;
										usuariosModel.contaRampas(registro, function(error,result){
											connection.end();	
											if (error){
												console.log(error)	
												res.send("O sistema está indisponível no momento. tente novamente mais tarde")
											}else{
												//console.log("passou do contaRampas")
												rampas = result[0].rampas;
												var retorno = {
													degraus:degraus,
													escadas:escadas,
													rampas:rampas,
												}
												//console.log(retorno)
												res.send(retorno);
											}
										})
									}
								})
													
							}
						})

					}
				})				
			}
		})		
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.gravaBanheirosAcessiveis = function(application, req, res){		
	if (req.session.autorizado){		
		var dados = req.query;		
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.verificaBanheirosAcessiveis(dados, function(error,result){
			if(error){			
				connection.end();				
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{
				if (result.length > 0){
					usuariosModel.atualizaBanheirosAcessiveis(dados, function(error,result){
						connection.end();
						if(error){														
							console.log(error)	
							res.send("O sistema está indisponível no momento. tente novamente mais tarde")
						}else{
							res.send(result)
						}
					})
				}else{					
					usuariosModel.gravaBanheirosAcessiveis(dados, function(error,result){						
						connection.end();	
						if(error){													
							console.log(error)	
							res.send("O sistema está indisponível no momento. tente novamente mais tarde")
						}else{
							res.send(result)
						}
					})

				}
			}
		})

	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}

module.exports.carregaBanheirosAcessiveis = function(application, req, res){		
	if (req.session.autorizado){
		
		var id_avaliacao = req.query.id_avaliacao;				
		var connection = application.config.dbConnection();
		var usuariosModel = new usuariosDAO(connection);

		usuariosModel.carregaBanheirosAcessiveis(id_avaliacao, function(error,result){
			connection.end();
			if(error){			
				console.log(error)	
				res.send("O sistema está indisponível no momento. tente novamente mais tarde")
			}else{				
				res.send(result)						
			}
		})
		
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}
}






