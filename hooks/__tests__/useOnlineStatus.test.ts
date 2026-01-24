import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { renderHook } from '@testing-library/react';
import { useOnlineStatus } from '../useOnlineStatus';

describe('useOnlineStatus', () => {
    beforeAll(() => {
        GlobalRegistrator.register();
    });

    afterAll(() => {
        GlobalRegistrator.unregister();
    });

    test('should be defined', () => {
        expect(useOnlineStatus).toBeDefined();
    });

    test('should return boolean', () => {
        const { result } = renderHook(() => useOnlineStatus());
        expect(typeof result.current).toBe('boolean');
    });
});
