import {ENV} from "./src/config/env.js";

export default {
    schhema: "./src/db/schema.js",
    out: "./src/db/migrations",
    dialect: "postgresql",
    dbCredentials: {url: ENV.DATABASE_URL},
}