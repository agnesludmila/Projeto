(async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const resultadoDiv = document.getElementById('resultado');

    if (!token) {
        resultadoDiv.textContent = "⚠️ O link de ativação é inválido ou expirou.";
        resultadoDiv.classList.add('erro');
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/ativacao", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token })
        });

        const mensagem = await response.json().catch(() => {
            return { mensagem: "Erro desconhecido." };
        });

        if (response.ok) {
            resultadoDiv.textContent = mensagem.mensagem;
            resultadoDiv.classList.add('sucesso');
            setTimeout(() => window.location.href = "/MAP/frontend/LoginRegister.html", 3000);
        } else {
            resultadoDiv.textContent = mensagem.mensagem || "Erro ao ativar a conta.";
            resultadoDiv.classList.add('erro');
        }
    } catch (error) {
        resultadoDiv.textContent = "Erro de conexão. Tente novamente mais tarde.";
        resultadoDiv.classList.add('erro');
        console.error("Erro ao ativar conta:", error);
    }

})();
