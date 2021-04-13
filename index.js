const express = require("express");
const { nanoid } = require("nanoid");
// Mock DB
// const db = require("./database.json");
// const { login } = auth;
// const auth = require("./auth");
const app = express();
const port = 3000;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  next();
});

const db = {
  users: [
    { username: "casey", password: "123" },
    { username: "marc", password: "123" },
  ],
  projects: [
    {
      usernames: ["casey"],
      projectTitle: "Casey's Project",
      columnNames: [{ name: "column1", id: "SHitvcADEy" }],
      todos: [
        {
          text: "Delete Me!",
          id: "VkYqK0kqEkWW9ubO87rdC",
          completed: false,
          columnPosition: 0,
        },
        {
          text: "I'm Completed!",
          id: "VkYqK0kqEkWWPubO87rdC",
          completed: true,
          columnPosition: 0,
        },
      ],
      projectId: "OeYX9myAKiy85odj8DsjB",
    },
    {
      usernames: ["marc"],
      projectTitle: "Marc's Project",
      columnNames: [{ name: "around the house", id: "wvRLOyzVSW" }],
      todos: [
        {
          text: "Delete Me!",
          id: "RXl1sH2bzziTmy41v0Z0p",
          completed: false,
          columnPosition: 0,
        },
        {
          text: "I'm Completed!",
          id: "VkYqK0kPEkWWPubO87rdC",
          completed: true,
          columnPosition: 0,
        },
      ],
      projectId: "VrKrUoBWCo6R9hT7q0XWc",
    },
    {
      usernames: ["casey", "marc"],
      projectTitle: "combo Project",
      columnNames: [
        { name: "column1", id: "CwVhtPwRGi" },
        { name: "column2", id: "hGqEtbAYxi" },
        { name: "column3", id: "GADADDbQJX" },
      ],
      todos: [
        {
          text: "Delete Me!",
          id: "UWFNQasJvnjwJ62HovaKB",
          completed: false,
          columnPosition: 0,
        },
        {
          text: "Delete Me!",
          id: "_ew3kp_75Dy4K9B4QsaHc",
          completed: false,
          columnPosition: 1,
        },
        {
          text: "Delete Me!",
          id: "_ew3kp_75Dy4K9B4QEaHc",
          completed: false,
          columnPosition: 2,
        },
        {
          text: "I'm Completed!",
          id: "VkYqK0kqGkWWPubO87rdC",
          completed: true,
          columnPosition: 0,
        },
      ],
      projectId: "P4nMLeAcqFfVoJ1oC1Bpy",
    },
  ],
};

// Express middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "Hello World" });
});

// Login User
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const userIndex = db.users.findIndex((user) => user.username === username);
  if (userIndex !== -1) {
    if (db.users[userIndex].password === password) {
      res.statusCode(201).send({ username: db.users[userIndex].username });
    } else {
      res.statusCode(401).send({
        message: "That password doesn't seem to be right.",
      });
    }
  } else {
    res.statusCode(404).send({
      message:
        "We can't find that user on our side, maybe check your spelling 😅.",
    });
  }
});

// Sign Up User
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  // const userIndex = db.users.findIndex((user) => user.username === username);
  if (!db.users.some((user) => user.username === username)) {
    db.users.push({ username: username, password: password });
    tempProject = {
      usernames: [username],
      projectTitle: `${username}'s First Project`,
      columnNames: [{ name: "Change My Name", id: nanoid() }],
      todos: [
        {
          text: "Delete Me!",
          id: nanoid(),
          completed: false,
          columnPosition: 0,
        },
      ],
      projectId: nanoid(),
    };
    db.projects.push(tempProject);
    res
      .statusCode(201)
      .send({ message: "Congrats, you just made an account! 😍" });
  } else {
    res.statusCode(401).send({ message: "That username is already taken. 😭" });
  }
});

