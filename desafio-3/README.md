# Iniciando a aplicação

Instale o docker e o docker-compose, se não tiver instalado.

1. Renomeio o arquivo .env.example para .env, e modifique os valores, se desejar, ou deixe com os valores padrões.

2. Execute `docker-compose up`

3. Na primeira vez que você executar a aplicação, a database ainda não existe, para criá-la, abra uma nova janela do terminal, na pasta do projeto, e execute os seguintes comandos:
   `yarn createdb`
   `yarn migrate`

Após isso o projeto já estará funcionando!

As tarefas completadas estarão marcadas com :white_check_mark:

# Descrição do Desafio 03. Continuando aplicação

Durante esse desafio vamos aprimorar a aplicação Meetapp que demos início no desafio anterior implementando funcionalidades que aprendemos durante as aulas até agora.

## Funcionalidades

Abaixo estão descritas as funcionalidades que você deve adicionar em sua aplicação.

### Gerenciamento de arquivos

Crie uma rota para upload de arquivos que cadastra em uma tabela o caminho e nome do arquivo e retorna todos dados do arquivo cadastrado. :white_check_mark:

### Gerenciamento de meetups

O usuário pode cadastrar meetups na plataforma com título do meetup, descrição, localização, data e hora e imagem (banner). Todos campos são obrigatórios. Adicione também um campo user_id que armazena o ID do usuário que organiza o evento. :white_check_mark:

Não deve ser possível cadastrar meetups com datas que já passaram. :white_check_mark:

O usuário também deve poder editar todos dados de meetups que ainda não aconteceram e que ele é organizador. :white_check_mark:

Crie uma rota para listar os meetups que são organizados pelo usuário logado. :white_check_mark:

O usuário deve poder cancelar meetups organizados por ele e que ainda não aconteceram. O cancelamento deve deletar o meetup da base de dados. :white_check_mark:

### Inscrição no meetup

O usuário deve poder se inscrever em meetups que não organiza. 

O usuário não pode se inscrever em meetups que já aconteceram.

O usuário não pode se inscrever no mesmo meetup duas vezes.

O usuário não pode se inscrever em dois meetups que acontecem no mesmo horário.

Sempre que um usuário se inscrever no meetup, envie um e-mail ao organizador contendo os dados relacionados ao usuário inscrito. O template do e-mail fica por sua conta :)

### Listagem de meetups

Crie uma rota para listar os meetups com filtro por data (não por hora), os resultados dessa listagem devem vir paginados em 10 itens por página. Abaixo tem um exemplo de chamada para a rota de listagem dos meetups: :white_check_mark:

```
http://localhost:3333/meetups?date=2019-07-01&page=2
```

Nesse exemplo, listaremos a página 2 dos meetups que acontecerão no dia 01 de Julho.

Nessa listagem retorne também os dados do organizador. :white_check_mark:

### Listagem de inscrições

Crie uma rota para listar os meetups em que o usuário logado está inscrito. :white_check_mark:

Liste apenas meetups que ainda não passaram e ordene meetups mais próximos como primeiros da lista. :white_check_mark:
