import { renderShell, bindLayoutEvents } from './components/layout.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderEntry, bindEntryEvents } from './pages/entry.js';
import { renderAnalytics, renderReports, renderSettings } from './pages/placeholder.js';
import { createAppState } from './state/appState.js';
import { qs, setHTML } from './utils/dom.js';

const appState = createAppState();
const app = qs('#app');

const pageRenderers = {
  dashboard: renderDashboard,
  entry: renderEntry,
  analytics: renderAnalytics,
  reports: renderReports,
  settings: renderSettings
};

appState.subscribe((state) => {
  setHTML(app, renderShell(state));
  bindLayoutEvents(appState);

  const renderPage = pageRenderers[state.activePage] || renderDashboard;
  setHTML(qs('#page'), renderPage(state));

  if (state.activePage === 'entry') {
    bindEntryEvents(appState);
  }
});
