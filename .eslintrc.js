module.exports = {
    "extends": [
        "eslint:recommended",
        "angular",
        "plugin:lodash/recommended",
        "plugin:jasmine/recommended"
    ],
    "plugins": [
        "lodash",
        "jasmine"
    ],
    "globals": {
        "_": true
    },
    "env": {
        "jasmine": true
    }
};
