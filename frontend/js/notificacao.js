export function exibirNotificacao(mensagem, sucesso = true, tempo = 3000) {
    const notificacaoAnterior = document.querySelector('.toast-notificacao');
    if (notificacaoAnterior) {
        notificacaoAnterior.remove();
    }

    const toast = document.createElement('div');
    toast.classList.add('toast-notificacao');
    toast.innerHTML = sucesso ? `✅ ${mensagem}` : `✖️ ${mensagem}`;

    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px 20px',
        borderRadius: '5px',
        backgroundColor: sucesso ? '#4CAF50' : '#f44336',
        color: 'white',
        fontWeight: 'bold',
        zIndex: 1000,
        opacity: '0',
        transition: 'opacity 0.5s ease'
    });

    document.body.appendChild(toast);

    setTimeout(() => { toast.style.opacity = '1'; }, 100);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, tempo);
}
