require("@babel/register")({
  presets: ["@babel/preset-env"],
  extensions: [".js", ".ts"],
});

// If you are using ES modules
require("@babel/polyfill");

// Start your main application
require("./app"); // Replace with your actual entry file
