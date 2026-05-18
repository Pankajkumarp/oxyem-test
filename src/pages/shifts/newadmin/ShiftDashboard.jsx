"use client";

import { useState, useEffect, useRef } from "react";

/* ─── Static seed data ─── */
const STATS_SEED = [
  { label: "Total Shifts",        value: 48,  iconBg: "#e8f0ff", iconColor: "#4f7cfe" },
  { label: "Upcoming Shifts",     value: 15,  iconBg: "#fff3e8", iconColor: "#ff9f43" },
  { label: "Total Employees",     value: 258, iconBg: "#e8fdf2", iconColor: "#1dd1a1" },
  { label: "Overlapping Shifts",  value: 7,   iconBg: "#ffe8f3", iconColor: "#ff6b9d" },
];

const TL_DATES = [
  "Mon, Aug 26","Tue, Aug 27","Wed, Aug 28","Thu, Aug 29",
  "Fri, Aug 30","Sat, Aug 31","Sun, Sep 1","Mon, Sep 2",
];

const TL_EMEA = [
  { left:"0%",  width:"21%", bg:"#4f7cfe", txt:"Morning Shift 6AM"      },
  { left:"25%", width:"27%", bg:"#ff9f43", txt:"Afternoon – Evening 1PM" },
  { left:"57%", width:"19%", bg:"#1dd1a1", txt:"Evening 7PM"             },
  { left:"80%", width:"18%", bg:"#ff6b6b", txt:"Night Shift 10PM"        },
];
const TL_AUS = [
  { left:"20%", width:"23%", bg:"#ff9f43", txt:"Morning Shift 8AM" },
  { left:"52%", width:"21%", bg:"#4f7cfe", txt:"Afternoon 2PM"     },
];

const OVL_PEOPLE_SEED = [
  { id:1, name:"Mary Johnson", role:"Shift Supervisor",  date:"16 Aug 2028", av:"MJ", avBg:"linear-gradient(135deg,#667eea,#764ba2)", btnBg:"#4f7cfe", btnTxt:"Assign New Shift"  },
  { id:2, name:"Alex Brown",   role:"Shift Coordinator", date:"28 Aug 2028", av:"AB", avBg:"linear-gradient(135deg,#f5a623,#f0932b)", btnBg:"#ff9f43", btnTxt:"Resolve Overlap"   },
];

const CAL_SQUARES = [
  "#4f7cfe","#b8cbff","#ff9f43","#4f7cfe","#b8cbff","#1dd1a1","#4f7cfe",
  "#e8edf5","#ff9f43","#4f7cfe","#b8cbff","#1dd1a1","#4f7cfe","#e8edf5",
];

const ALL_TABLE_ROWS = [
  { id:1, region:"EMEA", rBg:"#e8f0ff", rColor:"#4f7cfe", date:"29 Aug 2028", shift:"5:00 AM – 2:00 PM",  employee:"Sarah Chen",    status:"Confirmed" },
  { id:2, region:"US",   rBg:"#e8fdf2", rColor:"#1dd1a1", date:"22 Aug 2028", shift:"9:00 AM – 6:00 PM",  employee:"James Miller",  status:"Pending"   },
  { id:3, region:"AUS",  rBg:"#fff3e8", rColor:"#ff9f43", date:"22 Aug 2028", shift:"8:00 AM – 2:00 PM",  employee:"Emma Wilson",   status:"Confirmed" },
  { id:4, region:"EMEA", rBg:"#e8f0ff", rColor:"#4f7cfe", date:"15 Sep 2028", shift:"5:00 PM – 10:00 PM", employee:"David Clark",   status:"Pending"   },
  { id:5, region:"AUS",  rBg:"#fff3e8", rColor:"#ff9f43", date:"15 Sep 2028", shift:"5:00 AM – 2:00 PM",  employee:"Olivia Brown",  status:"Confirmed" },
  { id:6, region:"US",   rBg:"#e8fdf2", rColor:"#1dd1a1", date:"20 Sep 2028", shift:"8:00 AM – 4:00 PM",  employee:"Liam Johnson",  status:"Confirmed" },
  { id:7, region:"EMEA", rBg:"#e8f0ff", rColor:"#4f7cfe", date:"25 Sep 2028", shift:"6:00 AM – 2:00 PM",  employee:"Ava Martinez",  status:"Cancelled" },
  { id:8, region:"AUS",  rBg:"#fff3e8", rColor:"#ff9f43", date:"01 Oct 2028", shift:"10:00 AM – 6:00 PM", employee:"Noah Davis",    status:"Pending"   },
];

const EMP_SWATCHES = [
  { name:"Alex",  color:"#4f7cfe" },
  { name:"Sarah", color:"#ff9f43" },
  { name:"Mike",  color:"#1dd1a1" },
  { name:"Emma",  color:"#a29bfe" },
];
const EMP_SHIFT_LABELS = ["Morning","Afternoon","Evening","Night"];

const BSI_ROWS = [
  { color:"#4f7cfe", label:"Day Shift – 51%",     pct:"28%", range:"– $235" },
  { color:"#1dd1a1", label:"Evening Shift – 88%", pct:"23%", range:"– 22%"  },
];
const DONUT_LEGEND = [
  { color:"#4f7cfe", label:"Day Shift – 51%"    },
  { color:"#ff9f43", label:"Evening Shift – 33%" },
  { color:"#1dd1a1", label:"Night Shift – 87%"   },
];

