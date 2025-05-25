// ./js/Post.js
const API_URL = 'http://localhost:8080/postagem';
const userId = localStorage.getItem('usuarioId');

// Elementos da página
const listaPostagensEl = document.getElementById('lista-postagens');

// Elementos do perfil na sidebar
const sidebarNomeUsuarioEl = document.querySelector('.sidebar .nome-usuario');
const sidebarEmailUsuarioEl = document.querySelector('.sidebar .usuario-email');

// Elementos de busca principal (do seu HTML)
const mainSearchInputEl = document.getElementById('searchInput');
const searchButtonEl = document.getElementById('searchToggle');

// Modal de Publicação
const modalPublicacaoEl = document.getElementById('modalPublicacao');
const criarPostBtnEl = document.getElementById('criarPostBtn');
const closeModalBtnEl = document.getElementById('closeModalBtn');
const tituloInputEl = document.getElementById('titulo');
const descricaoInputEl = document.getElementById('descricao');
const imagemUploadInputEl = document.getElementById('imagem-upload');
const postBoxEl = document.getElementById('postBox'); // Para abrir modal de publicação

// Modal de Contato
const modalContatoEl = document.getElementById('modalContato');
const closeContatoModalBtnEl = document.getElementById('closeContatoModal');
const modalTelefoneEl = document.getElementById('modalTelefone');
const modalEmailEl = document.getElementById('modalEmail');

// Modal de Categorias Dinâmicas (NOVO)
const modalCategoriasDinamicasEl = document.getElementById('modalCategoriasDinamicas');
const closeModalCategoriasDinamicasBtnEl = document.getElementById('closeModalCategoriasDinamicasBtn');
const listaCategoriasDinamicasUlEl = document.getElementById('listaCategoriasDinamicas');
const feedbackCategoriasDinamicasEl = document.getElementById('feedbackCategoriasDinamicas');

// Botão de Logout (NOVO)
const logoutButtonEl = document.getElementById('logoutButton');


if (!userId && window.location.pathname.includes("Search.html")) { // Ou qualquer que seja sua página principal protegida
    console.warn('Usuário não autenticado. Redirecionando para login.');
    // window.location.href = './LoginRegister.html'; // Descomente para redirecionar
}


async function carregarPerfil() {
    if (!userId) return;
    try {
        const res = await fetch(`http://localhost:8080/perfil/${userId}`);
        if (!res.ok) throw new Error('Erro ao buscar dados do perfil');
        const data = await res.json();

        if (sidebarNomeUsuarioEl) sidebarNomeUsuarioEl.textContent = data.nome || 'Nome não definido';
        if (sidebarEmailUsuarioEl) sidebarEmailUsuarioEl.textContent = data.email || 'Email não informado';

        document.querySelectorAll('[data-perfil-img]').forEach(img => {
            img.src = data.fotoPerfil
                ? `http://localhost:8080${data.fotoPerfil}?t=${Date.now()}`
                : './imgprofile/ImagemProfile.jpg';
            img.onerror = function () { this.src = 'https://www.svgrepo.com/show/382106/user-alt.svg'; };
        });
    } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        if (sidebarNomeUsuarioEl) sidebarNomeUsuarioEl.textContent = 'Erro ao carregar';
        if (sidebarEmailUsuarioEl) sidebarEmailUsuarioEl.textContent = '';
    }
}

