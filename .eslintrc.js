module.exports = {
    "extends": [
        "standard",
        "angular"
    ],
    "plugins": [
        "standard",
        "promise"
    ],

    // my custom rules (overwrite the above)
    "rules": {
        "quotes": ["error", "double"],  // use single quotes
        "indent": ["error", 4],  // indent using four spaces
        "semi": ["error", "always"],  // require semicolons
        "space-before-function-paren": ["error", "never"]  // no space between function name and parameters
    }
};