// Delete User
app.delete("/user/delete", (req, res) => {
  const { username, password } = req.body;
  const userIndex = db.users.findIndex((user) => user.username === username);
  if (userIndex !== -1) {
    if (db.users[userIndex].password === password) {
      db.projects.forEach((project) => {
        if (
          project.usernames.length > 1 &&
          project.usernames.includes(username)
        ) {
          const filteredUserNames = project.usernames.filter(
            (u) => u !== username
          );
          project.usernames = filteredUserNames;
        }
      });
      const filteredProjects = db.projects.filter(
        (project) => !project.usernames.includes(username)
      );
      db.projects = filteredProjects;
      res.statusCode(202).send({
        message: "Congrats I guess, we're a little sad to see you go. 😂",
      });
    } else {
      res
        .statusCode(401)
        .send({ message: "That password doesn't seem to be right. 🤨" });
    }
  } else {
    res.statusCode(404).send({
      message:
        "We can't find that user on our side, maybe check your spelling 😅.",
    });
  }
});

// Get all projects
app.get("/projects", (req, res) => {
  res.send(db.projects);
});

// Get Projects by Users
app.get("/projects/:username", (req, res) => {
  const { username } = req.params;
  if (db.users.some((user) => user.username === username)) {
    const filteredDB = db.projects.filter((project) =>
      project.usernames.includes(username)
    );
    res.statusCode(200).send(filteredDB);
  }
  res
    .statusCode(404)
    .send({ message: "Hmm, can't seem to find that user. 🐍" });
});

// Add new project board
app.post("/projects/:username", (req, res) => {
  const { username } = req.params;
  const { title } = req.body;

  tempProject = {
    usernames: [username],
    projectTitle: title,
    columnNames: [{ name: "Change My Name", id: nanoid() }],
    todos: [
      {
        text: "Delete Me!",
        id: nanoid(),
        completed: false,
        columnPosition: 0,
      },
    ],
    projectId: nanoid(),
  };
  db.projects.push(tempProject);
  res.statusCode(201).send(tempProject);
});

// delete project board
app.delete("/project/:projectId", (req, res) => {
  const { projectId } = req.params;
  const projectIndex = db.projects.findIndex(
    (project) => project.projectId === projectId
  );
  if (projectIndex !== -1) {
    if (db.projects[projectIndex].usernames.length === 1) {
      const filteredProjects = db.projects.filter(
        (project) => project.projectId !== projectId
      );
      db.projects = filteredProjects;
      res.statusCode(202).send({
        message:
          "Congrats, that project board has been wiped off the face of this earth. 👽",
      });
    } else {
      res.statusCode(401).send({
        message:
          "There are multiple users on this project, if you want to delete it you need to remove the other users first or you can remove yourself from the user list.",
      });
    }
  } else {
    res
      .statusCode(404)
      .send({ message: "Hmm, can't seem to find that project. 🕷" });
  }
});

// edit project title
app.patch("/project/title/:projectId", (req, res) => {
  const { projectId } = req.params;
  const { newTitle } = req.body;
  const projectIndex = db.projects.findIndex(
    (project) => project.projectId === projectId
  );
  if (projectIndex !== -1) {
    db.projects[projectIndex].projectTitle = newTitle;
    res.statusCode(201).send(db.projects[projectIndex]);
  } else {
    res
      .statusCode(404)
      .send({ message: "Hmm, can't seem to find that project. 🕷" });
  }
});

// add project users
app.post("/project/users/:projectId", (req, res) => {
  const { projectId } = req.params;
  const { newUser } = req.body;
  const projectIndex = db.projects.findIndex(
    (project) => project.projectId === projectId
  );
  const userExists = db.users.some((user) => user.username === newUser);
  if (userExists) {
    if (projectIndex !== -1) {
      if (!db.projects[projectIndex].usernames.includes(newUser)) {
        db.projects[projectIndex].usernames.push(newUser);
        res.statusCode(201).send(db.projects[projectIndex]);
      } else {
        res
          .statusCode(401)
          .send({ message: "That user is already part of the project." });
      }
    } else {
      res
        .statusCode(404)
        .send({ message: "Hmm, can't seem to find that project. 🕷" });
    }
  } else {
    res
      .statusCode(404)
      .send({ message: "Hmm, can't seem to find that user. 🐍" });
  }
});

// remove user from project
app.delete("/project/users/:projectId", (req, res) => {
  const { projectId } = req.params;
  const { user } = req.body;
  const projectIndex = db.projects.findIndex(
    (project) => project.projectId === projectId
  );
  if (projectIndex !== -1) {
    if (!db.projects[projectIndex].usernames.includes(user)) {
      res.statusCode(404).send("We couldn't find that user on the list. 😢");
    } else if (db.projects[projectIndex].usernames.length === 1) {
      res.statusCode(401).send({
        message:
          "You are the only user, silly! If you're done with this project then delete it.",
      });
    } else {
      filteredUserNames = db.projects[projectIndex].usernames.filter(
        (username) => username !== user
      );
      db.projects[projectIndex].usernames = filteredUserNames;
      res.statusCode(202).send(db.projects[projectIndex]);
    }
  } else {
    res
      .statusCode(404)
      .send({ message: "Hmm, can't seem to find that project. 🕷" });
  }
});

//add column
app.post("/project/column/:projectId", (req, res) => {
  const { projectId } = req.params;
  const { columnTitle } = req.body;
  const projectIndex = db.projects.findIndex(
    (project) => project.projectId === projectId
  );

  if (projectIndex !== -1) {
    db.projects[projectIndex].columnNames.push({
      name: columnTitle,
      id: nanoid(),
    });
    res.statusCode(201).send(db.projects[projectIndex]);
  } else {
    res
      .statusCode(404)
      .send({ message: "Hmm, can't seem to find that project. 🕷" });
  }
});

// edit column title
app.patch("/project/column/:projectId", (req, res) => {
  const { projectId } = req.params;
  const { columnTitle, columnId } = req.body;
  const projectIndex = db.projects.findIndex(
    (project) => project.projectId === projectId
  );

  if (projectIndex !== -1) {
    const columnIndex = db.projects[projectIndex].columnNames.findIndex(
      (column) => column.id === columnId
    );
    if (columnIndex !== -1) {
      db.projects[projectIndex].columnNames[columnIndex].name = columnTitle;
      res.statusCode(201).send(db.projects[projectIndex]);
    } else {
      res.statusCode(404).send({ message: "We couldn't find that column. 😢" });
    }
  } else {
    res.statusCode(404).send({ message: "We couldn't find that project. 😭" });
  }
});

// delete column
app.delete("/project/column/:projectId", (req, res) => {
  const { projectId } = req.params;
  const { columnId } = req.body;
  const projectIndex = db.projects.findIndex(
    (project) => project.projectId === projectId
  );

  if (projectIndex !== -1) {
    const columnIndex = db.projects[projectIndex].columnNames.findIndex(
      (column) => column.id === columnId
    );
    if (columnIndex !== -1) {
      let filteredTodos = db.projects[projectIndex].todos.filter(function (
        todo
      ) {
        if (todo.completed) {
          return true;
        } else if (todo.columnPosition !== columnIndex) {
          return true;
        }
      });
      filteredTodos = filteredTodos.map((todo) => {
        if (todo.columnPosition > columnIndex) {
          todo.columnPosition = todo.columnPosition - 1;
        }
        return todo;
      });
      const filteredColumns = db.projects[projectIndex].columnNames.filter(
        (column) => column.id !== columnId
      );
      db.projects[projectIndex].columnNames = filteredColumns;
      db.projects[projectIndex].todos = filteredTodos;
      res.statusCode(202).send(db.projects[projectIndex]);
    }
  } else {
    res.statusCode(404).send({ message: "We couldn't find that project. 😭" });
  }
});

