import { expect, test, describe } from 'bun:test';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('PWA Manifest', () => {
    const manifestPath = join(process.cwd(), 'public', 'manifest.json');

    test('manifest.json should exist', () => {
        expect(existsSync(manifestPath)).toBe(true);
    });

    test('manifest.json should have required fields', () => {
        if (!existsSync(manifestPath)) return;
        
        const content = readFileSync(manifestPath, 'utf-8');
        const manifest = JSON.parse(content);

        expect(manifest.name).toBe('OpenBook');
        expect(manifest.short_name).toBe('OpenBook');
        expect(manifest.display).toBe('standalone');
        expect(manifest.background_color).toBeDefined();
        expect(manifest.theme_color).toBeDefined();
        expect(manifest.icons).toBeInstanceOf(Array);
        expect(manifest.icons.length).toBeGreaterThan(0);
    });
});
