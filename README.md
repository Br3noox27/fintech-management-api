# Fintech FIAP — Grand Finale

Banco digital completo com backend Spring Boot (Oracle FIAP) e frontend React.

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| Java       | 21+           |
| Node.js    | 18+           |
| npm        | 9+            |

> Não é necessário instalar Maven — o projeto já inclui o Maven Wrapper (`mvnw`).

---

## Como rodar

### 1. Backend

Abra um terminal na pasta `fintech/` e execute:

**Windows:**
```bash
cd fintech
.\mvnw.cmd spring-boot:run
```

**Mac / Linux:**
```bash
cd fintech
./mvnw spring-boot:run
```

O backend sobe em `http://localhost:8080`.

> Se a porta 8080 estiver ocupada:
> ```bash
> netstat -ano | findstr :8080
> taskkill /PID <número_do_pid> /F
> ```

---

### 2. Frontend

Abra **outro terminal** na pasta `frontend/` e execute:

```bash
cd frontend
npm install
npm run dev
```

O frontend sobe em `http://localhost:5173`.

> O backend precisa estar rodando antes de abrir o frontend.

---

## Banco de dados

O projeto usa **Oracle FIAP** configurado em `fintech/src/main/resources/application.properties`:

```
URL:      jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
Usuário:  rm567249
Senha:    270805
```

As tabelas e sequences são criadas automaticamente pelo Hibernate na primeira inicialização.

---

## Autenticação

O sistema usa **autenticação por token de sessão** armazenado no banco de dados.

- O login gera um token único que expira em **8 horas**
- Todas as rotas (exceto cadastro e login) exigem o header `Authorization: Bearer <token>`
- O logout invalida o token no banco imediatamente

**Fluxo:**
1. `POST /api/auth/login` → retorna `{ token, expiraEm, usuario }`
2. Todas as requisições seguintes enviam `Authorization: Bearer <token>`
3. `POST /api/auth/logout` → invalida o token

---

## Credenciais de teste

### Opção 1 — Criar pela interface

1. Acesse `http://localhost:5173`
2. Clique em **"Criar conta"** na tela de login
3. Preencha nome, e-mail e senha

### Opção 2 — Criar via API

```http
POST http://localhost:8080/api/usuarios
Content-Type: application/json

{
  "nome": "Breno Teste",
  "email": "breno@fiap.com",
  "senha": "123456"
}
```

Depois faça login:

```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "breno@fiap.com",
  "senha": "123456"
}
```

### Após criar o usuário

Acesse **Contas** no menu e crie ao menos uma conta bancária. Sem conta criada, as funções de depósito, PIX e extrato não ficam disponíveis.

---

## Funcionalidades

| Tela          | O que faz                                                                        |
|---------------|----------------------------------------------------------------------------------|
| Login         | Autenticação por e-mail e senha com token de sessão (expira em 8h)              |
| Home          | Saldo total + atalhos rápidos (PIX, Lançamento, Extrato, Cartões...)             |
| Lançamento    | Registra receita (entra no saldo) ou despesa (sai do saldo) na conta            |
| Transferência | PIX entre contas: busca destinatário pelo ID da conta e transfere               |
| Extrato       | Histórico de transações com filtros por tipo (Todos / Receitas / Despesas)      |
| Contas        | CRUD de contas bancárias                                                         |
| Cartões       | CRUD de cartões vinculados ao usuário                                            |
| Transações    | Listagem completa de todas as transações                                         |
| Usuários      | CRUD de usuários                                                                 |

---

## Endpoints da API

### Auth — `/api/auth`
| Método | Rota             | Descrição                          | Auth      |
|--------|------------------|------------------------------------|-----------|
| POST   | /api/auth/login  | Autenticar e obter token           | Público   |
| POST   | /api/auth/logout | Invalidar token                    | Bearer    |

### Usuários — `/api/usuarios`
| Método | Rota               | Descrição     | Auth    |
|--------|--------------------|---------------|---------|
| GET    | /api/usuarios      | Listar todos  | Bearer  |
| GET    | /api/usuarios/{id} | Buscar por ID | Bearer  |
| POST   | /api/usuarios      | Criar usuário | Público |
| PUT    | /api/usuarios/{id} | Atualizar     | Bearer  |
| DELETE | /api/usuarios/{id} | Deletar       | Bearer  |

