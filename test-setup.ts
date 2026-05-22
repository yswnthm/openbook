import { GlobalRegistrator } from '@happy-dom/global-registrator';

try {
  GlobalRegistrator.register();
  if (typeof window !== 'undefined' && window.location) {
    // Set a valid URL for Happy DOM location
    window.location.href = 'http://localhost/';
  }
} catch (e) {
  console.error('Failed to register global DOM:', e);
}

// Mock ResizeObserver which is commonly missing in test environments
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
