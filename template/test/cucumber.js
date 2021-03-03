module.exports = {
    default: [
        "features/**/*.feature",
        "--require-module ts-node/register",
        "--require stepDefinitions/**/*.ts",
        "--require hooks/**/*.ts",
        "--format progress-bar",
    ].join(" ")
};