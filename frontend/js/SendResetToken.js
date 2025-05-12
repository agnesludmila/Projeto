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

function exibirNotificacao(mensagem, sucesso = true, tempo = 3000) {
    const notificacaoAnterior = document.querySelector('.toast-notificacao');
    if (notificacaoAnterior) {
        notificacaoAnterior.remove();
    }

    const toast = document.createElement('div');
    toast.classList.add('toast-notificacao');
    toast.innerHTML = sucesso ? `✅ ${mensagem}` : `✖️ ${mensagem}`;

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

    document.body.appendChild(toast);

    setTimeout(() => { toast.style.opacity = '1'; }, 100);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, tempo);
}
