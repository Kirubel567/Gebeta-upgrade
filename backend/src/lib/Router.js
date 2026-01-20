class Router {
  constructor() {
    this.routes = {};
  }

  //register routes with their methds
  get(path, controller) {
    this.routes[`GET ${path}`] = controller;
  }
  put(path, controller) {
    this.routes[`PUT ${path}`] = controller;
  }
  patch(path, controller) {
    this.routes[`PATCH ${path}`] = controller;
  }
  post(path, controller) {
    this.routes[`POST ${path}`] = controller;
  }
  delete(path, controller) {
    this.routes[`DELETE ${path}`] = controller;
  }

  //method for defining where to send the incoming requests
  handleRoutes(req, res) {

    //added this inorder to parse url and put the body to req.query
    const { method, url: fullUrl } = req;

    //parse url for query parameters
    const parseUrl = new URL(fullUrl, `http://${req.headers.host}`);
    const path = parseUrl.pathname;

    //attach the query object to req
    req.query = Object.fromEntries(parseUrl.searchParams);

    for (const routeKey in this.routes) {
      const [routeMethod, routePath] = routeKey.split(" ");

      if (routeMethod !== method) continue;

      //convert /api/businesses/:id to regex
      const regex = new RegExp(
        "^" + routePath.replace(/:\w+/g, "([^/]+)") + "$",
      );
      const match = path.match(regex);

      if (match) {
        req.params = {};
        const keys = routePath.match(/:\w+/g);
        if (keys) {
          keys.forEach((key, index) => {
            req.params[key.substring(1)] = match[index + 1];
          });
        }
        return this.routes[routeKey](req, res);
      }
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
}

export default Router;
