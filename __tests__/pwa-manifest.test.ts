import { expect, test, describe } from 'bun:test';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('PWA Manifest', () => {
    const manifestPath = join(process.cwd(), 'public', 'manifest.json');

    test('manifest.json should exist', () => {
        expect(existsSync(manifestPath)).toBe(true);
    });

    test('manifest.json should have required fields', () => {
        if (!existsSync(manifestPath)) {
            // Fail safely if file doesn't exist, though the previous test checks this.
            // But per instructions, we should assert existence here too or handle it carefully.
            expect(existsSync(manifestPath)).toBe(true);
            return;
        }

        const content = readFileSync(manifestPath, 'utf-8');
        let manifest;
        try {
            manifest = JSON.parse(content);
        } catch (e) {
            throw new Error(`Failed to parse manifest.json: ${(e as Error).message}`);
        }

        expect(manifest.name).toBe('OpenBook');
        expect(manifest.short_name).toBe('OpenBook');
        expect(manifest.display).toBe('standalone');
        expect(manifest.background_color).toBeDefined();
        expect(manifest.theme_color).toBeDefined();
        expect(manifest.icons).toBeInstanceOf(Array);
        expect(manifest.icons.length).toBeGreaterThan(0);
    });
});
