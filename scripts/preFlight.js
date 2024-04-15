require("dotenv").config();
require("./patchNextLogger");
const { readFileSync } = require("fs");

// Check if .env exists on root dir
if ((!process.env.CI_TEST) && (!readFileSync(".env", "utf8"))) {
    console.error("No .env file found! Make one using the template on .env.example!");
    process.exit(1);
} else {
    require("../dist/index");
}