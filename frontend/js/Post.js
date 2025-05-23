const API_URL = 'http://localhost:8080/postagem';
const perfilImgEl = document.querySelector('.perfil-img');
const nomeUsuarioEl = document.querySelector('.nome-usuario');
const emailUsuarioEl = document.querySelector('.usuario-email');
const listaPostagensEl = document.getElementById('lista-postagens');
const userId = localStorage.getItem('usuarioId');

if (!userId) {
    console.error('Usuário não autenticado.');
}

let postagens = [];

async function carregarPerfil() {
    try {
        const res = await fetch(`http://localhost:8080/perfil/${userId}`);
        if (!res.ok) throw new Error('Erro ao buscar dados do perfil');
        const data = await res.json();

        nomeUsuarioEl.textContent = data.nome || 'Nome não definido';
        emailUsuarioEl.textContent = data.email || 'Email não informado';

        document.querySelectorAll('[data-perfil-img]').forEach(img => {
            img.src = data.fotoPerfil
                ? `http://localhost:8080${data.fotoPerfil}?t=${Date.now()}`
                : './imgprofile/ImagemProfile.jpg';

            img.onerror = function () {
                this.src = 'https://www.svgrepo.com/show/382106/user-alt.svg';
            };
        });
    } catch (err) {
        console.error('Erro ao carregar perfil:', err);
    }
}

async function carregarPostagens() {
    try {
        const res = await fetch(`${API_URL}/todas`);
        if (!res.ok) throw new Error('Erro ao buscar postagens');
        postagens = await res.json(); // salva globalmente

        listaPostagensEl.innerHTML = '';

        if (postagens.length === 0) {
            listaPostagensEl.innerHTML = '<p>Nenhuma postagem encontrada.</p>';
            return;
        }


        postagens.forEach(postagem => {
            console.log('postagem.usuarioId:', postagem.usuarioId, typeof postagem.usuarioId);
            console.log('userId:', userId, typeof userId);

            const isDono = Number(postagem.usuarioId) === Number(userId);

            const postagemEl = document.createElement('div');
            postagemEl.classList.add('post');

            postagemEl.innerHTML = `
        <div class="post-header">
           <img src="${postagem.fotoPerfil ? `http://localhost:8080${postagem.fotoPerfil}` : './imgprofile/ImagemProfile.jpg'}" alt="Foto do autor" />
            <div class="user-info">
                <span class="name">${postagem.nomeUsuario || 'Desconhecido'}</span>
                <span class="date">${new Date(postagem.dataCriacao).toLocaleString()}</span>
            </div>
        </div>

        <h3 class="post-title">${postagem.titulo}</h3>
        <p class="post-description">${postagem.descricao || ''}</p>

        <div class="post-media">
            <img src="${postagem.caminhoImagem ? `http://localhost:8080${postagem.caminhoImagem}` : './imgprofile/ImagemProfile.jpg'}" alt="Imagem da postagem" />
        </div>
        <div class="post-actions">     
            <button class="btn-contato"
                data-postagem-id="${postagem.id}"
                data-contato="${postagem.contato || ''}"
                data-email="${postagem.email || ''}">
                <i class="fas fa-phone"></i> Contato
            </button>

            ${isDono ? `
            <button class="btn-apagar" data-id="${postagem.id}">
                <i class="fas fa-trash-alt"></i> Apagar
            </button>
             ` : ''}
        </div>
    `;

            listaPostagensEl.appendChild(postagemEl);
        });

        configurarBotoesContato();

        document.querySelectorAll('.btn-apagar').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');

                const resultado = await Swal.fire({
                    title: 'Tem certeza?',
                    text: "Deseja apagar esta postagem?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: 'green',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim, apagar!',
                    cancelButtonText: 'Cancelar'
                });

                if (resultado.isConfirmed) {
                    try {
                        const resDel = await fetch(`${API_URL}/deletar/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'userId': userId
                            }
                        });

                        if (!resDel.ok) {
                            const errMsg = await resDel.text();
                            throw new Error(errMsg || 'Erro ao apagar postagem');
                        }

                        await Swal.fire(
                            'Apagado!',
                            'Postagem apagada com sucesso.',
                            'success'
                        );

                        carregarPostagens();
                    } catch (err) {
                        Swal.fire(
                            'Erro!',
                            'Erro ao apagar postagem: ' + err.message,
                            'error'
                        );
                        console.error(err);
                    }
                }
            });
        });


    } catch (err) {
        console.error('Erro ao carregar postagens:', err);
    }
}

function configurarBotoesContato() {
    const modalContato = document.getElementById('modalContato');
    const btnFecharContato = document.getElementById('closeContatoModal');
    const telefoneEl = document.getElementById('modalTelefone');
    const emailEl = document.getElementById('modalEmail');

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-contato')) {
            const contato = e.target.dataset.contato || 'Não informado';
            const email = e.target.dataset.email || 'Não informado';

            telefoneEl.textContent = contato;
            emailEl.textContent = email;

            if (contato !== 'Não informado') {
                telefoneEl.href = `tel:${contato.replace(/\D/g, '')}`;
            } else {
                telefoneEl.removeAttribute('href');
            }

            if (email !== 'Não informado') {
                emailEl.href = `mailto:${email}`;
            } else {
                emailEl.removeAttribute('href');
            }

            modalContato.style.display = 'flex';
        }
    });

    btnFecharContato.addEventListener('click', () => {
        modalContato.style.display = 'none';
    });

    modalContato.addEventListener('click', (e) => {
        if (e.target === modalContato) {
            modalContato.style.display = 'none';
        }
    });

}

window.addEventListener('DOMContentLoaded', () => {
    carregarPerfil();
    carregarPostagens();

    const criarBtn = document.getElementById('criarPostBtn');
    criarBtn.addEventListener('click', criarPostagem);
});

async function criarPostagem(event) {
    event.preventDefault(); // evita recarregar a página

    const tituloInput = document.getElementById('titulo');
    const descricaoInput = document.getElementById('descricao');
    const imagemInput = document.getElementById('imagem-upload');

    const titulo = tituloInput.value.trim();
    const descricao = descricaoInput.value.trim();

    if (!titulo) {
        alert('Título é obrigatório!');
        return;
    }
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("usuarioId", String(userId));

    if (imagemInput.files.length > 0) {
        formData.append("imagem", imagemInput.files[0]);
    }

    try {
        const res = await fetch(`${API_URL}/criar`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || 'Erro ao criar postagem');
        }

        tituloInput.value = '';
        descricaoInput.value = '';
        imagemInput.value = '';
        document.getElementById('modalPublicacao').style.display = 'none';

        carregarPostagens();

    } catch (err) {
        alert('Erro ao criar postagem: ' + err.message);
        console.error('Erro ao criar postagem:', err);
    }
}
