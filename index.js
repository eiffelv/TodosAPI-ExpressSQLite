const express = require('express');
const app = express();
const port = 3000;

// Import the sqlite3 module
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('todos.db');

// Middleware to parse JSON bodies
app.use(express.json());

// Prepare Database for the Server
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
      return res.status(500).json({ "message": "Data Failed to be Added", error: err.message });
    } else {
      newTodo.id = this.lastID;
      return res.status(201).json(newTodo);
    }
  });
});

// PUT /todos/complete-all - Complete all to-do items
app.put('/todos/complete-all', (req, res) => {
  db.run("UPDATE todos SET completed = 1", function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    }
    else {
      db.all("SELECT * FROM todos", (err, rows) => {
        res.json(rows);
      });
    }
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
      res.status(500).json({ message: "Data Failed Updating", error: err.message });
    }
    else if (this.changes === 0) {
      res.status(404).json({ error: "To-Do item not found" });
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
    else if (this.changes === 0) {
      res.status(404).json({ error: "To-Do item not found" });
    } else {
      res.status(204).send();
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
