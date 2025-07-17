# Entidades para Backend - Sistema de Registro de Ponto

## Visão Geral
Este documento detalha todas as entidades necessárias para implementar o backend do sistema de registro de ponto eletrônico.

## Entidades Principais

### 1. Funcionario
Representa os funcionários da empresa.

**Campos obrigatórios:**
- `id`: string (UUID)
- `nome`: string
- `cpf`: string (único)
- `email`: string (único)
- `telefone`: string
- `cargo`: string
- `departamento`: string
- `ativo`: boolean
- `dataAdmissao`: Date
- `horarioTrabalho`: objeto com entrada, saída e intervalos

**Relacionamentos:**
- Um para muitos com `RegistroPonto`
- Um para muitos com `Ausencia`
- Um para muitos com `Ferias`
- Um para muitos com `JustificativaPonto`
- Um para muitos com `BancoHoras`

### 2. RegistroPonto
Registra todas as marcações de ponto dos funcionários.

**Campos obrigatórios:**
- `id`: string (UUID)
- `funcionarioId`: string (FK)
- `dataHora`: DateTime
- `tipo`: enum ("entrada" | "saida" | "intervalo_inicio" | "intervalo_fim")
- `localizacao`: objeto com latitude, longitude e endereço
- `qrCodeId`: string (FK)
- `status`: enum ("aprovado" | "pendente" | "rejeitado")

**Campos opcionais:**
- `justificativa`: string

**Relacionamentos:**
- Muitos para um com `Funcionario`
- Muitos para um com `QRCode`
- Um para muitos com `JustificativaPonto`

### 3. Ausencia
Controla faltas, licenças, atestados e feriados.

**Campos obrigatórios:**
- `id`: string (UUID)
- `funcionarioId`: string (FK)
- `tipo`: enum ("falta" | "atestado" | "licenca" | "feriado")
- `dataInicio`: Date
- `dataFim`: Date
- `motivo`: string
- `status`: enum ("pendente" | "aprovada" | "rejeitada")

**Campos opcionais:**
- `documentoAnexo`: string (URL/path)
- `observacoes`: string

**Relacionamentos:**
- Muitos para um com `Funcionario`

### 4. Ferias
Gerencia os períodos de férias dos funcionários.

**Campos obrigatórios:**
- `id`: string (UUID)
- `funcionarioId`: string (FK)
- `periodoAquisitivo`: objeto com data início e fim
- `diasDireito`: number
- `diasUsados`: number
- `periodos`: array de objetos com períodos de férias

**Relacionamentos:**
- Muitos para um com `Funcionario`

### 5. JustificativaPonto
Justificativas para registros de ponto irregulares.

**Campos obrigatórios:**
- `id`: string (UUID)
- `funcionarioId`: string (FK)
- `registroPontoId`: string (FK)
- `motivo`: string
- `descricao`: string
- `dataJustificativa`: DateTime
- `status`: enum ("pendente" | "aprovada" | "rejeitada")

**Campos opcionais:**
- `documentoAnexo`: string
- `analisadoPor`: string (FK para Funcionario)
- `dataAnalise`: DateTime
- `observacoesAnalise`: string

**Relacionamentos:**
- Muitos para um com `Funcionario`
- Muitos para um com `RegistroPonto`

### 6. BancoHoras
Controla o saldo de horas extras e débitos.

**Campos obrigatórios:**
- `id`: string (UUID)
- `funcionarioId`: string (FK)
- `mes`: number (1-12)
- `ano`: number
- `horasExtras`: number
- `horasDebito`: number
- `saldoAnterior`: number
- `saldoAtual`: number
- `detalhes`: array de movimentações

**Relacionamentos:**
- Muitos para um com `Funcionario`

## Entidades Auxiliares

### 7. Departamento
Lista de departamentos da empresa.

**Campos:**
- `id`: string (UUID)
- `nome`: string
- `funcionarios`: number (contador)

### 8. Cargo
Lista de cargos disponíveis.

**Campos:**
- `id`: string (UUID)
- `nome`: string
- `departamento`: string

### 9. QRCode
QR Codes para marcação de ponto.

**Campos:**
- `id`: string
- `nome`: string
- `localizacao`: string
- `ativo`: boolean
- `coordenadas`: objeto com latitude e longitude

### 10. Feriado
Calendário de feriados.

**Campos:**
- `id`: string (UUID)
- `nome`: string
- `data`: Date
- `tipo`: enum ("nacional" | "estadual" | "municipal" | "empresa")

## APIs Necessárias

### Funcionários
- `GET /funcionarios` - Listar funcionários
- `POST /funcionarios` - Criar funcionário
- `GET /funcionarios/:id` - Buscar funcionário
- `PUT /funcionarios/:id` - Atualizar funcionário
- `DELETE /funcionarios/:id` - Desativar funcionário

### Registro de Ponto
- `POST /ponto/marcar` - Registrar ponto
- `GET /ponto/:funcionarioId` - Histórico de pontos
- `GET /ponto/hoje` - Pontos do dia atual
- `PUT /ponto/:id/status` - Aprovar/rejeitar ponto

### Ausências
- `GET /ausencias` - Listar ausências
- `POST /ausencias` - Solicitar ausência
- `PUT /ausencias/:id/status` - Aprovar/rejeitar ausência

### Férias
- `GET /ferias/:funcionarioId` - Saldo de férias
- `POST /ferias` - Agendar férias
- `PUT /ferias/:id` - Atualizar férias

### Justificativas
- `GET /justificativas` - Listar justificativas
- `POST /justificativas` - Criar justificativa
- `PUT /justificativas/:id/analisar` - Analisar justificativa

### Banco de Horas
- `GET /banco-horas/:funcionarioId` - Saldo do funcionário
- `GET /banco-horas/:funcionarioId/:ano/:mes` - Detalhes do mês

### Dashboard
- `GET /dashboard/metricas` - Métricas principais
- `GET /dashboard/presenca` - Dados de presença

### Relatórios
- `GET /relatorios/frequencia` - Relatório de frequência
- `GET /relatorios/banco-horas` - Relatório de banco de horas
- `GET /relatorios/contador` - Dados para contador

## Considerações de Implementação

### Segurança
- Autenticação JWT
- Autorização baseada em roles (funcionário, gestor, admin)
- Validação de dados de entrada
- Rate limiting

### Performance
- Índices em campos de busca frequente
- Cache para dados estáticos (feriados, departamentos)
- Paginação em listagens
- Queries otimizadas

### Validações
- CPF único e válido
- Email único e válido
- Validação de horários de trabalho
- Limite de registros por dia
- Validação de períodos de ausência/férias

### Auditoria
- Log de todas as operações
- Histórico de alterações
- Rastreabilidade de aprovações

## Tecnologias Recomendadas

### Backend
- Node.js + Express ou Fastify
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis (cache)

### Validação
- Zod ou Joi

### Autenticação
- JWT
- bcrypt

### Documentação
- Swagger/OpenAPI

### Testes
- Jest
- Supertest 