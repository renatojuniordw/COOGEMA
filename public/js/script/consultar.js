'user strict';

// (() => {

$(document).ready(function () {
  loadAlunosTable();
  // $('#example').DataTable();
});

function loadAlunosTable() {
  $.LoadingOverlay("show");

  var table = $("#example tbody");
  var index = 1;

  var starCountRef = firebase.database().ref('alunos');
  starCountRef.on('value', function (snapshot) {
    table.empty();
    $.each(snapshot.val(), function (i, item) {
      var auxDtNasc = item.dtNascimento.split("-");
      table.append(htmlTr(index, item.nome, item.cpf, idade(new Date(auxDtNasc[0], auxDtNasc[1], auxDtNasc[2]), new Date()), item.nTelefone, i));
      index++;
    });

    $('#example').DataTable();
    $.LoadingOverlay("hide");
  });
}

$("#example").on('click', 'button', function (e) {
  $.LoadingOverlay("show");

  var idAluno = e.target.id;
  let nmBotao = e.target.innerHTML.trim();

  var refDataBase = firebase.database().ref('alunos/' + idAluno);

  refDataBase.on('value', function (snapshot) {

    let dadosAluno = snapshot.val();

    $("#exampleModalLabel").html(" ");
    $(".modal-body").html(' ');
    $("#exampleModalLabel").html(`${dadosAluno.nome}`);


    if (nmBotao != "Editar") {
      $(".modal-body").html(htmlVisualizarAluno(dadosAluno));
    }

    $.LoadingOverlay("hide");
  });
});

function htmlVisualizarAluno(data) {
  var dtNascimento = moment(data.dtNascimento, "YYYY-MM-DD").format("DD/MM/YYYY");

  return `
        ${htmlAluno(data, dtNascimento)}
        ${regraHtmlSnNecessidade(data)}
        <br>
        ${htmlEndereco(data)}
        <br>
        ${htmlResponsavel(data)}
        <div class="text-right">
          <a type="button" href="${data.foto}" target="_blank" class="btn btn-info">Visualizar Foto</a>
        </div>

    `
}

function htmlAluno(data, dtNascimento) {
  return `
<div class="form-row">
    <div class="col-2">
        <label for="">Nome:</label>
    </div>
    <div class="col">
        <span id="nome">${data.nome}</span>
    </div>
</div>

<div class="form-row">
    <div class="col-2">
        <label for="">RG:</label>
    </div>
    <div class="col-4">
        <span id="rg">${data.rg}</span>
    </div>
    <div class="col-2">
        <label for="">CPF:</label>
    </div>
    <div class="col-4">
        <span id="cpf">${data.cpf}</span>
    </div>
</div>

<div class="form-row">
    <div class="col-2">
        <label for="">Data de Nasc.:</label>
    </div>
    <div class="col-4">
        <span id="dtNascimento">${dtNascimento}</span>
    </div>

    <div class="col-2">
        <label for="">Telefone:</label>
    </div>
    <div class="col-4">
        <span id="nTelefone">${data.nTelefone}</span>
    </div>
</div>
 `;
}

function regraHtmlSnNecessidade(data) {
  let _config = {
    nmNecessidade: "",
    qual: ""
  }
  if (data.snNecessidade == 0) {
    _config.nmNecessidade = "Sim";
    _config.qualNecessidade = data.qualNecessidade;
  } else {
    _config.nmNecessidade = "Não";
    _config.qualNecessidade = "N/A";
  }

  return `
    <div class="form-row">
        <div class="col-8">
            Portador de necessidades especiais? 
        </div>
        <div class="col-4">
        ${_config.nmNecessidade}
        </div>
        </br>
        <div class="col-2">
            <label for="">Qual:</label>
        </div>
        <div class="col">
            <span id="necessidade">${_config.qualNecessidade}</span>
        </div>
    </div>
    `;
}

function htmlEndereco(data) {
  return `
    <div class="form-row">
        <div class="col-1">
            <label for="">Rua:</label>
        </div>
        <div class="col-8">
            <span id="rua">${data.rua}</span>
        </div>

        <div class="col-1">
            <label for="">Nº:</label>
        </div>
        <div class="col-1">
            <span id="numero">${data.numero}</span>
        </div>
    </div>

    <div class="form-row">

        <div class="col-1">
            <label for="">CEP: </label>
        </div>
        <div class="col-3">
            <span id="cep">${data.cep}</span>
        </div>

        <div class="col-3">
            <label for="">Complemento: </label>
        </div>
        <div class="col">
            <span id="cep">${data.complemento}</span>
        </div>

    </div>

    <div class="form-row">

        <div class="col-2">
            <label for="">Cidade: </label>
        </div>
        <div class="col-3">
            <span id="cidade">${data.cidade}</span>
        </div>

        <div class="col-2">
            <label for="">Bairro: </label>
        </div>
        <div class="col-3">
            <span id="bairro">${data.bairro}</span>
        </div>

        <div class="col-1">
          <label for="">UF: </label>
        </div>
        <div class="col-1">
            <span id="bairro">${data.estado}</span>
        </div>

    </div>

    `;
}

function htmlResponsavel(data) {
  return `
    <div class="form-row">
        <div class="col-5">
            <label for="">Nome do responsável:</label>
        </div>
        <div class="col">
            <span id="rua">${data.nomeResponsavel}</span>
        </div>
        </div>
        <div class="form-row">
        <div class="col-3">
            <label for="">Profissão:</label>
        </div>
        <div class="col">
            <span id="numero">${data.profissao}</span>
        </div>
    </div>
    `;
}

function htmlTr(id, nome, cpf, idade, telefone, idFirebase) {
  return `
    <tr>
        <td>${id}</td>
        <td>${nome}</td>
        <td>${cpf}</td>
        <td>${idade}</td>
        <td>${telefone}</td>
        <td>
          <button type="button" id="${idFirebase}" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">   
            <i class="mdi mdi-account-search"></i>
          </button>
       
          <button type="button" id="${idFirebase}" class="btn btn-info" onclick="window.location.href='/pages/editar.html?idAluno=${idFirebase}'">   
            <i class="mdi mdi-pencil"></i>
          </button>
        </td>
  </tr>
    `;
}

function idade(nascimento, hoje) {
  var diferencaAnos = hoje.getFullYear() - nascimento.getFullYear();
  if (new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()) <
    new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate()))
    diferencaAnos--;
  return diferencaAnos;
}

// })();