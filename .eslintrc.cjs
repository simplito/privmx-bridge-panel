// @ts-check

/** @type {import("./eslintTypes").Selector[]} */
const commonNamingConventionRules = [
    // Use strictCamelCase by default
    {
        selector: "default",
        format: ["strictCamelCase"],
    },

    // Use both strictCamelCase and StrictPascalCase for identifiers that end with "Class" or "Constructor" (e.g. "const SomeClass = ...")
    {
        selector: "default",
        format: ["strictCamelCase", "StrictPascalCase"],
        filter: {
            regex: "(Class|Constructor)$",
            match: true,
        },
    },

    // Use strictCamelCase with a single leading underscore for unused parameters
    {
        selector: "parameter",
        modifiers: ["unused"],
        format: ["strictCamelCase"],
        leadingUnderscore: "require",
    },

    // Use StrictPascalCase for type-like identifiers
    {
        selector: "typeLike",
        format: ["StrictPascalCase"],
        leadingUnderscore: "allow",
    },

    // Use strictCamelCase for static-readonly class properties
    {
        selector: "classProperty",
        modifiers: ["static", "readonly"],
        format: ["strictCamelCase"],
    },

    // Use StrictPascalCase with "T" prefix for type parameters
    {
        selector: "typeParameter",
        format: ["StrictPascalCase"],
        prefix: ["T"],
    },

    // Require a boolean-like prefix for boolean vars
    {
        selector: "variable",
        types: ["boolean"],
        format: ["StrictPascalCase"],
        prefix: ["are", "can", "did", "does", "do", "has", "have", "is", "should", "was", "were", "will"],
    },

    // Use both strictCamelCase and StrictPascalCase for const variables; allow optional single or double leading underscore
    {
        selector: "variable",
        modifiers: ["const"],
        format: ["strictCamelCase", "StrictPascalCase"],
        leadingUnderscore: "allowSingleOrDouble",
    },

    // Use strictCamelCase with a single leading underscore for private properties
    {
        selector: "property",
        format: ["strictCamelCase"],
        leadingUnderscore: "allow",
        modifiers: ["private"],
    },

    // Use strictCamelCase with a single leading underscore for protected properties
    {
        selector: "property",
        format: ["strictCamelCase"],
        leadingUnderscore: "allow",
        modifiers: ["protected"],
    },

    // Use StrictPascalCase for enum members
    {
        selector: "enumMember",
        format: ["StrictPascalCase"],
    },

    // Use both strictCamelCase and StrictPascalCase for default and namespace import names
    {
        selector: "import",
        format: ["strictCamelCase", "StrictPascalCase"],
    },
];

