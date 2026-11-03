import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Network, 
  Cpu, 
  Database, 
  Play, 
  RotateCcw, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Radio, 
  Server, 
  Laptop, 
  Router as RouterIcon, 
  Layers, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Maximize2 
} from "lucide-react";

interface NodeItem {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'server' | 'firewall' | 'client';
  ip: string;
  status: 'nominal' | 'congested' | 'blocked';
  x: number;
  y: number;
}

export function InteractiveSimulationLab() {
  const [activeLabMode, setActiveLabMode] = useState<'network' | 'hardware' | 'sql'>('network');

  // Network Simulation State
  const [nodes, setNodes] = useState<NodeItem[]>([
    { id: "fw", name: "Enterprise NextGen Firewall", type: "firewall", ip: "192.168.1.1", status: "nominal", x: 120, y: 160 },
    { id: "core-rt", name: "Core Layer-3 Router", type: "router", ip: "192.168.1.254", status: "nominal", x: 300, y: 160 },
    { id: "sw-1", name: "Distribution Switch (VLAN 10)", type: "switch", ip: "192.168.10.2", status: "nominal", x: 480, y: 100 },
    { id: "sw-2", name: "Database Server Switch (VLAN 20)", type: "switch", ip: "192.168.20.2", status: "nominal", x: 480, y: 220 },
    { id: "srv-db", name: "Primary Oracle DB Server", type: "server", ip: "192.168.20.100", status: "nominal", x: 660, y: 220 },
    { id: "client-1", name: "Workstation CAD-01", type: "client", ip: "192.168.10.45", status: "nominal", x: 660, y: 100 },
  ]);

  const [firewallBlocked, setFirewallBlocked] = useState(false);
  const [bandwidthLimitMbps, setBandwidthLimitMbps] = useState([1000]);
  const [isPacketTesting, setIsPacketTesting] = useState(false);
  const [testLog, setTestLog] = useState<string[]>([
    "النظام جاهز. تم تحميل بنية الشبكة المؤسسية BTEC Unit 1 بنجاح."
  ]);
  const [latencyMs, setLatencyMs] = useState(14);
  const [packetLoss, setPacketLoss] = useState(0);

  // Hardware Simulation State
  const [selectedHardwarePart, setSelectedHardwarePart] = useState<string>("socket");
  const [postTestState, setPostTestState] = useState<'idle' | 'testing' | 'success' | 'warning'>('idle');
  const [postCode, setPostCode] = useState("0x00 (STANDBY)");

  // SQL Simulation State
  const [sqlQuery, setSqlQuery] = useState("SELECT StudentID, FullName, CourseName, Grade FROM StudentRegistrations WHERE Grade >= 85;");
  const [sqlResultRows, setSqlResultRows] = useState([
    { StudentID: "STU-101", FullName: "أحمد بن محمد", CourseName: "BTEC IT Systems", Grade: 94, Status: "Distinction" },
    { StudentID: "STU-104", FullName: "سارة القحطاني", CourseName: "Cloud Computing", Grade: 88, Status: "Merit" },
    { StudentID: "STU-108", FullName: "فيصل الرويلي", CourseName: "Network Security", Grade: 91, Status: "Distinction" },
  ]);
  const [sqlExecutionTimeMs, setSqlExecutionTimeMs] = useState(2.4);

  // Handlers for Network Lab
  const runPingTest = () => {
    setIsPacketTesting(true);
    setTestLog(prev => [
      `[${new Date().toLocaleTimeString('ar-SA')}] بدء اختبار ICMP Ping من Workstation (192.168.10.45) إلى Database (192.168.20.100)...`,
      ...prev
    ]);

    setTimeout(() => {
      if (firewallBlocked) {
        setPacketLoss(100);
        setLatencyMs(0);
        setTestLog(prev => [
          `[${new Date().toLocaleTimeString('ar-SA')}] ⚠️ فشل الاختبار: تم إسقاط الحزم بواسطة جدار الحماية (ACL Rule #10: Block Inter-VLAN ICMP).`,
          ...prev
        ]);
      } else {
        const calculatedLatency = Math.round(10 + Math.random() * 8 + (1000 - bandwidthLimitMbps[0]) / 100);
        setLatencyMs(calculatedLatency);
        setPacketLoss(0);
        setTestLog(prev => [
          `[${new Date().toLocaleTimeString('ar-SA')}] ✓ نجح الاختبار: 4 حزم أُرسلت، 4 حزم استُلمت، زمن الاستجابة ${calculatedLatency}ms، فقدان الحزم 0%.`,
          ...prev
        ]);
      }
      setIsPacketTesting(false);
    }, 900);
  };

  const toggleFirewallPolicy = () => {
    const nextState = !firewallBlocked;
    setFirewallBlocked(nextState);
    setTestLog(prev => [
      `[${new Date().toLocaleTimeString('ar-SA')}] تعديل سياسة الجدار الناري: ${nextState ? "حظر حركة ICMP بين الشبكات الفرعية (Inter-VLAN Block)" : "السماح بالمرور المصرح به (Policy: Allow Established)"}`,
      ...prev
    ]);
  };

  // Handlers for Hardware Lab
  const runPostDiagnostics = () => {
    setPostTestState('testing');
    setPostCode("0x15 (INIT CPU)");
    setTimeout(() => {
      setPostCode("0x55 (TRAINING DDR5)");
      setTimeout(() => {
        setPostCode("0x78 (CHECK PCIE BUS)");
        setTimeout(() => {
          setPostCode("0x00 (POST OK - BOOT READY)");
          setPostTestState('success');
        }, 600);
      }, 600);
    }, 600);
  };

  // Handlers for SQL Lab
  const executeQuery = () => {
    const isFiltered = sqlQuery.toLowerCase().includes("where");
    setSqlExecutionTimeMs(Number((1.2 + Math.random() * 2).toFixed(2)));
    if (isFiltered) {
      setSqlResultRows([
        { StudentID: "STU-101", FullName: "أحمد بن محمد", CourseName: "BTEC IT Systems", Grade: 94, Status: "Distinction" },
        { StudentID: "STU-104", FullName: "سارة القحطاني", CourseName: "Cloud Computing", Grade: 88, Status: "Merit" },
        { StudentID: "STU-108", FullName: "فيصل الرويلي", CourseName: "Network Security", Grade: 91, Status: "Distinction" },
      ]);
    } else {
      setSqlResultRows([
        { StudentID: "STU-101", FullName: "أحمد بن محمد", CourseName: "BTEC IT Systems", Grade: 94, Status: "Distinction" },
        { StudentID: "STU-102", FullName: "نورة العتيبي", CourseName: "Database Systems", Grade: 78, Status: "Merit" },
        { StudentID: "STU-103", FullName: "خالد الحربي", CourseName: "IT Hardware", Grade: 65, Status: "Pass" },
        { StudentID: "STU-104", FullName: "سارة القحطاني", CourseName: "Cloud Computing", Grade: 88, Status: "Merit" },
        { StudentID: "STU-108", FullName: "فيصل الرويلي", CourseName: "Network Security", Grade: 91, Status: "Distinction" },
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Lab Mode Segmented Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-600/10 text-sky-600 flex items-center justify-center">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              مختبر المحاكاة التفاعلي (BTEC Interactive Sandbox)
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>محاكاة فورية</span>
              <span aria-hidden="true">·</span>
              <span>تغذية راجعة حية</span>
              <span aria-hidden="true">·</span>
              <span>متوافق مع المعايير المهنية</span>
            </div>
          </div>
        </div>

        {/* Segmented Mode Tabs */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveLabMode('network')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeLabMode === 'network'
                ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            <span>معمل الشبكات (Unit 1)</span>
          </button>
          <button
            onClick={() => setActiveLabMode('hardware')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeLabMode === 'hardware'
                ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>معمل العتاد (Unit 3)</span>
          </button>
          <button
            onClick={() => setActiveLabMode('sql')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeLabMode === 'sql'
                ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>معمل قواعد البيانات (Unit 2)</span>
          </button>
        </div>
      </div>

      {/* LAB MODE 1: NETWORK TOPOLOGY & PACKET FLOW */}
      {activeLabMode === 'network' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Zone: Interactive SVG Topology Stage */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden min-h-[460px]">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 z-10">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-sky-400">TOPOLOGY: DUAL-VLAN ENTERPRISE FABRIC</span>
                <span className="text-xs text-slate-500">|</span>
                <span className="text-xs font-mono tabular-nums text-slate-400">SUBNET: 192.168.0.0/16</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs">
                  <span className={`inline-block w-2 h-2 rounded-full ${firewallBlocked ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <span className="font-mono text-slate-300">
                    {firewallBlocked ? 'FIREWALL: FILTERING' : 'FIREWALL: PASS'}
                  </span>
                </div>
              </div>
            </div>

            {/* Topology SVG Canvas */}
            <div className="relative flex-1 flex items-center justify-center w-full my-2">
              <svg className="w-full h-80" viewBox="0 0 800 340">
                <defs>
                  <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.2" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Connection Links */}
                {/* FW to Core Router */}
                <line x1="120" y1="170" x2="300" y2="170" stroke="#0284C7" strokeWidth="2.5" strokeDasharray="4 2" />
                {/* Core Router to Switch 1 */}
                <line x1="300" y1="170" x2="480" y2="100" stroke="#0284C7" strokeWidth="2.5" />
                {/* Core Router to Switch 2 */}
                <line x1="300" y1="170" x2="480" y2="240" stroke="#0284C7" strokeWidth="2.5" />
                {/* Switch 1 to Workstation */}
                <line x1="480" y1="100" x2="660" y2="100" stroke="#0EA5E9" strokeWidth="2" />
                {/* Switch 2 to Server */}
                <line x1="480" y1="240" x2="660" y2="240" stroke="#0EA5E9" strokeWidth="2" />

                {/* Animated Packet Pulse if Testing */}
                {isPacketTesting && (
                  <>
                    <circle r="4.5" fill="#38BDF8" filter="url(#glow)">
                      <animateMotion path="M 660 100 L 480 100 L 300 170 L 480 240 L 660 240" dur="0.8s" repeatCount="indefinite" />
                    </circle>
                    <circle r="3" fill="#F8FAFC">
                      <animateMotion path="M 660 100 L 480 100 L 300 170 L 480 240 L 660 240" dur="0.8s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}

                {/* Nodes rendering */}
                {/* 1. Firewall */}
                <g transform="translate(90, 140)">
                  <rect width="60" height="60" rx="10" fill="#0F172A" stroke="#0284C7" strokeWidth="1.5" />
                  <ShieldCheck x="18" y="14" width="24" height="24" className="text-sky-400" />
                  <text x="30" y="52" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">FIREWALL</text>
                  <text x="30" y="74" fill="#64748B" fontSize="9" textAnchor="middle" fontFamily="monospace">192.168.1.1</text>
                </g>

                {/* 2. Core Router */}
                <g transform="translate(270, 140)">
                  <rect width="60" height="60" rx="10" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
                  <RouterIcon x="18" y="14" width="24" height="24" className="text-sky-300" />
                  <text x="30" y="52" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">CORE RT</text>
                  <text x="30" y="74" fill="#64748B" fontSize="9" textAnchor="middle" fontFamily="monospace">192.168.1.254</text>
                </g>

                {/* 3. Switch 1 (VLAN 10) */}
                <g transform="translate(450, 70)">
                  <rect width="60" height="60" rx="10" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
                  <Layers x="18" y="14" width="24" height="24" className="text-slate-300" />
                  <text x="30" y="52" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">SW-VLAN10</text>
                  <text x="30" y="74" fill="#64748B" fontSize="9" textAnchor="middle" fontFamily="monospace">192.168.10.2</text>
                </g>

                {/* 4. Switch 2 (VLAN 20) */}
                <g transform="translate(450, 210)">
                  <rect width="60" height="60" rx="10" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
                  <Layers x="18" y="14" width="24" height="24" className="text-slate-300" />
                  <text x="30" y="52" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">SW-VLAN20</text>
                  <text x="30" y="74" fill="#64748B" fontSize="9" textAnchor="middle" fontFamily="monospace">192.168.20.2</text>
                </g>

                {/* 5. Workstation Client */}
                <g transform="translate(630, 70)">
                  <rect width="60" height="60" rx="10" fill="#0F172A" stroke="#10B981" strokeWidth="1.5" />
                  <Laptop x="18" y="14" width="24" height="24" className="text-emerald-400" />
                  <text x="30" y="52" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">CLIENT-01</text>
                  <text x="30" y="74" fill="#64748B" fontSize="9" textAnchor="middle" fontFamily="monospace">192.168.10.45</text>
                </g>

                {/* 6. Database Server */}
                <g transform="translate(630, 210)">
                  <rect width="60" height="60" rx="10" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
                  <Server x="18" y="14" width="24" height="24" className="text-amber-400" />
                  <text x="30" y="52" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">DB-SERVER</text>
                  <text x="30" y="74" fill="#64748B" fontSize="9" textAnchor="middle" fontFamily="monospace">192.168.20.100</text>
                </g>
              </svg>
            </div>

            {/* Real-time Telemetry Strip */}
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-800 text-xs">
              <div className="flex flex-col">
                <span className="text-slate-500">زمن الرحلة (Round-Trip Latency)</span>
                <span className="font-mono text-base font-semibold tabular-nums text-sky-400">
                  {latencyMs} ms
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500">فقدان الحزم (Packet Loss)</span>
                <span className={`font-mono text-base font-semibold tabular-nums ${packetLoss > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {packetLoss}% {packetLoss === 0 ? '● NOMINAL' : '▲ DROP'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500">عرض النطاق الترددي المتاح</span>
                <span className="font-mono text-base font-semibold tabular-nums text-slate-200">
                  {bandwidthLimitMbps[0]} Mbps
                </span>
              </div>
            </div>
          </div>

          {/* Right Zone: Control & Parameter Deck */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="h-4 w-4 text-sky-600" />
                <span>لوحة التحكم والتجارب (Control Deck)</span>
              </h3>

              {/* Ping Trigger Button */}
              <div className="space-y-2">
                <Button
                  onClick={runPingTest}
                  disabled={isPacketTesting}
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isPacketTesting ? "جاري إرسال حزم الاختبار..." : "تشغيل اختبار الحزم (Send ICMP Probe)"}
                </Button>
                <p className="text-[11px] text-slate-500 leading-tight">
                  يرسل 4 حزم بيانات من محطة العمل في VLAN 10 إلى خادم قاعدة البيانات في VLAN 20 عبر الموجه والـ Firewall.
                </p>
              </div>

              {/* Firewall Policy Switch */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    جدار الحماية: حظر الحزم بين الـ VLANs
                  </span>
                  <button
                    onClick={toggleFirewallPolicy}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      firewallBlocked ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        firewallBlocked ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  {firewallBlocked 
                    ? "القاعدة الحالية تسقط حزم ICMP العابرة بين شبكتي 10 و 20 لتطبيق مبدأ Zero Trust." 
                    : "القاعدة الحالية تسمح بتمرير حزم الاستكشاف والفحص."}
                </p>
              </div>

              {/* Bandwidth Limiter Slider */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">عرض نطاق الرابط (Bandwidth)</span>
                  <span className="font-mono text-slate-500 tabular-nums">{bandwidthLimitMbps[0]} Mbps</span>
                </div>
                <Slider
                  value={bandwidthLimitMbps}
                  onValueChange={setBandwidthLimitMbps}
                  min={100}
                  max={2000}
                  step={100}
                  className="py-1"
                />
              </div>

              {/* Diagnostic Log Terminal */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Terminal className="h-3.5 w-3.5" />
                    <span>سجل الأحداث الفوري</span>
                  </span>
                  <button
                    onClick={() => setTestLog(["تم مسح السجل. النظام جاهز."])}
                    className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    مسح
                  </button>
                </div>
                <div className="bg-slate-950 text-slate-300 font-mono text-[11px] p-2.5 rounded-lg h-32 overflow-y-auto space-y-1 border border-slate-800">
                  {testLog.map((log, index) => (
                    <div key={index} className="leading-relaxed whitespace-pre-wrap">{log}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAB MODE 2: HARDWARE & MOTHERBOARD ARCHITECTURE */}
      {activeLabMode === 'hardware' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Zone: Motherboard Blueprint Inspection */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-sky-400">SCHEMATIC: INTEL Z790 LGA 1700 MOTHERBOARD</span>
                <span className="text-xs text-slate-500">|</span>
                <span className="text-xs font-mono text-slate-400">BUS: PCIE 5.0 + DMI 4.0</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-300">
                  POST CODE: {postCode}
                </span>
              </div>
            </div>

            {/* Blueprint Image with Interactive Hotspots */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60 aspect-[16/9]">
              <img
                src="/src/assets/images/btec_hardware_lab_1792058532465.jpg"
                alt="Motherboard Schematic Architecture"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />

              {/* Interactive Target Overlays */}
              {/* CPU Socket Target */}
              <button
                onClick={() => setSelectedHardwarePart('socket')}
                className={`absolute top-[28%] left-[54%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-lg border-2 transition-all ${
                  selectedHardwarePart === 'socket' 
                    ? 'border-sky-400 bg-sky-500/20 ring-4 ring-sky-500/30' 
                    : 'border-white/40 bg-black/30 hover:border-sky-300'
                }`}
                title="LGA 1700 Processor Socket"
              />

              {/* RAM Banks Target */}
              <button
                onClick={() => setSelectedHardwarePart('ram')}
                className={`absolute top-[32%] left-[72%] -translate-x-1/2 -translate-y-1/2 w-16 h-40 rounded-lg border-2 transition-all ${
                  selectedHardwarePart === 'ram' 
                    ? 'border-sky-400 bg-sky-500/20 ring-4 ring-sky-500/30' 
                    : 'border-white/40 bg-black/30 hover:border-sky-300'
                }`}
                title="DDR5 RAM Banks"
              />

              {/* PCIe 5.0 Slot Target */}
              <button
                onClick={() => setSelectedHardwarePart('pcie')}
                className={`absolute top-[58%] left-[51%] -translate-x-1/2 -translate-y-1/2 w-48 h-10 rounded-lg border-2 transition-all ${
                  selectedHardwarePart === 'pcie' 
                    ? 'border-sky-400 bg-sky-500/20 ring-4 ring-sky-500/30' 
                    : 'border-white/40 bg-black/30 hover:border-sky-300'
                }`}
                title="PCI Express 5.0 x16 Primary Slot"
              />

              {/* Chipset Target */}
              <button
                onClick={() => setSelectedHardwarePart('chipset')}
                className={`absolute top-[71%] left-[71%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-lg border-2 transition-all ${
                  selectedHardwarePart === 'chipset' 
                    ? 'border-sky-400 bg-sky-500/20 ring-4 ring-sky-500/30' 
                    : 'border-white/40 bg-black/30 hover:border-sky-300'
                }`}
                title="Intel Z790 Chipset"
              />
            </div>

            <div className="pt-3 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>انقر على أي جزء من اللوحة الأم لاستعراض مسار البيانات والترددات التشغيلية.</span>
              <span className="font-mono text-slate-300">4 SENSORS ACTIVE</span>
            </div>
          </div>

          {/* Right Zone: Component Inspector Details */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-sky-600" />
                <span>فحص المكون المحدد (Component Inspector)</span>
              </h3>

              {selectedHardwarePart === 'socket' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400 block mb-1">
                      LGA 1700 Processor Socket
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      مقبس معالجات الجيل 13 و 14، يحتوي على 1700 نقطة اتصال لتزويد الطاقة ونقل البيانات مباشرة مع خطوط PCIe وذاكرة DDR5.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="text-slate-400 block">عرض النطاق:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">128 GB/s</span>
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="text-slate-400 block">خطوط المعالج:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">16+4 Lanes</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedHardwarePart === 'ram' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400 block mb-1">
                      DDR5 Dual-Channel RAM Banks
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      4 شقوق ذاكرة تدعم الترددات حتى 6400+ MHz. كل قناة DDR5 تتضمن قناتين فرعيتين 32-bit لتقليل زمن التأخير ومضاعفة كفاءة النقل المتزامن.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="text-slate-400 block">التردد الاسمي:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">6000 MHz</span>
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="text-slate-400 block">زمن CAS:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">CL32 (10.6ns)</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedHardwarePart === 'pcie' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400 block mb-1">
                      PCI Express 5.0 x16 Primary Slot
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      الشق الأساسي للبطاقة الرسومية، متصل مباشرة بمسارات المعالج بدون وسيط الـ Chipset لتقليل زمن التأخر إلى الصفر، محاط بدرع معدني لمنع التداخل الكهرومغناطيسي.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="text-slate-400 block">معدل النقل:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">32 GT/s</span>
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="text-slate-400 block">أقصى إنتاجية:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">64 GB/s</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedHardwarePart === 'chipset' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400 block mb-1">
                      Intel Z790 Platform Controller Hub
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      الشريحة المركزية التي تدير منافذ SATA، ومنافذ USB 3.2، ومنافذ M.2 الإضافية، وترتبط بالمعالج عبر جسر DMI 4.0 فائق السرعة.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="text-slate-400 block">رابط DMI:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">DMI 4.0 x8</span>
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="text-slate-400 block">منافذ SATA:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">6x 6Gbps</span>
                    </div>
                  </div>
                </div>
              )}

              {/* POST Diagnostics Test Runner */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <Button
                  onClick={runPostDiagnostics}
                  disabled={postTestState === 'testing'}
                  className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  {postTestState === 'testing' ? "تشغيل فحص POST..." : "تشغيل اختبار الإقلاع الذاتي (POST Diagnostic)"}
                </Button>
                {postTestState === 'success' && (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>تم اجتياز جميع اختبارات التوافق والممرات بنجاح (Post Code 0x00).</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAB MODE 3: SQL & RELATIONAL DATABASE PLAYGROUND */}
      {activeLabMode === 'sql' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Zone: SQL Editor & Result Grid */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-sky-600" />
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  محرر استعلامات SQL الفوري (BTEC Unit 2)
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span>EXEC TIME: {sqlExecutionTimeMs} ms</span>
                <span>|</span>
                <span>ROWS: {sqlResultRows.length}</span>
              </div>
            </div>

            {/* SQL Code Box */}
            <div className="space-y-2">
              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 text-sky-300 font-mono text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="اكتب استعلام SQL هنا..."
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={executeQuery}
                    size="sm"
                    className="bg-sky-600 hover:bg-sky-500 text-white font-medium"
                  >
                    <Play className="h-3.5 w-3.5 mr-1" />
                    تنفيذ الاستعلام (Run SQL)
                  </Button>
                  <Button
                    onClick={() => {
                      setSqlQuery("SELECT * FROM StudentRegistrations;");
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    عرض كل الجداول
                  </Button>
                </div>
                <span className="text-xs text-slate-400 font-mono">SCHEMA: StudentDB_3NF</span>
              </div>
            </div>

            {/* Results Table */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                مخرجات الاستعلام المباشرة (Live Dataset View)
              </span>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-xs text-right">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-medium">
                    <tr>
                      <th className="py-2.5 px-3">رقم الطالب</th>
                      <th className="py-2.5 px-3">اسم الطالب</th>
                      <th className="py-2.5 px-3">المقرر الدراسي</th>
                      <th className="py-2.5 px-3 text-center">الدرجة</th>
                      <th className="py-2.5 px-3 text-center">المستوى المستحق</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {sqlResultRows.map((row) => (
                      <tr key={row.StudentID} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2 px-3 text-sky-600 dark:text-sky-400 font-bold">{row.StudentID}</td>
                        <td className="py-2 px-3 font-sans text-slate-800 dark:text-slate-200">{row.FullName}</td>
                        <td className="py-2 px-3 font-sans text-slate-600 dark:text-slate-400">{row.CourseName}</td>
                        <td className="py-2 px-3 text-center tabular-nums font-bold">{row.Grade}%</td>
                        <td className="py-2 px-3 text-center font-sans">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                            row.Status === 'Distinction'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                              : row.Status === 'Merit'
                              ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}>
                            {row.Status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Zone: Database ERD & Optimization Deck */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>مواصفات التطبيع (3NF Normalization)</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">1NF (الشكل الطبيعي الأول)</span>
                  <p className="text-slate-600 dark:text-slate-400">
                    جميع الحقول تحتوي على قيم ذرية أحادية (Atomic Values) مع مفتاح أساسي فريد.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">2NF (الشكل الطبيعي الثاني)</span>
                  <p className="text-slate-600 dark:text-slate-400">
                    لا توجد تبعيات وظيفية جزئية؛ كل حقل غير مفتاحي يعتمد كلياً على المفتاح الأساسي.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">3NF (الشكل الطبيعي الثالث)</span>
                  <p className="text-slate-600 dark:text-slate-400">
                    إزالة التبعيات المتعدية (Transitive Dependencies)؛ لا يعتمد حقل غير رئيسي على حقل آخر غير رئيسي.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl text-xs text-sky-800 dark:text-sky-300">
                <span className="font-bold block mb-1">نصيحة معيار التميز (Distinction Tip):</span>
                <span>
                  أرفق خطة تنفيذ الاستعلام (EXPLAIN ANALYZE) موضحاً كيف يقلص الفهرس المركب (Composite Index) عدد مرات قراءة الصفحات من القرص.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
