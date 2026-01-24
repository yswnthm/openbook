import { describe, test, expect, beforeAll, afterAll, mock } from 'bun:test';
import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { render } from '@testing-library/react';
import React from 'react';
import { OfflineIndicator } from '../OfflineIndicator';

// Mock useOnlineStatus hook
const mockUseOnlineStatus = mock(() => true);
mock.module('@/hooks/useOnlineStatus', () => ({
  useOnlineStatus: mockUseOnlineStatus,
}));

describe('OfflineIndicator', () => {
  beforeAll(() => {
    GlobalRegistrator.register();
  });

  afterAll(() => {
    GlobalRegistrator.unregister();
  });

  test('should not render when online', () => {
    mockUseOnlineStatus.mockReturnValue(true);
    const { container } = render(<OfflineIndicator />);
    expect(container.firstChild).toBeNull();
  });

  test('should render when offline', () => {
    mockUseOnlineStatus.mockReturnValue(false);
    const { getByText } = render(<OfflineIndicator />);
    const indicator = getByText(/You are offline/i);
    expect(indicator).toBeDefined();
  });
});
