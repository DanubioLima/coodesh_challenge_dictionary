# Back-end Challenge - Dictionary

This is a challenge by [Coodesh](https://coodesh.com/)

API REST que permite consultar palavras em um dicionário. A API permite que um usuário crie uma conta e consulte, favorite e liste
palavras do dicionário. Também é possível remover palavras da lista de favoritos e consultar o histórico de palavras visitadas ou favoritadas.

# Como rodar o projeto

1. Clone o repositório

```bash
gh repo clone DanubioLima/coodesh_challenge_dictionary
```

2. Entre na pasta do projeto

```bash
cd coodesh_challenge_dictionary
```

3. Instale as dependências

```bash
npm install
```

4. Inicialize os containers do docker

```bash
docker-compose up -d
```

5. Execute o script para importar as palavras do dicionário

```bash
npm run import
```

6. Na raíz do projeto tem um arquivo `postman-api.json` que pode ser importado no Postman para testar facilmente
   os endpoints. Depois de importar o arquivo, inicie o servidor:

```bash
npm run start:dev
```

7. Rodar os testes

```bash
npm run test
```

# Tecnologias usadas

- Node.js
- Typescript
- Fastify
- Redis
- Jest
- Docker
- PostgreSQL
- Nestjs

# Decisões técnicas

- Foi utilizado o banco de dados PostgreSQL para armazenar os usuários, as palavras do dicionário e o histórico de palavras visitadas e favoritadas.
- Decidi utilizar o framework Nestjs por trazer uma estrutura de projeto organizada e por ser fácil de trabalhar com injeção de dependências.
- Utilizei Redis como cache das requests de listagem por ser de fácil uso e baixa latência.
- Tentei manter o código o mais limpo e organizado possível, seguindo os princípios do SOLID.
- Utilizei o Jest para testes unitários e de integração.
- Troquei a versão inicial com Express por Fastify a fim de ganhar mais performance nos endpoints.
