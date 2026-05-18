export const CSS = `
:root {
  --blue-950: #020d24;
  --blue-900: #041535;
  --blue-800: #0a2356;
  --blue-700: #103585;
  --blue-600: #1649b8;
  --blue-500: #1d5fe8;
  --blue-400: #4d82f0;
  --blue-300: #87aaF5;
  --blue-200: #bdd0fb;
  --blue-100: #dce8fd;
  --blue-50:  #eef4ff;
  --blue-25:  #f7faff;
  --white: #ffffff;
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-150: #eaeff6;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;
  --green-600: #059669;
  --green-500: #10b981;
  --green-100: #d1fae5;
  --green-50:  #ecfdf5;
  --amber-600: #d97706;
  --amber-500: #f59e0b;
  --amber-100: #fef3c7;
  --amber-50:  #fffbeb;
  --red-600: #dc2626;
  --red-500: #ef4444;
  --red-100: #fee2e2;
  --red-50:  #fef2f2;
  --purple-500: #8b5cf6;
  --purple-100: #ede9fe;
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius: 12px;
  --radius-lg: .375rem;
  --radius-xl: 20px;
  --shadow-xs: 0 1px 2px rgba(0,0,0,.05);
  --shadow-sm: 0 1px 4px rgba(0,0,0,.06), 0 2px 8px rgba(0,0,0,.04);
  --shadow: 0 4px 16px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.05);
  --shadow-md: 0 8px 24px rgba(0,0,0,.10), 0 2px 6px rgba(0,0,0,.06);
  --shadow-lg: 0 16px 48px rgba(0,0,0,.12), 0 4px 12px rgba(0,0,0,.07);
  --sidebar-w: 232px;
  --topbar-h: 58px;
}

/* ═══════════════════════════════
   MAIN
═══════════════════════════════ */
..main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ── Topbar ── */
.view-timesheet-main .topbar {
  height: var(--topbar-h);
  background: white;
  border-bottom: 1px solid var(--gray-200);
  display: flex; align-items: center;
  padding: 0 28px; gap: 12px;
  position: sticky; top: 0; z-index: 50;
}

.view-timesheet-main .breadcrumb {
  display: flex; align-items: center; gap: 7px;
  font-size: 13px;
}

.view-timesheet-main .bc-link { color: var(--blue-500); font-weight: 500; cursor: pointer; text-decoration: none; }
.view-timesheet-main .bc-link:hover { text-decoration: underline; }
.view-timesheet-main .bc-sep { color: var(--gray-300); }
.view-timesheet-main .bc-current { color: var(--gray-700); font-weight: 600; }

.view-timesheet-main .topbar-right {
  margin-left: auto;
  display: flex; align-items: center; gap: 8px;
}

.view-timesheet-main .btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: var(--radius-sm);
   font-size: 13px; font-weight: 600;
  cursor: pointer; border: none; transition: all .15s;
  white-space: nowrap;
}
.view-timesheet-main .btn svg { width: 14px; height: 14px; }

.view-timesheet-main .btn-primary {
  background: var(--blue-500); color: white;
  box-shadow: 0 2px 8px rgba(29,95,232,.3);
}
.view-timesheet-main .btn-primary:hover { background: var(--blue-600); box-shadow: 0 4px 12px rgba(29,95,232,.4); transform: translateY(-1px); }

.view-timesheet-main .btn-outline {
  background: white; color: var(--gray-700);
  border: 1.5px solid var(--gray-200);
}
.view-timesheet-main .btn-outline:hover { border-color: var(--gray-300); background: var(--gray-50); }

.view-timesheet-main .btn-ghost {
  background: transparent; color: var(--gray-600);
  padding: 7px 10px;
}
.view-timesheet-main .btn-ghost:hover { background: var(--gray-100); color: var(--gray-800); }

.view-timesheet-main .icon-btn {
  width: 34px; height: 34px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: none; cursor: pointer;
  color: var(--gray-500); transition: all .15s;
}
.view-timesheet-main .icon-btn:hover { background: var(--gray-100); color: var(--gray-700); }
.view-timesheet-main .icon-btn svg { width: 17px; height: 17px; }
.view-timesheet-main .icon-btn.has-notif { position: relative; }
.view-timesheet-main .icon-btn.has-notif::after {
  content: ''; position: absolute; top: 6px; right: 6px;
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--red-500); border: 2px solid white;
}

/* ═══════════════════════════════
   PAGE
═══════════════════════════════ */

/* ── Page Header ── */
.view-timesheet-main .page-head {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 22px;
}

.view-timesheet-main .page-title-wrap { flex: 1; }

.view-timesheet-main .page-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 1px;
  text-transform: uppercase; color: var(--blue-500);
  margin-bottom: 3px;
}

.view-timesheet-main .page-title {
  font-size: 20px; font-weight: 800;
  color: var(--gray-900); letter-spacing: -.3px;
}

.view-timesheet-main .page-title em {
  font-family: var(--font-display);
  font-style: italic; font-weight: 400;
  color: var(--blue-500);
}

.view-timesheet-main .status-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: .375rem;
  font-size: 12px; font-weight: 600;
}

.view-timesheet-main .status-badge .dot { width: 7px; height: 7px; border-radius: 50%; }
.view-timesheet-main .status-open { background: var(--green-50); color: var(--green-600); border: 1px solid rgba(16,185,129,.2); }
.view-timesheet-main .status-open .dot { background: var(--green-500); }
.view-timesheet-main .status-inprogress, .view-timesheet-main .status-in, .view-timesheet-main .status-In  { background: #eff6ff; color: #2563eb; border: 1px solid #2563eb; }
.view-timesheet-main .status-inprogress .dot, .view-timesheet-main .status-in .dot, .view-timesheet-main .status-In .dot { background: #2563eb; }
.view-timesheet-main .status-closed .dot{ background: var(--red-600); }
.view-timesheet-main .status-closed { background: var(--red-50); color: var(--red-600); border: 1px solid rgba(239,68,68,.2); }
.view-timesheet-main .status-pending { background: var(--amber-50); color: var(--amber-600); border: 1px solid rgba(245,158,11,.2); }
.view-timesheet-main .status-pending .dot{ background: var(--amber-600); }

/* ═══════════════════════════════
   STAT CARDS
═══════════════════════════════ */
.view-timesheet-main .stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 22px;
}

.view-timesheet-main .stat-card {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
  padding: 18px 20px;
  display: flex; align-items: flex-start; gap: 14px;
  position: relative; overflow: hidden;
  transition: box-shadow .2s, transform .2s;
  animation: slideUp .4s ease both;
}

.view-timesheet-main .stat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

.stat-card:nth-child(1) { animation-delay: .05s; }
.stat-card:nth-child(2) { animation-delay: .10s; }
.stat-card:nth-child(3) { animation-delay: .15s; }
.stat-card:nth-child(4) { animation-delay: .20s; }

.view-timesheet-main .stat-icon-wrap {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.stat-icon-wrap svg { width: 22px; height: 22px; }
.sic-blue { background: var(--blue-50); color: var(--blue-500); }
.sic-green { background: var(--green-50); color: var(--green-500); }
.sic-amber { background: var(--amber-50); color: var(--amber-500); }
.sic-purple { background: var(--purple-100); color: var(--purple-500); }

.stat-body { flex: 1; min-width: 0; }
.stat-label { font-size: 11.5px; font-weight: 600; color: var(--gray-500); margin-bottom: 4px; text-transform: uppercase; letter-spacing: .4px; }
.stat-value { font-size: 26px; font-weight: 800; color: var(--gray-900); letter-spacing: -.5px; line-height: 1; }
.stat-value .unit { font-size: 14px; font-weight: 500; color: var(--gray-500); letter-spacing: 0; }
.stat-sub { font-size: 11.5px; color: var(--gray-400); margin-top: 5px; }
.stat-sub strong { color: var(--gray-600); }

.stat-progress-track {
  width: 100%; height: 4px; background: var(--gray-100);
  border-radius: 4px; overflow: hidden; margin-top: 10px;
}
.stat-progress-fill { height: 100%; border-radius: 4px; transition: width .8s cubic-bezier(.4,0,.2,1); }

.stat-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
}
.sc-blue::before { background: linear-gradient(90deg, var(--blue-400), var(--blue-600)); }
.sc-green::before { background: linear-gradient(90deg, var(--green-500), #06b6d4); }
.sc-amber::before { background: linear-gradient(90deg, var(--amber-500), #f97316); }
.sc-purple::before { background: linear-gradient(90deg, var(--purple-500), #ec4899); }

/* ═══════════════════════════════
   DETAIL PANEL
═══════════════════════════════ */
.detail-panel {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
  margin-bottom: 18px;
  overflow: hidden;
  animation: slideUp .4s .25s ease both;
}

.detail-panel-head {
  padding: 14px 22px;
  border-bottom: 1px solid var(--gray-100);
  display: flex; align-items: center; gap: 10px;
}

.detail-panel-title {
  font-size: 13.5px; font-weight: 700;
  color: var(--gray-700); flex: 1;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}

.detail-item {
  padding: 16px 22px;
  border-right: 1px solid var(--gray-100);
  display: flex; align-items: flex-start; gap: 12px;
  transition: background .12s;
}
.detail-item:hover { background: var(--blue-25); }
.detail-item:last-child, .detail-item:nth-child(3) { border-right: none; }
.detail-item:nth-child(4), .detail-item:nth-child(5), .detail-item:nth-child(6) {
  border-top: 1px solid var(--gray-100);
}

.di-icon {
  width: 32px; height: 32px; border-radius: 8px;
  background: var(--blue-50); color: var(--blue-400);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.di-icon svg { width: 15px; height: 15px; }

.di-body {}
.di-label { font-size: 11px; font-weight: 600; color: var(--gray-400); text-transform: uppercase; letter-spacing: .5px; margin-bottom: 3px; }
.di-value { font-size: 13.5px; font-weight: 600; color: var(--gray-800); }
.di-value.mono { font-variant-numeric: tabular-nums; }

/* ═══════════════════════════════
   TABS
═══════════════════════════════ */
.tabs-bar {
  display: flex; align-items: center;
  border-bottom: 2px solid var(--gray-200);
  margin-bottom: 18px;
  gap: 0;
}

.tab-btn {
  padding: 11px 22px;
   font-size: 13.5px; font-weight: 600;
  color: var(--gray-500); background: transparent; border: none;
  cursor: pointer; position: relative; transition: color .15s;
  display: flex; align-items: center; gap: 7px;
  white-space: nowrap;
}
.tab-btn svg { width: 14px; height: 14px; }
.tab-btn::after {
  content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
  height: 2px; border-radius: 2px 2px 0 0;
  background: var(--blue-500); transform: scaleX(0); transition: transform .2s;
}
.tab-btn:hover { color: var(--gray-700); }
.tab-btn.active { color: var(--blue-600); }
.tab-btn.active::after { transform: scaleX(1); }

.tab-count {
  font-size: 10.5px; font-weight: 700;
  background: var(--blue-100); color: var(--blue-600);
  padding: 1px 6px; border-radius: 10px;
}

.view-panel { display: none; }
.view-panel.active { display: block; animation: fadeIn .25s ease; }
@keyframes fadeIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform: translateY(0); } }

/* ═══════════════════════════════
   TASK ASSIGNMENT DETAILS
═══════════════════════════════ */
.task-section { margin-bottom: 10px; }

.task-group {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 10px;
  transition: box-shadow .15s;
}
.task-group:hover { box-shadow: var(--shadow-sm); }

.task-group-header {
  padding: 14px 18px;
  display: flex; align-items: center; gap: 12px;
  cursor: pointer;
  transition: background .12s;
  position: relative;
}
.task-group-header:hover { background: var(--blue-25); }

.task-num {
  width: 26px; height: 26px; border-radius: 7px;
  background: var(--blue-500); color: white;
  font-size: 12px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.task-group-name {
  font-size: 13px; font-weight: 700; color: var(--gray-800);
}

.task-group-code {
  font-size: 10px; font-weight: 600;
  background: var(--blue-50); color: var(--blue-600);
  padding: 2px 7px; border-radius: 4px; border: 1px solid var(--blue-100);
}

.task-meta-chips {
  display: flex; align-items: center; gap: 8px; margin-left: 4px;
}

.meta-chip {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; color: var(--gray-500);
}
.meta-chip strong { color: var(--gray-700); }

.meta-sep { color: var(--gray-300); font-size: 12px; }

.tg-right {
  margin-left: auto;
  display: flex; align-items: center; gap: 8px;
}

.sub-tasks-badge {
  font-size: 10px; font-weight: 600;
  border: 1.5px solid var(--gray-200);
  color: var(--gray-600); padding: 3px 9px; border-radius: 6px;
  cursor: pointer; transition: all .15s;
}
.sub-tasks-badge:hover { border-color: var(--blue-300); color: var(--blue-500); }

.chevron {
  width: 20px; height: 20px;
  color: var(--gray-400);
  transition: transform .2s;
}
.chevron.open { transform: rotate(180deg); }

/* ── Subtask header ── */
.subtask-wrap {
  border-top: 1px solid var(--gray-100);
  background: var(--gray-50);
}

.subtask-item {
  border-bottom: 1px solid var(--gray-100);
}
.subtask-item:last-child { border-bottom: none; }

.subtask-header {
  padding: 11px 18px 11px 5px;
  display: flex; align-items: center; gap: 10px;
  cursor: pointer;
  transition: background .12s;
}
.subtask-header:hover { background: var(--blue-25); }

.subtask-num {
  font-size: 11.5px; font-weight: 700; color: var(--blue-500);
  background: var(--blue-50); border: 1px solid var(--blue-100);
  padding: 2px 7px; border-radius: 5px;
}

.subtask-name { font-size: 13px; font-weight: 600; color: var(--gray-700); }

.subtask-code {
  font-size: 10px; font-weight: 600;
  background: white; color: var(--gray-500);
  padding: 2px 7px; border-radius: 4px; border: 1px solid var(--gray-200);
}

/* ── Employee Table ── */
.emp-table-wrap {
  overflow-x: auto;
  background: white;
  border-top: 1px solid var(--gray-100);
}

.emp-table {
  width: 100%;
  border-collapse: collapse;
}

.emp-table th {
  padding: 10px 16px;
  text-align: left;
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .6px;
  color: var(--gray-500);
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
  white-space: nowrap;
}

.emp-table td {
  padding: 9px 15px;
  font-size: 11px;
  color: var(--gray-700);
  border-bottom: 1px solid var(--gray-100);
  vertical-align: middle;
}

.emp-table tbody tr:last-child td { border-bottom: none; }
.emp-table tbody tr { transition: background .1s; }
.emp-table tbody tr:hover { background: var(--blue-25); }

.emp-name-cell {
  display: flex; align-items: center; gap: 10px;
}

.emp-avatar {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: white; flex-shrink: 0;
}

.emp-name { font-weight: 600; color: var(--gray-800); }

.work-status-pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 6px;
  font-size: 10px; font-weight: 600;
}
.ws-not-started { background: var(--gray-100); color: var(--gray-600); }
.ws-in-progress { background: var(--blue-50); color: var(--blue-600); border: 1px solid var(--blue-100); }
.ws-completed { background: var(--green-50); color: var(--green-600); border: 1px solid var(--green-100); }
.ws-on-hold { background: var(--amber-50); color: var(--amber-600); border: 1px solid var(--amber-100); }

.indicator-cell { display: flex; align-items: center; gap: 10px; }
.indicator-bar {
  width: 80px; height: 6px;
  background: var(--gray-150); border-radius: 6px; overflow: hidden;
  flex-shrink: 0;
}
.indicator-fill { height: 100%; border-radius: 6px; }
.fill-ok { background: var(--blue-400); }
.fill-warn { background: var(--amber-500); }
.fill-done { background: var(--green-500); }
.fill-zero { background: var(--gray-300); }

.indicator-text { font-size: 12px; color: var(--gray-600); font-weight: 500; white-space: nowrap; }
.indicator-pct { font-size: 11px; color: var(--gray-400); }

.risk-dot {
  width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0;
  position: relative;
}
.risk-dot::after {
  content: '';
  position: absolute; inset: -3px;
  border-radius: 50%; opacity: .25;
}
.risk-high { background: var(--red-500); }
.risk-high::after { background: var(--red-500); }
.risk-medium { background: var(--amber-500); }
.risk-medium::after { background: var(--amber-500); }
.risk-low { background: var(--green-500); }
.risk-low::after { background: var(--green-500); }
.risk-none { background: var(--gray-300); }

.risk-cell { display: flex; align-items: center; gap: 6px; }
.risk-label { font-size: 11.5px; color: var(--gray-500); font-weight: 500; }

/* Row actions */
.row-actions-cell { display: flex; align-items: center; gap: 4px; }
.ra-btn {
  width: 28px; height: 28px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: none; cursor: pointer;
  color: var(--gray-400); transition: all .12s;
}
.ra-btn:hover { background: var(--gray-100); color: var(--gray-600); }
.ra-btn svg { width: 13px; height: 13px; }

/* Log time inline btn */
.log-time-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 11px; border-radius: 6px;
  font-size: 12px; font-weight: 600;
  background: var(--blue-50); color: var(--blue-600);
  border: 1px solid var(--blue-100); cursor: pointer;
  transition: all .15s;
}
.log-time-btn:hover { background: var(--blue-100); border-color: var(--blue-200); }
.log-time-btn svg { width: 12px; height: 12px; }

/* today line */
.today-line {
  position: absolute; top: 0; bottom: 0; width: 2px;
  background: var(--red-500); opacity: .6; pointer-events: none; z-index: 5;
}
.today-label {
  position: absolute; top: -18px; transform: translateX(-50%);
  font-size: 9px; font-weight: 700; color: var(--red-500);
  white-space: nowrap; background: white; padding: 1px 4px; border-radius: 3px;
}

/* dependency arrow */
.dep-arrow { position: absolute; pointer-events: none; z-index: 4; }
.box-min-height{
max-height: 310px;
    overflow: auto;
    padding-right: 5px;
	&::-webkit-scrollbar {
		width: 6px;
	}

	&::-webkit-scrollbar-track {
		background-color: var(--theme-lightgrey-color);
	}

	&::-webkit-scrollbar-thumb {
		background-color: var(--theme-primary-color);
	}
}
    .ms-side{margin-left:30px;
    }
    /* ═══════════════════════════════
   RESPONSIVE BREAKPOINTS
═══════════════════════════════ */

/* ──────────────────────────────
   LARGE TABLET (≤1200px)
────────────────────────────── */
@media (max-width: 1200px) {

  .view-timesheet-main .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .detail-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .detail-item:nth-child(3),
  .detail-item:nth-child(6) {
    border-right: none;
  }

  .detail-item:nth-child(4) {
    border-top: 1px solid var(--gray-100);
  }

}

/* ──────────────────────────────
   TABLET (≤992px)
────────────────────────────── */
@media (max-width: 992px) {

  .view-timesheet-main .topbar {
    padding: 0 16px;
  }

  .view-timesheet-main .stats-grid {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-item {
    border-right: none !important;
    border-top: 1px solid var(--gray-100);
  }

  .tabs-bar {
    overflow-x: auto;
    scrollbar-width: none;
  }

  .tabs-bar::-webkit-scrollbar {
    display: none;
  }

  .tab-btn {
    padding: 10px 14px;
    font-size: 12px;
  }

  .task-group-header {
    flex-wrap: wrap;
    gap: 8px;
  }

  .tg-right {
    width: 100%;
    justify-content: space-between;
    margin-left: 0;
  }

  .task-meta-chips {
    flex-wrap: wrap;
  }

}

/* ──────────────────────────────
   MOBILE (≤768px)
────────────────────────────── */
@media (max-width: 768px) {

  .view-timesheet-main .page-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .view-timesheet-main .page-title {
    font-size: 18px;
  }

  .view-timesheet-main .btn {
    font-size: 12px;
    padding: 6px 10px;
  }

  .view-timesheet-main .topbar-right {
    gap: 6px;
  }

  .task-group-header {
    padding: 12px;
  }

  .task-group-name {
    font-size: 13px;
  }

  .task-group-code {
    font-size: 10px;
  }

  .subtask-header {
    padding: 10px 12px 10px 5px;
  }

  .emp-table th,
  .emp-table td {
    padding: 8px 10px;
    font-size: 12px;
  }

  .indicator-bar {
    width: 60px;
  }

  .box-min-height {
    max-height: 250px;
  }

}

/* ──────────────────────────────
   SMALL MOBILE (≤576px)
────────────────────────────── */
@media (max-width: 576px) {

  .view-timesheet-main .topbar {
    flex-wrap: wrap;
    height: auto;
    padding: 10px 12px;
  }

  .view-timesheet-main .breadcrumb {
    flex-wrap: wrap;
  }

  .view-timesheet-main .btn {
    font-size: 11px;
    padding: 5px 8px;
  }

  .stat-card {
    padding: 14px;
  }

  .stat-value {
    font-size: 20px;
  }

  .task-group-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .tg-right {
    width: 100%;
    justify-content: space-between;
  }

  .subtask-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .emp-table-wrap {
    overflow-x: auto;
  }

  .emp-table {
    min-width: 600px; /* keeps table readable */
  }

}
`