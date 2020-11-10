require("dotenv").config({ path: "../config/dev/dev.env" });
const app = require("./app");

const port = process.env.PORT || 3001;

app.listen(3001, () => console.log(`Task app listening on port port!`));
