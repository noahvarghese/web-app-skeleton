export default {
    name: "server",
    dependencies: [{
            package: "bcrypt",
            types: "@types/bcrypt"
        }, {
            package: "cookie-parser",
            types: "@types/cookie-parser"
        },
        {
            package: "cors",
            types: "@types/cors"
        },
        {
            package: "csurf",
            types: "@types/csurf"
        },
        {
            package: "express",
            types: "@types/express"
        },
        {
            package: "express-fileupload",
            types: "@types/express-fileupload"
        },
        {
            package: "express-session",
            types: "@types/express-session"
        },
        {
            package: "mysql",
            types: "@types/mysql"
        },
        {
            package: "nodemailer",
            types: "@types/nodemailer"
        },
        {
            package: "path",
            types: "@types/path"
        },
        {
            package: "typeorm",
            types: "@types/typeorm"
        },
    ],
    devDependencies: [
        "dotenv",
        "nodemon",
        "ts-node",
        "tslint",
        "typescript",
    ],
    scripts: [{
            key: "build",
            value: "rm -rf ./node_modules/ && rm -rf ./dist/ && npm i && tsc -p . && mv ./dist/src/* ./dist/ && rmdir ./dist/src/"
        },
        {
            key: "dev",
            value: "nodemon -e env,ts --exec ts-node ./src/server.ts"
        },
        {
            key: "start",
            value: "node ./dist/server.js"
        },
        {
            key: "move-frontend-to-server",
            value: "cd ../client && npm run build && mv ./dist/* ../server/views"
        },
    ]
}