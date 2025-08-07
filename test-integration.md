# Teste de Integração Frontend + Backend

## Como testar

### 1. Iniciar o Backend

```bash
cd backend-registro-de-ponto
npm run start:dev
```

O backend estará rodando em: `http://localhost:3001`
Documentação Swagger: `http://localhost:3001/api/docs`

### 2. Iniciar o Frontend

```bash
cd front-registro-de-ponto
npm run dev
```

O frontend estará rodando em: `http://localhost:3000`

### 3. Configurar Variável de Ambiente

Crie o arquivo `.env.local` na raiz do frontend:

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
```

### 4. Testar Funcionalidades

#### 4.1. Verificar Backend
- Acesse: `http://localhost:3001/api/docs`
- Teste o endpoint: `GET /api/funcionarios`
- Deve retornar uma lista vazia inicialmente

#### 4.2. Verificar Frontend
- Acesse: `http://localhost:3000/empresa/funcionarios`
- Deve aparecer "Nenhum funcionário cadastrado"
- As estatísticas devem mostrar zeros

#### 4.3. Criar Funcionário via Swagger
1. Acesse: `http://localhost:3001/api/docs`
2. Vá para o endpoint `POST /api/funcionarios`
3. Use este JSON de exemplo:

```json
{
  "nome": "João Silva",
  "cpf": "123.456.789-10",
  "email": "joao.silva@empresa.com",
  "telefone": "(11) 99999-0001",
  "cargo": "Desenvolvedor Frontend",
  "departamento": "Tecnologia",
  "ativo": true,
  "dataAdmissao": "2023-01-15",
  "horarioTrabalho": {
    "entrada": "08:00",
    "saida": "17:00",
    "intervalos": [
      {
        "inicio": "12:00",
        "fim": "13:00"
      }
    ]
  }
}
```

#### 4.4. Verificar no Frontend
- Volte para: `http://localhost:3000/empresa/funcionarios`
- Clique em "Atualizar"
- Deve aparecer o funcionário criado
- As estatísticas devem ser atualizadas

#### 4.5. Testar Funcionalidades
- **Busca**: Digite "João" no campo de busca
- **Filtros**: Selecione "Tecnologia" no filtro de departamento
- **Ações**: 
  - Clique no botão de desativar (ícone UserX)
  - Verifique que o status muda para "Inativo"
  - Clique novamente para ativar

### 5. Endpoints Testáveis via Swagger

#### Básicos:
- `GET /api/funcionarios` - Listar com paginação
- `POST /api/funcionarios` - Criar funcionário
- `GET /api/funcionarios/{id}` - Buscar por ID
- `PATCH /api/funcionarios/{id}` - Atualizar
- `DELETE /api/funcionarios/{id}` - Excluir

#### Específicos:
- `GET /api/funcionarios/cpf/{cpf}` - Buscar por CPF
- `GET /api/funcionarios/email/{email}` - Buscar por email
- `GET /api/funcionarios/departamento/{departamento}` - Por departamento
- `PATCH /api/funcionarios/{id}/ativar` - Ativar
- `PATCH /api/funcionarios/{id}/desativar` - Desativar

#### Estatísticas:
- `GET /api/funcionarios/estatisticas/departamentos`
- `GET /api/funcionarios/estatisticas/cargos`

### 6. Casos de Teste

#### 6.1. Validação de CPF
- Tente criar funcionário com CPF inválido
- Deve retornar erro 400

#### 6.2. Unicidade
- Tente criar dois funcionários com mesmo CPF
- Deve retornar erro 400

#### 6.3. Paginação
- Crie mais de 10 funcionários
- Verifique se a paginação funciona no frontend

#### 6.4. Filtros
- Crie funcionários de departamentos diferentes
- Teste os filtros no frontend

### 7. Troubleshooting

#### CORS Error
Se aparecer erro de CORS:
1. Verifique se o backend está rodando na porta 3001
2. Confirme que o CORS está configurado no `main.ts`

#### Connection Refused
Se não conseguir conectar:
1. Verifique se ambos os servidores estão rodando
2. Confirme a URL da API no `.env.local`

#### Database Error
Se aparecer erro de banco:
1. Verifique se o PostgreSQL está rodando
2. Confirme a configuração do banco no backend

### 8. Próximos Passos

Após confirmar que tudo funciona:
1. ✅ Criar funcionário
2. ✅ Listar funcionários
3. ✅ Filtros e busca
4. ✅ Ativação/desativação
5. ✅ Paginação
6. 🔄 Modal de criação/edição
7. 🔄 Visualização detalhada
8. 🔄 Validações visuais
9. 🔄 Notificações de sucesso/erro 