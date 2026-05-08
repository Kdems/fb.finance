(function exposeDashboard(global) {
  'use strict';

  const calculations = global.SkybarCalculations;
  const filters = global.SkybarFilters;

  function renderKpis(rows) {
    const metrics = calculations.aggregate(rows);
    const cards = [
      { label: 'Net revenue', value: calculations.currency(metrics.revenue), delta: `${metrics.ebitdaMargin.toFixed(1)}% EBITDA margin`, tone: metrics.ebitdaMargin >= 14 ? 'positive' : 'negative' },
      { label: 'Prime cost', value: calculations.currency(metrics.primeCost), delta: `${metrics.primeCostRatio.toFixed(1)}% of sales`, tone: metrics.primeCostRatio <= 62 ? 'positive' : 'negative' },
      { label: 'Gross profit', value: calculations.currency(metrics.grossProfit), delta: `${calculations.percent(metrics.grossProfit, metrics.revenue).toFixed(1)}% gross margin`, tone: 'positive' },
      { label: 'Cash reserve', value: calculations.currency(metrics.cashReserve), delta: `${metrics.cashRunwayDays} operating days`, tone: metrics.cashRunwayDays >= 45 ? 'positive' : 'negative' },
    ];

    document.getElementById('kpiGrid').innerHTML = cards.map((card) => `
      <article class="kpi-card ${card.tone}">
        <span class="kpi-label">${card.label}</span>
        <strong>${card.value}</strong>
        <small>${card.delta}</small>
      </article>
    `).join('');
  }

  function renderRevenueMix(rows) {
    const mix = calculations.revenueMix(rows);
    const max = Math.max(...mix.map((item) => item.value), 1);
    document.getElementById('revenueMixChart').innerHTML = mix.map((item) => `
      <div class="chart-row">
        <span class="chart-label">${item.label}</span>
        <span class="chart-track"><span class="chart-fill" style="width: ${(item.value / max) * 100}%"></span></span>
        <span class="chart-value">${calculations.compactCurrency(item.value)}</span>
      </div>
    `).join('');
  }

  function renderCostRatios(rows) {
    const metrics = calculations.aggregate(rows);
    const ratios = [
      { label: 'Food cost', value: metrics.foodCostRatio, target: 29 },
      { label: 'Beverage cost', value: metrics.beverageCostRatio, target: 18 },
      { label: 'Labor cost', value: metrics.laborRatio, target: 31 },
      { label: 'Prime cost', value: metrics.primeCostRatio, target: 62 },
    ];

    document.getElementById('costRatioList').innerHTML = ratios.map((ratio) => {
      const tone = ratio.value > ratio.target + 3 ? 'danger' : ratio.value > ratio.target ? 'warning' : '';
      return `
        <div class="ratio-item">
          <div class="ratio-line"><span>${ratio.label}</span><strong>${ratio.value.toFixed(1)}%</strong></div>
          <div class="ratio-meter"><span class="${tone}" style="width: ${Math.min(ratio.value, 100)}%"></span></div>
          <small>Target: ${ratio.target.toFixed(1)}%</small>
        </div>
      `;
    }).join('');
  }

  function renderTable(rows) {
    document.getElementById('pnlTableBody').innerHTML = rows.map((row) => {
      const primeCost = row.foodCost + row.beverageCost + row.laborCost;
      const ebitda = row.totalRevenue - primeCost - row.operatingExpenses;
      return `
        <tr>
          <td>${filters.monthNames[row.month - 1]} ${row.year}</td>
          <td>${calculations.currency(row.totalRevenue)}</td>
          <td>${calculations.currency(primeCost)}</td>
          <td>${calculations.currency(ebitda)}</td>
          <td>${calculations.currency(row.cashReserve)}</td>
        </tr>
      `;
    }).join('');
  }

  function renderCash(rows) {
    const metrics = calculations.aggregate(rows);
    document.getElementById('cashRunwayCard').innerHTML = `
      <div class="cash-figure">${metrics.cashRunwayDays} days</div>
      <p>Runway is calculated from current cash reserve divided by average daily prime cost and operating expenses for the selected period.</p>
      <div class="cash-stack">
        <div><span>Cash reserve</span><strong>${calculations.currency(metrics.cashReserve)}</strong></div>
        <div><span>Monthly operating expense</span><strong>${calculations.currency(metrics.operatingExpenses)}</strong></div>
        <div><span>EBITDA</span><strong>${calculations.currency(metrics.ebitda)}</strong></div>
      </div>
    `;
  }

  function renderAlerts(rows) {
    const metrics = calculations.aggregate(rows);
    const alerts = [];
    if (metrics.primeCostRatio > 62) alerts.push(`Prime cost is ${metrics.primeCostRatio.toFixed(1)}% of sales; review purchasing and labor schedules.`);
    if (metrics.cashRunwayDays < 45) alerts.push(`Cash runway is ${metrics.cashRunwayDays} days; tighten discretionary spending and deposit collection.`);
    if (!alerts.length) alerts.push('Financial controls are within approved operating thresholds for the selected period.');
    document.getElementById('financeAlerts').innerHTML = alerts.map((alert) => `<div class="alert-item">${alert}</div>`).join('');
  }

  function render(rows, selectedFilters) {
    const filteredRows = filters.apply(rows, selectedFilters);
    const displayRows = filteredRows.length ? filteredRows : rows;
    document.getElementById('selectedPeriodLabel').textContent = filters.label(selectedFilters);
    renderAlerts(displayRows);
    renderKpis(displayRows);
    renderRevenueMix(displayRows);
    renderCostRatios(displayRows);
    renderTable(displayRows);
    renderCash(displayRows);
  }

  global.SkybarDashboard = { render };
})(window);