/* ─── SVG Icons ─── */
const Ico = ({ d, size=16, color="#4f7cfe", fill="none", sw=2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {typeof d === "string" ? <path d={d}/> : d}
  </svg>
);
const IconClock      = ({color="#4f7cfe",size=16})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconCalendar   = ({color="#4f7cfe",size=16})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconUsers      = ({color="#4f7cfe",size=16})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconBarChart   = ({color="#4f7cfe",size=16})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IconRefresh    = ({color="#ff6b9d",size=16})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
const IconList       = ({color="#4f7cfe",size=14})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const IconGrid       = ({color="#4f7cfe",size=14})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const IconChevDown   = ({color="#4f7cfe",size=12})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const IconTrash      = ({color="#a3aed0",size=13})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>;
const IconDot        = ({color="#4f7cfe",size=13})=><svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><circle cx="12" cy="12" r="5"/></svg>;
const IconX          = ({color="#666",size=14})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconCheck      = ({color="#22c55e",size=14})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconFilter     = ({color="#4f7cfe",size=13})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const IconSearch     = ({color="#a3aed0",size=13})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconDownload   = ({color="#4f7cfe",size=13})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IconEdit       = ({color="#4f7cfe",size=13})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconPlus       = ({color="#fff",size=13})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;

const StatIcon = ({idx,color}) => {
  const icons = [
    <IconClock  color={color} size={20} key="0"/>,
    <IconCalendar color={color} size={20} key="1"/>,
    <IconUsers  color={color} size={20} key="2"/>,
    <IconRefresh color={color} size={20} key="3"/>,
  ];
  return icons[idx] || null;
};

/* ─── Modal Component ─── */
const Modal = ({ title, onClose, children }) => (
  <div style={{
    position:"fixed",inset:0,background:"rgba(27,37,89,0.45)",
    display:"flex",alignItems:"center",justifyContent:"center",
    zIndex:1000,padding:16,backdropFilter:"blur(3px)"
  }} onClick={onClose}>
    <div style={{
      background:"#fff",borderRadius:16,padding:24,width:"100%",maxWidth:480,
      boxShadow:"0 20px 60px rgba(0,0,0,0.2)",position:"relative",maxHeight:"90vh",overflowY:"auto"
    }} onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div style={{fontSize:15,fontWeight:700,color:"#1b2559"}}>{title}</div>
        <button onClick={onClose} style={{background:"#f2f5ff",border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <IconX color="#1b2559" size={14}/>
        </button>
      </div>
      {children}
    </div>
  </div>
);

/* ─── Toast ─── */
const Toast = ({ msg, type, onClose }) => (
  <div style={{
    position:"fixed",bottom:24,right:24,zIndex:2000,
    background: type==="success"?"#22c55e":type==="error"?"#ef4444":"#4f7cfe",
    color:"#fff",borderRadius:10,padding:"10px 16px",fontSize:12,fontWeight:600,
    boxShadow:"0 4px 20px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",gap:8,
    animation:"slideIn .25s ease"
  }}>
    {type==="success"?<IconCheck color="#fff" size={14}/>:<IconX color="#fff" size={14}/>}
    {msg}
    <button onClick={onClose} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",marginLeft:4,padding:0}}>
      <IconX color="#fff" size={11}/>
    </button>
  </div>
);

/* ─── CSS ─── */
const CSS = `
  @keyframes slideIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  .sd-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:14px; }
  .sd-stat  {
    background:#fff; border-radius:.475rem; padding:14px 16px;
    display:flex; align-items:center; justify-content:space-between;
    box-shadow:0 1px 8px rgba(0,0,0,0.06); gap:10px; min-width:0;
    cursor:pointer; transition:transform .15s, box-shadow .15s;
  }
  .sd-stat:hover { transform:translateY(-2px); box-shadow:0 4px 16px rgba(79,124,254,0.12); }
  .sd-stat-label { font-size:.75rem; color:#a3aed0; font-weight:500; margin-bottom:4px; }
  .sd-stat-value { font-size:1.85rem; font-weight:700; color:#1b2559; line-height:1; }
  .sd-stat-icon  { width:44px; height:44px; border-radius:.475rem; flex-shrink:0; display:flex; align-items:center; justify-content:center; }

  /* Timeline */
  .sd-timeline { background:#fff; border-radius:.475rem; padding:14px 16px; margin-bottom:14px; box-shadow:0 1px 8px rgba(0,0,0,0.06); }
  .tl-header { display:flex; align-items:center; gap:8px; margin-bottom:10px; flex-wrap:wrap; }
  .tl-back   { font-size:11px; color:#a3aed0; cursor:pointer; padding:2px 6px; border-radius:6px; transition:background .15s; }
  .tl-back:hover { background:#f2f5ff; }
  .tl-title  { font-weight:700; font-size:13px; color:#1b2559; }
  .tl-sub    { font-size:11px; color:#a3aed0; }
  .tl-nav    { display:flex; gap:4px; margin-left:auto; }
  .tl-nav-btn{
    background:#f2f5ff; border:none; border-radius:6px; width:24px; height:24px;
    cursor:pointer; font-size:13px; color:#4f7cfe; display:flex; align-items:center;
    justify-content:center; font-weight:700; transition:background .15s;
  }
  .tl-nav-btn:hover { background:#e8f0ff; }
  .tl-close  { background:none; border:none; font-size:15px; color:#a3aed0; cursor:pointer; margin-left:2px; transition:color .15s; }
  .tl-close:hover { color:#ef4444; }
  .tl-scroll { overflow-x:auto; }
  .tl-dates  { display:flex; min-width:600px; border-bottom:1px solid #f2f5ff; padding-bottom:6px; margin-bottom:8px; }
  .tl-date   { flex:1; font-size:10px; color:#a3aed0; text-align:center; white-space:nowrap; }
  .tl-rows   { min-width:600px; }
  .tl-row    { display:flex; align-items:center; gap:8px; padding:4px 0; }
  .tl-region { font-size:11px; font-weight:700; color:#1b2559; width:38px; flex-shrink:0; }
  .tl-track  { flex:1; position:relative; height:26px; }
  .tl-block  {
    position:absolute; height:100%; border-radius:6px; display:flex; align-items:center;
    padding:0 8px; font-size:9px; color:#fff; font-weight:600; white-space:nowrap;
    overflow:hidden; cursor:pointer; transition:opacity .15s, filter .15s;
  }
  .tl-block:hover { opacity:.85; filter:brightness(1.05); }

  /* Grid rows */
  .sd-2col      { display:grid; grid-template-columns:1fr 1fr;   gap:14px; margin-bottom:14px; }
  .sd-2col-wide { display:grid; grid-template-columns:1.4fr 1fr; gap:14px; margin-bottom:14px; }

  /* Card */
  .sd-card { background:#fff; border-radius:.475rem; padding:14px 16px; box-shadow:0 1px 8px rgba(0,0,0,0.06); min-width:0; }
  .sd-card-title { font-size:.9rem; font-weight:700; color:#1b2559; display:flex; align-items:center; gap:6px; margin-bottom:12px; }
  .sd-card-title-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; flex-wrap:wrap; gap:6px; }
  .nav-btn  { background:#f2f5ff; border:none; border-radius:6px; padding:3px 8px; cursor:pointer; font-size:12px; color:#4f7cfe; font-weight:700; transition:background .15s; }
  .nav-btn:hover { background:#e8f0ff; }
  .icon-btn { background:#f2f5ff; border:none; border-radius:6px; width:26px; height:26px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; }
  .icon-btn:hover { background:#e8f0ff; }
  .icon-btn.active { background:#4f7cfe; }
  .badge-blue { background:#e8f0ff; color:#4f7cfe; font-size:10px; padding:3px 8px; border-radius:20px; font-weight:600; display:flex; align-items:center; gap:3px; cursor:pointer; transition:background .15s; }
  .badge-blue:hover { background:#d0e4ff; }

  /* Overlap items */
  .ovl-item { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid #f2f5ff; }
  .ovl-item:last-child { border-bottom:none; }
  .ovl-avatar { width:36px; height:36px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:11px; }
  .ovl-name { font-size:12px; font-weight:600; color:#1b2559; }
  .ovl-role { font-size:10px; color:#a3aed0; }
  .ovl-date { font-size:10px; color:#a3aed0; white-space:nowrap; flex-shrink:0; }
  .ovl-btn  { color:#fff; border:none; border-radius:8px; padding:6px 12px; font-size:10px; font-weight:600; cursor:pointer; white-space:nowrap; flex-shrink:0; transition:filter .15s; }
  .ovl-btn:hover { filter:brightness(1.1); }

  /* Calendar */
  .si-cal-box { background:#f2f5ff; border-radius:10px; padding:8px 12px; display:inline-flex; align-items:center; gap:8px; margin-bottom:12px; }
  .si-cal-num { font-size:24px; font-weight:700; color:#4f7cfe; line-height:1; }
  .si-year    { font-size:12px; font-weight:600; color:#1b2559; margin-left:6px; }
  .si-squares { display:flex; gap:5px; flex-wrap:wrap; }
  .si-sq      { width:28px; height:28px; border-radius:6px; cursor:pointer; transition:transform .15s, box-shadow .15s; }
  .si-sq:hover{ transform:scale(1.12); box-shadow:0 2px 8px rgba(0,0,0,0.15); }
  .si-sq.selected { transform:scale(1.15); box-shadow:0 0 0 2px #1b2559; }

  /* Table */
  .sd-tbl-wrap { overflow-x:auto; }
  .sd-table    { width:100%; border-collapse:collapse; }
  .sd-table th { font-size:10px; color:#a3aed0; font-weight:600; text-align:left; padding:6px 8px; border-bottom:1px solid #f2f5ff; white-space:nowrap; user-select:none; cursor:pointer; }
  .sd-table th:hover { color:#4f7cfe; }
  .sd-table td { font-size:11px; color:#1b2559; padding:8px; border-bottom:1px solid #f2f5ff; }
  .sd-table tr:last-child td  { border-bottom:none; }
  .sd-table tbody tr { cursor:pointer; transition:background .1s; }
  .sd-table tbody tr:hover td { background:#fafbff; }
  .sd-table tbody tr.selected td { background:#f0f5ff; }
  .td-region { font-size:10px; padding:2px 8px; border-radius:6px; font-weight:400; display:inline-block; white-space:nowrap; }
  .td-status { font-size:9px; padding:2px 7px; border-radius:10px; white-space:nowrap; }

  /* Swatch */
  .emp-swatch-row  { display:flex; gap:8px; margin-bottom:8px; flex-wrap:wrap; }
  .emp-swatch      { text-align:center; cursor:pointer; }
  .emp-swatch-box  { width:32px; height:32px; border-radius:8px; margin-bottom:3px; transition:transform .15s; }
  .emp-swatch:hover .emp-swatch-box { transform:scale(1.1); }
  .emp-swatch-name { font-size:9px; color:#a3aed0; }
  .emp-label-row   { display:flex; gap:8px; margin-bottom:12px; }
  .emp-label       { font-size:9px; color:#a3aed0; flex:1; text-align:center; }

  .insight-sub       { background:#f8faff; border-radius:10px; padding:10px 12px; margin-top:12px; }
  .insight-sub-title { font-size:11px; font-weight:700; color:#1b2559; display:flex; align-items:center; gap:5px; margin-bottom:10px; }
  .insight-num-row   { display:flex; align-items:center; justify-content:space-between; padding:7px 10px; border-radius:8px; margin-bottom:6px; background:#fff; cursor:pointer; transition:background .15s; }
  .insight-num-row:hover { background:#f0f5ff; }
  .insight-num-row:last-child { margin-bottom:0; }
  .insight-num-label { font-size:11px; color:#1b2559; }
  .insight-num-val   { font-size:16px; font-weight:700; color:#4f7cfe; }

  /* BSI */
  .bsi-row { display:flex; align-items:center; gap:8px; padding:9px 0; border-bottom:1px solid #f2f5ff; cursor:pointer; transition:background .1s; border-radius:6px; }
  .bsi-row:hover { background:#fafbff; padding-left:4px; }
  .bsi-row:last-child { border-bottom:none; }
  .bsi-dot   { width:10px; height:10px; border-radius:3px; flex-shrink:0; }
  .bsi-label { font-size:11px; color:#1b2559; flex:1; }
  .bsi-pct   { font-size:11px; font-weight:700; color:#1b2559; }
  .bsi-range { font-size:10px; color:#a3aed0; }

  /* Donut */
  .donut-wrap { display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
  .donut { width:92px; height:92px; border-radius:50%; flex-shrink:0; position:relative; background:conic-gradient(#4f7cfe 0deg 70deg,#ff9f43 70deg 160deg,#1dd1a1 160deg 240deg,#a29bfe 240deg 290deg,#e8edf5 290deg 360deg); cursor:pointer; transition:transform .2s; }
  .donut:hover { transform:scale(1.05); }
  .donut::after { content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:54px; height:54px; background:#fff; border-radius:50%; }
  .dl-item { display:flex; align-items:center; gap:6px; margin-bottom:6px; font-size:10px; cursor:pointer; padding:3px 4px; border-radius:5px; transition:background .1s; }
  .dl-item:hover { background:#f2f5ff; }
  .dl-dot  { width:8px; height:8px; border-radius:2px; flex-shrink:0; }
  .dl-label{ color:#1b2559; }

  /* Form inputs */
  .form-group   { margin-bottom:14px; }
  .form-label   { font-size:11px; font-weight:600; color:#1b2559; margin-bottom:5px; display:block; }
  .form-input   { width:100%; border:1.5px solid #e8edf5; border-radius:8px; padding:8px 10px; font-size:12px; color:#1b2559; outline:none; transition:border .15s; font-family:inherit; }
  .form-input:focus { border-color:#4f7cfe; box-shadow:0 0 0 3px #4f7cfe18; }
  .form-select  { width:100%; border:1.5px solid #e8edf5; border-radius:8px; padding:8px 10px; font-size:12px; color:#1b2559; outline:none; background:#fff; font-family:inherit; cursor:pointer; }
  .form-select:focus { border-color:#4f7cfe; }
  .form-row     { display:grid; grid-template-columns:1fr 1fr; gap:10px; }

  /* Buttons */
  .btn-primary { background:#4f7cfe; color:#fff; border:none; border-radius:8px; padding:9px 18px; font-size:12px; font-weight:600; cursor:pointer; transition:filter .15s; font-family:inherit; display:flex; align-items:center; gap:5px; }
  .btn-primary:hover { filter:brightness(1.08); }
  .btn-secondary { background:#f2f5ff; color:#4f7cfe; border:none; border-radius:8px; padding:9px 18px; font-size:12px; font-weight:600; cursor:pointer; transition:background .15s; font-family:inherit; }
  .btn-secondary:hover { background:#e8f0ff; }
  .btn-danger   { background:#fff0f0; color:#ef4444; border:none; border-radius:8px; padding:9px 18px; font-size:12px; font-weight:600; cursor:pointer; transition:background .15s; font-family:inherit; }
  .btn-danger:hover { background:#ffe0e0; }

  /* Search bar */
  .search-bar { display:flex; align-items:center; gap:8px; background:#f2f5ff; border-radius:8px; padding:6px 10px; margin-bottom:12px; }
  .search-input { border:none; background:none; outline:none; font-size:11px; color:#1b2559; flex:1; font-family:inherit; }
  .search-input::placeholder { color:#a3aed0; }

  /* Filter bar */
  .filter-bar { display:flex; gap:6px; margin-bottom:10px; flex-wrap:wrap; }
  .filter-chip { background:#f2f5ff; border:1.5px solid transparent; border-radius:20px; padding:3px 10px; font-size:10px; font-weight:600; cursor:pointer; transition:all .15s; color:#a3aed0; }
  .filter-chip:hover { border-color:#4f7cfe; color:#4f7cfe; }
  .filter-chip.active { background:#4f7cfe; color:#fff; border-color:#4f7cfe; }

  /* Pagination */
  .pagination { display:flex; align-items:center; gap:4px; margin-top:10px; justify-content:flex-end; }
  .pg-btn { background:#f2f5ff; border:none; border-radius:6px; width:26px; height:26px; cursor:pointer; font-size:11px; color:#4f7cfe; font-weight:600; display:flex; align-items:center; justify-content:center; transition:background .15s; }
  .pg-btn:hover { background:#e8f0ff; }
  .pg-btn.active { background:#4f7cfe; color:#fff; }

  /* Responsive */
  @media (max-width:1100px) {
    .sd-stats     { grid-template-columns:repeat(2,1fr); }
    .sd-2col-wide { grid-template-columns:1fr; }
  }
  @media (max-width:860px) {
    .sd           { padding:12px; }
    .sd-stats     { grid-template-columns:repeat(2,1fr); }
    .sd-2col      { grid-template-columns:1fr; }
    .sd-2col-wide { grid-template-columns:1fr; }
    .sd-stat-value{ font-size:1.65rem; }
    .ovl-date     { display:none; }
    .form-row     { grid-template-columns:1fr; }
  }
  @media (max-width:600px) {
    .sd           { padding:10px; }
    .sd-stats     { gap:8px; }
    .sd-stat      { padding:10px 12px; }
    .sd-stat-value{ font-size:1.6rem; }
    .sd-card      { padding:12px; }
    .ovl-btn      { padding:4px 8px; font-size:9px; }
    .donut        { width:76px; height:76px; }
    .donut::after { width:44px; height:44px; }
    .si-sq        { width:24px; height:24px; }
  }
  @media (max-width:420px) {
    .sd           { padding:8px; }
    .sd-stats     { grid-template-columns:1fr 1fr; gap:6px; }
    .sd-stat-value{ font-size:1.45rem; }
    .sd-stat-label{ font-size:.7rem; }
    .sd-stat-icon { width:36px; height:36px; }
    .ovl-avatar   { width:30px; height:30px; font-size:10px; }
    .ovl-btn      { display:none; }
    .si-sq        { width:22px; height:22px; }
  }
`;

const ROWS_PER_PAGE = 4;

export default function ShiftDashboard() {
  const [mounted, setMounted]           = useState(false);

  /* ── Stats ── */
  const [stats, setStats]               = useState(STATS_SEED.map(s=>({...s})));

  /* ── Timeline ── */
  const [tlVisible, setTlVisible]       = useState(true);
  const [tlWeekOffset, setTlWeekOffset] = useState(0);

  /* ── Overlapping people ── */
  const [ovlPeople, setOvlPeople]       = useState(OVL_PEOPLE_SEED);
  const [ovlPage, setOvlPage]           = useState(0);

  /* ── Calendar ── */
  const [selSquare, setSelSquare]       = useState(null);

  /* ── Table ── */
  const [tableRows, setTableRows]       = useState(ALL_TABLE_ROWS);
  const [viewMode, setViewMode]         = useState("list"); // "list"|"grid"
  const [filterRegion, setFilterRegion] = useState("All");
  const [searchQ, setSearchQ]           = useState("");
  const [sortCol, setSortCol]           = useState(null);
  const [sortDir, setSortDir]           = useState("asc");
  const [selRows, setSelRows]           = useState([]);
  const [page, setPage]                 = useState(0);

  /* ── Modals ── */
  const [modal, setModal]               = useState(null); // "addShift"|"editShift"|"shiftDetail"|"assignShift"|"resolveOverlap"|"deleteConfirm"|"insightDetail"|"downloadConfirm"
  const [modalData, setModalData]       = useState(null);

  /* ── Toast ── */
  const [toast, setToast]               = useState(null);

  /* ── New shift form ── */
  const [newShift, setNewShift]         = useState({ region:"EMEA", date:"", shiftStart:"", shiftEnd:"", employee:"" });

  useEffect(()=>{ setMounted(true); },[]);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(()=>setToast(null), 3000);
  };

  const closeModal = () => { setModal(null); setModalData(null); };

  /* ── Derived table data ── */
  const filteredRows = tableRows
    .filter(r => filterRegion==="All" || r.region===filterRegion)
    .filter(r => {
      if(!searchQ) return true;
      const q = searchQ.toLowerCase();
      return r.region.toLowerCase().includes(q) || r.date.toLowerCase().includes(q) ||
             r.shift.toLowerCase().includes(q)  || r.employee.toLowerCase().includes(q);
    })
    .sort((a,b)=>{
      if(!sortCol) return 0;
      const av = a[sortCol]||"", bv = b[sortCol]||"";
      return sortDir==="asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalPages = Math.ceil(filteredRows.length / ROWS_PER_PAGE);
  const pagedRows  = filteredRows.slice(page*ROWS_PER_PAGE, page*ROWS_PER_PAGE+ROWS_PER_PAGE);

  const handleSort = (col) => {
    if(sortCol===col) setSortDir(d=>d==="asc"?"desc":"asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const handleAddShift = () => {
    if(!newShift.date || !newShift.employee || !newShift.shiftStart || !newShift.shiftEnd){
      showToast("Please fill in all fields","error"); return;
    }
    const regionMeta = {
      EMEA:{ rBg:"#e8f0ff", rColor:"#4f7cfe" },
      US:  { rBg:"#e8fdf2", rColor:"#1dd1a1" },
      AUS: { rBg:"#fff3e8", rColor:"#ff9f43" },
    };
    const meta = regionMeta[newShift.region] || regionMeta.EMEA;
    const newRow = {
      id: Date.now(), region:newShift.region, ...meta,
      date:newShift.date, shift:`${newShift.shiftStart} – ${newShift.shiftEnd}`,
      employee:newShift.employee, status:"Pending"
    };
    setTableRows(r=>[...r, newRow]);
    setStats(s=>s.map((st,i)=>i===0?{...st,value:st.value+1}:i===1?{...st,value:st.value+1}:st));
    setNewShift({ region:"EMEA", date:"", shiftStart:"", shiftEnd:"", employee:"" });
    closeModal();
    showToast("New shift added successfully!");
  };

  const handleDeleteSelected = () => {
    setTableRows(r=>r.filter(row=>!selRows.includes(row.id)));
    setStats(s=>s.map((st,i)=>i===0?{...st,value:Math.max(0,st.value-selRows.length)}:st));
    setSelRows([]);
    closeModal();
    showToast(`${selRows.length} shift(s) deleted`,"error");
  };

  const handleStatusToggle = (row) => {
    setTableRows(r=>r.map(x=>x.id===row.id?{...x,status:x.status==="Confirmed"?"Pending":x.status==="Pending"?"Confirmed":"Cancelled"}:x));
    showToast(`Status updated to ${row.status==="Confirmed"?"Pending":"Confirmed"}`);
  };

  const handleDownload = () => {
    const header = "Region,Date,Shift,Employee,Status\n";
    const body   = filteredRows.map(r=>`${r.region},${r.date},"${r.shift}",${r.employee},${r.status}`).join("\n");
    const blob   = new Blob([header+body],{type:"text/csv"});
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement("a");
    a.href=url; a.download="shift_schedule.csv"; a.click();
    URL.revokeObjectURL(url);
    closeModal();
    showToast("CSV downloaded!");
  };

  const handleAssignShift = (person) => {
    showToast(`New shift assigned to ${person.name}`);
    closeModal();
  };

  const handleResolveOverlap = (person) => {
    setOvlPeople(p=>p.filter(x=>x.id!==person.id));
    setStats(s=>s.map((st,i)=>i===3?{...st,value:Math.max(0,st.value-1)}:st));
    showToast(`Overlap resolved for ${person.name}`);
    closeModal();
  };

  const weekLabel = () => {
    if(tlWeekOffset===0) return "August 2028";
    if(tlWeekOffset>0)   return `+${tlWeekOffset} week(s) ahead`;
    return `${Math.abs(tlWeekOffset)} week(s) back`;
  };

  if(!mounted) return <div style={{background:"#f2f5ff",minHeight:"100vh"}}/>;

  const regions = ["All","EMEA","US","AUS"];
  const statusColors = { Confirmed:{bg:"#e8fff3",c:"#22c55e"}, Pending:{bg:"#fff8e8",c:"#f59e0b"}, Cancelled:{bg:"#fff0f0",c:"#ef4444"} };

  return (
    <>
      <style suppressHydrationWarning>{CSS}</style>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      {/* ── ADD SHIFT MODAL ── */}
      {modal==="addShift" && (
        <Modal title="Add New Shift" onClose={closeModal}>
          <div className="form-group">
            <label className="form-label">Region</label>
            <select className="form-select" value={newShift.region} onChange={e=>setNewShift(s=>({...s,region:e.target.value}))}>
              <option>EMEA</option><option>US</option><option>AUS</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Employee Name</label>
            <input className="form-input" placeholder="e.g. Sarah Chen" value={newShift.employee} onChange={e=>setNewShift(s=>({...s,employee:e.target.value}))}/>
          </div>
          <div className="form-group">
            <label className="form-label">Shift Date</label>
            <input className="form-input" type="date" value={newShift.date} onChange={e=>setNewShift(s=>({...s,date:e.target.value}))}/>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input className="form-input" type="time" value={newShift.shiftStart} onChange={e=>setNewShift(s=>({...s,shiftStart:e.target.value}))}/>
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input className="form-input" type="time" value={newShift.shiftEnd} onChange={e=>setNewShift(s=>({...s,shiftEnd:e.target.value}))}/>
            </div>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:4}}>
            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="btn-primary" onClick={handleAddShift}><IconPlus size={13}/>Add Shift</button>
          </div>
        </Modal>
      )}

      {/* ── SHIFT DETAIL MODAL ── */}
      {modal==="shiftDetail" && modalData && (
        <Modal title="Shift Details" onClose={closeModal}>
          {[["Region",modalData.region],["Employee",modalData.employee],["Date",modalData.date],["Time",modalData.shift],["Status",modalData.status]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f2f5ff"}}>
              <span style={{fontSize:11,color:"#a3aed0",fontWeight:600}}>{k}</span>
              <span style={{fontSize:11,fontWeight:600,color:"#1b2559"}}>{v}</span>
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:16,justifyContent:"flex-end"}}>
            <button className="btn-secondary" onClick={closeModal}>Close</button>
            <button className="btn-primary" onClick={()=>{ handleStatusToggle(modalData); closeModal(); }}>
              <IconCheck color="#fff" size={13}/> Toggle Status
            </button>
          </div>
        </Modal>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {modal==="deleteConfirm" && (
        <Modal title="Confirm Delete" onClose={closeModal}>
          <p style={{fontSize:13,color:"#1b2559",marginBottom:16}}>
            Are you sure you want to delete <strong>{selRows.length}</strong> selected shift(s)? This action cannot be undone.
          </p>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="btn-danger" onClick={handleDeleteSelected}><IconTrash color="#ef4444" size={13}/> Delete</button>
          </div>
        </Modal>
      )}

      {/* ── ASSIGN SHIFT MODAL ── */}
      {modal==="assignShift" && modalData && (
        <Modal title={`Assign New Shift — ${modalData.name}`} onClose={closeModal}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",marginBottom:12,borderBottom:"1px solid #f2f5ff"}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:modalData.avBg,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700}}>{modalData.av}</div>
            <div><div style={{fontWeight:600,fontSize:13}}>{modalData.name}</div><div style={{fontSize:11,color:"#a3aed0"}}>{modalData.role}</div></div>
          </div>
          <div className="form-group">
            <label className="form-label">New Shift Date</label>
            <input className="form-input" type="date"/>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input className="form-input" type="time" defaultValue="09:00"/>
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input className="form-input" type="time" defaultValue="17:00"/>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-input" rows={3} placeholder="Optional notes..." style={{resize:"vertical"}}/>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="btn-primary" onClick={()=>handleAssignShift(modalData)}><IconCheck color="#fff" size={13}/> Assign</button>
          </div>
        </Modal>
      )}

      {/* ── RESOLVE OVERLAP MODAL ── */}
      {modal==="resolveOverlap" && modalData && (
        <Modal title={`Resolve Overlap — ${modalData.name}`} onClose={closeModal}>
          <div style={{background:"#fff8e8",borderRadius:10,padding:12,marginBottom:14,fontSize:12,color:"#92400e"}}>
            <strong>Overlap detected</strong> on {modalData.date}. This employee is scheduled for two shifts at the same time.
          </div>
          <div className="form-group">
            <label className="form-label">Resolution Action</label>
            <select className="form-select">
              <option>Remove the later shift</option>
              <option>Remove the earlier shift</option>
              <option>Split into two half-shifts</option>
              <option>Reassign to another employee</option>
            </select>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="btn-primary" onClick={()=>handleResolveOverlap(modalData)}><IconCheck color="#fff" size={13}/> Resolve</button>
          </div>
        </Modal>
      )}

      {/* ── DOWNLOAD CONFIRM MODAL ── */}
      {modal==="downloadConfirm" && (
        <Modal title="Download Shift Schedule" onClose={closeModal}>
          <p style={{fontSize:13,color:"#1b2559",marginBottom:16}}>
            Download <strong>{filteredRows.length}</strong> filtered shift records as a CSV file?
          </p>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="btn-primary" onClick={handleDownload}><IconDownload color="#fff" size={13}/> Download CSV</button>
          </div>
        </Modal>
      )}

      {/* ── INSIGHT DETAIL MODAL ── */}
      {modal==="insightDetail" && modalData && (
        <Modal title={modalData.label} onClose={closeModal}>
          <div style={{fontSize:56,fontWeight:800,color:"#4f7cfe",textAlign:"center",padding:"16px 0"}}>{modalData.val}</div>
          <p style={{fontSize:12,color:"#a3aed0",textAlign:"center",marginBottom:16}}>
            {modalData.label==="Understaffed Shifts"
              ? "These shifts currently have fewer employees assigned than required."
              : "Employees have requested to swap these shifts with colleagues."}
          </p>
          <div style={{display:"flex",justifyContent:"flex-end"}}>
            <button className="btn-primary" onClick={closeModal}>Got it</button>
          </div>
        </Modal>
      )}

      <div className="sd" suppressHydrationWarning>

        {/* ── Stats ── */}
        <div className="sd-stats">
          {stats.map((s, i) => (
            <div className="sd-stat" key={i} onClick={()=>{ setModal("insightDetail"); setModalData({label:s.label,val:s.value}); }}>
              <div>
                <div className="sd-stat-label">{s.label}</div>
                <div className="sd-stat-value">{s.value}</div>
              </div>
              <div className="sd-stat-icon" style={{background:s.iconBg}}>
                <StatIcon idx={i} color={s.iconColor}/>
              </div>
            </div>
          ))}
        </div>

        {/* ── Timeline ── */}
        {tlVisible && (
          <div className="sd-timeline">
            <div className="tl-header">
              <span className="tl-back" onClick={()=>setTlWeekOffset(o=>o-1)}>← Prev Week</span>
              <span className="tl-title">Weekly Schedule</span>
              <span className="tl-sub">{weekLabel()}</span>
              <div className="tl-nav">
                <button className="tl-nav-btn" onClick={()=>setTlWeekOffset(o=>o-1)} title="Previous week">‹</button>
                <button className="tl-nav-btn" onClick={()=>setTlWeekOffset(o=>o+1)} title="Next week">›</button>
                <button className="tl-close"   onClick={()=>setTlVisible(false)} title="Hide timeline">✕</button>
              </div>
            </div>
            <div className="tl-scroll">
              <div className="tl-dates">
                {TL_DATES.map((d,i)=><div key={i} className="tl-date">{d}</div>)}
              </div>
              <div className="tl-rows">
                {[{region:"EMEA",blocks:TL_EMEA},{region:"AUS",blocks:TL_AUS}].map((row,ri)=>(
                  <div className="tl-row" key={ri} style={ri>0?{marginTop:4}:{}}>
                    <div className="tl-region">{row.region}</div>
                    <div className="tl-track">
                      {row.blocks.map((b,i)=>(
                        <div key={i} className="tl-block"
                          style={{left:b.left,width:b.width,background:b.bg}}
                          title={b.txt}
                          onClick={()=>{ setModal("shiftDetail"); setModalData({region:row.region,employee:"–",date:"Aug 2028",shift:b.txt,status:"Confirmed"}); }}>
                          {b.txt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {!tlVisible && (
          <button className="btn-secondary" style={{marginBottom:14,display:"flex",alignItems:"center",gap:5}} onClick={()=>setTlVisible(true)}>
            <IconCalendar color="#4f7cfe" size={13}/> Show Timeline
          </button>
        )}

        {/* ── Overlapping Shifts + Shift Insights ── */}
        <div className="sd-2col">
          <div className="sd-card">
            <div className="sd-card-title-row">
              <div className="sd-card-title"><IconUsers color="#4f7cfe"/> Overlapping Shifts</div>
              <div style={{display:"flex",gap:4}}>
                <button className="nav-btn" onClick={()=>setOvlPage(p=>Math.max(0,p-1))} title="Previous">‹</button>
                <button className="nav-btn" onClick={()=>setOvlPage(p=>Math.min(Math.max(0,ovlPeople.length-1),p+1))} title="Next">›</button>
              </div>
            </div>
            {ovlPeople.length===0 ? (
              <div style={{textAlign:"center",padding:"20px 0",color:"#a3aed0",fontSize:12}}>
                <IconCheck color="#22c55e" size={24}/><br/>No overlapping shifts!
              </div>
            ) : (
              ovlPeople.slice(ovlPage, ovlPage+2).map((p,i)=>(
                <div className="ovl-item" key={p.id}>
                  <div className="ovl-avatar" style={{background:p.avBg}}>{p.av}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="ovl-name">{p.name}</div>
                    <div className="ovl-role">{p.role}</div>
                  </div>
                  <div className="ovl-date">{p.date}</div>
                  <button className="ovl-btn" style={{background:p.btnBg}}
                    onClick={()=>{
                      setModalData(p);
                      setModal(p.btnTxt==="Assign New Shift"?"assignShift":"resolveOverlap");
                    }}>
                    {p.btnTxt}
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="sd-card">
            <div className="sd-card-title"><IconCalendar color="#4f7cfe"/> Shift Insights</div>
            <div style={{display:"flex",alignItems:"center",marginBottom:12}}>
              <div className="si-cal-box">
                <div className="si-cal-num">19</div>
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:"#1b2559"}}>Saturday</div>
                  <div style={{fontSize:10,color:"#a3aed0"}}>Today</div>
                </div>
              </div>
              <div className="si-year">August 2028</div>
            </div>
            <div className="si-squares">
              {CAL_SQUARES.map((c,i)=>(
                <div key={i} className={`si-sq${selSquare===i?" selected":""}`}
                  style={{background:c}}
                  title={`Week ${i+1}`}
                  onClick={()=>{ setSelSquare(i===selSquare?null:i); showToast(`Week ${i+1} selected`,"info"); }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Shift Schedule Table + Shift Leave Requests ── */}
        <div className="sd-2col-wide">
          <div className="sd-card">
            {/* Header row */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
              <div className="sd-card-title" style={{marginBottom:0}}>
                <IconList color="#4f7cfe"/> Shift Schedule
              </div>
              <div style={{display:"flex",gap:4}}>
                <button className={`icon-btn${viewMode==="grid"?" active":""}`} title="Grid view" onClick={()=>setViewMode("grid")}><IconGrid color={viewMode==="grid"?"#fff":"#4f7cfe"} size={13}/></button>
                <button className={`icon-btn${viewMode==="list"?" active":""}`} title="List view" onClick={()=>setViewMode("list")}><IconList color={viewMode==="list"?"#fff":"#4f7cfe"} size={13}/></button>
              </div>
              <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                <button className="btn-primary" style={{padding:"5px 10px",fontSize:10}} onClick={()=>setModal("addShift")} title="Add new shift">
                  <IconPlus size={11}/> Add Shift
                </button>
                <button className="icon-btn" title="Download CSV" onClick={()=>setModal("downloadConfirm")}><IconDownload color="#4f7cfe" size={13}/></button>
                {selRows.length>0 && (
                  <button className="icon-btn" title={`Delete ${selRows.length} selected`} onClick={()=>setModal("deleteConfirm")} style={{background:"#fff0f0"}}>
                    <IconTrash color="#ef4444" size={13}/>
                  </button>
                )}
                <button className="icon-btn" title="Sort"><IconChevDown color="#4f7cfe" size={12}/></button>
              </div>
            </div>

            {/* Search */}
            <div className="search-bar">
              <IconSearch color="#a3aed0" size={13}/>
              <input className="search-input" placeholder="Search by region, employee, date…" value={searchQ} onChange={e=>{setSearchQ(e.target.value);setPage(0);}}/>
              {searchQ && <button style={{background:"none",border:"none",cursor:"pointer",color:"#a3aed0",padding:0}} onClick={()=>setSearchQ("")}><IconX color="#a3aed0" size={11}/></button>}
            </div>

            {/* Filter chips */}
            <div className="filter-bar">
              <IconFilter color="#a3aed0" size={11}/>
              {regions.map(r=>(
                <button key={r} className={`filter-chip${filterRegion===r?" active":""}`} onClick={()=>{setFilterRegion(r);setPage(0);}}>
                  {r}
                </button>
              ))}
              {selRows.length>0 && <span style={{fontSize:10,color:"#a3aed0",marginLeft:"auto"}}>{selRows.length} selected</span>}
            </div>

            {/* Table / Grid */}
            {viewMode==="list" ? (
              <div className="sd-tbl-wrap">
                <table className="sd-table">
                  <thead>
                    <tr>
                      <th style={{width:24}}><input type="checkbox" onChange={e=>setSelRows(e.target.checked?pagedRows.map(r=>r.id):[])}/></th>
                      {[["region","Region"],["date","Date"],["shift","Time"],["employee","Employee"],["status","Status"]].map(([col,lbl])=>(
                        <th key={col} onClick={()=>handleSort(col)}>
                          {lbl} {sortCol===col?(sortDir==="asc"?"↑":"↓"):""}
                        </th>
                      ))}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.length===0 && (
                      <tr><td colSpan={7} style={{textAlign:"center",color:"#a3aed0",padding:24}}>No shifts found</td></tr>
                    )}
                    {pagedRows.map(r=>(
                      <tr key={r.id} className={selRows.includes(r.id)?"selected":""} onClick={()=>{setModal("shiftDetail");setModalData(r);}}>
                        <td onClick={e=>e.stopPropagation()}>
                          <input type="checkbox" checked={selRows.includes(r.id)} onChange={e=>{e.stopPropagation();setSelRows(s=>e.target.checked?[...s,r.id]:s.filter(x=>x!==r.id));}}/>
                        </td>
                        <td><span className="td-region" style={{background:r.rBg,color:r.rColor}}>{r.region}</span></td>
                        <td>{r.date}</td>
                        <td>{r.shift}</td>
                        <td>{r.employee}</td>
                        <td>
                          <span className="td-status" style={{background:statusColors[r.status]?.bg,color:statusColors[r.status]?.c}}>
                            {r.status}
                          </span>
                        </td>
                        <td onClick={e=>e.stopPropagation()} style={{display:"flex",gap:4}}>
                          <button className="icon-btn" title="Edit status" onClick={()=>handleStatusToggle(r)}><IconEdit color="#4f7cfe" size={12}/></button>
                          <button className="icon-btn" title="Delete" style={{background:"#fff0f0"}} onClick={()=>{setSelRows([r.id]);setModal("deleteConfirm");}}><IconTrash color="#ef4444" size={12}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Grid view */
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
                {pagedRows.map(r=>(
                  <div key={r.id} style={{background:"#f8faff",borderRadius:10,padding:10,cursor:"pointer",border:selRows.includes(r.id)?"2px solid #4f7cfe":"2px solid transparent",transition:"border .15s"}}
                    onClick={()=>{setModal("shiftDetail");setModalData(r);}}>
                    <span className="td-region" style={{background:r.rBg,color:r.rColor,marginBottom:6,display:"inline-block"}}>{r.region}</span>
                    <div style={{fontSize:11,fontWeight:600,marginBottom:2}}>{r.employee}</div>
                    <div style={{fontSize:10,color:"#a3aed0",marginBottom:4}}>{r.date}</div>
                    <div style={{fontSize:10,color:"#4f7cfe",fontWeight:600}}>{r.shift}</div>
                    <span className="td-status" style={{background:statusColors[r.status]?.bg,color:statusColors[r.status]?.c,marginTop:6,display:"inline-block"}}>{r.status}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages>1 && (
              <div className="pagination">
                <button className="pg-btn" onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}>‹</button>
                {Array.from({length:totalPages},(_,i)=>(
                  <button key={i} className={`pg-btn${page===i?" active":""}`} onClick={()=>setPage(i)}>{i+1}</button>
                ))}
                <button className="pg-btn" onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page===totalPages-1}>›</button>
              </div>
            )}
          </div>

          {/* Shift Leave Requests */}
          <div className="sd-card">
            <div className="sd-card-title-row">
              <div className="sd-card-title" style={{marginBottom:0}}><IconCalendar color="#4f7cfe"/> Shift Leave Requests</div>
              <button className="icon-btn" title="Clear all leave requests" onClick={()=>{ showToast("Leave requests cleared"); }}>
                <IconTrash/>
              </button>
            </div>

            <div style={{fontSize:11,fontWeight:700,color:"#1b2559",marginBottom:8}}>Employees Per Shift</div>
            <div className="emp-swatch-row">
              {EMP_SWATCHES.map((e,i)=>(
                <div key={i} className="emp-swatch" title={`${e.name} – click to view`}
                  onClick={()=>showToast(`Viewing ${e.name}'s shifts`)}>
                  <div className="emp-swatch-box" style={{background:e.color}}/>
                  <div className="emp-swatch-name">{e.name}</div>
                </div>
              ))}
            </div>
            <div className="emp-label-row">
              {EMP_SHIFT_LABELS.map((l,i)=>(
                <div key={i} className="emp-label">{l}</div>
              ))}
            </div>

            <div className="insight-sub">
              <div className="insight-sub-title"><IconBarChart color="#4f7cfe" size={13}/> Shift Insights</div>
              {[
                { label:"Understaffed Shifts", val:"2" },
                { label:"Shift Swap Requests", val:"4" },
              ].map((r,i)=>(
                <div className="insight-num-row" key={i}
                  onClick={()=>{ setModal("insightDetail"); setModalData(r); }}>
                  <span className="insight-num-label">{r.label}</span>
                  <span className="insight-num-val">{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom: Shift Insights + Donut ── */}
        <div className="sd-2col">
          <div className="sd-card">
            <div className="sd-card-title"><IconBarChart color="#4f7cfe"/> Shift Insights</div>
            <div style={{fontSize:11,fontWeight:700,color:"#1b2559",marginBottom:10}}>Employees Per Shift Type</div>
            {BSI_ROWS.map((b,i)=>(
              <div className="bsi-row" key={i}
                onClick={()=>{ setModal("insightDetail"); setModalData({label:b.label,val:b.pct}); }}>
                <div className="bsi-dot" style={{background:b.color}}/>
                <div className="bsi-label">{b.label}</div>
                <span className="bsi-pct">{b.pct}</span>
                <span className="bsi-range">{b.range}</span>
              </div>
            ))}
          </div>

          <div className="sd-card">
            <div className="sd-card-title"><IconDot color="#4f7cfe" size={13}/> Employees Per Shift</div>
            <div className="donut-wrap">
              <div className="donut" title="Click for breakdown" onClick={()=>showToast("Day 51% · Evening 33% · Night 87%","info")}/>
              <div>
                {DONUT_LEGEND.map((d,i)=>(
                  <div className="dl-item" key={i}
                    onClick={()=>{ setModal("insightDetail"); setModalData({label:d.label,val:d.label.split("–")[1]?.trim()||""}); }}>
                    <div className="dl-dot" style={{background:d.color}}/>
                    <span className="dl-label">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
