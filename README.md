# Fintech FIAP — Grand Finale

> Banco digital completo desenvolvido como projeto integrador da FIAP. Backend em Spring Boot com Oracle, frontend em React, autenticação por token de sessão com expiração.

---

## Tecnologias

| Camada         | Tecnologia                                      |
|----------------|-------------------------------------------------|
| Backend        | Java 21, Spring Boot, Spring Data JPA, Hibernate |
| Autenticação   | Token UUID com expiração de 8h, Bearer header   |
| Banco de dados | Oracle (instância FIAP)                         |
| Frontend       | React 19, Vite, React Router, Axios             |

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| Java       | 21+           |
| Node.js    | 18+           |
| npm        | 9+            |

> Maven não precisa ser instalado — o projeto já inclui o Maven Wrapper (`mvnw`).

---

## Configuração

Antes de rodar, configure o banco em `fintech/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:oracle:thin:@<host>:<porta>:<sid>
spring.datasource.username=<seu_usuario>
spring.datasource.password=<sua_senha>
spring.jpa.database-platform=org.hibernate.dialect.OracleDialect
spring.jpa.hibernate.ddl-auto=update
server.port=8080
```

> As tabelas e sequences são criadas automaticamente pelo Hibernate na primeira inicialização.

---

## Como rodar

### 1. Backend

```bash
# Windows
cd fintech
.\mvnw.cmd spring-boot:run

# Mac / Linux
cd fintech
./mvnw spring-boot:run
```

Backend disponível em `http://localhost:8080`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em `http://localhost:5173`.

> O backend precisa estar rodando antes de abrir o frontend.

---

## Autenticação

O sistema usa **tokens de sessão** armazenados no banco de dados.

- Token gerado no login expira em **8 horas**
- Todas as rotas protegidas exigem o header `Authorization: Bearer <token>`
- O logout invalida o token imediatamente no banco

**Fluxo:**

```
POST /api/auth/login  →  { token, expiraEm, usuario }
                              ↓
          Authorization: Bearer <token>  (em todas as requisições)
                              ↓
          POST /api/auth/logout  →  token invalidado
```

---

## Primeiros passos

### 1. Criar conta

```http
POST http://localhost:8080/api/usuarios
Content-Type: application/json

{
  "nome": "Seu Nome",
  "email": "seu@email.com",
  "senha": "suasenha"
}
```

Ou acesse `http://localhost:5173` e clique em **Criar conta**.

### 2. Fazer login

```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "seu@email.com",
  "senha": "suasenha"
}
```

Resposta:
```json
{
  "token": "abc123...",
  "expiraEm": "2025-01-01T20:00:00",
  "usuario": { "id": 1, "nome": "Seu Nome", "email": "seu@email.com" }
}
```

### 3. Criar uma conta bancária

Acesse **Contas** no menu e crie ao menos uma conta. Sem conta bancária cadastrada, depósito, PIX e extrato não ficam disponíveis.

---

## Funcionalidades

| Tela          | O que faz                                                               |
|---------------|-------------------------------------------------------------------------|
| Login         | Autenticação com token de sessão (expira em 8h)                        |
| Home          | Saldo total + atalhos rápidos (PIX, Depositar, Extrato, Cartões...)    |
| Depositar     | Lança receita (entra no saldo) ou despesa (sai do saldo)               |
| Transferência | PIX entre contas pelo ID da conta destino                              |
| Extrato       | Histórico com filtros por tipo (Todos / Receitas / Despesas)           |
| Contas        | CRUD de contas bancárias                                               |
| Cartões       | CRUD de cartões vinculados ao usuário                                  |
| Transações    | Listagem completa de transações                                        |
| Usuários      | CRUD de usuários                                                       |

---

## Endpoints da API

### Auth — `/api/auth`
| Método | Rota              | Descrição                | Auth    |
|--------|-------------------|--------------------------|---------|
| POST   | /api/auth/login   | Autenticar, obter token  | Público |
| POST   | /api/auth/logout  | Invalidar token          | Bearer  |

