import { exibirNotificacao } from './notificacao';

(async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const form = document.querySelector('form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Verifica se o token está presente na URL
    if (!token) {
        exibirNotificacao("⚠️ O link de redefinição é inválido ou expirou.", false);
        form.style.display = 'none';
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const novaSenha = passwordInput.value.trim();
        const confirmarSenha = confirmPasswordInput.value.trim();

        if (!novaSenha || !confirmarSenha) {
            exibirNotificacao("Por favor, preencha todos os campos.", false);
            return;
        }

        if (novaSenha !== confirmarSenha) {
            exibirNotificacao("As senhas não coincidem.", false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token, novaSenha })
            });

            const data = await response.json().catch(() => {
                return { mensagem: "Erro desconhecido." };
            });

            if (response.ok && data.codigo === 0) {
                exibirNotificacao(data.mensagem || "Senha redefinida com sucesso!");
                form.reset();
                setTimeout(() => window.location.href = "/MAP/frontend/LoginRegister.html", 3000);
            } else {
                exibirNotificacao(data.mensagem || "Erro ao redefinir a senha.", false);
            }
        } catch (error) {
            console.error("Erro ao redefinir senha:", error);
            exibirNotificacao("Erro de conexão. Tente novamente mais tarde.", false);
        }
    });
})();
