'user strict';
$(document).ready(function () {
    events();
});

function events() {

    UTILS.inputMascaras();

    $('#btnCad').bind('click', function (e) {
        e.preventDefault();

        var itemAdd = UTILS.getValueInput();
        itemAdd["dtInsercao"] = new Date().toLocaleDateString();

        firebase.database().ref().child('alunos').push(itemAdd).then(function (e) {
            UTILS.salvarArquivo(e.key).then(function (url) {
                itemAdd["foto"] = url;
                UTILS.editarAluno(e.key, itemAdd).then(function (url) {
                    swal("Aluno cadastrado com sucesso!", "", "success").then(function () {
                        UTILS.redirect("consultar"); s
                    });
                });
            });
        });
    });

    UTILS.regraSnNecessidade();
}

function salvarArquivo() {
    var file = document.getElementById("foto").files[0];
    var storageRef = firebase.storage().ref();
    var nmArquivo = id + "." + file.name.split(".")[1]
    var thisRef = storageRef.child('fotosAlunos/' + nmArquivo);
    // var thisRef = storageRef.child('fotosAlunos/' + file.name);

    return thisRef.put(file).then(function (snapshot) {
        console.log('Uploaded a blob or file! ', snapshot);
        return thisRef.getDownloadURL().then(function (url) {
            console.log("url", url);
            return url;
        })
    });

}