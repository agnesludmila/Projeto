'use strict'

const loginContainer = document.getElementById('login-container')

const moveOverlay = () => loginContainer.classList.toggle('move')

document.getElementById('cadastrar').addEventListener('click', moveOverlay)
document.getElementById('entrar').addEventListener('click', moveOverlay)

// Captura o formulário usando o id "cadastroForm"
document.getElementById('cadastroForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário e a recarga da página

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const matricula = document.getElementById('matricula').value;

    const usuario = {
        nome: nome,
        email: email,
        senha: senha,
        matricula: matricula
    };

    // Envia os dados para a API usando fetch (requisição POST)
    fetch('http://localhost:8080/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario), // Converte o objeto para JSON
    })
    .then(response => response.json()) // Espera a resposta da API
    .then(data => {
        console.log('Usuário cadastrado com sucesso:', data);

        document.getElementById('cadastroForm').reset();
        // Aqui você pode redirecionar o usuário ou exibir uma mensagem
        window.location.href='pagina.html';
    })
    .catch((error) => {
        console.error('Erro ao cadastrar usuário:', error);
        alert("Erro ao cadastrar usuário. Tente novamente.");
    });
});


function prepararRedirecionamento(event) {
    event.preventDefault(); 

    // Adiciona a classe fade para iniciar a transição de opacidade (fade out)
    document.body.classList.add('fade');

    setTimeout(function() {
        // Redireciona manualmente após a transição de fade
        window.location.href = event.target.href;
    }, 300); 
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
  
    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        senha: senha,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.text(); // ou .json() se o backend mandar JSON
        } else {
          throw new Error("Login inválido");
        }
      })
      .then((mensagem) => {
        document.getElementById("mensagemLogin").textContent = mensagem;
        // redirecionar, se quiser
        // window.location.href = "/pagina-principal.html";
      })
      .catch((error) => {
        document.getElementById("mensagemLogin").textContent = error.message;
      });
  });

  
  
  
  
  