### Contas — `/api/contas`
| Método | Rota                       | Descrição                      | Auth   |
|--------|----------------------------|--------------------------------|--------|
| GET    | /api/contas                | Listar todas                   | Bearer |
| GET    | /api/contas/{id}           | Buscar por ID                  | Bearer |
| GET    | /api/contas/usuario/{id}   | Contas de um usuário           | Bearer |
| POST   | /api/contas                | Criar conta                    | Bearer |
| PUT    | /api/contas/{id}           | Atualizar conta                | Bearer |
| DELETE | /api/contas/{id}           | Deletar conta                  | Bearer |
| POST   | /api/contas/{id}/depositar | Lançar receita ou despesa      | Bearer |
| POST   | /api/contas/transferir     | Transferência PIX entre contas | Bearer |

**Body — lançamento:**
```json
{ "valor": 500.00, "descricao": "Salário", "tipo": "RECEITA" }
```

**Body — transferência:**
```json
{ "contaOrigemId": 1, "contaDestinoId": 2, "valor": 200.00, "descricao": "Pagamento" }
```

### Transações — `/api/transacoes`
| Método | Rota                       | Descrição               | Auth   |
|--------|----------------------------|-------------------------|--------|
| GET    | /api/transacoes            | Listar todas            | Bearer |
| GET    | /api/transacoes/{id}       | Buscar por ID           | Bearer |
| GET    | /api/transacoes/conta/{id} | Transações de uma conta | Bearer |
| POST   | /api/transacoes            | Criar transação         | Bearer |
| PUT    | /api/transacoes/{id}       | Atualizar               | Bearer |
| DELETE | /api/transacoes/{id}       | Deletar                 | Bearer |

### Cartões — `/api/cartoes`
| Método | Rota                      | Descrição             | Auth   |
|--------|---------------------------|-----------------------|--------|
| GET    | /api/cartoes              | Listar todos          | Bearer |
| GET    | /api/cartoes/{id}         | Buscar por ID         | Bearer |
| GET    | /api/cartoes/usuario/{id} | Cartões de um usuário | Bearer |
| POST   | /api/cartoes              | Criar cartão          | Bearer |
| PUT    | /api/cartoes/{id}         | Atualizar             | Bearer |
| DELETE | /api/cartoes/{id}         | Deletar               | Bearer |

---

## Estrutura do Projeto

```
grand finale/
├── README.md
├── fintech/                          # Backend Spring Boot
│   └── src/main/java/br/com/fiap/fintech/
│       ├── model/                    # Entidades JPA (Usuario, Conta, Transacao, Cartao, TokenSessao)
│       ├── repository/               # Interfaces Spring Data JPA
│       ├── service/                  # Regras de negócio + AuthService
│       ├── controller/               # Endpoints REST + AuthController
│       ├── dto/                      # Data Transfer Objects
│       ├── exception/                # BusinessException, ResourceNotFoundException, UnauthorizedException
│       └── config/                   # CORS, TokenInterceptor, WebConfig
│
└── frontend/                         # Frontend React + Vite
    └── src/
        ├── pages/                    # Login, Home, Deposito, Transferencia, Extrato...
        ├── services/                 # Chamadas à API (axios + Bearer token automático)
        ├── context/                  # AuthContext (login/logout com token)
        └── components/               # Layout, sidebar
```

---

## Entidades

| Entidade     | Tabela            | Sequence         |
|--------------|-------------------|------------------|
| Usuario      | TB_USUARIO        | SQ_USUARIO       |
| Conta        | TB_CONTA          | SQ_CONTA         |
| Transacao    | TB_TRANSACAO      | SQ_TRANSACAO     |
| Cartao       | TB_CARTAO         | SQ_CARTAO        |
| TokenSessao  | TB_TOKEN_SESSAO   | SQ_TOKEN_SESSAO  |
