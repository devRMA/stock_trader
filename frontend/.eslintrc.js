module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['prettier', 'react', 'simple-import-sort', 'testing-library'],
    extends: [
        'airbnb-typescript',
        'airbnb',
        'airbnb/hooks',
        'eslint:recommended',
        'next',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:jsx-a11y/recommended',
        'plugin:prettier/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react/recommended',
        'plugin:unicorn/recommended',
        'plugin:storybook/recommended',
    ],
    settings: {
        react: {
            version: 'detect',
        },
    },
    parserOptions: {
        ecmaVersion: 2020,
        project: ['tsconfig.json'],
        sourceType: 'module',
    },
    rules: {
        '@typescript-eslint/no-confusing-void-expression': [
            'error',
            { ignoreArrowShorthand: true },
        ],
        'capitalized-comments': 'error',
        'default-case-last': 'error',
        'grouped-accessor-pairs': 'error',
        'import/extensions': 'off',
        'import/no-anonymous-default-export': 'off',
        'import/no-deprecated': 'error',
        'import/no-extraneous-dependencies': 'off',
        'import/prefer-default-export': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        'newline-before-return': 'error',
        'no-dupe-else-if': 'error',
        'no-implicit-coercion': 'error',
        'no-param-reassign': ['error', { props: false }],
        'no-promise-executor-return': 'error',
        'no-restricted-syntax': 'error',
        'no-unreachable-loop': 'error',
        'no-unused-vars': 'error',
        'no-useless-backreference': 'error',
        'prefer-regex-literals': 'error',
        'react/boolean-prop-naming': ['error', { validateNested: true }],
        'react/function-component-definition': 'off',
        'react/jsx-filename-extension': [2, { extensions: ['.tsx'] }],
        'react/jsx-key': 'error',
        'react/jsx-no-bind': [
            'error',
            {
                ignoreRefs: false,
                allowArrowFunctions: true,
                allowFunctions: true,
                allowBind: false,
                ignoreDOMComponents: false,
            },
        ],
        'react/jsx-no-constructed-context-values': 'error',
        'react/jsx-no-script-url': 'error',
        'react/jsx-no-useless-fragment': 'error',
        'react/jsx-props-no-spreading': 'off',
        'react/no-unstable-nested-components': 'error',
        'react/prop-types': 'error',
        'react/react-in-jsx-scope': 'off',
        'require-atomic-updates': 'error',
        'simple-import-sort/exports': 'error',
        'simple-import-sort/imports': 'error',
        'sort-imports': 'off',
        'unicorn/filename-case': [
            'error',
            { cases: { camelCase: true, pascalCase: true } },
        ],
        'unicorn/prevent-abbreviations': 'off',
    },
};
