const esModules = ['d3', 'd3-array'].join('|');

module.exports = {
    transform: {
        '^.+\\.svelte$': 'svelte-jester',
        '^.+\\.js$': 'babel-jest',
    },
    transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
    moduleFileExtensions: ['js', 'svelte'],
}