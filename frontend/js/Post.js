  document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('foto');
  const container = document.getElementById('preview-container');
  const publicarBtn = document.querySelector('.btn-publicar');
  const modal = document.getElementById('modal');
  const closeModalBtn = document.querySelector('.close-modal');

  input.addEventListener('change', () => {
    container.innerHTML = '';
    Array.from(input.files).forEach(file => {
      const reader = new FileReader();
      const item = document.createElement('div');
      item.classList.add('preview-item');
      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.innerText = '×';
      deleteBtn.addEventListener('click', () => {
        item.remove();
      });

      reader.onload = () => {
        if (file.type.startsWith('image/')) {
          const img = document.createElement('img');
          img.src = reader.result;
          item.appendChild(img);
        } else if (file.type.startsWith('video/')) {
          const video = document.createElement('video');
          video.src = reader.result;
          video.controls = true;
          item.appendChild(video);
        }
        item.appendChild(deleteBtn);
        container.appendChild(item);
      };
      reader.readAsDataURL(file);
    });
  });

  publicarBtn.addEventListener('click', function (e) {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const arquivos = input.files;

    if (!titulo || !descricao) {
      alert('Preencha o título e a descrição.');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);

    for (let i = 0; i < arquivos.length; i++) {
      formData.append('midias', arquivos[i]);
    }

    fetch('http://localhost:8080/publicacoes', {
      method: 'POST',
      body: formData
    })
        .then(response => {
          if (response.ok) {
            alert('Publicação realizada com sucesso!');
            modal.style.display = 'none';
            clearForm();
            // Aqui você pode adicionar código para atualizar o feed sem recarregar
          } else {
            alert('Erro ao publicar. Verifique os campos.');
          }
        })
        .catch(error => {
          console.error('Erro ao enviar:', error);
          alert('Erro de rede ao tentar publicar.');
        });
  });

  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  function clearForm() {
    document.getElementById('titulo').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('foto').value = '';
    container.innerHTML = '';
  }
});

const toggleBtn = document.getElementById('searchToggle');
const wrapper = document.querySelector('.search-wrapper');

toggleBtn.addEventListener('click', () => {
  wrapper.classList.toggle('active');
});


document.getElementById("inputPost").addEventListener("click", function () {
  document.getElementById("modalPublicacao").style.display = "flex";
});

document.getElementById('postBox').addEventListener('click', function() {
  document.getElementById('modalPublicacao').style.display = 'flex';
});

document.getElementById('closeModalBtn').addEventListener('click', function() {
  document.getElementById('modalPublicacao').style.display = 'none';
});

function abrirVisualizacao(imgSrc, titulo, descricao, usuario) {
  document.getElementById("visualizacao-img").src = imgSrc;
  document.getElementById("visualizacao-titulo").textContent = titulo;
  document.getElementById("visualizacao-descricao").textContent = descricao;
  document.getElementById("visualizacao-usuario").textContent = usuario;
  document.getElementById("visualizacaoModal").style.display = "block";
}

function fecharVisualizacao() {
  document.getElementById("visualizacaoModal").style.display = "none";
}