// add todo
app.post("/project/todo/:projectId", (req, res) => {
  const { projectId } = req.params;
  const { text, columnPosition } = req.body;
  const projectIndex = db.projects.findIndex(
    (project) => project.projectId === projectId
  );
  if (projectIndex !== -1) {
    db.projects[projectIndex].todos.push({
      text: text,
      id: nanoid(),
      completed: false,
      columnPosition: columnPosition,
    });
    res.statusCode(201).send(db.projects[projectIndex]);
  } else {
    res.statusCode(404).send({ message: "We couldn't find that project. 😭" });
  }
});

//edit todo text
app.patch("/project/todo/text/:projectId", (req, res) => {
  const { projectId } = req.params;
  const { text, todoId } = req.body;
  const projectIndex = db.projects.findIndex(
    (project) => project.projectId === projectId
  );
  if (projectIndex !== -1) {
    const todoIndex = db.projects[projectIndex].todos.findIndex(
      (todo) => todo.id === todoId
    );
    if (todoIndex !== -1) {
      db.projects[projectIndex].todos[todoIndex].text = text;
      res.statusCode(201).send(db.projects[projectIndex]);
    } else {
      res.statusCode(404).send({ message: "We couldn't find that todo. 😢" });
    }
  } else {
    res.statusCode(404).send({ message: "We couldn't find that project. 😭" });
  }
});

//edit todo position
app.patch("/project/todo/position/:projectId", (req, res) => {
  const { projectId } = req.params;
  const { columnPosition, todoId } = req.body;
  const projectIndex = db.projects.findIndex(
    (project) => project.projectId === projectId
  );
  if (projectIndex !== -1) {
    const todoIndex = db.projects[projectIndex].todos.findIndex(
      (todo) => todo.id === todoId
    );
    if (todoIndex !== -1) {
      db.projects[projectIndex].todos[
        todoIndex
      ].columnPosition = columnPosition;
      res.statusCode(201).send(db.projects[projectIndex]);
    } else {
      res.statusCode(404).send({ message: "We couldn't find that todo. 😢" });
    }
  } else {
    res.statusCode(404).send({ message: "We couldn't find that project. 😭" });
  }
});

//toggle todo complete
app.patch("/project/todo/completed/:projectId", (req, res) => {
  const { projectId } = req.params;
  const { boolean, todoId } = req.body;
  const projectIndex = db.projects.findIndex(
    (project) => project.projectId === projectId
  );
  if (projectIndex !== -1) {
    const todoIndex = db.projects[projectIndex].todos.findIndex(
      (todo) => todo.id === todoId
    );
    if (todoIndex !== -1) {
      db.projects[projectIndex].todos[todoIndex].completed = boolean;
      db.projects[projectIndex].todos[todoIndex].columnPosition = 0;
      res.statusCode(201).send(db.projects[projectIndex]);
    } else {
      res.statusCode(404).send({ message: "We couldn't find that todo. 😢" });
    }
  } else {
    res.statusCode(404).send({ message: "We couldn't find that project. 😭" });
  }
});

//delete todo
app.delete("/project/todo/:projectId", (req, res) => {
  const { projectId } = req.params;
  const { todoId } = req.body;
  const projectIndex = db.projects.findIndex(
    (project) => project.projectId === projectId
  );
  if (projectIndex !== -1) {
    if (db.projects[projectIndex].todos.some((todo) => todo.id === todoId)) {
      const filteredTodos = db.projects[projectIndex].todos.filter(
        (todo) => todo.id !== todoId
      );
      db.projects[projectIndex].todos = filteredTodos;

      res.statusCode(202).send(db.projects[projectIndex]);
    } else {
      res.statusCode(404).send({ message: "We couldn't find that todo. 😢" });
    }
  } else {
    res.statusCode(404).send({ message: "We couldn't find that project. 😭" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
