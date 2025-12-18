# Contributing to OpenBook

Thank you for your interest in contributing to OpenBook! This guide will help you get started with our development workflow and code standards.

## Code Formatting

We use **Prettier** and **ESLint** to maintain consistent code formatting across the project. This helps ensure that code reviews focus on functionality rather than style differences.

### Automatic Formatting

The project is configured with:

- **Prettier** for code formatting
- **Import sorting** plugin for organizing imports
- **Tailwind CSS** plugin for class ordering

### Running Formatters

```bash
# Format all files
npm run format

# Check if files are properly formatted (useful for CI)
npm run format:check

# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix
```

### Editor Setup

For the best development experience, configure your editor to:

1. **Format on save** - This prevents formatting conflicts
2. **Use project's Prettier config** - Ensures consistency
3. **Show ESLint warnings** - Helps catch issues early

#### VS Code Configuration

Add this to your VS Code settings (`.vscode/settings.json`):

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
}
```

#### Other Editors

- **WebStorm/IntelliJ**: Enable Prettier and ESLint in Preferences → Languages & Frameworks
- **Vim/Neovim**: Use plugins like `prettier/vim-prettier` and `dense-analysis/ale`
- **Sublime Text**: Install `JsPrettier` package

### Pre-commit Hooks

The project uses **Husky** and **lint-staged** to automatically format files before commits. This ensures all committed code follows our standards.

If you encounter formatting issues:

1. Run `npm run format` to fix formatting
2. Run `npm run lint:fix` to fix linting issues
3. Commit your changes again

### Import Organization

Imports are automatically sorted in this order:

1. React imports (`react`, `react/...`)
2. Next.js imports (`next`, `next/...`)
3. Third-party packages
4. Internal imports with `@/` alias
5. Relative imports (`./`, `../`)

Example:

```typescript
import { useState } from 'react';
import { useRouter } from 'next/router';
import { clsx } from 'clsx';

import { Button } from '@/components/ui/button';
import { utils } from '@/lib/utils';

import './styles.css';
```

### Tailwind CSS Classes

Tailwind classes are automatically sorted using the official plugin, following the recommended order:

```tsx
<div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-lg font-semibold text-gray-900 shadow-sm hover:bg-gray-50">
    Content
</div>
```

## Best Practices for Contributors

1. **Don't disable formatters** - If you think the formatting is wrong, discuss it in an issue first
2. **Run formatting before submitting PRs** - This prevents unnecessary formatting commits
3. **Use meaningful commit messages** - Focus on what changed, not formatting fixes
4. **Respect existing patterns** - Follow the established code structure and naming conventions

## Troubleshooting

### Formatting Conflicts

If you're seeing constant formatting changes:

1. Ensure your editor uses the project's Prettier config
2. Check that you have the latest version of Prettier and plugins
3. Run `npm run format` to align with project standards

### Plugin Issues

If Prettier plugins aren't working:

1. Install dependencies: `npm install`
2. Restart your editor
3. Check that your editor's Prettier extension is up to date

### Getting Help

- Create an issue for bugs or suggestions
- Check existing issues for similar problems
- Ask questions in discussions

Thank you for contributing to OpenBook! 🚀
