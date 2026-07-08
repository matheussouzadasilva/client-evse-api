class Carrinho
{
    static formToJSON(form) 
    {
        var codigo = "";

        if (form.codigo != undefined) {
            codigo = form.codigo.value;
        }

        return JSON.stringify({
            "produto_id_produto": codigo,
            "quantidade": form.txtNome.value
        });
    }

    static carregaQtdProdutos()
    {
        var idProduto = document.getElementById("codigo").value;
        var xhr = Util.createXHR();

        if(xhr != undefined) {
            //Montar requisição

            xhr.open("GET","http://localhost:9999/api/v1/carrinho/carrega-qtd-placas-recomendada");
            //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("idProduto", idProduto);
            xhr.onreadystatechange = function() {
                //Verificar pelo estado "4" de pronto.
                if (xhr.readyState == 4) {
                    var json = JSON.parse(xhr.responseText);
                    document.getElementById("txtNome").value = json.carrinho[0].nr_placas;
                    Util.prototype.ajaxcount++;
                }
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(); 
        }
    }

    static carregaProduto()
    {
        var xhr = Util.createXHR();

        if(xhr != undefined) {
            //Montar requisição

            xhr.open("GET","http://localhost:9999/api/v1/carrinho/listar-tudo");
            //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                //Verificar pelo estado "4" de pronto.
                if (xhr.readyState == 4) {
                    var json = JSON.parse(xhr.responseText);
                    var len         = json.carrinho.length;
                    var temRegistro = false;
                    var strHTML     = '';
                    var potencia_inversor_escolhido = 0;
                    var passou = false;

                    for (var i=0; i < len; i++) {
                        var codigo  = json.carrinho[i].id_produto;
                        var nome    = json.carrinho[i].nome;
                        var tipo_produto    = json.carrinho[i].tipo_produto;
                        var inversor_escolhido    = json.carrinho[i].inversor_escolhido;
                        var descricao             = json.carrinho[i].descricao;
                        
                        if (inversor_escolhido == 1 && tipo_produto == 2) {
                            potencia_inversor_escolhido = (json.carrinho[i].potencia/220)*1.2;
                            strHTML =  strHTML + "<option id=\"cdiv"+codigo+"\" value=\""+codigo+"\">"+nome+"</option>";
                        } 

                        if (inversor_escolhido == 0 && tipo_produto == 2) { 
                            strHTML =  strHTML + "<option id=\"cdiv"+codigo+"\" value=\""+codigo+"\">"+nome+"</option>";
                        }  

                        if (inversor_escolhido == 0 && tipo_produto != 2 && tipo_produto != 3) {
                            strHTML =  strHTML + "<option id=\"cdiv"+codigo+"\" value=\""+codigo+"\">"+nome+"</option>";
                        } 

                        if (tipo_produto == 3 && potencia_inversor_escolhido >= 12 && potencia_inversor_escolhido <= 13.9 && descricao == "4mm") {
                            strHTML =  strHTML + "<option id=\"cdiv"+codigo+"\" value=\""+codigo+"\">"+nome+"</option>";
                        }

                        if (tipo_produto == 3 && potencia_inversor_escolhido >= 14 && potencia_inversor_escolhido <= 15.9 && descricao == "5mm") {
                            strHTML =  strHTML + "<option id=\"cdiv"+codigo+"\" value=\""+codigo+"\">"+nome+"</option>";
                        }

                        if (tipo_produto == 3 && potencia_inversor_escolhido >= 16 && potencia_inversor_escolhido <= 17 && descricao == "6mm") {
                            strHTML =  strHTML + "<option id=\"cdiv"+codigo+"\" value=\""+codigo+"\">"+nome+"</option>";
                        }

                        temRegistro = true; 
                    }

                    if (temRegistro == false) {
                        strHTML = "<option value=\"\">Nenhuma conta de energia cadastrada</option>";
                    }  

                    document.getElementById("codigo").innerHTML = strHTML;
                    Util.prototype.ajaxcount++;
                }
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(); 
        }     
    }


    static carregaValorTotal()
    {
        var xhr = Util.createXHR();

        if(xhr != undefined) {
            //Montar requisição

            xhr.open("GET","http://localhost:9999/api/v1/carrinho/carrega-valor-total");
            //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                //Verificar pelo estado "4" de pronto.
                var strHTML     = '';

                if (xhr.readyState == 4) {
                    var json = JSON.parse(xhr.responseText);
                    var valor    = json.carrinho[0].valorTotal.toFixed(2);
                    document.getElementById("valorTotal").innerHTML = "<p>O valor total do projeto é R$ "+valor+"</p>";
                }

                    Util.prototype.ajaxcount++;
                }
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send();   
    }


    


    static carregaValorRetornoInvestimentoAvista()
    {
        var xhr = Util.createXHR();

        if(xhr != undefined) {
            //Montar requisição

            xhr.open("GET","http://localhost:9999/api/v1/carrinho/retorno-investimento-avista");
            //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                //Verificar pelo estado "4" de pronto.
                var strHTML     = '';

                if (xhr.readyState == 4) {
                    var json = JSON.parse(xhr.responseText);
                    var valor    = json.meses.toFixed(2);
                    document.getElementById("retornaDeInvestimentoAvista").innerHTML = "<p>O seu retorno de investimento avista é de "+valor+" meses</p>";
                }

                    Util.prototype.ajaxcount++;
                }
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send();   
    }


    static carregaValorRetornoInvestimentoAprestacao(form)
    {
        var xhr = Util.createXHR();

        if(xhr != undefined) {
            //Montar requisição

            xhr.open("GET","http://localhost:9999/api/v1/carrinho/retorno-investimento-aprazo");
            //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("parcela", document.getElementById("parcela").value);
            xhr.setRequestHeader("meses", document.getElementById("meses").value);

            xhr.onreadystatechange = function() {
                //Verificar pelo estado "4" de pronto.
                var strHTML     = '';

                if (xhr.readyState == 4) {
                    var json = JSON.parse(xhr.responseText);
                    var valor    = json.meses.toFixed(2);
                    document.getElementById("retornaDeInvestimentoAprazo").innerHTML = "<p>O seu retorno de investimento a prestação é de "+valor+" meses</p>";
                }

                    Util.prototype.ajaxcount++;
                }
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send();   
    }

    static listar()
    {
        var jwtoken,codigo,detalhes,alterar,excluir;

        jwtoken = Util.getCookie('token');

        var table = jQuery('#tabela01').dataTable( {
        processing: true,
        serverSide: true,
        dom: "Bfrtip",        
        ajax : {
         "url": 'http://localhost:9999/api/v1/carrinho',
         "dataType": 'json',
         "type": "GET",
         "beforeSend": function(xhr){
            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
         }
        },
        columns: [
        {
        "class": "details-control",
        "orderable": false,
        "searchable": false,
        "searchable": false,
        "data": null, 
        render: function ( data, type, row ) {

            codigo = data.id;

            // Combine the first and last names into a single table field
            detalhes = "<a href=\"../formularios/carrinho.htm?op=2&codigo="
            + codigo
            + "\"><i class='fa-solid fa-info'></i></a>";

            alterar = "<span>  </span><a href=\"../formularios/carrinho.htm?op=1&codigo="
            + codigo
            + "\"><i class='fa-solid fa-edit'></i></a>";

            excluir = "<span>  </span><a href=\"javascript:Carrinho.confirmar("
            + codigo
            + ")\"><i class='fa-solid fa-trash'></i></a>";

            //console.log(row);
            return detalhes+alterar+excluir;
        }, 
        "defaultContent": "",
        },

        { "data": "id" , name: "id", "width": "60px" },
        { "data": "nomeProduto"  },
        { "data": "quantidade" },
        { "data": "valorTotalProduto" },
        { "data": "valorMaoDeObra" },
        { "data": "valorTotal" },


        ],
        select: true,
        'language': {
        'url': '../../js/Portuguese-Brasil.json'
        }

        });
    }

    static detalhe(codigo)
    {
        var xhr = Util.createXHR();
        xhr.open("GET","http://localhost:9999/api/v1/carrinho/"+codigo,true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            //Verificar pelo estado "4" de pronto.

            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    //Pegar dados da resposta json
                    var data = JSON.parse(xhr.responseText);
                    document.getElementById("codigo").value = data[0].produto_id_produto;
                    document.getElementById("txtNome").value = data[0].quantidade;
                } else if (xhr.status == 429) {
                    document.getElementById("mensagem").innerHTML = "<br /><b>você foi bloqueado por 3 minutos por que voce fez muitas requisições ao sistema, aguarde.</b>";
                }
            }
        }

        var jwtoken = '';
        jwtoken = Util.getCookie('token');

        xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        xhr.send();
    }

    static callbackCadAltDel(xhr, op)
    {
        var msg = "";

        if (op === 'cad') {
            msg = "Produto adicionado no carrinho com sucesso.";
        } else if (op === 'alt') {
            msg = "Produto alterado no carrinho com sucesso.";
        }

        //Verificar pelo estado "4" de pronto.
        if (xhr.readyState == 4) {
            //Pegar dados da resposta json
            var json = "";

            if (xhr.status !== 429) {
                json = JSON.parse(xhr.responseText);
            }

            if (xhr.status == 200 || xhr.status == 201) {

                if (op == 'cad') {
                    document.getElementById("txtNome").value = "";
                }

                if (op !== 'exc') {
                    document.getElementById("mensagem").innerHTML = msg;
                }
                
            } else if (xhr.status == 422) {
                var strErrosValidate = "";

                if (json.validate_error !== undefined && json.validate_error.nome !== undefined) {
                    strErrosValidate += json.validate_error.dataCompra[0];
                }

                if (strErrosValidate !== '') {
                    document.getElementById("mensagem").innerHTML = "<br /><b>"+strErrosValidate+"</b>";    
                } else {
                    document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                }
                
            } else if (xhr.status == 500) {                 
                if (json.error !== undefined && json.error === 'token_invalid') {
                    document.getElementById("mensagem").innerHTML = "<br /><b>Token inválido. Faça o login novamente.</b>";
                } else {
                    document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                }
            } else if (xhr.status == 401) {
                if (json.error !== undefined && json.error === 'token_expired') {
                    document.getElementById("mensagem").innerHTML = "<br /><b>Token expirado. Faça o login novamente.</b>";
                } else {
                    document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                }
            } else if (xhr.status === 429) {
                document.getElementById("mensagem").innerHTML = "<br /><b>você foi bloqueado por 3 minutos por que voce fez muitas requisições ao sistema, aguarde.</b>";
            } else {
                document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
            }
        }
    }

    static confirmar(codigo)
    {
        var xhr = Util.createXHR();
        var ok = window.confirm("Você tem certeza que deseja excluir esta compra do carrinho?");

        if (ok && xhr != undefined) {
            var mensagem = "";

            if (codigo == "") {
                mensagem += "Código invalido";
            }

            if(mensagem == "") {
                xhr.open("DELETE","http://localhost:9999/api/v1/carrinho/"+codigo, true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.onreadystatechange = function() {
                    Carrinho.callbackCadAltDel(xhr, 'exc');
                    location.reload();
                }

                var jwtoken = '';
                jwtoken = Util.getCookie('token');

                xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
                xhr.send();
            } else {
                alert(mensagem);
            } 
        }
    }

    static cadastrar(form) 
    {
        document.getElementById("mensagem").innerHTML = "<br /><b>Aguarde...</b>";
        var xhr = Util.createXHR();
        var mensagem = "";

        if (form.txtNome.value == "") {
            mensagem += "<br /><b>Você não preencheu o carrinho</b>";
        }

        if (Util.getCookie('token') == "") {
            mensagem += "Token inválido";
        }
                
        if (mensagem == "" && xhr != undefined) {
            xhr.open("POST","http://localhost:9999/api/v1/carrinho",true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                Carrinho.callbackCadAltDel(xhr, 'cad');
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(Carrinho.formToJSON(form));
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        }
    }

    static atualizar(form) 
    {
        document.getElementById("mensagem").innerHTML = "<br /><b>Aguarde...</b>";
        
        var codigo = form.codigo.value;
        var mensagem = "";

        if (Util.getCookie('token') == "") {
            mensagem += "Token invalido";
        }

        if (codigo == "" || codigo == undefined) {
            mensagem += "Código invalido";
        }
        
        if (document.getElementById("txtNome").value == "") {
            mensagem += "<br /><b>Você não preencheu o Carrinho</b>";
        }
        
        var consulta = "";

        var xhr = Util.createXHR();

        if(mensagem == "" && xhr != undefined) {
            xhr.open("PUT","http://localhost:9999/api/v1/carrinho/"+codigo,true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                Carrinho.callbackCadAltDel(xhr, 'alt');
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(Carrinho.formToJSON(form));
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        } 
    }
}
