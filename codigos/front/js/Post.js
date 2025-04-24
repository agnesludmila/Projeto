
  const input = document.getElementById('foto');
  const container = document.getElementById('preview-container');

  input.addEventListener('change', () => {

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

  document.querySelector('.btn-publicar').addEventListener('click', function (e) {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const arquivos = document.getElementById('foto').files;

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);

    for (let i = 0; i < arquivos.length; i++) {
      formData.append('midias', arquivos[i]); // nome "midias" deve bater com o Spring
    }

    fetch('http://localhost:8080/publicacoes', { // ajuste para a sua rota real
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        alert('Publicação realizada com sucesso!');
        window.location.href = 'pagina-principal.html'; // ou outra página
      } else {
        alert('Erro ao publicar. Verifique os campos.');
      }
    })
    .catch(error => {
      console.error('Erro ao enviar:', error);
      alert('Erro de rede ao tentar publicar.');
    });
  });


