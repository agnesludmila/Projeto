import { exibirNotificacao } from './notificacao.js';

document.addEventListener('DOMContentLoaded', function () {
    const resetButton = document.querySelector('.form-tela2 .form-button');
    const emailInput = document.getElementById('email');

    function isEmailValido(email) {
        const regex = /^[^\s@]+@aluno\.uepb\.edu\.br$/;
        return regex.test(email);
    }

    resetButton.addEventListener('click', function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();

        if (!email) {
            exibirNotificacao('Por favor, informe um e-mail.', false);
            return;
        }

        if (!isEmailValido(email)) {
            exibirNotificacao('Formato de e-mail inválido.', false);
            return;
        }

        fetch('http://localhost:8080/auth/reset-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
            .then(response => response.json())
            .then(data => {
                if (data.codigo === 0) {
                    exibirNotificacao('Um link de recuperação foi enviado para seu e-mail.');
                } else {
                    exibirNotificacao(data.mensagem || 'Erro ao enviar o e-mail de redefinição.', false);
                }
            })
            .catch(error => {
                console.error(error);
                exibirNotificacao('Erro ao enviar o e-mail de redefinição.', false);
            });
    });
});
