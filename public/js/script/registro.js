'user strict';

(() => {

    $('#btnRegistrar').click(function () {
          
        var email = $('#inputEmail').val();
        var senha = $('#inputPassword').val();
        var confirmarSenha = $('#inputPasswordConfirme').val();

        if (isEQsenha(senha, confirmarSenha)) {
            if (validarEmailSenha(email, senha, confirmarSenha)) {
                firebase.auth().createUserWithEmailAndPassword(email, senha).then(function () {
                    validarEmail().then(() => {
                         
                        swal("Cadastrado com sucesso!", "", "success").then(() => {
                            UTILS.redirectIndex();
                        });
                    });
                }).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    console.log("errorCode", errorCode);
                    console.log("errorMessage", errorMessage);
                     
                    tratarErros(errorCode);
                    // ...
                });
            }
        } else {
            swal("Senhas incompatíveis");
        }

    });

    function limparInput() {
        $('#inputEmail').val(" ");
        $('#inputPassword').val(" ");
        $('#inputPasswordConfirme').val(" ");
    }

    function tratarErros(errorCode) {

        switch (errorCode) {
            case "auth/weak-password":
                swal("A senha deve ter pelo menos 6 caracteres").then(function () { limparInput() });
                break;
            case "auth/invalid-email":
                swal("E-mail inválido.").then(function () { limparInput() });
                break;
            case "auth/email-already-in-use":
                swal("O endereço de e-mail já está sendo usado por outra conta.").then(function () { limparInput() });
                break;
        }

    }


    function validarEmailSenha(email, senha, senha2) {
        let isResult = true;
        if (!email && !senha && !senha2) {
            swal("Prencha todos os campos");
            isResult = false;
        } else if (!email && senha && senha2) {
            swal("Prencha o campo E-mail");
            isResult = false;
        } else if (email && !senha && !senha2) {
            swal("Prencha o campo senha");
            isResult = false;
        }

        return isResult;
    }

    function isEQsenha(senha1, senha2) {
        return (senha1 == senha2);
    }

    function validarEmail() {
        var user = firebase.auth().currentUser;

        return user.sendEmailVerification().then(function () {
            console.log("E-mail de verificação enviado")
        }).catch(function (error) {
            // An error happened.
        });
    }

})();