# Twitter Clone - Projeto Final EBAC

Aplicação full stack inspirada no Twitter, desenvolvida como projeto final do curso Full Stack Python da EBAC.

## Links de Deploy

- Frontend (Vercel): https://twitter-clone-steel-five.vercel.app
- Backend (PythonAnywhere): https://rieshinoda.pythonanywhere.com
- Swagger (documentação da API): https://rieshinoda.pythonanywhere.com/api/v1/swagger/

## Funcionalidades

- Cadastro e login com JWT
- Edição de perfil (username, bio e avatar)
- Alteração de senha
- Seguir e deixar de seguir usuários
- Feed de postagens de usuários seguidos
- Curtidas e comentários em postagens
- Página de perfil com listagem de posts

## Tecnologias

### Backend

- Python
- Django
- Django REST Framework
- Simple JWT
- drf-spectacular (Swagger/ReDoc)
- SQLite (desenvolvimento)

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router

## Estrutura do Projeto

```text
twitter_clone/
	backend/
		accounts/
		posts/
		core/
		manage.py
	frontend/
		src/
		package.json
```

## Como Rodar Localmente

## 1. Clonar repositório

```bash
git clone <url-do-repositorio>
cd twitter_clone
```

## 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Crie um arquivo `.env` em `backend/` com base no `.env.example`.

Exemplo de variáveis locais:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173
```

## 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Crie um arquivo `.env` em `frontend/` com base no `.env.example`.

Exemplo de variável local:

```env
VITE_API_URL=http://localhost:8000/api/v1/
```

## Principais Endpoints

- `POST /api/v1/auth/register/`
- `POST /api/v1/auth/login/`
- `POST /api/v1/auth/change-password/`
- `GET/PATCH /api/v1/profile/`
- `GET /api/v1/users/`
- `POST /api/v1/users/{id}/follow/`
- `POST /api/v1/posts/`
- `GET /api/v1/feed/`
- `GET /api/v1/my-posts/`
- `POST /api/v1/posts/{id}/like/`
- `GET/POST /api/v1/posts/{id}/comments/`

## Deploy

### Backend - PythonAnywhere

Resumo do processo:

1. Criar web app (manual configuration)
2. Clonar repositório no servidor
3. Criar e ativar virtualenv
4. `pip install -r requirements.txt`
5. Configurar `.env` de produção
6. Rodar `python manage.py migrate`
7. Rodar `python manage.py collectstatic --noinput`
8. Configurar mapeamento de `/static/` e `/media/` no painel Web
9. Reload da aplicação

Exemplo de `.env` em produção:

```env
SECRET_KEY=your-real-secret-key
DEBUG=False
ALLOWED_HOSTS=rieshinoda.pythonanywhere.com
CORS_ALLOWED_ORIGINS=https://twitter-clone-steel-five.vercel.app
CSRF_TRUSTED_ORIGINS=https://twitter-clone-steel-five.vercel.app
```

### Frontend - Vercel

Resumo do processo:

1. Importar repositório na Vercel
2. Definir Root Directory como `frontend`
3. Configurar variável `VITE_API_URL`
4. Fazer deploy

Valor em producao:

```env
VITE_API_URL=https://rieshinoda.pythonanywhere.com/api/v1/
```

## Autor

Projeto desenvolvido por Thayná Shinoda
