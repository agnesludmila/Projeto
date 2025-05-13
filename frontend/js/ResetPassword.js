document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const resetButton = document.querySelector('.form-button');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // Validação em tempo real dos campos de senha
    passwordInput.addEventListener('input', handleInputValidation);
    confirmPasswordInput.addEventListener('input', handleInputValidation);

    resetButton.addEventListener('click', function (event) {
        event.preventDefault();
        handleResetPassword();
    });

    function handleInputValidation() {
        validatePassword();
        validateConfirmPassword();
    }

    function validatePassword() {
        const password = passwordInput.value;

        if (!passwordRegex.test(password)) {
            passwordError.textContent = "A senha deve ter pelo menos 8 caracteres, incluir maiúsculas e minúsculas.";
            passwordError.style.display = "block";
        } else {
            passwordError.style.display = "none";
        }
    }

    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (confirmPassword !== password) {
            confirmPasswordError.textContent = "As senhas não coincidem.";
            confirmPasswordError.style.display = "block";
        } else {
            confirmPasswordError.style.display = "none";
        }
    }

    function exibirNotificacao(mensagem, sucesso = true, tempo = 3000) {
        const notificacaoAnterior = document.querySelector('.toast-notificacao');
        if (notificacaoAnterior) {
            notificacaoAnterior.remove();
        }

        const toast = document.createElement('div');
        toast.classList.add('toast-notificacao');
        toast.innerHTML = sucesso ? `✅ ${mensagem}` : `✖️ ${mensagem}`;

        Object.assign(toast.style, {
            backgroundColor: sucesso ? '#4CAF50' : '#f44336',
        });

        document.body.appendChild(toast);

        setTimeout(() => { toast.style.opacity = '1'; }, 100);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, tempo);
    }

    function handleResetPassword() {
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Validação das senhas
        if (isValidPassword(password, confirmPassword)) {
            redefinirSenha(password);
        }
    }

    function isValidPassword(password, confirmPassword) {
        if (!password || !confirmPassword) {
            exibirNotificacao('Por favor, preencha todos os campos.', false);
            return false;
        }

        if (password !== confirmPassword) {
            exibirNotificacao('As senhas não coincidem.', false);
            return false;
        }

        if (!passwordRegex.test(password)) {
            exibirNotificacao('A senha deve ter pelo menos 8 caracteres, incluir letras maiúsculas e minúsculas e números.', false);
            return false;
        }

        return true;
    }

    function redefinirSenha(password) {
        fetch('http://localhost:8080/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.codigo === 0) {
                    exibirNotificacao('Senha redefinida com sucesso!');
                } else {
                    exibirNotificacao(data.mensagem || 'Erro ao redefinir a senha.', false);
                }
            })
            .catch(error => {
                console.error(error);
                exibirNotificacao('Erro ao redefinir a senha.', false);
            });
    }
});
