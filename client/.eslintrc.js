module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: [
        'react',
        '@typescript-eslint',
        'jest'
    ],
    extends: [
        'airbnb',
        'airbnb/hooks',
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
        'plugin:prettier/recommended'
    ],
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    rules: {
        "no-console": "off",
        // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
        'no-prototype-builtins': 'off',
        // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
        'react/destructuring-assignment': 'off',
        "import/extensions": ['error', 'never'],
        "react/require-default-props": 'off',
        // Use function hoisting to improve code readability
        'no-use-before-define': [
            'error',
            { functions: false, classes: true, variables: true },
        ],
        '@typescript-eslint/no-use-before-define': [
            'error',
            { functions: false, classes: true, variables: true, typedefs: true },
        ],
        'prettier/prettier': [
            'warn',
            {
                endOfLine: 'auto',
                singleQuote: true,
                tabWidth: 2,
                trailingComma: 'es5',
            },
        ],
    }
};