function exibirPostagens(lista) {
    if (!listaPostagensEl) return;
    listaPostagensEl.innerHTML = '';

    if (!lista || lista.length === 0) {
        listaPostagensEl.innerHTML = '<p style="text-align:center; padding:20px;">Nenhuma postagem encontrada.</p>';
        return;
    }

    const template = document.getElementById('postTemplate');

    lista.forEach(postagem => {
        const isDono = Number(postagem.usuarioId) === Number(userId);
        const clone = template.content.cloneNode(true);
        const postagemEl = clone.querySelector('.post');

        // Preencher dados
        const imgAutor = postagemEl.querySelector('.autor-foto-post');
        imgAutor.src = postagem.fotoPerfil ? `http://localhost:8080${postagem.fotoPerfil}` : './imgprofile/ImagemProfile.jpg';
        imgAutor.alt = `Foto de ${postagem.nomeUsuario || 'Desconhecido'}`;

        postagemEl.querySelector('.name').textContent = postagem.nomeUsuario || 'Desconhecido';
        postagemEl.querySelector('.date').textContent = new Date(postagem.dataCriacao).toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        postagemEl.querySelector('.post-title').textContent = postagem.titulo;
        postagemEl.querySelector('.post-description').textContent = postagem.descricao || '';

        const mediaDiv = postagemEl.querySelector('.post-media');
        const imgPrincipal = postagemEl.querySelector('.post-imagem-principal');
        if (postagem.caminhoImagem) {
            imgPrincipal.src = `http://localhost:8080${postagem.caminhoImagem}`;
            mediaDiv.style.display = 'block';
        }

        // Botão de contato
        const btnContato = postagemEl.querySelector('.btn-contato');
        btnContato.dataset.postagemId = postagem.id;
        btnContato.dataset.contato = postagem.contato || '';
        btnContato.dataset.email = postagem.emailUsuario || postagem.email || '';

        // Botão de apagar (só se for dono)
        const btnApagar = postagemEl.querySelector('.btn-apagar');
        if (isDono) {
            btnApagar.style.display = 'inline-block';
            btnApagar.dataset.id = postagem.id;
            btnApagar.addEventListener('click', async (e) => {
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
                        const resDel = await fetch(`${API_URL}/deletar/${postagem.id}`, {
                            method: 'DELETE',
                            headers: { 'userId': userId }
                        });

                        if (!resDel.ok) throw new Error(await resDel.text());
                        await Swal.fire('Apagado!', 'Postagem apagada com sucesso.', 'success');
                        carregarTodasPostagens();
                    } catch (err) {
                        Swal.fire('Erro!', 'Erro ao apagar postagem: ' + err.message, 'error');
                        console.error(err);
                    }
                }
            });
        }

        listaPostagensEl.appendChild(postagemEl);
    });

    configurarBotoesContato();
}


async function carregarTodasPostagens() {
    if (!listaPostagensEl) return;
    if (!userId) {
        listaPostagensEl.innerHTML = '<p style="text-align:center; padding:20px;">Faça login para ver as postagens.</p>';
        return;
    }
    listaPostagensEl.innerHTML = '<p style="text-align:center; padding:20px;">Carregando postagens...</p>';
    try {
        const res = await fetch(`${API_URL}/todas`);
        if (!res.ok) throw new Error('Erro ao buscar postagens');
        const todasAsPostagens = await res.json();
        exibirPostagens(todasAsPostagens);
    } catch (err) {
        console.error('Erro ao carregar postagens:', err);
        listaPostagensEl.innerHTML = '<p style="text-align:center; padding:20px;">Erro ao carregar postagens.</p>';
    }
}

