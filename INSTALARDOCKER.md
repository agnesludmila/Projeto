# Guia de Instalação e Execução do Projeto

## 1. Instalar o Docker

- Acesse o site oficial: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
- Baixe e instale o **Docker Desktop** para Windows.
- Após instalar, reinicie o computador se necessário.

---

## 2. Fazer login no Docker com GitHub

- Abra o **Docker Desktop**.
- Clique em **Sign In**.
- Escolha a opção **Continue with GitHub**.
- Autorize o acesso ao seu GitHub.


## 3. Atualizar o Projeto para a Última Versão da Main

```bash
git pull origin main
```

---

## 4. Subir os Containers com Docker Compose

Na **pasta raiz** do projeto (onde está o `docker-compose.yml`), rode:

```bash
docker-compose up -d
```
- O Docker vai criar e iniciar os containers do banco de dados e outros serviços necessários.

---

## 5. Verificar se os Containers estão Rodando

```bash
docker ps
```
- Você verá os containers rodando, incluindo um chamado `bd-achados-e-perdidos`.

- CONTAINER ID   IMAGE         COMMAND                  CREATED        STATUS         PORTS                    NAMES
Se aparecer isso, significa que o container não está rodando.

---

## 6. Acessar o Banco de Dados Dentro do Container

Rode o comando:

```bash
docker exec -it bd-achados-e-perdidos psql -U usuario -d achados-e-perdidos
```
- Você agora está dentro do banco PostgreSQL do projeto!

---

## . 7 Instalar o Maven (caso ainda não tenha)

### 7.1 Baixar o Maven
- Acesse: [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)
- Baixe o arquivo `.zip` (ex: `apache-maven-3.9.6-bin.zip`).

### 7.2 Configurar Variáveis de Ambiente
- Extraia o zip para uma pasta, como:
  ```
  C:\Program Files\Apache\Maven
  ```
- Crie uma variável de ambiente chamada `MAVEN_HOME` apontando para o caminho extraído.
- Adicione `%MAVEN_HOME%\bin` na variável `Path`.

### 7.3 Verificar Instalação

```bash
mvn -version
```
- Deve aparecer a versão do Maven e do Java.

---

## 8. Rodar a Aplicação Spring Boot

- Na mesma pasta onde está o `pom.xml` (`backend/`), rode:

```bash
./mvnw spring-boot:run
```

- O servidor irá iniciar e o projeto estará disponível ( `http://localhost:8080`).


---