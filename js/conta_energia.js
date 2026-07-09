class Conta
{
    static formataDataParaDB(value) 
    {
    let date = new Date(value);
    const day = date.toLocaleString('default', { day: '2-digit' });
    const month = date.toLocaleString('default', { month: '2-digit' });
    const year = date.toLocaleString('default', { year: '4-digit' });
    return  year+'-'+month+'-'+day;
    }

    static formToJSON(form) 
    {
        var codigo = "", dataVencimento = "", valor = "", kw = "";

        if (form.codigo != undefined) {
            codigo = form.codigo.value;
        }

        if (form.txtDataVencimento != undefined) {
            dataVencimento = form.txtDataVencimento.value;
        }

        if (form.txtValor != undefined) {
            valor = form.txtValor.value;
        }

        if (form.txtKw != undefined) {
            kw = form.txtKw.value;
        }



        return JSON.stringify({
            "id_conta_energia": codigo,
            "dataVencimento": dataVencimento,
            "valor": valor,
            "kw": kw
        });
    }

    static listar()
    {
        var jwtoken,codigo,detalhes,alterar,excluir;

        jwtoken = Util.getCookie('token');

        console.log("antes do datatable");

        jQuery('#tabela01').DataTable({

            processing: true,
            serverSide: true,

            dom: "Bfrtip",

            ajax: {
                url: 'http://localhost:9999/api/v1/contas_energia',
                dataType: 'json',
                type: 'GET',

                beforeSend: function(xhr){
                    xhr.setRequestHeader(
                        'Authorization',
                        'Bearer ' + jwtoken
                    );
                },

                dataSrc: function(json){
                    console.log("DATA RECEBIDO:", json);

                    return json.data; // <-- importante
                },

                error: function(xhr, status, error){
                    console.log("ERRO API:", xhr, status, error);
                }
            },


            columns: [

                {
                    className: "details-control",
                    orderable: false,
                    searchable: false,
                    data: null,

                    render: function(data, type, row){

                        codigo = row.id_conta_energia;

                        detalhes =
                        "<a href=\"../formularios/conta.htm?op=2&codigo="
                        + codigo +
                        "\"><i class='fa-solid fa-info'></i></a>";

                        alterar =
                        "<a href=\"../formularios/conta.htm?op=1&codigo="
                        + codigo +
                        "\"><i class='fa-solid fa-edit'></i></a>";

                        excluir =
                        "<a href=\"javascript:Conta.confirmar("
                        + codigo +
                        ")\"><i class='fa-solid fa-trash'></i></a>";

                        return detalhes + alterar + excluir;
                    }
                },


                {
                    data: "id_conta_energia",
                    name: "id_conta_energia",
                    width:"60px"
                },

                {
                    data:"kw"
                },

                {
                    data:"dataVencimento"
                },

                {
                    data:"valor"
                }

            ],


            select:true,

            language:{
                url:'../../js/Portuguese-Brasil.json'
            }

        });


        console.log("depois do datatable");
    }


    static convertDateBRtoUS(inputFormat) 
    {
        return inputFormat.split("/").reverse().join("-");
    }

    static detalhe(codigo)
    {
        var xhr = Util.createXHR();
        xhr.open("GET","http://localhost:9999/api/v1/contas_energia/"+codigo,true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            //Verificar pelo estado "4" de pronto.

            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    //Pegar dados da resposta json
                    var data = JSON.parse(xhr.responseText);
                    document.getElementById("codigo").value = data.id_conta_energia;

                    document.getElementById("txtDataVencimento").value = Conta.convertDateBRtoUS(data.dataVencimento);
                    document.getElementById("txtValor").value = data.valor;
                    document.getElementById("txtKw").value = data.kw;
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
            msg = "Conta cadastrada com sucesso.";
        } else if (op === 'alt') {
            msg = "Conta alterada com sucesso.";
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
                    document.getElementById("txtDataVencimento").value = "";
                }

                if (op !== 'exc') {
                    document.getElementById("mensagem").innerHTML = msg;
                }

            } else if (xhr.status == 422) {
                var strErrosValidate = "";

                if (json.validate_error !== undefined && json.json.validate_error.nome !== undefined) {
                    strErrosValidate += json.validate_error.nome[0];
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
            } else if (xhr.status == 429) {
                document.getElementById("mensagem").innerHTML = "<br /><b>você foi bloqueado por 3 minutos por que voce fez muitas requisições ao sistema, aguarde.</b>";
            }  else {
                document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
            }
        }
    }

    static confirmar(codigo)
    {
        var xhr = Util.createXHR();
        var ok = window.confirm("Você tem certeza que deseja excluir esta conta de energia?");

        if (ok) { 	 
            var mensagem = "";

            if (Util.getCookie('token') == "") {
                mensagem += "Token invalido";
            }

            if (codigo == "") {
                mensagem += "Código invalido";
            }
                    
            if (mensagem == "" && xhr != undefined) {
                xhr.open("DELETE","http://localhost:9999/api/v1/contas_energia/"+codigo,true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.onreadystatechange = function() {
                    Conta.callbackCadAltDel(xhr, 'exc');
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

        if (form.txtDataVencimento.value == "") {
            mensagem += "<br /><b>Você não preencheu a conta de energia</b>";
        }

        if (Util.getCookie('token') == "") {
            mensagem += "Token invalido";
        }

        if (mensagem == "" && xhr != undefined) {
            xhr.open("POST","http://localhost:9999/api/v1/contas_energia",true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                Conta.callbackCadAltDel(xhr, 'cad');
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(Conta.formToJSON(form));
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
        
        if (document.getElementById("txtDataVencimento").value == "") {
            mensagem += "<br /><b>Você não preencheu a Conta</b>";
        }
        
        var consulta = "";

        var xhr = Util.createXHR();

        if(mensagem == "" && xhr != undefined) {
            xhr.open("PUT","http://localhost:9999/api/v1/contas_energia/"+codigo,true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                Conta.callbackCadAltDel(xhr, 'alt');
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(Conta.formToJSON(form));
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        } 
    }
}