async function abrirModalComCategoriasSugeridas() {
    if (!modalCategoriasDinamicasEl || !listaCategoriasDinamicasUlEl || !feedbackCategoriasDinamicasEl) {
        Swal.fire('Erro de Interface', 'Elementos do modal de categorias não foram encontrados na página. Verifique o HTML.', 'error');
        return;
    }

    listaCategoriasDinamicasUlEl.innerHTML = '';
    feedbackCategoriasDinamicasEl.textContent = 'Carregando sugestões de categorias...';
    feedbackCategoriasDinamicasEl.style.display = 'block';
    modalCategoriasDinamicasEl.style.display = 'flex';

    try {
        const res = await fetch(`${API_URL}/sugestoes-termos`);
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Erro ${res.status} ao buscar sugestões: ${errorText}`);
        }
        const termos = await res.json();

        if (termos && termos.length > 0) {
            feedbackCategoriasDinamicasEl.style.display = 'none';
            termos.forEach(termo => {
                const li = document.createElement('li');
                li.textContent = termo;
                li.dataset.termo = termo;
                li.style.padding = '10px';
                li.style.borderBottom = '1px solid #f0f0f0'; // Cor mais suave
                li.style.cursor = 'pointer';
                li.style.transition = 'background-color 0.2s ease';
                li.addEventListener('mouseover', () => li.style.backgroundColor = '#e9e9e9');
                li.addEventListener('mouseout', () => li.style.backgroundColor = 'transparent');

                li.addEventListener('click', () => {
                    buscarPostagensPeloTermoSelecionado(termo);
                    modalCategoriasDinamicasEl.style.display = 'none';
                });
                listaCategoriasDinamicasUlEl.appendChild(li);
            });
        } else {
            feedbackCategoriasDinamicasEl.textContent = 'Nenhuma categoria sugerida encontrada no momento.';
        }
    } catch (error) {
        console.error("Erro ao carregar categorias dinâmicas:", error);
        feedbackCategoriasDinamicasEl.textContent = 'Erro ao carregar sugestões.';
        Swal.fire('Erro', `Não foi possível carregar as sugestões: ${error.message}`, 'error');
    }
}

async function buscarPostagensPeloTermoSelecionado(termo) {
    if (!listaPostagensEl) return;
    listaPostagensEl.innerHTML = `<p style="text-align:center; padding:20px;">Buscando postagens sobre "${termo}"...</p>`;

    try {
        const encodedTermo = encodeURIComponent(termo);
        const res = await fetch(`${API_URL}/por-termo/${encodedTermo}`);
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Erro ${res.status} ao buscar postagens por termo: ${errorText}`);
        }
        const postagensEncontradas = await res.json();
        exibirPostagens(postagensEncontradas);
    } catch (error) {
        console.error(`Erro ao buscar postagens por termo "${termo}":`, error);
        listaPostagensEl.innerHTML = `<p style="text-align:center; padding:20px;">Erro ao buscar postagens sobre "${termo}".</p>`;
        Swal.fire('Erro', `Não foi possível buscar postagens: ${error.message}`, 'error');
    }
}

function configurarBotoesContato() {
    if (!modalContatoEl || !closeContatoModalBtnEl || !modalTelefoneEl || !modalEmailEl) return;

    document.addEventListener('click', function (e) {
        const targetButton = e.target.closest('.btn-contato');
        if (targetButton) {
            const contato = targetButton.dataset.contato || 'Não informado';
            const email = targetButton.dataset.email || 'Não informado';

            modalTelefoneEl.textContent = contato;
            modalEmailEl.textContent = email;

            if (contato !== 'Não informado' && contato.replace(/\D/g, '').length > 0) {
                modalTelefoneEl.href = `tel:${contato.replace(/\D/g, '')}`;
            } else {
                modalTelefoneEl.removeAttribute('href');
                modalTelefoneEl.textContent = 'Não informado';
            }

            if (email !== 'Não informado' && email.includes('@')) {
                modalEmailEl.href = `mailto:${email}`;
            } else {
                modalEmailEl.removeAttribute('href');
                modalEmailEl.textContent = 'Não informado';
            }
            modalContatoEl.style.display = 'flex';
        }
    });

    closeContatoModalBtnEl.addEventListener('click', () => {
        modalContatoEl.style.display = 'none';
    });

    modalContatoEl.addEventListener('click', (e) => {
        if (e.target === modalContatoEl) {
            modalContatoEl.style.display = 'none';
        }
    });
}

async function criarPostagemHandler(event) {
    event.preventDefault();
    if (!userId) {
        Swal.fire('Login Necessário', 'Você precisa estar logado para criar uma postagem.', 'info');
        return;
    }

    const titulo = tituloInputEl.value.trim();
    const descricao = descricaoInputEl.value.trim();
    if (!titulo) {
        Swal.fire('Atenção!', 'O título é obrigatório!', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("usuarioId", String(userId));
    if (imagemUploadInputEl.files.length > 0) {
        formData.append("imagem", imagemUploadInputEl.files[0]);
    }

    try {
        const res = await fetch(`${API_URL}/criar`, { method: 'POST', body: formData });
        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || 'Erro ao criar postagem');
        }

        tituloInputEl.value = '';
        descricaoInputEl.value = '';
        if (imagemUploadInputEl) imagemUploadInputEl.value = '';
        if (modalPublicacaoEl) modalPublicacaoEl.style.display = 'none';

        Swal.fire('Sucesso!', 'Postagem criada com sucesso!', 'success');
        carregarTodasPostagens();
    } catch (err) {
        Swal.fire('Erro!', `Erro ao criar postagem: ${err.message}`, 'error');
        console.error('Erro ao criar postagem:', err);
    }
}

