module.exports.usuarios = function(application, req, res){	
	if (req.session.autorizado){
        
        if (req.session.perfil == "Administrador"){
            var connection = application.config.dbConnection();
            var usuariosModel = new application.app.models.usuariosDAO(connection);
            usuariosModel.getUsuarios(function(error,result){
                connection.end();

                if (error){
                    console.log(error);
                    res.send("Houve um erro interno. Tente novamente mais tarde")
                }else{
                    var usuarios = result;				
                    res.render('usuarios', {perfil: req.session.perfil, msg: {}, usuarios:usuarios, status:req.session.status})
                }
            })
        }else{
            req.session.destroy( function(err){                
                res.render("index", {validacao:{}, dadosForm:{}, email:{}});
            });
        }
	}else{
		res.render("index", {validacao:{}, dadosForm:{},  email:{}});	
	}	
}

module.exports.buscaUsuario = function(application, req, res){	
    if (req.session.autorizado){        
        if (req.session.perfil == "Administrador"){
            var pesquisa = req.query.nome_usuario;            
            var connection = application.config.dbConnection();
            var usuariosModel = new application.app.models.usuariosDAO(connection);
            var perfil = req.session.perfil;
            usuariosModel.buscaUsuario(pesquisa, function(error,result){
                connection.end();

                if (error){
                    console.log(error);
                    res.send("Houve um erro interno. Tente novamente mais tarde")
                }else{
                   
                    var usuarios = result;				
                    var msg = ""
                    res.render('usuarios', {perfil: perfil, msg: msg, usuarios:usuarios, status:req.session.status})
                }
            })
        }else{
            req.session.destroy( function(err){                
                res.render("index", {validacao:{}, dadosForm:{}, email:{}});
            });
        }
	}else{
		res.render("index", {validacao:{}, dadosForm:{}, email:{}});	
	}	
}

module.exports.autorizarUsuario = function(application, req, res){	
    if (req.session.autorizado){        
        if (req.session.perfil == "Administrador"){
            var id = req.query.id_usuario;
            var connection = application.config.dbConnection();
            var usuariosModel = new application.app.models.usuariosDAO(connection);
            var perfil = req.session.perfil;
            usuariosModel.autorizaUsuario(id, function(error,result){
                connection.end();

                if (error){
                    console.log(error);
                    res.send("Houve um erro interno. Tente novamente mais tarde")
                }else{                    
                    var usuarios = result;				
                  
                    res.send(result)
                }
            })
        }else{
            req.session.destroy( function(err){                
                res.render("index", {validacao:{}, dadosForm:{}, email:{}});
            });
        }
	}else{
		res.render("index", {validacao:{}, dadosForm:{}, email:{}});	
	}	
}

module.exports.suspendeUsuario = function(application, req, res){	
    if (req.session.autorizado){        
        if (req.session.perfil == "Administrador"){
            var id = req.query.id_usuario;
            var connection = application.config.dbConnection();
            var usuariosModel = new application.app.models.usuariosDAO(connection);
            var perfil = req.session.perfil;
            usuariosModel.suspendeUsuario(id, function(error,result){
                connection.end();

                if (error){
                    console.log(error);
                    res.send("Houve um erro interno. Tente novamente mais tarde")
                }else{                    
                    var usuarios = result;				
                  
                    res.send(result)
                }
            })
        }else{
            req.session.destroy( function(err){                
                res.render("index", {validacao:{}, dadosForm:{}, email:{}});
            });
        }
	}else{
		res.render("index", {validacao:{}, dadosForm:{}, email:{}});	
	}	
}

module.exports.reativaUsuario = function(application, req, res){	
    if (req.session.autorizado){        
        if (req.session.perfil == "Administrador"){
            var id = req.query.id_usuario;
            var connection = application.config.dbConnection();
            var usuariosModel = new application.app.models.usuariosDAO(connection);
            var perfil = req.session.perfil;
            usuariosModel.reativaUsuario(id, function(error,result){
                connection.end();

                if (error){
                    console.log(error);
                    res.send("Houve um erro interno. Tente novamente mais tarde")
                }else{                    
                    var usuarios = result;				
                  
                    res.send(result)
                }
            })
        }else{
            req.session.destroy( function(err){                
                res.render("index", {validacao:{}, dadosForm:{}, email:{}});
            });
        }
	}else{
		res.render("index", {validacao:{}, dadosForm:{}, email:{}});	
	}	
}

module.exports.logUsuarios = function(application, req, res){	
	
	if (req.session.autorizado){
        if (req.session.perfil == "Administrador"){
            var pesquisa = req.query;

            var connection = application.config.dbConnection();
            var administracaoModel = new application.app.models.usuariosDAO(connection);
            
            administracaoModel.logUsuarios(pesquisa,  function(error, result){	
                connection.end();
                if (error){
                    console.log(error);
                    res.send("Houve um problema interno. Este recurso está indisponível momentaneamente")

                }else{
                    registros = result;
                    res.render("log_usuarios", {perfil: req.session.perfil, log:result, busca:pesquisa, status:req.session.status})

                }
            });
        }
    }
}

