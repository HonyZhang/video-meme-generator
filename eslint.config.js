import js from "@eslint/js"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import prettierPlugin from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"

export default [
    {
        // ✅ 忽略无需校验的目录
        ignores: [
            "**/node_modules/**",
            "**/dist/**",
            "**/build/**",
            "**/*.config.js",
            "**/.plasmo/**"
        ]
    },
    js.configs.recommended,
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true
                }
            },
            env: {
                browser: true
            }
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            react,
            "react-hooks": reactHooks,
            prettier: prettierPlugin
        },
        rules: {
            // ✅ TypeScript + React 推荐规则
            ...tsPlugin.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,

            // ✅ Prettier 风格校验
            "prettier/prettier": "error",

            // ✅ 不再强制要求 import React
            "react/react-in-jsx-scope": "off"
        },
        settings: {
            react: {
                version: "detect"
            }
        }
    },
    {
        rules: {
            ...prettierConfig.rules
        }
    }
]