### Usuários — `/api/usuarios`
| Método | Rota                | Descrição     | Auth    |
|--------|---------------------|---------------|---------|
| GET    | /api/usuarios       | Listar todos  | Bearer  |
| GET    | /api/usuarios/{id}  | Buscar por ID | Bearer  |
| POST   | /api/usuarios       | Criar usuário | Público |
| PUT    | /api/usuarios/{id}  | Atualizar     | Bearer  |
| DELETE | /api/usuarios/{id}  | Deletar       | Bearer  |

### Contas — `/api/contas`
| Método | Rota                        | Descrição                      | Auth   |
|--------|-----------------------------|--------------------------------|--------|
| GET    | /api/contas                 | Listar todas                   | Bearer |
| GET    | /api/contas/{id}            | Buscar por ID                  | Bearer |
| GET    | /api/contas/usuario/{id}    | Contas de um usuário           | Bearer |
| POST   | /api/contas                 | Criar conta                    | Bearer |
| PUT    | /api/contas/{id}            | Atualizar                      | Bearer |
| DELETE | /api/contas/{id}            | Deletar                        | Bearer |
| POST   | /api/contas/{id}/depositar  | Lançar receita ou despesa      | Bearer |
| POST   | /api/contas/transferir      | Transferência PIX entre contas | Bearer |

**Body — lançamento:**
```json
{ "valor": 500.00, "descricao": "Salário", "tipo": "RECEITA" }
```

**Body — transferência:**
```json
{ "contaOrigemId": 1, "contaDestinoId": 2, "valor": 200.00, "descricao": "Pagamento" }
```

### Transações — `/api/transacoes`
| Método | Rota                        | Descrição               | Auth   |
|--------|-----------------------------|-------------------------|--------|
| GET    | /api/transacoes             | Listar todas            | Bearer |
| GET    | /api/transacoes/{id}        | Buscar por ID           | Bearer |
| GET    | /api/transacoes/conta/{id}  | Transações de uma conta | Bearer |
| POST   | /api/transacoes             | Criar transação         | Bearer |
| PUT    | /api/transacoes/{id}        | Atualizar               | Bearer |
| DELETE | /api/transacoes/{id}        | Deletar                 | Bearer |

### Cartões — `/api/cartoes`
| Método | Rota                       | Descrição             | Auth   |
|--------|----------------------------|-----------------------|--------|
| GET    | /api/cartoes               | Listar todos          | Bearer |
| GET    | /api/cartoes/{id}          | Buscar por ID         | Bearer |
| GET    | /api/cartoes/usuario/{id}  | Cartões de um usuário | Bearer |
| POST   | /api/cartoes               | Criar cartão          | Bearer |
| PUT    | /api/cartoes/{id}          | Atualizar             | Bearer |
| DELETE | /api/cartoes/{id}          | Deletar               | Bearer |

---

## Estrutura do Projeto

```
grand finale/
├── fintech/                              # Backend Spring Boot
│   └── src/main/java/br/com/fiap/fintech/
│       ├── config/                       # CORS, TokenInterceptor, WebConfig
│       ├── controller/                   # AuthController, UsuarioController, ContaController...
│       ├── dto/                          # LoginDTO, DepositoDTO, TransferenciaDTO
│       ├── exception/                    # BusinessException, ResourceNotFoundException, UnauthorizedException
│       ├── model/                        # Usuario, Conta, Transacao, Cartao, TokenSessao
│       ├── repository/                   # Interfaces Spring Data JPA
│       └── service/                      # AuthService, UsuarioService, ContaService...
│
└── frontend/                             # Frontend React + Vite
    └── src/
        ├── components/                   # Layout, sidebar, RotaProtegida
        ├── context/                      # AuthContext (token + logout)
        ├── pages/                        # Login, Home, Deposito, Extrato...
        └── services/                     # API axios (Bearer automático)
```

---

## Entidades

| Entidade    | Tabela          | Sequence        |
|-------------|-----------------|-----------------|
| Usuario     | TB_USUARIO      | SQ_USUARIO      |
| Conta       | TB_CONTA        | SQ_CONTA        |
| Transacao   | TB_TRANSACAO    | SQ_TRANSACAO    |
| Cartao      | TB_CARTAO       | SQ_CARTAO       |
| TokenSessao | TB_TOKEN_SESSAO | SQ_TOKEN_SESSAO |
