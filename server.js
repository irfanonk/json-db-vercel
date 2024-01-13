// See https://github.com/typicode/json-server#module
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const db = require("./db.json");

const PORT = 8001;
server.use(jsonServer.bodyParser); //necessaru to parse req body
server.use(middlewares);
// Add this before server.use(router)
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
    "/blog/:resource/:id/show": "/:resource/:id",
  })
);
// server.get("/tags", function (req, res) {
//   const allTags = [];
//   const items = db.items;
//   items.forEach((item) => {
//     item.tags.forEach((tag) => {
//       if (allTags.find((item) => item.name === tag)) return;
//       allTags.push({ name: tag, slug: tag });
//     });
//   });
//   return res.jsonp(allTags);
// });

server.post("/login", function (req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.jsonp({
      code: "error",
      message: "credentials required",
    });
  }
  const users = db.users;
  const user = users.filter((user) => user.email === email)[0];
  if (!user)
    return res.jsonp({
      code: "error",
      message: "user not exist",
    });
  if (user.password !== password)
    return res.jsonp({
      code: "error",
      message: "invalid credentials",
    });

  return res.jsonp({
    success: true,
    data: user,
  });
});

server.use(router);
server.listen(PORT, () => {
  console.log(`JSON Server is running port: ${PORT}`);
});

// Export the Server API
module.exports = server;
