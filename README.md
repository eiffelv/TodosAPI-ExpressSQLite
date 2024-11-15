# Todos API with Express and SQLite

Eiffel Valentino's Extra Credit Implementation of Todos API from CSC 317 Class

- This server specifically deals data with SQLite

## API Documentation

- Documentation is based from: https://gist.github.com/azagniotov/a4b16faf0febd12efbc6c3d7370383a6
- Which is adopted from: https://stubby4j.com/docs/admin_portal.html
- Inspired by Swagger API docs style & structure: https://petstore.swagger.io/#/pet

### Getting To-do List

<details>
 <summary><code>GET</code> <code><b>/todos</b></code> <code>(get all to-do list/filtered list)</code></summary>

#### Parameters

> | name        |  type     | data type | description                     |
> |-------------|-----------|-----------|---------------------------------|
> | `completed` |  optional | string    | Accepts only `true` or `false`  |


#### Responses

> | http code     | content-type                      | response                                                                      |
> |---------------|-----------------------------------|-------------------------------------------------------------------------------|
> | `200`         | `application/json`  | `[{"id": 1, "task": "Learn Node.js", "completed": false, "priority": "high"}]` |

#### Example cURL

> ```console
>  curl http://localhost:3000/todos
> ```
> ```console
>  curl http://localhost:3000/todos?completed=false
> ```

</details>

### Add To-do Item

<details>
 <summary><code>POST</code> <code><b>/todos</b></code> <code>(add to-do item)</code></summary>

#### Parameters

> | name      |  type     | data type               | description    |
> |-----------|-----------|-------------------------|----------------|
> | None      |  required | object (JSON or YAML)   | N/A            |

#### Responses

> | http code     | content-type                      | response                                                                      |
> |---------------|-----------------------------------|-------------------------------------------------------------------------------|
> | `201`         | `application/json`  | `[{"id": 3, "task": "Watch YouTube", "completed": false, "priority": "low"}]` |

#### Example JSON Request Body

> ```json
>  {
>    "task": "Watch YouTube",
>    "priority": "low"
>  }
> ```
> <code>priority</code> is optional. If not included, it will default to <code>medium</code>.

</details>

### Update To-do Items

<details>
 <summary><code>PUT</code> <code><b>/todos/complete-all</b></code> <code>(set all to-do items as completed)</code></summary>

#### Parameters

> None

#### Responses

> | http code     | content-type                      | response                                                                      |
> |---------------|-----------------------------------|-------------------------------------------------------------------------------|
> | `200`         | `application/json`  | `[{"id": 1, "task": "Learn Node.js", "completed": true, "priority": "high"}]` |

#### Example cURL

> ```javascript
>  curl -X PUT http://localhost:3000/todos/complete-all
> ```

</details>

<details>
 <summary><code>PUT</code> <code><b>/todos/{id}</b></code> <code>(update item by its {id})</code></summary>

#### Parameters

> | name      |  type     | data type               | description    |
> |-----------|-----------|-------------------------|----------------|
> | None      |  required | object (JSON or YAML)   | N/A            |

#### Responses

> | http code     | content-type                      | response                                                                      |
> |---------------|-----------------------------------|-------------------------------------------------------------------------------|
> | `200`         | `application/json`  | `[{"id": 1, "task": "Watch YouTube", "completed": false, "priority": "low"}]` |
> | `404`         | `text/html`  | `To-Do item not found` |

#### Example JSON Request Body

> ```json
>  {
>    "task": "Watch YouTube",
>    "priority": "low"
>  }
> ```
> Request URL: <code>PUT</code> http://localhost:3000/todos/1

</details>

### Delete a To-do Item

<details>
 <summary><code>DELETE</code> <code><b>/todos/{id}</b></code> <code>(delete item by {id})</code></summary>

#### Parameters

> None


#### Responses

> | http code     | content-type | response               |
> |---------------|--------------|------------------------|
> | `204`         | `None`       | `None`                 |
> | `404`         | `text/html`  | `To-Do item not found` |

#### Example cURL

> ```console
>  curl -X DELETE http://localhost:3000/todos/1
> ```

</details>

## Running The Server

Prerequisites:

- [Node 21.x or higher](https://nodejs.org/en/download/package-manager)

Steps:

1. Clone the repository somewhere in your system

   ```bash
   git clone https://github.com/eiffelv/CSC317-ExpressAPI.git
   ```

2. Navigate to the Repository folder

   ```bash
   cd CSC317-ExpressAPI
   ```
   
3. Install dependencies

   ```bash
   npm install
   ```

4. Run the server

   ```bash
   npm start
   ```

Server should now listen to http://localhost:3000. Use cURL or an API client such as [Postman](https://www.postman.com/) or [Bruno](https://www.usebruno.com/) to make Requests.

## Default Data

The server will open a file named <code>todos.db</code>. If the file does not exist or does not have data, it will automatically populate data from below. By default, the server has the following data created:
```json
[
  {
    "id": 1,
    "task": "Learn Node.js",
    "completed": false,
    "priority": "high"
  },
  {
    "id": 2,
    "task": "Build a REST API",
    "completed": false,
    "priority": "low"
  }
]
```
