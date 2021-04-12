const express = require("express");
const { nanoid } = require("nanoid");
// Mock DB
// const db = require("./database.json");
// const { login } = auth;
// const auth = require("./auth");

const app = express();
const port = 3000;
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
  res.send("Hello World");
});

// Login User
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const userIndex = db.users.findIndex((user) => user.username === username);
  if (userIndex !== -1) {
    if (db.users[userIndex].password === password) {
      res.status(201).send(db.users[userIndex].username);
    } else {
      res.status(401).send("That password doesn't seem to be right.");
    }
  } else {
    res
      .status(404)
      .send(
        "We can't find that user on our side, maybe check your spelling 😅."
      );
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
    res.status(201).send("Congrats, you just made an account! 😍");
  } else {
    res.status(401).send("That username is already taken. 😭");
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
    res.status(200).send(filteredDB);
  }
  res.status(404).send("Hmm, can't seem to find that user. 🐍");
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
  res.status(201).send(tempProject);
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
    res.status(201).send(db.projects[projectIndex]);
  } else {
    res.status(404).send("Hmm, can't seem to find that project. 🕷");
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
        res.status(201).send(db.projects[projectIndex]);
      } else {
        res.status(401).send("That user is already part of the project.");
      }
    } else {
      res.status(404).send("Hmm, can't seem to find that project. 🕷");
    }
  } else {
    res.status(404).send("Hmm, can't seem to find that user. 🐍");
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
      res.status(404).send("We couldn't find that user on the list. 😢");
    } else if (db.projects[projectIndex].usernames.length === 1) {
      res
        .status(401)
        .send(
          "You are the only user, silly! If you're done with this project then delete it."
        );
    } else {
      filteredUserNames = db.projects[projectIndex].usernames.filter(
        (username) => username !== user
      );
      db.projects[projectIndex].usernames = filteredUserNames;
      res.status(202).send(db.projects[projectIndex]);
    }
  } else {
    res.status(404).send("Hmm, can't seem to find that project. 🕷");
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
    res.status(201).send(db.projects[projectIndex]);
  } else {
    res.status(404).send("Hmm, can't seem to find that project. 🕷");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
