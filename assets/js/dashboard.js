(function exposeDashboard(global) {
  'use strict';

  const calculations = global.SkybarCalculations;
  const chartRegistry = new Map();

  const ids = {
    dailyRevenue: 'kpiDailyRevenue',
    mtdRevenue: 'kpiMtdRevenue',
    foodRevenue: 'kpiFoodRevenue',
    beverageRevenue: 'kpiBeverageRevenue',
    foodCostPercent: 'kpiFoodCostPercent',
    beverageCostPercent: 'kpiBeverageCostPercent',
    fixedCostPercent: 'kpiFixedCostPercent',
    gop: 'kpiGop',
    budgetVariance: 'kpiBudgetVariance',
  };

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function setTone(element, value) {
    if (!element) return;
    element.classList.remove('positive', 'negative', 'neutral');
    element.classList.add(value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral');
  }

  function clearCanvas(canvas, message = 'Add daily entries to activate this chart.') {
    if (!canvas || !canvas.getContext) return;
    const parentWidth = canvas.parentElement?.clientWidth || 640;
    const height = canvas.parentElement?.clientHeight || 260;
    const ratio = global.devicePixelRatio || 1;
    canvas.width = parentWidth * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${parentWidth}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.clearRect(0, 0, parentWidth, height);
    ctx.fillStyle = '#97a9bf';
    ctx.font = '700 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(message, parentWidth / 2, height / 2);
  }

  function drawAxes(ctx, width, height, padding) {
    ctx.strokeStyle = 'rgba(161, 184, 216, 0.18)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i += 1) {
      const y = padding.top + ((height - padding.top - padding.bottom) / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }
  }

  function installTooltip(canvas, points, formatter) {
    if (!canvas || !canvas.parentElement) return;
    let tooltip = canvas.parentElement.querySelector('.chart-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'chart-tooltip';
      canvas.parentElement.append(tooltip);
    }
    const moveHandler = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const nearest = points.reduce((best, point) => {
        const distance = Math.hypot(point.x - x, point.y - y);
        return !best || distance < best.distance ? { point, distance } : best;
      }, null);
      if (!nearest || nearest.distance > 36) {
        tooltip.classList.remove('is-visible');
        return;
      }
      tooltip.innerHTML = formatter(nearest.point.data);
      tooltip.style.left = `${Math.min(rect.width - 150, Math.max(12, nearest.point.x + 12))}px`;
      tooltip.style.top = `${Math.max(12, nearest.point.y - 42)}px`;
      tooltip.classList.add('is-visible');
    };
    const leaveHandler = () => tooltip.classList.remove('is-visible');
    if (chartRegistry.has(canvas.id)) {
      const previous = chartRegistry.get(canvas.id);
      canvas.removeEventListener('mousemove', previous.moveHandler);
      canvas.removeEventListener('mouseleave', previous.leaveHandler);
    }
    canvas.addEventListener('mousemove', moveHandler);
    canvas.addEventListener('mouseleave', leaveHandler);
    chartRegistry.set(canvas.id, { moveHandler, leaveHandler });
  }

  function drawLineChart(canvasId, series, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !canvas.getContext) return;
    if (!series.length) {
      clearCanvas(canvas);
      return;
    }

    const width = canvas.parentElement?.clientWidth || 640;
    const height = canvas.parentElement?.clientHeight || 260;
    const ratio = global.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 22, right: 24, bottom: 34, left: 52 };
    const values = series.map((item) => item.value);
    const min = Math.min(0, ...values);
    const max = Math.max(...values, 1);
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const xStep = series.length > 1 ? plotWidth / (series.length - 1) : 0;
    const yFor = (value) => padding.top + (1 - ((value - min) / (max - min || 1))) * plotHeight;

    drawAxes(ctx, width, height, padding);
    const points = series.map((item, index) => ({
      x: padding.left + (series.length === 1 ? plotWidth / 2 : xStep * index),
      y: yFor(item.value),
      data: item,
    }));

    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, options.fill || 'rgba(100, 216, 203, 0.25)');
    gradient.addColorStop(1, 'rgba(100, 216, 203, 0)');
    ctx.beginPath();
    points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
    ctx.lineTo(points.at(-1).x, height - padding.bottom);
    ctx.lineTo(points[0].x, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
    ctx.strokeStyle = options.color || '#64d8cb';
    ctx.lineWidth = 3;
    ctx.stroke();

    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#07111f';
      ctx.fill();
      ctx.strokeStyle = options.color || '#64d8cb';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    ctx.fillStyle = '#97a9bf';
    ctx.font = '700 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    points.forEach((point, index) => {
      if (series.length <= 8 || index % Math.ceil(series.length / 6) === 0) {
        ctx.fillText(point.data.label, point.x, height - 11);
      }
    });
    ctx.textAlign = 'left';
    ctx.fillText(calculations.currency(max), 8, padding.top + 4);
    ctx.fillText(calculations.currency(min), 8, height - padding.bottom);

    installTooltip(canvas, points, (item) => `<strong>${item.date}</strong><span>${options.label || 'Value'}: ${calculations.currency(item.value)}</span>`);
  }

  function drawGroupedBarChart(canvasId, entries) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !canvas.getContext) return;
    const calculated = entries.map(calculations.calculateEntry).sort((a, b) => a.date.localeCompare(b.date));
    if (!calculated.length) {
      clearCanvas(canvas);
      return;
    }

    const width = canvas.parentElement?.clientWidth || 640;
    const height = canvas.parentElement?.clientHeight || 260;
    const ratio = global.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 22, right: 24, bottom: 38, left: 52 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const max = Math.max(...calculated.flatMap((entry) => [entry.foodRevenue, entry.beverageRevenue]), 1);
    const groupWidth = plotWidth / calculated.length;
    const barWidth = Math.max(8, Math.min(24, groupWidth / 3));
    const points = [];

    drawAxes(ctx, width, height, padding);
    calculated.forEach((entry, index) => {
      const center = padding.left + groupWidth * index + groupWidth / 2;
      [
        { key: 'Food', value: entry.foodRevenue, color: '#64d8cb', offset: -barWidth / 1.7 },
        { key: 'Beverage', value: entry.beverageRevenue, color: '#8fb8ff', offset: barWidth / 1.7 },
      ].forEach((bar) => {
        const barHeight = (bar.value / max) * plotHeight;
        const x = center + bar.offset - barWidth / 2;
        const y = height - padding.bottom - barHeight;
        ctx.fillStyle = bar.color;
        ctx.fillRect(x, y, barWidth, barHeight);
        points.push({ x: x + barWidth / 2, y, data: { date: entry.date, label: bar.key, value: bar.value } });
      });
      ctx.fillStyle = '#97a9bf';
      ctx.font = '700 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      if (calculated.length <= 8 || index % Math.ceil(calculated.length / 6) === 0) ctx.fillText(entry.date.slice(5), center, height - 12);
    });

    installTooltip(canvas, points, (item) => `<strong>${item.date}</strong><span>${item.label}: ${calculations.currency(item.value)}</span>`);
  }

  function updateKpis(entries) {
    const summary = calculations.summarizeEntries(entries);
    setText(ids.dailyRevenue, calculations.currency(summary.dailyRevenue));
    setText(ids.mtdRevenue, calculations.currency(summary.mtdRevenue));
    setText(ids.foodRevenue, calculations.currency(summary.foodRevenue));
    setText(ids.beverageRevenue, calculations.currency(summary.beverageRevenue));
    setText(ids.foodCostPercent, calculations.percent(summary.foodCostPercent));
    setText(ids.beverageCostPercent, calculations.percent(summary.beverageCostPercent));
    setText(ids.fixedCostPercent, calculations.percent(summary.fixedCostPercent));
    setText(ids.gop, calculations.currency(summary.gop));
    setText(ids.budgetVariance, calculations.currency(summary.budgetVariance));

    setTone(document.getElementById(ids.gop)?.closest('.kpi-card'), summary.gop);
    setTone(document.getElementById(ids.budgetVariance)?.closest('.kpi-card'), summary.budgetVariance);
    return summary;
  }

  function actionButton(label, action, date, tone = '') {
    return `<button class="table-action ${tone}" type="button" data-action="${action}" data-date="${date}">${label}</button>`;
  }

  function updateTable(entries) {
    const tbody = document.getElementById('entriesTableBody');
    const emptyState = document.getElementById('emptyState');
    const entryCount = document.getElementById('entryCount');
    const calculatedEntries = entries.map(calculations.calculateEntry).sort((a, b) => b.date.localeCompare(a.date));

    if (entryCount) entryCount.textContent = `${calculatedEntries.length} ${calculatedEntries.length === 1 ? 'entry' : 'entries'}`;
    if (emptyState) emptyState.hidden = calculatedEntries.length > 0;
    if (!tbody) return;

    tbody.innerHTML = calculatedEntries.map((entry) => `
      <tr>
        <td>${entry.date}</td>
        <td>${calculations.currency(entry.totalRevenue)}</td>
        <td>${calculations.currency(entry.totalCost)}</td>
        <td class="${entry.gop >= 0 ? 'value-positive' : 'value-negative'}">${calculations.currency(entry.gop)}</td>
        <td>${actionButton('Edit', 'edit', entry.date)}</td>
        <td>${actionButton('Delete', 'delete', entry.date, 'danger')}</td>
      </tr>
    `).join('');
  }

  function statusForCost(type, value) {
    const thresholds = {
      food: { warning: 35, critical: 40 },
      beverage: { warning: 25, critical: 30 },
      fixed: { warning: 20, critical: 25 },
    }[type];
    if (value > thresholds.critical) return { label: 'Critical', className: 'critical' };
    if (value >= thresholds.warning) return { label: 'Warning', className: 'warning' };
    return { label: 'Healthy', className: 'healthy' };
  }

  function trendLabel(current, previous) {
    const delta = calculations.round(current - previous, 1);
    if (delta === 0) return 'Flat vs previous period';
    return `${delta > 0 ? '+' : ''}${delta.toFixed(1)} pts vs previous period`;
  }

  function updateCostAnalytics(summary, previousSummary) {
    const container = document.getElementById('costAnalytics');
    if (!container) return;
    const cards = [
      { key: 'food', label: 'Food Cost %', value: summary.foodCostPercent, previous: previousSummary.foodCostPercent },
      { key: 'beverage', label: 'Beverage Cost %', value: summary.beverageCostPercent, previous: previousSummary.beverageCostPercent },
      { key: 'fixed', label: 'Fixed Cost %', value: summary.fixedCostPercent, previous: previousSummary.fixedCostPercent },
    ];
    container.innerHTML = cards.map((card) => {
      const status = statusForCost(card.key, card.value);
      return `
        <div class="cost-card ${status.className}">
          <div><span>${card.label}</span><strong>${calculations.percent(card.value)}</strong></div>
          <span class="performance-indicator">${status.label}</span>
          <small>${trendLabel(card.value, card.previous)}</small>
          <div class="cost-meter"><span style="width: ${Math.min(card.value, 100)}%"></span></div>
        </div>
      `;
    }).join('');
  }

  function dayLabel(entry) {
    return entry ? `${entry.date} · ${calculations.currency(entry.gop ?? entry.totalRevenue)}` : 'No entries';
  }

  function updateGopAnalytics(summary) {
    const pill = document.getElementById('gopMarginPill');
    const container = document.getElementById('gopAnalytics');
    if (pill) pill.textContent = `GOP Margin ${calculations.percent(summary.gopMargin)}`;
    if (!container) return;
    container.innerHTML = `
      <div><span>MTD GOP</span><strong>${calculations.currency(summary.gop)}</strong></div>
      <div><span>Best GOP day</span><strong>${dayLabel(summary.bestGopDay)}</strong></div>
      <div><span>Worst GOP day</span><strong>${dayLabel(summary.worstGopDay)}</strong></div>
      <div><span>GOP Margin</span><strong>${calculations.percent(summary.gopMargin)}</strong></div>
    `;
  }

  function updateBudgetAnalytics(summary) {
    const container = document.getElementById('budgetAnalytics');
    if (!container) return;
    const achievement = Math.min(summary.targetAchievementPercent, 140);
    container.innerHTML = `
      <div class="budget-headline ${summary.budgetVariance >= 0 ? 'positive' : 'negative'}">
        <span>Variance Amount</span>
        <strong>${calculations.currency(summary.budgetVariance)}</strong>
      </div>
      <div class="budget-row"><span>Variance %</span><strong>${calculations.percent(summary.budgetVariancePercent)}</strong></div>
      <div class="budget-row"><span>Target Achievement</span><strong>${calculations.percent(summary.targetAchievementPercent)}</strong></div>
      <div class="progress-bar" aria-label="Target achievement progress"><span style="width: ${Math.min(achievement, 100)}%"></span></div>
      <small>${summary.targetAchievementPercent >= 100 ? 'Revenue is above budget target.' : 'Revenue is below budget target.'}</small>
    `;
  }

  function updateSummaryCards(summary) {
    const container = document.getElementById('summaryCards');
    if (!container) return;
    const bestSales = summary.bestSalesDay ? `${summary.bestSalesDay.date} · ${calculations.currency(summary.bestSalesDay.totalRevenue)}` : 'No entries';
    const lowSales = summary.lowestSalesDay ? `${summary.lowestSalesDay.date} · ${calculations.currency(summary.lowestSalesDay.totalRevenue)}` : 'No entries';
    const cards = [
      ['Best sales day', bestSales],
      ['Lowest sales day', lowSales],
      ['Average daily revenue', calculations.currency(summary.averageDailyRevenue)],
      ['Average GOP', calculations.currency(summary.averageGop)],
      ['Average cost %', calculations.percent(summary.averageCostPercent)],
    ];
    container.innerHTML = cards.map(([label, value]) => `<div class="summary-card"><span>${label}</span><strong>${value}</strong></div>`).join('');
  }

  function updateCharts(entries) {
    drawLineChart('dailyRevenueChart', calculations.dailySeries(entries, 'totalRevenue'), { label: 'Revenue', color: '#64d8cb' });
    drawLineChart('mtdRevenueChart', calculations.cumulativeSeries(entries, 'totalRevenue'), { label: 'MTD Revenue', color: '#8fb8ff', fill: 'rgba(143, 184, 255, 0.23)' });
    drawGroupedBarChart('revenueComparisonChart', entries);
    drawLineChart('gopTrendChart', calculations.dailySeries(entries, 'gop'), { label: 'GOP', color: '#74e39a', fill: 'rgba(116, 227, 154, 0.2)' });
  }

  function showMessage(message, type = 'info') {
    const container = document.getElementById('dashboardMessage');
    if (!container) return;
    container.innerHTML = message ? `<div class="alert-item ${type}">${message}</div>` : '';
  }

  function render(entries, options = {}) {
    const summary = updateKpis(entries);
    const previousSummary = calculations.summarizeEntries(options.previousEntries || []);
    updateTable(entries);
    updateCharts(entries);
    updateCostAnalytics(summary, previousSummary);
    updateGopAnalytics(summary);
    updateBudgetAnalytics(summary);
    updateSummaryCards(summary);
  }

  global.SkybarDashboard = { render, showMessage, updateKpis, updateTable };
})(window);
