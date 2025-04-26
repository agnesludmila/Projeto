## 🚀 Instruções para Iniciar o Projeto

### 1. Abrir dois terminais:
- **Terminal 1:** dentro da pasta `backend` (onde está o `pom.xml`)
- **Terminal 2:** em qualquer pasta para gerenciar o Docker

---

### 2. No terminal do Docker:
- Verificar se o container está rodando:
  ```bash
  docker ps
  ```

- **Se o container não estiver rodando:**
    - Abrir o Docker Desktop e iniciar o container manualmente
    - **Ou**, rodar:
      ```bash
      docker start bd-achados-e-perdidos
      ```

- **Se o container já estiver rodando:**
    - Acessar o banco de dados usando o seguinte comando:
      ```bash
      docker exec -it bd-achados-e-perdidos psql -U usuario -d achados-e-perdidos
      ```

---

### 3. No terminal do Spring Boot:
- Dentro da pasta `backend`, rodar o projeto usando Maven:
  ```bash
  ./mvnw spring-boot:run
  ```

---

### ✅ Agora o projeto estará rodando!
- O backend estará escutando em `http://localhost:8080`
- O banco de dados estará disponível no container Docker

---

**Dica:** se der erro de permissão no `./mvnw`, rode:
```bash
chmod +x mvnw
```