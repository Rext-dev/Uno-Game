# DESARROLLO DE UN BACKEND CON NODE JS Y EXPRESS

## Objetivo

Crear un backend utilizando Node.js y Express para un juego simple. Implementar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) para gestionar los datos del juego. Además, se debe incluir un middleware para manejar errores y utilizar Postman para probar las rutas.

## Indicaciones

Desarrolla un backend utilizando Node.js y Express para un juego simple. Debe incluir operaciones CRUD para gestionar los datos del juego. Utiliza un middleware para manejar errores y Postman para probar las rutas.

---

### `POST /game`

Crea un nuevo juego. Se espera un cuerpo JSON con los datos del juego.

- **Status Code esperado:** `201 – Created`

**JSON de Entrada**
![JSON de Entrada](task-week1-1.png)

**JSON de Salida (Ejemplo):**
![JSON de Salida de Ejemplo](task-week1-2.png)

**RESULTADO:**
![JSON de Salida de Ejemplo](post.png)
---

### `GET /game/:id`

Obtiene los detalles de un juego específico por su ID.

- **Status Code esperado:** `200 - OK`

**JSON de Salida (Ejemplo):**
![JSON de Salida de Ejemplo](task-week1-3.png)

**RESULTADO:**
![JSON de Salida de Ejemplo](get.png)
---

### `PUT /game/:id`

Actualiza los datos de un juego existente por su ID. Se espera un cuerpo JSON con los nuevos datos del juego.

- **Status Code esperado:** `200 – OK`

**JSON de Entrada:**
![JSON de Entrada](task-week1-4.png)

**JSON de Salida (Ejemplo):**
![JSON de Salida de Ejemplo](task-week1-5.png)

**RESULTADO:**
![JSON de Salida de Ejemplo](put.png)

---

### `DELETE /game/:id`

Elimina un juego específico por su ID.

- **Status Code esperado:** `204 - No Content`

No se espera JSON de salida.

**RESULTADO:**
![JSON de Lectura después de Patch](delete.png)

---

### `PATCH /game/:id`

Actualiza parcialmente los datos de un juego por su ID. Se espera un cuerpo JSON con los campos a actualizar.

- **Status Code esperado:** `200 - OK`

**JSON de Entrada:**
![JSON de Entrada](task-week1-6.png)

**JSON de lectura después de patch:**
![JSON de Lectura después de Patch](task-week1-7.png)

**RESULTADO:**
![JSON de Salida de Ejemplo](patch.png)

---

## Middleware

- Implementa un middleware para manejar errores en caso de que ocurra algún problema durante la ejecución de las rutas.

hice 2 middlewares, uno para manejar errores y otro para validar los datos de entrada.

[Middlewares](../../src/middleware)

## Base de datos

- Utiliza una base de datos documental o relacional para almacenar la información del juego. Puedes utilizar un ORM (Object-Relational Mapping) como Sequelize para facilitar el manejo de la base de datos.

Realice una base de datos relacional utilizando Sequelize y conectandome a una base de datos MySQL.