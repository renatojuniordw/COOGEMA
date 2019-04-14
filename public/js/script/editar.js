'user strict';
(() => {

    let idAluno = 0;
    var urlFoto = "";

    $(document).ready(function () {
        idAluno = getUrlVars()["idAluno"];
        if (idAluno == undefined) {
            window.location.href = urlRelativa.site;
        } else {
            loadDadosAluno(idAluno);
            UTILS.regraSnNecessidade();
            UTILS.inputMascaras();
        }
    });

    function loadDadosAluno(idAluno) {
        $.LoadingOverlay("show");
        var refDataBase = firebase.database().ref('alunos/' + idAluno);

        refDataBase.on('value', function (snapshot) {
            let dadosAluno = snapshot.val();
            urlFoto = dadosAluno["foto"];
            console.log(urlFoto);

            $.each($('input'), function (i, input) {
                if (input.type != "radio" & input.id != "foto") {
                    $("#" + input.id).val(dadosAluno[input.id]);
                } else {
                    if (input.name == "snNecessidades") {
                        switch (dadosAluno["snNecessidade"]) {
                            case "Sim":
                                setInterval(function () {
                                    $("#snSim").attr('checked', true);
                                    $("#qualNecessidade").attr("readonly", false)
                                }, 1000);
                                break;
                            case "Não":
                                setInterval(function () {
                                    $("#snNao").attr('checked', true);
                                    $("#qualNecessidade").attr("readonly", true);
                                }, 1000);
                                break;
                        }
                    }
                }
            });
            $.LoadingOverlay("hide");
        });
    }

    $('#btnCad').bind('click', function (e) {
        e.preventDefault();
        $.LoadingOverlay("show");

        var itemUpdate = UTILS.getValueInput();
        itemUpdate["dtInsercao"] = new Date().toLocaleDateString();

        if ($("#foto").val() == "") itemUpdate["foto"] = urlFoto

        UTILS.editarAluno(idAluno, itemUpdate).then(function () {
            if ($("#foto").val() !== "") {
                UTILS.salvarArquivo(idAluno).then(function (url) {
                    itemUpdate["foto"] = url;
                    UTILS.editarAluno(idAluno, itemUpdate).then(function () {
                        $.LoadingOverlay("hide");
                        swal("Aluno Alterado com sucesso!", "Clique em 'OK' para continuar.", "success").then(() => {
                            UTILS.redirect("consultar");
                        });
                    });
                });
            } else {
                $.LoadingOverlay("hide");
                swal("Aluno Alterado com sucesso!", "Clique em 'OK' para continuar.", "success").then(() => {
                    UTILS.redirect("consultar");
                });
            }
        });
    });

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
            function (m, key, value) {
                vars[key] = value;
            });
        return vars;
    }

})();