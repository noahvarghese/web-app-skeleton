export default {
    name: "Vue",
    basePackage: {
        name: "@vue/cli",
        cmd: "vue",
        options: "create client"
    },
    dependencies: [{
            package: "vue-router",
        },
        {
            package: "vuex",
        }
    ],
    devDependencies: []
};