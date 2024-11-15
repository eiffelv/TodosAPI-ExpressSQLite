const express = require('express');
const app = express();
const port = 3000;
const online = false; // Uncomment for Hardcoded data
// const online = true; // Uncomment for SQLite database

// Middleware to parse JSON bodies
app.use(express.json());

let todos = [];

/*
    Hardcoded Implementation
*/
if (online !== true) {
  // Question 1: Add a "Priority" Field to the To-Do API
  // Sample data
  todos = [
    { id: 1, task: "Learn Node.js", completed: false, priority: "high" },
    { id: 2, task: "Build a REST API", completed: false, priority: "low" }
  ];

  // GET /todos - Retrieve all to-do items
  /* app.get('/todos', (req, res) => {
    res.json(todos);
  }); */

  /* 
  Q.3"
  GET /todos - Retrieve all to-do items or filter by completed status.
  after completing this part, you need to comment out the GET end point 
  already implemented here to test this new GET endpoint! 
  */
  app.get('/todos', (req, res) => {
    const completed = req.query.completed;
    if (completed !== undefined) {
      const filteredTodos = todos.filter(todo => todo.completed === (completed === 'true'));
      return res.json(filteredTodos);
    }
    res.json(todos);
  });

  // POST /todos - Add a new to-do item
  app.post('/todos', (req, res) => {
    const newTodo = {
      id: todos.length + 1,
      task: req.body.task,
      completed: false,
      priority: req.body.priority || "medium"
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
  });

  /*
  Question 2: Implement a "Complete All" Endpoint
  example usage: 
  curl -X PUT http://localhost:3000/todos/complete-all
  */
  app.put('/todos/complete-all', (req, res) => {
    todos.forEach(todo => todo.completed = true);
    res.json(todos);
  });

  // PUT /todos/:id - Update an existing to-do item
  app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    if (!todo) {
      return res.status(404).send("To-Do item not found");
    }
    todo.task = req.body.task || todo.task;
    todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
    res.json(todo);
  });

  // DELETE /todos/:id - Delete a to-do item
  app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) {
      return res.status(404).send("To-Do item not found");
    }
    todos.splice(index, 1);
    res.status(204).send();
  });


/*
    SQLite Implementation
*/
} else if (online === true) {
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database('todos.db');
  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, task TEXT NOT NULL, completed BOOLEAN NOT NULL, priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')))");
    // Do not add sample data if the table already has data
    db.get("SELECT COUNT(*) AS count FROM todos", (err, row) => {
      if (row.count === 0) {
        db.run("INSERT INTO todos (task, completed, priority) VALUES ('Learn Node.js', 0, 'high')");
        db.run("INSERT INTO todos (task, completed, priority) VALUES ('Build a REST API', 0, 'low')");
      }
    });
  });

  // GET /todos - Retrieve all to-do items or filter by completed status
  app.get('/todos', (req, res) => {
    const completed = req.query.completed;
    let sql = "SELECT * FROM todos";
    if (completed !== undefined) {
      sql += ` WHERE completed = ${completed === 'true' ? 1 : 0}`;
    }
    db.all(sql, (err, rows) => {
      res.json(rows);
    });
  });

  // POST /todos - Add a new to-do item
  app.post('/todos', (req, res) => {
    const newTodo = {
      task: req.body.task,
      completed: false,
      priority: req.body.priority || "medium"
    };
    db.run("INSERT INTO todos (task, completed, priority) VALUES (?, ?, ?)", [newTodo.task, newTodo.completed, newTodo.priority], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      }
      newTodo.id = this.lastID;
      res.status(201).json(newTodo);
    });
  });

  // PUT /todos/complete-all - Complete all to-do items
  app.put('/todos/complete-all', (req, res) => {
    db.run("UPDATE todos SET completed = 1", function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      }
      db.all("SELECT * FROM todos", (err, rows) => {
        res.json(rows);
      });
    });
  });

  // PUT /todos/:id - Update an existing to-do item
  app.put('/todos/:id', (req, res) => {
    const id = req.params.id;
    const todo = {
      task: req.body.task,
      completed: req.body.completed,
      priority: req.body.priority
    };
    db.run("UPDATE todos SET task = ?, completed = ?, priority = ? WHERE id = ?", [todo.task, todo.completed, todo.priority, id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        res.status(404).send("To-Do item not found");
      } else {
        res.json(todo);
      }
    });
  });

  // DELETE /todos/:id - Delete a to-do item
  app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM todos WHERE id = ?", id, function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        res.status(404).send("To-Do item not found");
      } else {
        res.status(204).send();
      }
    });
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
