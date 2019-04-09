var UTILS = UTILS || {};
var database = firebase.database();

var dadosUsuario = {
    autenticado: false
}

$(document).ready(function () {
    // UTILS.getUsuario();
});

UTILS.desconectar = function () {
    firebase.auth().signOut().then(function () {
        UTILS.redirectIndex();
    }).catch(function (error) {
        // An error happened.
    });
}

UTILS.getUsuario = function () {
    if (!isGetPagina()) {
        firebase.auth().onAuthStateChanged(function (user) {

            if (user) {
                dadosUsuario.displayName = user.displayName;
                dadosUsuario.email = user.email;
                dadosUsuario.emailVerified = user.emailVerified;
                dadosUsuario.photoURL = user.photoURL;
                dadosUsuario.isAnonymous = user.isAnonymous;
                dadosUsuario.uid = user.uid;
                dadosUsuario.providerData = user.providerData;
                dadosUsuario.autenticado = true;

                $("#nmUserLogado").html(dadosUsuario.email.split("@")[0]);
            } else {
                UTILS.alertRedirectIndex("Você não está autenticado, favor se autenticar!")
            }
        });
    }
}

UTILS.getAllAlunos = function () {
    var refDataBase = firebase.database().ref('alunos');

    return refDataBase.on('value', function (snapshot) {
        return snapshot.val();
    });

}

UTILS.getAlunoPorID = function (idAluno) {
    var refDataBase = firebase.database().ref('alunos/' + idAluno);

    return refDataBase.on('value', function (snapshot) {
        return snapshot.val();
    });

}

UTILS.post = function (dataAluno, urlApi) {
    return $.ajax({
        type: 'POST',
        url: urlApi,
        data: dataAluno,
        async: true,
        success: function success(data, textStatus, xhr) {
            console.log("Aluno adicionado.");
        },
        error: function error(xhr, textStatus, errorThrown) {
            swal("Erro ao adicionar aluno a base", function () {
                window.location.reload();
            });
            console.log(errorThrown);
        }
    });
}

UTILS.getValueInput = function () {
    var itemSave = {};

    $.each($('input'), function (i, input) {
        if (input.type != "radio") {

            if ($("#" + input.id).val() != "") {
                itemSave[input.id] = $("#" + input.id).val();
            } else {
                itemSave[input.id] = "N/A";
            }

        }
    });

    itemSave["snNecessidade"] = $("input[name='snNecessidades']:checked").val();

    if ($("input[name='snNecessidades']:checked").val() == "nao") {
        itemSave["qualNecessidade"] = "N/A";
    }

    // itemSave["usuario"] = dadosUsuario.email;

    return itemSave;
}

UTILS.regraSnNecessidade = function () {
    $("#snSim").change(function (e) {
        $("#qualNecessidade").attr("readonly", false)
    });

    $("#snNao").change(function (e) {
        $("#qualNecessidade").attr("readonly", true)
    });
}

UTILS.inputMascaras = function () {
    $("#cpf").mask("000.000.000-00");
    $("#nTelefone").mask("(00) 0 0000-0000");
    $("#cep").mask("00000-000");
}

UTILS.redirect = function (page) {
    window.location.href = window.location.origin + "/pages/" + page + ".html";
}

UTILS.redirectIndex = function () {
    window.location.href = window.location.origin;
}

UTILS.alertRedirectIndex = function (msg) {
    swal(msg).then(function () {
        UTILS.redirectIndex();
    });
    // if (!swal(msg)) {
    //     UTILS.redirectIndex();
    // }
}

UTILS.salvarArquivo = function (id) {
    var file = document.getElementById("foto").files[0];
    var storageRef = firebase.storage().ref();
    var nmArquivo = id + "." + file.name.split(".")[1]
    var thisRef = storageRef.child('fotosAlunos/' + nmArquivo);

    return thisRef.put(file).then(function (snapshot) {
        return thisRef.getDownloadURL().then(function (url) {
            return url;
        })
    });

}

UTILS.editarAluno = function (idAluno, itemUpdate) {
    return firebase.database().ref().child('alunos/' + idAluno).set(itemUpdate).then(function () {
        console.log("Aluno Atualizado, com sucesso!")
    });
}

function isGetPagina() {
    var isResult = false;
    switch (window.location.pathname) {
        case "/":
            isResult = true;
            break;
        case "/pages/register.html":
            isResult = true;
            break;
    }

    return isResult;
}
