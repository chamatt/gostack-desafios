import express from "express";
import bodyParser from "body-parser";
const app = express();

const projects = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let count = 0;

// - Crie um middleware que será utilizado em todas rotas que recebem o ID do projeto nos parâmetros da URL que verifica se o projeto com aquele ID existe. Se não existir retorne um erro, caso contrário permita a requisição continuar normalmente;
const checkId = (req, res, next) => {
  const { id } = req.params;
  if (!projects.some(project => project.id === id))
    return res.status(404).send({
      error: {
        msg: "ID not found"
      }
    });
  else next();
};
// - Crie um middleware global chamado em todas requisições que imprime (`console.log`) uma contagem de quantas requisições foram feitas na aplicação até então;
app.use((req, res, next) => {
  count++;
  console.log(count);
  next();
});

// POST /projects: A rota deve receber id e title dentro corpo de cadastrar um novo projeto dentro de um array no seguinte formato: { id: "1", title: 'Novo projeto', tasks: [] }; Certifique-se de enviar tanto o ID quanto o título do projeto no formato string com àspas duplas.
app.post("/projects", (req, res) => {
  const { title, id } = req.body;
  const newProject = { title, id, tasks: [] };
  projects.push(newProject);
  res.status(201).json({ data: newProject });
});

// GET /projects: Rota que lista todos projetos e suas tarefas;
app.get("/projects", (req, res) => {
  res.status(200).json({ data: projects });
});

// PUT /projects/:id: A rota deve alterar apenas o título do projeto com o id presente nos parâmetros da rota;
app.put("/projects/:id", checkId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const projectIndex = projects.findIndex(project => project.id === id);
  projects[projectIndex] = { ...projects[projectIndex], title };
  res.json({ data: { id, title, tasks: projects[projectIndex].tasks } });
});

// DELETE /projects/:id: A rota deve deletar o projeto com o id presente nos parâmetros da rota;
app.delete("/projects/:id", checkId, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(project => project.id === id);
  projects.splice(projectIndex, 1);
  res.json("Successfully deleted");
});

// POST /projects/:id/tasks: A rota deve receber um campo title e armazenar uma nova tarefa no array de tarefas de um projeto específico escolhido através do id presente nos parâmetros da rota;
app.post("/projects/:id/tasks", checkId, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(project => project.id === id);
  projects[projectIndex].tasks.push(req.body);
  res.json({ data: projects[projectIndex] });
});

app.listen(3000, () => {
  console.log("Servidor Iniciado na porta 3000");
});
