export const RESTAURANT_NAME = 'SKYBAR';

export const YEARS = Array.from({ length: 16 }, (_, index) => 2025 + index);

export const MONTHS = [
  { value: 0, label: 'January', shortLabel: 'Jan' },
  { value: 1, label: 'February', shortLabel: 'Feb' },
  { value: 2, label: 'March', shortLabel: 'Mar' },
  { value: 3, label: 'April', shortLabel: 'Apr' },
  { value: 4, label: 'May', shortLabel: 'May' },
  { value: 5, label: 'June', shortLabel: 'Jun' },
  { value: 6, label: 'July', shortLabel: 'Jul' },
  { value: 7, label: 'August', shortLabel: 'Aug' },
  { value: 8, label: 'September', shortLabel: 'Sep' },
  { value: 9, label: 'October', shortLabel: 'Oct' },
  { value: 10, label: 'November', shortLabel: 'Nov' },
  { value: 11, label: 'December', shortLabel: 'Dec' }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'entry', label: 'Entry', icon: '✍️' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'reports', label: 'Reports', icon: '📑' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
];

export const STORAGE_KEY = 'skybar.finance.entries.v1';
