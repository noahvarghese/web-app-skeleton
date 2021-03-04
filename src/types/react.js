export default {
    name: "React",
    basePackage: {
        name: "create-react-app",
        cmd: "create-react-app",
        options: "client --typescript",
    },
    dependencies: [{
            package: "react-dom",
            types: "@types/react-dom"
        },
        {
            package: "react-router-dom",
            types: "@types/react-router-dom"
        },
        {
            package: "redux",
        },
        {
            package: "react-redux",
            types: "@types/react-redux"
        },
        {
            package: "react-helmet",
            types: "@types/react-helmet"
        },
        {
            package: "node-sass",
        }
    ],
    devDependencies: [

    ]
};