function handleLogout() {
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('token'); // Se você usar token JWT
    // Adicione quaisquer outros itens do localStorage que precisam ser limpos
    Swal.fire('Deslogado', 'Você foi desconectado com sucesso.', 'success').then(() => {
        window.location.href = './LoginRegister.html'; // Redireciona para a página de login
    });
}


window.addEventListener('DOMContentLoaded', async () => {
    // Menu Toggle
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggleBtn && sidebar) {
        menuToggleBtn.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    if (userId) {
        await carregarPerfil();
        await carregarTodasPostagens();
        if(searchButtonEl) searchButtonEl.style.display = 'block'; // Mostra botão de busca se logado
        if(mainSearchInputEl) mainSearchInputEl.style.display = 'block'; // Mostra input de busca se logado
    } else {
        if(listaPostagensEl) listaPostagensEl.innerHTML = '<p style="text-align:center; padding:20px;">Bem-vindo! Faça <a href="./LoginRegister.html">login</a> ou <a href="./LoginRegister.html">registre-se</a> para interagir.</p>';
        if(postBoxEl) postBoxEl.style.display = 'none';
        if(searchButtonEl) searchButtonEl.style.display = 'none'; // Esconde botão de busca se não logado
        if(mainSearchInputEl) mainSearchInputEl.style.display = 'none'; // Esconde input de busca se não logado
        if(document.querySelector('.menu-link svg[fill="white"]')) { // Simplificação para ocultar itens do menu
            document.querySelectorAll('.sidebar .menu-lateral li').forEach(li => {
                const link = li.querySelector('a');
                if (link && (link.href.includes('Profile.html') || link.href.includes('Settings.html'))) {
                    li.style.display = 'none';
                }
            });
        }
    }

    if (postBoxEl) {
        postBoxEl.addEventListener('click', () => {
            if (!userId) {
                Swal.fire('Login Necessário', 'Você precisa estar logado para criar uma publicação.', 'info');
                return;
            }
            if(modalPublicacaoEl) modalPublicacaoEl.style.display = 'flex';
        });
    }
    if (closeModalBtnEl && modalPublicacaoEl) {
        closeModalBtnEl.addEventListener('click', () => modalPublicacaoEl.style.display = 'none');
    }
    if (criarPostBtnEl) {
        criarPostBtnEl.addEventListener('click', criarPostagemHandler);
    }

    if (searchButtonEl && userId) { // Só adiciona listener se o botão existir e usuário logado
        searchButtonEl.addEventListener('click', abrirModalComCategoriasSugeridas);
    }

    if (closeModalCategoriasDinamicasBtnEl && modalCategoriasDinamicasEl) {
        closeModalCategoriasDinamicasBtnEl.addEventListener('click', () => {
            modalCategoriasDinamicasEl.style.display = 'none';
        });
        modalCategoriasDinamicasEl.addEventListener('click', (event) => {
            if (event.target === modalCategoriasDinamicasEl) {
                modalCategoriasDinamicasEl.style.display = 'none';
            }
        });
    }


    // Se você adicionar um botão com id="limparBuscaButtonPrincipal" ao seu HTML:
    const limparBuscaButtonPrincipalEl = document.getElementById('limparBuscaButtonPrincipal');
    if (limparBuscaButtonPrincipalEl && userId) {
        limparBuscaButtonPrincipalEl.addEventListener('click', () => {
            if (mainSearchInputEl) mainSearchInputEl.value = ''; // Limpa o campo de texto da busca, se usado
            carregarTodasPostagens();
        });
    }

    if(logoutButtonEl) {
        logoutButtonEl.addEventListener('click', (e) => {
            e.preventDefault(); // Previne a navegação padrão do link
            handleLogout();
        });
    }
});