/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        project: true,
    },
    plugins: ["@typescript-eslint", "deprecation", "import", "jsx-a11y", "react", "react-hooks"],
    root: true,
    reportUnusedDisableDirectives: true,
    rules: {
        // eslint core / "Possible Problems"
        "no-async-promise-executor": "error",
        "no-compare-neg-zero": "error",
        "no-cond-assign": "error",
        "no-constant-binary-expression": "error",
        "no-constant-condition": "error",
        "no-control-regex": "error",
        "no-debugger": "error",
        "no-dupe-else-if": "error",
        "no-empty-character-class": "error",
        "no-empty-pattern": "error",
        "no-ex-assign": "error",
        "no-fallthrough": "error",
        "no-inner-declarations": "error",
        "no-invalid-regexp": "error",
        "no-irregular-whitespace": "error",
        "no-misleading-character-class": "error",
        "no-promise-executor-return": "error",
        "no-prototype-builtins": "error",
        "no-self-assign": "error",
        "no-self-compare": "error",
        "no-sparse-arrays": "error",
        "no-template-curly-in-string": "error",
        "no-unexpected-multiline": "error",
        "no-unmodified-loop-condition": "error",
        "no-unreachable": "error",
        "no-unreachable-loop": "error",
        "no-unsafe-finally": "error",
        "no-unsafe-negation": "error",
        "no-unsafe-optional-chaining": "error",
        "no-unused-private-class-members": "error",
        // "no-useless-assignment": "error", // @todo: enable when ESLint v9 becomes supported by Next.js and other ESLint plugins
        "no-useless-backreference": "error",
        "require-atomic-updates": "error",
        "use-isnan": "error",

        // eslint core / "Suggestions"
        "curly": ["error", "all"],
        "default-case": "error",
        "default-case-last": "error",
        "eqeqeq": "error",
        "grouped-accessor-pairs": "error",
        "max-classes-per-file": [
            "error",
            {
                ignoreExpressions: true,
                max: 1,
            },
        ],
        "max-depth": ["error", 5],
        "max-lines": [
            "error",
            {
                max: 1000,
                skipBlankLines: true,
                skipComments: true,
            },
        ],
        "max-lines-per-function": [
            "error",
            {
                max: 75,
                skipBlankLines: true,
                skipComments: true,
                IIFEs: true,
            },
        ],
        "max-nested-callbacks": ["error", 4],
        "no-alert": "error",
        "no-bitwise": "error",
        "no-caller": "error",
        "no-case-declarations": "error",
        "no-console": "error",
        "no-delete-var": "error",
        "no-div-regex": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-extra-label": "error",
        "no-global-assign": "error",
        "no-implicit-coercion": "error",
        "no-iterator": "error",
        "no-label-var": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-multi-assign": "error",
        "no-negated-condition": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-wrappers": "error",
        "no-nonoctal-decimal-escape": "error",
        "no-object-constructor": "error",
        "no-octal": "error",
        "no-octal-escape": "error",
        "no-param-reassign": ["error", { props: true }],
        "no-proto": "error",
        "no-regex-spaces": "error",
        "no-return-assign": "error",
        "no-script-url": "error",
        "no-sequences": "error",
        "no-shadow-restricted-names": "error",
        "no-unneeded-ternary": "error",
        "no-unused-labels": "error",
        "no-useless-call": "error",
        "no-useless-catch": "error",
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-useless-escape": "error",
        "no-useless-rename": "error",
        "no-var": "error",
        "no-void": ["error", { allowAsStatement: true }],
        "no-warning-comments": [
            "error",
            {
                terms: ["todo", "fixme"],
                location: "start",
                decoration: ["*", "/", "@"],
            },
        ],
        "no-with": "error",
        "one-var": ["error", "never"],
        "prefer-arrow-callback": "error",
        "prefer-const": "error",
        "prefer-exponentiation-operator": "error",
        "prefer-named-capture-group": "error",
        "prefer-numeric-literals": "error",
        "prefer-object-has-own": "error",
        "prefer-object-spread": "error",
        "prefer-regex-literals": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        "radix": "error",
        "require-unicode-regexp": "error",
        "require-yield": "error",
        "sort-imports": ["error", { ignoreDeclarationSort: true }],
        "symbol-description": "error",
        "yoda": "error",

        // plugin: @typescript-eslint
        "@typescript-eslint/adjacent-overload-signatures": "error",
        "@typescript-eslint/array-type": [
            "error",
            {
                default: "array-simple",
                readonly: "array-simple",
            },
        ],
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/ban-ts-comment": [
            "error",
            {
                "ts-expect-error": "allow-with-description",
                "ts-ignore": "allow-with-description",
                "ts-nocheck": "allow-with-description",
                "ts-check": false,
                "minimumDescriptionLength": 3,
            },
        ],
        "@typescript-eslint/class-literal-property-style": "error",
        "@typescript-eslint/consistent-generic-constructors": "error",
        "@typescript-eslint/consistent-indexed-object-style": "error",
        "@typescript-eslint/consistent-type-assertions": [
            "error",
            {
                assertionStyle: "as",
                objectLiteralTypeAssertions: "never",
            },
        ],
        "@typescript-eslint/consistent-type-definitions": "error",
        "@typescript-eslint/consistent-type-exports": "error",
        "@typescript-eslint/consistent-type-imports": "error",
        "default-param-last": "off",
        "@typescript-eslint/default-param-last": "error",
        "dot-notation": "off",
        "@typescript-eslint/dot-notation": "error",
        "@typescript-eslint/explicit-function-return-type": [
            "error",
            {
                allowExpressions: true,
            },
        ],
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            {
                accessibility: "no-public",
                overrides: {
                    parameterProperties: "off",
                },
            },
        ],
        "@typescript-eslint/explicit-module-boundary-types": "error",
        "max-params": "off",
        "@typescript-eslint/max-params": ["error", { max: 3 }],
        "@typescript-eslint/member-ordering": [
            "error",
            {
                default: {
                    optionalityOrder: "required-first",
                    memberTypes: [
                        // Index signature
                        "signature",
                        "call-signature",

                        // Static fields
                        "public-static-field",
                        "protected-static-field",
                        "private-static-field",
                        "#private-static-field",

                        // Static getters/setters
                        [
                            "public-static-get",
                            "public-static-set",
                            "protected-static-get",
                            "protected-static-set",
                            "private-static-get",
                            "private-static-set",
                            "#private-static-get",
                            "#private-static-set",
                        ],

                        // Static methods
                        "public-static-method",
                        "protected-static-method",
                        "private-static-method",
                        "#private-static-method",

                        // Static initialization
                        "static-initialization",

                        // Instance decorated fields
                        "public-decorated-field",
                        "protected-decorated-field",
                        "private-decorated-field",

                        // Instance abstract fields
                        "public-abstract-field",
                        "protected-abstract-field",

                        // Instance fields
                        "public-instance-field",
                        "protected-instance-field",
                        "private-instance-field",
                        "#private-instance-field",

                        // Instance getters/setters
                        [
                            "public-instance-get",
                            "public-instance-set",
                            "protected-instance-get",
                            "protected-instance-set",
                            "private-instance-get",
                            "private-instance-set",
                            "#private-instance-get",
                            "#private-instance-set",
                        ],

                        // Constructors
                        "public-constructor",
                        "protected-constructor",
                        "private-constructor",

                        // Instance abstract methods
                        "public-abstract-method",
                        "protected-abstract-method",

                        // Instance decorated methods
                        "public-decorated-method",
                        "protected-decorated-method",
                        "private-decorated-method",

                        // Instance methods
                        "public-instance-method",
                        "protected-instance-method",
                        "private-instance-method",
                        "#private-instance-method",
                    ],
                },
            },
        ],
        "@typescript-eslint/method-signature-style": "error",
        "@typescript-eslint/naming-convention": ["error", ...commonNamingConventionRules],
        "no-array-constructor": "off",
        "@typescript-eslint/no-array-constructor": "error",
        "@typescript-eslint/no-array-delete": "error",
        "@typescript-eslint/no-base-to-string": "error",
        "@typescript-eslint/no-confusing-non-null-assertion": "error",
        "@typescript-eslint/no-confusing-void-expression": "error",
        "@typescript-eslint/no-duplicate-enum-values": "error",
        "@typescript-eslint/no-duplicate-type-constituents": "error",
        "@typescript-eslint/no-dynamic-delete": "error",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-empty-object-type": [
            "error",
            {
                allowInterfaces: "always",
            },
        ],
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-extra-non-null-assertion": "error",
        "@typescript-eslint/no-extraneous-class": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-for-in-array": "error",
        "no-implied-eval": "off",
        "@typescript-eslint/no-implied-eval": "error",
        "@typescript-eslint/no-import-type-side-effects": "error",
        "@typescript-eslint/no-inferrable-types": "error",
        "@typescript-eslint/no-invalid-void-type": "error",
        "no-loop-func": "off",
        "@typescript-eslint/no-loop-func": "error",
        "no-loss-of-precision": "off",
        "@typescript-eslint/no-loss-of-precision": "error",
        "@typescript-eslint/no-meaningless-void-operator": "error",
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-misused-promises": "error",
        "@typescript-eslint/no-mixed-enums": "error",
        "@typescript-eslint/no-namespace": [
            "error",
            {
                allowDeclarations: true,
                allowDefinitionFiles: true,
            },
        ],
        "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/no-redundant-type-constituents": "error",
        "@typescript-eslint/no-require-imports": "error",
        "no-restricted-imports": "off",
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
        "@typescript-eslint/no-this-alias": "error",
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
        "@typescript-eslint/no-unnecessary-condition": "error",
        "@typescript-eslint/no-unnecessary-qualifier": "error",
        "@typescript-eslint/no-unnecessary-type-arguments": "off",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/no-unnecessary-type-constraint": "error",
        "@typescript-eslint/no-unsafe-argument": "error",
        "@typescript-eslint/no-unsafe-assignment": "error",
        "@typescript-eslint/no-unsafe-call": "error",
        "@typescript-eslint/no-unsafe-declaration-merging": "error",
        "@typescript-eslint/no-unsafe-enum-comparison": "error",
        "@typescript-eslint/no-unsafe-member-access": "error",
        "@typescript-eslint/no-unsafe-return": "error",
        "@typescript-eslint/no-unsafe-unary-minus": "error",
        "no-unused-expressions": "off",
        "@typescript-eslint/no-unused-expressions": "error",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            },
        ],
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "no-useless-constructor": "off",
        "@typescript-eslint/no-unnecessary-template-expression": "error",
        "@typescript-eslint/no-useless-constructor": "off",
        "@typescript-eslint/no-useless-empty-export": "error",
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/non-nullable-type-assertion-style": "error",
        "no-throw-literal": "off",
        "@typescript-eslint/only-throw-error": "error",
        "@typescript-eslint/prefer-as-const": "error",
        "@typescript-eslint/prefer-enum-initializers": "error",
        "@typescript-eslint/prefer-find": "error",
        "@typescript-eslint/prefer-for-of": "error",
        "@typescript-eslint/prefer-function-type": "error",
        "@typescript-eslint/prefer-includes": "error",
        "@typescript-eslint/prefer-literal-enum-member": "error",
        "@typescript-eslint/prefer-namespace-keyword": "error",
        "@typescript-eslint/prefer-nullish-coalescing": "error",
        "@typescript-eslint/prefer-optional-chain": "error",
        "prefer-promise-reject-errors": "off",
        "@typescript-eslint/prefer-promise-reject-errors": "error",
        "@typescript-eslint/prefer-readonly": "error",
        "@typescript-eslint/prefer-reduce-type-parameter": "error",
        "@typescript-eslint/prefer-regexp-exec": "error",
        "@typescript-eslint/prefer-return-this-type": "error",
        "@typescript-eslint/prefer-string-starts-ends-with": "error",
        "@typescript-eslint/prefer-ts-expect-error": "error",
        "@typescript-eslint/promise-function-async": "error",
        "@typescript-eslint/require-array-sort-compare": "error",
        "require-await": "off",
        "@typescript-eslint/require-await": "error",
        "@typescript-eslint/restrict-plus-operands": "error",
        "@typescript-eslint/restrict-template-expressions": "error",
        "no-return-await": "off",
        "@typescript-eslint/return-await": ["error", "always"],
        "@typescript-eslint/strict-boolean-expressions": "error",
        "@typescript-eslint/switch-exhaustiveness-check": "error",
        "@typescript-eslint/triple-slash-reference": "error",
        "@typescript-eslint/unbound-method": "error",
        "@typescript-eslint/unified-signatures": "error",
        "@typescript-eslint/use-unknown-in-catch-callback-variable": "error",

        // plugin: deprecation
        "deprecation/deprecation": "error",

        // plugin: import
        "import/first": "error",
        "import/no-amd": "error",
        "import/no-anonymous-default-export": "error",
        "import/no-commonjs": "error",
        "import/no-cycle": "error",
        "import/no-default-export": "error",
        "import/no-deprecated": "error",
        "import/no-dynamic-require": "error",
        "import/no-empty-named-blocks": "error",
        "import/no-extraneous-dependencies": [
            "error",
            {
                devDependencies: ["**/*.spec.ts", "**/*.spec.tsx", "**/*.test.ts", "**/*.test.tsx"],
                optionalDependencies: false,
                peerDependencies: false,
            },
        ],
        "import/no-mutable-exports": "error",
        "import/no-named-as-default-member": "error",
        "import/no-named-as-default": "error",
        "import/no-named-default": "error",
        "import/no-self-import": "error",
        "import/no-useless-path-segments": "error",
        "import/no-webpack-loader-syntax": "error",
        "import/order": [
            "error",
            {
                "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object"],
                "newlines-between": "never",
                "alphabetize": {
                    order: "asc",
                    caseInsensitive: true,
                },
                "warnOnUnassignedImports": true,
                "pathGroupsExcludedImportTypes": [],
                "pathGroups": [
                    {
                        pattern: "server-only",
                        group: "builtin",
                        position: "before",
                    },
                    {
                        pattern: "@/**",
                        group: "parent",
                        position: "before",
                    },
                    {
                        pattern: "./**/*.json",
                        group: "sibling",
                        position: "after",
                    },
                    {
                        pattern: "{./**/*.scss,./**/*.css}",
                        group: "object",
                        position: "after",
                    },
                ],
            },
        ],

        // plugin: jsx-a11y
        "jsx-a11y/alt-text": [
            "error",
            {
                elements: ["img"],
                img: ["Image"],
            },
        ],
        "jsx-a11y/anchor-has-content": "error",
        "jsx-a11y/anchor-is-valid": "error",
        "jsx-a11y/aria-activedescendant-has-tabindex": "error",
        "jsx-a11y/aria-props": "error",
        "jsx-a11y/aria-proptypes": "error",
        "jsx-a11y/aria-role": "error",
        "jsx-a11y/aria-unsupported-elements": "error",
        "jsx-a11y/autocomplete-valid": "error",
        "jsx-a11y/click-events-have-key-events": "error",
        "jsx-a11y/control-has-associated-label": "error",
        "jsx-a11y/heading-has-content": "error",
        "jsx-a11y/html-has-lang": "error",
        "jsx-a11y/iframe-has-title": "error",
        "jsx-a11y/img-redundant-alt": "error",
        "jsx-a11y/interactive-supports-focus": "error",
        "jsx-a11y/label-has-associated-control": "error",
        "jsx-a11y/lang": "error",
        "jsx-a11y/media-has-caption": "error",
        "jsx-a11y/mouse-events-have-key-events": "error",
        "jsx-a11y/no-access-key": "error",
        "jsx-a11y/no-aria-hidden-on-focusable": "error",
        "jsx-a11y/no-autofocus": "error",
        "jsx-a11y/no-distracting-elements": "error",
        "jsx-a11y/no-interactive-element-to-noninteractive-role": "error",
        "jsx-a11y/no-noninteractive-element-interactions": "error",
        "jsx-a11y/no-noninteractive-element-to-interactive-role": "error",
        "jsx-a11y/no-noninteractive-tabindex": "error",
        "jsx-a11y/no-redundant-roles": "error",
        "jsx-a11y/no-static-element-interactions": "error",
        "jsx-a11y/prefer-tag-over-role": "error",
        "jsx-a11y/role-has-required-aria-props": "error",
        "jsx-a11y/role-supports-aria-props": "error",
        "jsx-a11y/scope": "error",
        "jsx-a11y/tabindex-no-positive": "error",

        // plugin: react
        "react/boolean-prop-naming": [
            "error",
            {
                rule: "^(has|is|should|with)[A-Z]([A-Za-z0-9]?)+",
            },
        ],
        "react/button-has-type": "error",
        "react/destructuring-assignment": ["error", "never"],
        "react/display-name": "error",
        "react/function-component-definition": "error",
        "react/hook-use-state": "error",
        "react/iframe-missing-sandbox": "error",
        "react/jsx-fragments": "error",
        "react/jsx-handler-names": "error",
        "react/jsx-key": [
            "error",
            {
                checkFragmentShorthand: true,
                warnOnDuplicates: true,
            },
        ],
        "react/jsx-max-depth": [
            "error",
            {
                max: 8,
            },
        ],
        "react/jsx-no-bind": "error",
        "react/jsx-no-comment-textnodes": "error",
        "react/jsx-no-constructed-context-values": "error",
        "react/jsx-no-duplicate-props": "error",
        "react/jsx-no-leaked-render": "error",
        "react/jsx-no-script-url": "error",
        "react/jsx-no-target-blank": "error",
        "react/jsx-props-no-spreading": "error",
        "react/jsx-uses-react": "off",
        "react/no-array-index-key": "error",
        "react/no-children-prop": "error",
        "react/no-danger": "error",
        "react/no-danger-with-children": "error",
        "react/no-deprecated": "error",
        "react/no-object-type-as-default-prop": "error",
        "react/no-render-return-value": "error",
        "react/no-string-refs": "error",
        "react/no-this-in-sfc": "error",
        "react/no-unescaped-entities": "error",
        "react/no-unstable-nested-components": "error",
        "react/prefer-stateless-function": "error",
        "react/react-in-jsx-scope": "off",
        "react/require-render-return": "error",
        "react/self-closing-comp": "error",

        // plugin: react-hooks
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",
    },
    overrides: [
        {
            files: [".eslintrc.cjs"],
            env: {
                node: true,
            },
            rules: {
                // plugin: @typescript-eslint
                "@typescript-eslint/naming-convention": "off",
                "@typescript-eslint/no-require-imports": "off",
                "@typescript-eslint/no-var-requires": "off",

                // plugin: import
                "import/no-commonjs": "off",
            },
        },
        {
            files: ["*.tsx"],
            rules: {
                // eslint core / "Suggestions"
                "max-lines-per-function": [
                    "error",
                    {
                        max: 500,
                        skipBlankLines: true,
                        skipComments: true,
                        IIFEs: true,
                    },
                ],

                // plugin: @typescript-eslint
                "@typescript-eslint/explicit-function-return-type": "off",
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "@typescript-eslint/naming-convention": [
                    "error",
                    ...commonNamingConventionRules,
                    {
                        selector: ["function", "variable"],
                        format: ["camelCase", "PascalCase"],
                    },
                ],
            },
        },
        {
            files: [
                "./src/app/**/apple-icon.tsx",
                "./src/app/**/default.tsx",
                "./src/app/**/error.tsx",
                "./src/app/**/global-error.tsx",
                "./src/app/**/icon.tsx",
                "./src/app/**/layout.tsx",
                "./src/app/**/loading.tsx",
                "./src/app/**/not-found.tsx",
                "./src/app/**/page.tsx",
                "./src/app/**/route.tsx",
                "./src/app/**/template.tsx",
            ],
            rules: {
                // plugin: import
                "import/no-default-export": "off",
            },
        },
    ],
};
