'use strict';

document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.getElementById('login-container');

    const moveOverlay = () => loginContainer?.classList.toggle('move');

    document.getElementById('cadastrar')?.addEventListener('click', moveOverlay);
    document.getElementById('entrar')?.addEventListener('click', moveOverlay);

    function exibirNotificacao(mensagem, sucesso = true) {
        const toast = document.createElement('div');
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            padding: '15px 25px',
            borderRadius: '8px',
            backgroundColor: sucesso ? '#4CAF50' : '#f44336',
            color: 'white',
            fontSize: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: '1000',
            opacity: '0',
            transition: 'opacity 0.5s'
        });

        toast.textContent = mensagem;
        document.body.appendChild(toast);

        setTimeout(() => { toast.style.opacity = '1'; }, 100);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 500);
        }, 3000);
    }

    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const usuario = {
                nome: document.getElementById('nome')?.value,
                email: document.getElementById('email')?.value,
                senha: document.getElementById('senha')?.value,
                matricula: document.getElementById('matricula')?.value
            };

            if (Object.values(usuario).some(campo => !campo)) {
                exibirNotificacao("Todos os campos são obrigatórios!", false);
                return;
            }

            exibirNotificacao("Cadastrando usuário...");
            try {
                const response = await fetch('http://localhost:8080/usuarios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(usuario),
                });

                let data;
                try {
                    data = await response.json();
                } catch {
                    data = {};
                }

                if (response.status === 409) {
                    exibirNotificacao(data?.mensagem ?? "Email já cadastrado!", false);
                    return;
                }

                if (!response.ok) {
                    exibirNotificacao(data?.mensagem ?? "Erro ao cadastrar usuário.", false);
                    return;
                }

                exibirNotificacao(data?.mensagem ?? "Usuário cadastrado com sucesso!");
                cadastroForm.reset();
                setTimeout(() => window.location.href = 'LoginRegister.html', 2000);
            } catch (error) {
                console.error('Erro ao cadastrar usuário:', error);
                exibirNotificacao("Erro ao cadastrar usuário. Tente novamente.", false);
            }
        });
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const credenciais = {
                email: document.getElementById("email")?.value,
                senha: document.getElementById("senha")?.value
            };

            if (!credenciais.email || !credenciais.senha) {
                exibirNotificacao("Preencha email e senha!", false);
                return;
            }

            exibirNotificacao("Autenticando...");
            try {
                const response = await fetch("http://localhost:8080/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(credenciais),
                });

                const mensagem = await response.text();

                if (response.ok && mensagem === "Login bem-sucedido!") {
                    exibirNotificacao(mensagem);
                    setTimeout(() => window.location.href = "/pagina-principal.html", 2000);
                } else {
                    exibirNotificacao(mensagem || "Erro ao autenticar.", false);
                }
            } catch (error) {
                exibirNotificacao("Erro ao autenticar. Verifique seus dados.", false);
            }
        });
    }
});