import path from path;
import { fileURLToPath } from 'url';

import express from express;

const PORT = 47900;

const _dirname = path.dirname(fileURLToPath(import.meta.url));




export function run () {
    const app = express();
  
    // Security and CORS (Cross Origin Resource Sharing)
    app.use((req, res, next) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Headers", "Content-Type, Accept");
      res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      next();
    });
  
    // Redirect root to client
    app.get("/", (req, res) => {
      res.redirect("/client");
    });
  
    // Statically serve client files
    app.use("/client", express.static(STATIC_FILES_PATH));
  
    app.listen(PORT, () => {
      console.log(`Application is listening on http://0.0.0.0:${PORT}`);
    });
  }
  
  export default {
    run,
};
