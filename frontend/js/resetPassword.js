document.addEventListener('DOMContentLoaded', function () {
    const resetButton = document.querySelector('.form-tela2 .form-button');
    const emailInput = document.getElementById('email');

    function isEmailValido(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    resetButton.addEventListener('click', function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();

        if (!email) {
            alert('Por favor, informe um e-mail.');
            return;
        }

        if (!isEmailValido(email)) {
            alert('Formato de e-mail inválido.');
            return;
        }

        fetch('http://localhost:8080/auth/request-reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('E-mail não encontrado.');
                    }
                    throw new Error('Erro ao enviar o e-mail de redefinição.');
                }
                return response.text();
            })
            .then(data => {
                alert("Um link de recuperação foi enviado para seu e-mail.");
                emailInput.value = '';
            })
            .catch(error => {
                console.error(error);
                alert(error.message);
            });
    });
});
