export default {
    name: "test",
    dependencies: [],
    devDependencies: [
        "@cucumber/cucumber",
        "@types/chai",
        "@types/cucumber",
        "@types/node",
        "@types/selenium-web-driver",
        "chai",
        "chromedriver",
        "cucumber-pretty",
        "dotenv",
        "selenium-webdriver",
        "ts-node",
        "tslint",
        "typescript"
    ],
    scripts: [{
            key: "start",
            value: "npm run start-website-local && npm run test ; wait && npm run stop-website-local"
        },
        {
            key: "start-website-local",
            value: "sudo cp ../website/node-local.service /etc/systemd/system && sudo systemctl daemon-reload && sudo systemctl start node-local.service"
        },
        {
            key: "stop-website-local",
            value: "sudo systemctl stop node-local.service && sudo rm /etc/systemd/system/node-local.service"
        },
        {
            key: "test",
            value: "./node_modules/.bin/cucumber-js -p default"
        },
    ]
}