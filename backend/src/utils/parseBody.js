// Helper to get request body -  Acts as a bridge: returns req.body if middleware parsed it, otherwise parses stream manually (legacy support)

export const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    //  If middleware already parsed the body, return it immediately
    if (req.body) {
      return resolve(req.body);
    }

    //  Fallback: Parse stream manually cuz no size limits here
    try {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        if (!body) return resolve({});
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(new Error("Invalid JSON"));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
