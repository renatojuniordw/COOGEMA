'user strict';
// (() => {

var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

$('#btnEntrar').click(function (e) {
    e.preventDefault();

    //   
    var email = $('#inputEmail').val();
    var senha = $('#inputPassword').val();

    if (validarEmailSenha(email, senha)) {

        firebase.auth().signInWithEmailAndPassword(email, senha).then(function () {
            UTILS.redirect("home");
            //  
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log("errorCode", errorCode);
            console.log("errorMessage", errorMessage);
            //  
            tratarErros(errorCode);
        });

    }

});

function tratarErros(errorCode) {

    switch (errorCode) {
        case "auth/invalid-email":
            swal("E-mail não cadastrado.").then(function () { limparInput() });
            break;
        case "auth/user-not-found":
            swal("Não há registro de usuário correspondente a esse e-mail.").then(function () { limparInput() });
            break;
        case "auth/wrong-password":
            swal("Usuário ou senha inválida.").then(function () { limparInput() });
            break;
    }

}

function limparInput() {
    $('#inputEmail').val(" ");
    $('#inputPassword').val(" ");
}

function validarEmailSenha(email, senha) {
    let isResult = true;
    if (!email && !senha) {
        swal("Prencha todos os campos");
        isResult = false;
    } else if (!email && senha) {
        swal("Prencha o campo E-mail");
        isResult = false;
    } else if (email && !senha) {
        swal("Prencha o campo senha");
        isResult = false;
    }

    return isResult;
}

function loginGoogle() {
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;

        // The signed-in user info.
        var user = result.user;
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}

function redefinirSenha() {
    var auth = firebase.auth();
    var emailAddress = dadosUsuario.email;

    auth.sendPasswordResetEmail(emailAddress).then(function () {
        // Email sent.
    }).catch(function (error) {
        // An error happened.
    });
}

// })();