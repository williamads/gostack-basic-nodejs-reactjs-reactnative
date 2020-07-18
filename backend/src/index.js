const express = require("express");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());

const projects = [
  {
    "id": "0f70444d-62b3-4adb-9484-3a63ae06d399",
    "title": "Review ReactNative",
    "owner": "William"
  },
  {
    "id": "c80ea730-f7c1-497e-8e04-fc5c1e18bcf8",
    "title": "Review React",
    "owner": "William"
  },
  {
    "id": "7770ce09-fc8e-464c-b7c9-a4a72a6b5977",
    "title": "Review Node",
    "owner": "William"
  },
  {
    "id": "070d8ef6-5207-4e0d-8230-2ea07cb2fa23",
    "title": "Review MongoDB",
    "owner": "William"
  }
];

function logRequests(request, response, next){
    const { method, url } = request;

    const laberLog = `[${method.toUpperCase()}] ${url}`;

    console.log(laberLog);

    return next();
}

function validateProjectID(request, response, next){
    const { id } = request.params;

    if(!isUuid(id)){
        return response.status(400).json({ error: 'Invalid Project ID.' });
    }

    return next();
}

app.use(logRequests);
app.use('projects/:id', validateProjectID);

app.get('/', (request, response) => {
    return response.json({ message: "Json sended"});
});

app.get('/projects', (request, response) => {
    // const query = request.query;
    const { title } = request.query;

    const result = title
    ? projects.filter(project => project.title.includes(title))
    : projects;
    
    return response.json(result);
});

app.post('/projects', (request, response) => {
    const body = request.body;

    const { owner, title } = body;

    const project = { id: uuid(), title, owner };

    projects.push(project);
    
    return response.json(project);
});

app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { owner, title } =  request.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0){
        return response.status(400).json({ erro: "Project not found."})
    }

    const project = { id, title, owner };

    projects[projectIndex] = project;

    return response.json(projects[projectIndex]);
});

app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0){
        return response.status(400).json({ erro: "Project not found."})
    }

    projects.splice(projectIndex, 1);
    
    // 204 pois eh um "ok" com resposta vazia
    return response.status(204).send();
});

app.listen(3333, () => {
    console.log('👌️⚙️ ️ Back-end started!');
});