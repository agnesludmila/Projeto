'use strict';
import { exibirNotificacao } from './notificacao.js';

document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.getElementById('login-container');

    const moveOverlay = () => loginContainer?.classList.toggle('move');

    document.getElementById('cadastrar')?.addEventListener('click', moveOverlay);
    document.getElementById('entrar')?.addEventListener('click', moveOverlay);

    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const botao = event.submitter;
            botao.disabled = true;

            const usuario = {
                nome: document.getElementById('cadastro-nome')?.value,
                email: document.getElementById('cadastro-email')?.value,
                senha: document.getElementById('cadastro-senha')?.value,
                matricula: document.getElementById('cadastro-matricula')?.value
            };

            if (Object.values(usuario).some(campo => !campo)) {
                exibirNotificacao("Todos os campos são obrigatórios!", false);
                botao.disabled = false;
                return;
            }

            if (!/^[^\s@]+@aluno\.uepb\.edu\.br$/.test(usuario.email)) {
                exibirNotificacao("Digite um email institucional válido da UEPB!", false);
                botao.disabled = false;
                return;
            }

            exibirNotificacao("Cadastrando usuário...");
            try {
                const response = await fetch('http://localhost:8080/auth/cadastro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(usuario),
                });

                const resposta = await response.json();

                // Verifica o código retornado no backend e exibe a notificação apropriada
                if (response.status === 409) {
                    if (resposta.codigo === 1) {
                        exibirNotificacao("Email já cadastrado!", false);
                    } else if (resposta.codigo === 2) {
                        exibirNotificacao("Matrícula já cadastrada!", false);
                    } else {
                        exibirNotificacao(resposta.mensagem || "Email ou matrícula já cadastrados!", false);
                    }
                } else if (!response.ok) {
                    exibirNotificacao(resposta.mensagem || "Erro ao cadastrar usuário.", false);
                } else {
                    exibirNotificacao(resposta.mensagem || "Usuário cadastrado com sucesso. Verifique o email para ativar sua conta!");
                    cadastroForm.reset();
                    setTimeout(() => window.location.href = 'LoginRegister.html', 2000);
                }
            } catch (error) {
                console.error('Erro ao cadastrar usuário:', error);
                exibirNotificacao("Erro ao cadastrar usuário. Tente novamente.", false);
            } finally {
                botao.disabled = false;
            }
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const botao = event.submitter;
            botao.disabled = true;

            const credenciais = {
                email: document.getElementById('login-email')?.value,
                senha: document.getElementById('login-senha')?.value
            };

            if (!credenciais.email || !credenciais.senha) {
                exibirNotificacao("Preencha email e senha!", false);
                botao.disabled = false;
                return;
            }

            exibirNotificacao("Autenticando...");
            try {
                const response = await fetch('http://localhost:8080/auth/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(credenciais),
                });

                const resposta = await response.json();

                if (resposta.codigo === 0) {
                    localStorage.setItem("usuarioId", resposta.id);
                    exibirNotificacao(resposta.mensagem || "Login bem-sucedido!");
                    setTimeout(() => window.location.href = "/MAP/frontend/Search.html", 2000);
                } else if (resposta.codigo === 1) {
                    exibirNotificacao("Por favor, ative a sua conta primeiro!", false);
                } else if (resposta.codigo === 2) {
                    localStorage.setItem("usuarioId", resposta.id);
                    exibirNotificacao("Criação de perfil necessária.");
                    setTimeout(() => window.location.href = "/MAP/frontend/Profile.html", 2000);
                } else {
                    exibirNotificacao(resposta.mensagem || "Email ou senha inválidos!", false);
                }
            } catch (error) {
                console.error('Erro ao autenticar:', error);
                exibirNotificacao("Erro ao autenticar. Tente novamente.", false);
            } finally {
                botao.disabled = false;
            }
        });
    }
})

