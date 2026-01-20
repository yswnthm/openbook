import { expect, test, describe } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Layout Metadata (Static Analysis)', () => {
    const layoutPath = join(process.cwd(), 'app', 'layout.tsx');

    test('should have manifest link defined in metadata', () => {
        const content = readFileSync(layoutPath, 'utf-8');
        expect(content).toContain("manifest: '/manifest.json'");
    });

    test('should have appleWebApp configuration', () => {
        const content = readFileSync(layoutPath, 'utf-8');
        expect(content).toContain('appleWebApp: {');
        expect(content).toContain("capable: true");
        expect(content).toContain("statusBarStyle: 'black-translucent'");
    });
});