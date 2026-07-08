class Usuario
{
    static formToJSON(form) 
    {
        var codigo        = '';
        var txtNome       = '';
        var txtEmail      = '';
        var txtSenha      = '';
        var txtSenhaAtual = '';
        var txtConfSenha  = '';

        if (form.id != undefined) {
            codigo = form.id.value;
        }

        if (form.codigo != undefined) {
            codigo = form.codigo.value;
        }

        if (form.txtNome != undefined) {
            txtNome = form.txtNome.value;
        }

        if (form.txtEmail != undefined) {
            txtEmail = form.txtEmail.value;
        }

        if (form.txtSenha != undefined) {
            txtSenha = form.txtSenha.value;
        }

        if (form.txtSenhaAtual != undefined) {
            txtSenhaAtual = form.txtSenhaAtual.value;
        }

        if (form.txtConfSenha != undefined) {
            txtConfSenha = form.txtConfSenha.value;
        }

        return JSON.stringify({
            "name":  txtNome,
            "email":  txtEmail,
            "password":  txtSenha,
            "password_confirmation":  txtConfSenha
        });
    }

    static callbackCadAlt(xhr, op)
    {
        var msg = "";

        if (op === 'cad') {
            msg = "Usuario cadastrado com sucesso.";
        } else if (op === 'alt') {
            msg = "Usuario alterado com sucesso.";
        }

        //Verificar pelo estado "4" de pronto.
        if (xhr.readyState == '4') {
            //Pegar dados da resposta json
            var json = JSON.parse(xhr.responseText);

            if (xhr.status == '200' || xhr.status == '201') {
               
                if (op == 'cad') {
                    document.getElementById("txtNome").value = "";
                    document.getElementById("txtEmail").value = "";
                    document.getElementById("txtSenha").value = "";
                    document.getElementById("txtConfSenha").value = "";
                }

                if (op == 'cad' || op == 'alt') {
                    document.getElementById("mensagem").innerHTML = msg;
                }

            } else if (xhr.status == '422') {
                var strErrosValidate = "";

                if (json.validate_error.name !== undefined) {
                    strErrosValidate += json.validate_error.name[0];
                }

                if (json.validate_error.email !== undefined) {
                    strErrosValidate += json.validate_error.email[0];
                }

                if (json.validate_error.password !== undefined) {
                    strErrosValidate += json.validate_error.password[0];
                }

                if (strErrosValidate !== '') {
                    document.getElementById("mensagem").innerHTML = "<br /><b>"+strErrosValidate+"</b>";    
                } else {
                    document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                }
            } else if (xhr.status == '500') {
                if (json.error !== undefined && json.error === 'token_invalid') {
                    document.getElementById("mensagem").innerHTML = "<br /><b>Token inválido. Faça o login novamente.</b>";
                } else {
                    document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                }
            } else if (xhr.status == '401') {
                if (json.error !== undefined && json.error === 'token_expired') {
                    document.getElementById("mensagem").innerHTML = "<br /><b>Token expirado. Faça o login novamente.</b>";
                } else {
                    document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                }
            } else {
                document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
            }
        }
    }

    static cadastrar(form) 
    {
        //verificar cadastro
        document.getElementById("mensagem").innerHTML = "<br /><b>Aguarde...</b>";  
        var xhr = Util.createXHR();
        var mensagem = "";

        if (form.txtNome.value == "") {
            mensagem += "<br /><b>Você não preencheu o nome</b>";
        }

        if (form.txtEmail.value == "") {
            mensagem += "<br /><b>Você não preencheu o email</b>";
        }

        if (form.txtSenha.value == "") {
            mensagem += "<br /><b>Você não preencheu a senha</b>";
        }

        
        if (form.txtConfSenha.value == "") {
            mensagem += "<br /><b>Você não preencheu a confirmação da senha</b>";
        }

        if (form.txtSenha.value !== form.txtConfSenha.value) {
            mensagem += "<br /><b>As senhas não conferem</b>";
        }
        

        if(mensagem == "" && xhr != undefined) {
            xhr.open("POST","http://localhost:9999/api/v1/cadusuario",true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                Usuario.callbackCadAlt(xhr, 'cad');
            }
            
            xhr.send(Usuario.formToJSON(form));
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        } 
    }

    static atualizar(form) 
    {
        document.getElementById("mensagem").innerHTML = "<br /><b>Aguarde...</b>";  
        var xhr = Util.createXHR();
        var mensagem = "";

        if (form.txtNome.value == "") {
            mensagem += "<br /><b>Você não preencheu a técnico</b>";
        }
        
        var token  = Util.getCookie('token');
        
        var consulta = "";

        if (token !== "") {
            consulta = "&tk="+token;
        }

        if(mensagem == "" && xhr != undefined) {
            xhr.open("POST","http://localhost/sistemaRest/api/v1/controller/torcedor.php?a=8"+consulta,true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                //Verificar pelo estado "4" de pronto.

                if (xhr.readyState == '4' && xhr.status == '200') {
                    //Pegar dados da resposta json
                    var json = JSON.parse(xhr.responseText);
                    document.getElementById("mensagem").innerHTML = "<br /><b>"+json.mensagem+"</b>";  
                }
            }
            
            xhr.send(Usuario.formToJSON(form));
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        } 
    }
    
    static alterarMinhaSenhaLogado(form)
    {
        document.getElementById("mensagem").innerHTML = "<br /><b>Aguarde...</b>";
        var xhr = Util.createXHR();
        var mensagem = "";

        if (form.txtSenha.value == "") {
            mensagem += "<br /><b>Você não preencheu a senha</b>";
        }

        if (form.txtConfSenha.value == "") {
            mensagem += "<br /><b>Você não preencheu a confirmação da nova senha</b>";
        }

        if(mensagem == "" && xhr != undefined) {
            xhr.open("PUT","http://localhost:9999/api/v1/altsenhalog",true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                //Verificar pelo estado "4" de pronto.

                if (xhr.readyState == '4') {
                    //Pegar dados da resposta json
                    var json = JSON.parse(xhr.responseText);

                    if (xhr.status == '200' || xhr.status == '201') {
                        document.getElementById("mensagem").innerHTML = "Senha alterada com sucesso.";
                    } else if (xhr.status == '422') {
                        var strErrosValidate = "";

                        if (json.validate_error.hasOwnProperty('password_current_invalid') == false) {
                            strErrosValidate += "<br /><b>Senha atual inválida.</b>";
                        }

                        if (json.validate_error.txtSenha !== undefined) {
                            strErrosValidate += json.validate_error.txtSenha[0];
                        }

                        if (json.validate_error.txtConfSenha !== undefined) {
                            strErrosValidate += json.validate_error.txtConfSenha[0];
                        }

                        if (strErrosValidate !== '') {
                            document.getElementById("mensagem").innerHTML = "<br /><b>"+strErrosValidate+"</b>";    
                        } else {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                        }
                    } else if (xhr.status == '500') {
                        if (json.error !== undefined && json.error === 'token_invalid') {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Token inválido. Faça o login novamente.</b>";
                        } else {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                        }
                    } else if (xhr.status == '401') {
                        if (json.error !== undefined && json.error === 'token_expired') {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Token expirado. Faça o login novamente.</b>";
                        } else {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                        }
                    } else {
                        document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                    }
                }
            }
            
            var form = JSON.stringify({
                "password_current":  form.txtSenhaAtual.value,
                "password":  form.txtSenha.value,
                "password_confirmation":  form.txtConfSenha.value;
            });

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(form);
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        }
    }

    static insereDadosUsuarioRetornados(codigo)  
    {
        var xhr = Util.createXHR();

        var token  = Util.getCookie('token');
        var consulta = "";

        if (token !== "") {
            consulta = "&tk="+token;
        }

        xhr.open("GET","http://localhost/sistemaRest/api/v1/controller/torcedor.php?a=7&id="+codigo+consulta,true);   
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            //Verificar pelo estado "4" de pronto.

            if (xhr.readyState == '4' && xhr.status == '200') {
                //Pegar dados da resposta json
                var json = JSON.parse(xhr.responseText);

                if (json.mensagem == undefined) {
                    document.getElementById("txtNome").value = json.nome;
                    document.getElementById("txtEmail").value = json.email;
                } else {
                    alert(json.mensagem);
                }
                
            }
        }

        xhr.send();
    }
    
}
