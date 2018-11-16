var env = process.env.NODE_ENV || "development";

if (env === "development") {
  require("./dev");
} else if (env === "test") {
  require("./test");
}
