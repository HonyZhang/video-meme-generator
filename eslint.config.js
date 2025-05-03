import pluginVue from 'eslint-plugin-vue';
import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import vueParser from 'vue-eslint-parser';

export default [
  // ✅ Vue Flat 配置（必须放在前面）
  ...pluginVue.configs['flat/recommended'],

  // ✅ TypeScript + Vue 处理
  {
    files: ['**/*.ts', '**/*.vue'],
    languageOptions: {
      parser: vueParser, // ✅ 专门用于解析 .vue 文件
      parserOptions: {
        parser: parserTs, // ✅ 实际解析 script 内容的 TS parser
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
    },
    rules: {
      ...pluginTs.configs.recommended.rules,
      'vue/component-name-in-template-casing': [
        'error',
        'kebab-case',
        { registeredComponentsOnly: false },
      ],
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },

  // ✅ 忽略构建产物等
  {
    ignores: ['dist', 'node_modules'],
  },

  // ✅ Prettier 格式整合
  prettier,
];
