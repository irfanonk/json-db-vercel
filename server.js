// See https://github.com/typicode/json-server#module
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const db = require("./db.json");

const PORT = 8001;

server.use(middlewares);
// Add this before server.use(router)
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
    "/blog/:resource/:id/show": "/:resource/:id",
  })
);
server.get("/tags", function (req, res) {
  const allTags = [];
  const items = db.items;
  items.forEach((item) => {
    item.tags.forEach((tag) => {
      if (allTags.find((item) => item.name === tag)) return;
      allTags.push({ name: tag, slug: tag });
    });
  });
  return res.jsonp(allTags);
});
server.use(router);
server.listen(PORT, () => {
  console.log(`JSON Server is running port: ${PORT}`);
});

// Export the Server API
module.exports = server;
