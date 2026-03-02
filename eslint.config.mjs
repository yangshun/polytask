import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
];

export default eslintConfig;
