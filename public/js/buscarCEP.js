"use strict";

$(document).ready(init);

function init() {
	$("#cep").on("change", buscarEndereco);
}

function buscarEndereco() {
	var cep = $("#cep").val().replace(/\D/g, '');

	if (cep != "") {
		var validacep = /^[0-9]{8}$/;

		if (validacep.test(cep)) {
			readOnlyCepOn();

			$("#rua").val("...");
			$("#bairro").val("...");
			$("#cidade").val("...");
			$("#uf").val("...");

			$.getJSON("//viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
				if (!("erro" in dados)) {
					$("#rua").val(dados.logradouro);
					$("#bairro").val(dados.bairro);
					$("#cidade").val(dados.localidade);
					$("#estado").val(dados.uf);

					readOnlyCepOn();
				} else {
					readOnlyCepOff();
					limparCep();
					swal("CEP não encontrado.");
				}
			}).fail(function (d, textStatus, error) {
				readOnlyCepOff();
				limparCep();
				swal("Houve algum problema ao buscar o CEP. Verifique se há conexão ou o servidor pode estar offline.");
			});
		} else {
			readOnlyCepOff();
			limparCep();
			swal("Formato de CEP inválido.");
		}
	} else {
		readOnlyCepOff();
		limparCep();
	}
}

function limparCep() {
	$("#rua").val("");
	$("#bairro").val("");
	$("#cidade").val("");
	$("#estado").val("");
}

function readOnlyCepOn() {
	$("#rua").attr('readonly', "");
	$("#bairro").attr('readonly', "");
	$("#cidade").attr('readonly', "");
	$("#estado").attr('readonly', "");
}

function readOnlyCepOff() {
	$("#rua").removeAttr('readonly', "");
	$("#bairro").removeAttr('readonly', "");
	$("#cidade").removeAttr('readonly', "");
	$("#estado").removeAttr('readonly', "");
}