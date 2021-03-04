export default {
    name: "Vue",
    basePackage: {
        name: "@vue/cli",
        cmd: "vue",
        options: "create -p default-vuerc client -n"
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