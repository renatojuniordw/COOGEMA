'user strict';

// (() => {
var idParceiro = 0;

$(document).ready(function () {
    loadTableParceiros();
});

function loadTableParceiros() {
    $.LoadingOverlay("show");
    var table = $("#example tbody");
    var starCountRef = firebase.database().ref('parceiros');

    starCountRef.on('value', function (snapshot) {
        table.empty();

        $.each(snapshot.val(), function (i, item) {
            table.append(htmlTr(item.entidade, item.contato, item.email, item.cargo, item.tipo, i));
        });

        $('#example').DataTable();
        $.LoadingOverlay("hide");
    });
}

$('#btnCad').bind('click', function (e) {
    e.preventDefault();

    var itemAdd = UTILS.getValueInput();

    delete itemAdd["snNecessidade"];
    delete itemAdd["usuario"];
    itemAdd["tipo"] = $('#tipo').val();

    if ($('#btnCad').text() == "Salvar") {
        itemAdd["dtInsercao"] = new Date().toLocaleDateString();
        salvarParceiro(itemAdd)
    } else {
        itemAdd["dtAlteracao"] = new Date().toLocaleDateString();
        editarParceiro(idParceiro, itemAdd);
    }

});

$("#btnModal").click(function (e) {
    $.LoadingOverlay("show");
    $('#btnCad').text('Salvar');
    $("#exampleModalLabel").html(`Cadastrar Parceiro`);
    limparCampos();
    $.LoadingOverlay("hide");
});

$("#example").on('click', 'button', function (e) {
    $.LoadingOverlay("show");

    idParceiro = e.target.id;
    let nmBotao = e.target.innerHTML.trim();

    var refDataBase = firebase.database().ref('parceiros/' + idParceiro);

    refDataBase.on('value', function (snapshot) {

        let dadosAluno = snapshot.val();

        $("#exampleModalLabel").html(" ");
        $("#exampleModalLabel").html(`${dadosAluno.entidade}`);

        if (nmBotao != "Editar") {
            $('#btnCad').text('Editar');
            carregarInputs(dadosAluno);
        }

    });
});

function editarParceiro(id, itemUpdate) {
    firebase.database().ref().child('parceiros/' + id).set(itemUpdate).then(function () {
        $.LoadingOverlay("hide");
        swal("Parceiro alterado com sucesso!", "Clique em 'OK' para continuar.", "success").then(() => {
            $('#exampleModal').modal('hide');
            limparCampos();
        });
    });
}

function salvarParceiro(itemAdd) {
    $.LoadingOverlay("show");
    firebase.database().ref().child('parceiros').push(itemAdd).then(function (e) {
        $.LoadingOverlay("hide");
        swal("Parceiro cadastrado com sucesso!", "", "success").then(function () {
            $('#exampleModal').modal('hide');
            $.LoadingOverlay("hide");
            limparCampos();
        });
    });
}

function carregarInputs(dadosAluno) {
    $.each($('input, select'), function (i, input) {
        if (input.id !== "") {
            $("#" + input.id).val(dadosAluno[input.id]);
        }
    });
    $.LoadingOverlay("hide");
}

function limparCampos() {
    $.each($('input, select'), function (i, input) {
        if (input.id !== "") {
            $("#" + input.id).val(" ");
        }
    });
}

function htmlTr(entidade, contato, email, cargo, tipo, idFirebase) {
    return `
    <tr>
        <td>${entidade}</td>
        <td>${contato}</td>
        <td>${email}</td>
        <td>${cargo}</td>
        <td>${tipo}</td>
        <td>
          <button type="button" id="${idFirebase}" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">   
            <i class="mdi mdi-pencil"></i>
          </button>
        </td>
  </tr>
    `;
}

$("#salvar").bind("click", function () {
    $.LoadingOverlay("show");
    var reader = new FileReader();
    var file = $("#excel")[0].files[0];

    if (file) {
        reader.readAsArrayBuffer(file);
        reader.onload = function (e) {
            var data = new Uint8Array(reader.result);
            var wb = XLSX.read(data, { type: 'array' });

            var sheetName = wb.SheetNames[0];

            var sheet = wb.Sheets[sheetName];
            sheet = XLSX.utils.sheet_to_json(sheet);
            console.log(sheet);

            $.each(sheet, function (i, item) {
                salvarParceiro(item);
            });

        };
    } else {
        alert("Não existe arquivo");
    }
});

// })();