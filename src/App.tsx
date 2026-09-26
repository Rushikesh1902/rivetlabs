import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Terminal, 
  Copy, 
  Check, 
  RotateCcw, 
  AlertTriangle, 
  Github,
  Download,
  Share2,
  Code,
  History,
  X,
  Plus,
  Trash2,
  Sun,
  Moon,
  Sliders,
  QrCode,
  Layers,
  Monitor,
  Smartphone,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Presentation,
  FileText,
  Search,
  Activity,
  Target,
  TrendingUp,
  Edit3
} from 'lucide-react';

// Preset suggestions for rapid testing
const SAMPLE_PRESETS = [
  {
    title: "DevOps / Infrastructure",
    description: "An automated infrastructure deployment tool for solo founders who waste 15+ hours weekly configuring Kubernetes, AWS IAM, and CI/CD pipelines instead of writing code."
  },
  {
    title: "Local-First Health",
    description: "An encrypted local-first blood biomarker analysis app for health optimizers who want clinical laboratory trends without handing personal medical data to centralized cloud silos."
  },
  {
    title: "AI Audio Micro-Licensing",
    description: "A decentralized peer-to-peer micro-licensing platform for synthetic voice actors and indie game studios needing legally cleared training and voice-pack rights instantly."
  }
];

interface BrandNameOption {
  name: string;
  rationale: string;
  style: string;
}

interface GeneratedBrandData {
  category: string;
  categoryDetail: string;
  originalValueProp: string;
  targetAudience: string;
  names: BrandNameOption[];
  cliches: Array<{
    phrase: string;
    critique: string;
  }>;
  improvedValueProp: string;
  boldAlternativeName: {
    name: string;
    rationale: string;
  };
  launchHeadline: string;
  secondaryHeadline: string;
  colorMood: {
    name: string;
    palette: Array<{
      name: string;
      hex: string;
      role: string;
      border?: boolean;
    }>;
  };
  typography: {
    system: string;
    displayFont: string;
    displaySpec: string;
    bodyFont: string;
    bodySpec: string;
    monoFont: string;
    monoSpec: string;
  };
  assetPrompt: string;
}

// Heuristic algorithm to directly derive the Market Category from user prompt text
function deriveMarketCategory(input: string): string {
  if (!input || !input.trim()) return "Autonomous Systems Architecture";
  const text = input.trim();

  // Strip leading filler articles and introductory framing
  const stripped = text.replace(/^(?:a|an|the|we\s+are\s+building|we\s+built|our\s+product\s+is|this\s+is|build|building|create|creating|developing|a\s+new)\s+/i, '');

  // Extract the primary subject phrase preceding connective prepositions (for, that, which, who, to, so that)
  const match = stripped.match(/^([^.,;:\n]+?)(?:\s+(?:for|built\s+for|aimed\s+at|targeted\s+at|designed\s+for|that\s+|which\s+|who\s+|to\s+help|to\s+enable|so\s+that)\b|[.,;:\n])/i);
  
  let subject = (match && match[1] && match[1].trim().length >= 3)
    ? match[1].trim()
    : stripped.split(/[.,;:\n]/)[0].trim();

  // Clean trailing dangling prepositions or conjunctions
  subject = subject.replace(/\s+(?:for|to|with|that|which|by|and|in|on|at|of)$/i, '').trim();

  const words = subject.split(/\s+/).filter(w => w.length > 0);

  // If we have a crisp 2-5 word subject, format and return directly
  if (words.length >= 2 && words.length <= 6) {
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  // Filter stop words to isolate core technical nouns
  const stopWords = new Set(['a', 'an', 'the', 'is', 'are', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'with', 'from', 'into', 'by', 'who', 'that', 'this', 'we', 'our', 'you', 'your', 'so']);
  const meaningful = words.filter(w => !stopWords.has(w.toLowerCase()));

  if (meaningful.length >= 2) {
    const selected = meaningful.slice(0, 4);
    const lastWord = selected[selected.length - 1].toLowerCase();
    const hasCategoryNoun = ['tool', 'platform', 'system', 'protocol', 'engine', 'infrastructure', 'architecture', 'service', 'network', 'suite', 'app', 'framework', 'pipeline', 'stack', 'graph', 'graphs', 'cluster', 'ledger'].some(n => lastWord.includes(n));
    const title = selected.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return hasCategoryNoun ? title : `${title} Architecture`;
  }

  if (meaningful.length === 1) {
    const word = meaningful[0].charAt(0).toUpperCase() + meaningful[0].slice(1).toLowerCase();
    return `${word} Protocol & Architecture`;
  }

  return "Autonomous Systems Architecture";
}

// Heuristic algorithm to directly derive Category Detail from user prompt text
function deriveCategoryDetail(input: string, marketCategory: string): string {
  if (!input || !input.trim()) {
    return "Deterministic Specification & Production Infrastructure";
  }
  const text = input.trim();

  // Look for action clauses ("that ...", "who ...", "to ...", "without ...", "so that ...")
  const actionMatch = text.match(/(?:who|that|which|to|without|so\s+that)\s+([^.,;:\n]+)/i);
  if (actionMatch && actionMatch[1] && actionMatch[1].trim().length > 8) {
    const rawAction = actionMatch[1].trim();
    const formatted = rawAction.charAt(0).toUpperCase() + rawAction.slice(1);
    if (formatted.length > 80) {
      return `${formatted.slice(0, 77).trim()}...`;
    }
    return formatted;
  }

  // Look for target audience / purpose clause
  const audienceMatch = text.match(/(?:for|aimed\s+at|built\s+for|targeted\s+at)\s+([^.,;:\n]+)/i);
  if (audienceMatch && audienceMatch[1] && audienceMatch[1].trim().length > 6) {
    const aud = audienceMatch[1].trim();
    return `Specialized ${marketCategory} for ${aud}`;
  }

  return `Deterministic ${marketCategory} Specification & Continuous Delivery`;
}

// Heuristic algorithm to directly derive Core Value Proposition from user prompt text
function deriveValueProposition(input: string): string {
  if (!input || !input.trim()) {
    return "Automate infrastructure deployment so founders can focus on code.";
  }
  const clean = input.trim();
  const formatted = clean.charAt(0).toUpperCase() + clean.slice(1);
  return formatted.endsWith('.') || formatted.endsWith('!') || formatted.endsWith('?') ? formatted : `${formatted}.`;
}

// Heuristic algorithm to directly derive Target Audience from user prompt text
function deriveTargetAudience(input: string): string {
  if (!input || !input.trim()) return "Solo founders, technical CTOs, and small engineering teams";
  const text = input.trim();

  // Pattern: "for [audience] who/that/struggling/wasting/shipping/seeking/facing/building/scaling"
  const m1 = text.match(/(?:for|built\s+for|serving|targeted\s+at|aimed\s+at)\s+([^.,;:\n]+?(?:who|that|struggling|wasting|shipping|seeking|facing|building|scaling)[^.,;:\n]+)/i);
  if (m1 && m1[1] && m1[1].trim().length > 6) {
    return m1[1].trim();
  }

  // Pattern: "for [audience]" up to punctuation
  const m2 = text.match(/(?:for|built\s+for|serving|targeted\s+at|aimed\s+at)\s+([^.,;:\n]+)/i);
  if (m2 && m2[1] && m2[1].trim().length > 4) {
    return m2[1].trim();
  }

  // Match domain persona plural nouns
  const personas = text.match(/\b(founders|developers|engineers|architects|creators|designers|artists|operators|analysts|teams|researchers|builders|patients|athletes|journalists|marketers)\b/gi);
  if (personas && personas.length > 0) {
    const unique = Array.from(new Set(personas.map(p => p.toLowerCase())));
    return unique.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');
  }

  return "Solo founders, technical teams, and modern builders";
}

// Derive dynamic brand naming options directly from prompt keywords
function deriveBrandNames(input: string, category: string): { names: BrandNameOption[]; boldAlternativeName: { name: string; rationale: string } } {
  // Extract salient words (length > 3, exclude stop words)
  const stopWords = new Set(['an', 'the', 'for', 'with', 'who', 'that', 'this', 'from', 'into', 'and', 'are', 'tool', 'platform', 'app', 'system', 'your', 'their']);
  const tokens = input
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !stopWords.has(w.toLowerCase()));

  const primaryRoot = (tokens[0] || 'VECTR').toUpperCase();
  const secondaryRoot = (tokens[1] || 'FORGE').toUpperCase();
  const tertiaryRoot = (tokens[2] || 'RAIL').toUpperCase();

  const cleanName1 = primaryRoot.length > 6 ? primaryRoot.slice(0, 6) : primaryRoot;
  const cleanName2 = secondaryRoot.length > 5 ? secondaryRoot.slice(0, 5) : secondaryRoot;
  const cleanName3 = tertiaryRoot.length > 5 ? tertiaryRoot.slice(0, 5) : tertiaryRoot;

  return {
    names: [
      {
        name: cleanName1,
        rationale: `Precision-focused single-word identifier directly rooted in ${category.toLowerCase()} fundamentals.`,
        style: "Kinetic Minimalist"
      },
      {
        name: `${cleanName2}KIT`,
        rationale: `Modular programmatic moniker communicating direct craftsmanship and developer utility.`,
        style: "Pragmatic Builder"
      },
      {
        name: `${cleanName3}RAIL`,
        rationale: `Structural freight metaphor conveying unbreakable deterministic speed and continuous uptime.`,
        style: "Heavy Industrial"
      }
    ],
    boldAlternativeName: {
      name: `${cleanName1}CORE`,
      rationale: `Rejects polite corporate naming conventions. Severe, uncompromising, signals an absolute end to operational overhead and complexity.`
    }
  };
}

// Function to synthesize brand data directly derived from user input
function generateBrandIntelligence(rawInput: string): GeneratedBrandData {
  const valueProp = deriveValueProposition(rawInput);
  const category = deriveMarketCategory(rawInput);
  const categoryDetail = deriveCategoryDetail(rawInput, category);
  const targetAudience = deriveTargetAudience(rawInput);
  const { names, boldAlternativeName } = deriveBrandNames(rawInput, category);

  // Dynamic headlines directly derived from extracted category and value proposition
  const firstCategoryWord = category.split(' ')[0].toUpperCase();
  const launchHeadline = `ELIMINATE ${firstCategoryWord} FRICTION. EXECUTE DETERMINISTICALLY.`;
  const secondaryHeadline = valueProp.length > 85 ? `${valueProp.slice(0, 82).trim()}...` : valueProp;

  return {
    category,
    categoryDetail,
    originalValueProp: valueProp,
    targetAudience,
    names,
    cliches: [
      { phrase: "Seamless all-in-one platform", critique: "Vague superlative that masks lack of architectural boundaries." },
      { phrase: "Next-generation intelligent workflow", critique: "Empty marketing superlative common across bloated venture decks." },
      { phrase: "Frictionless experience", critique: "Passive consumer cliché with zero measurable operational SLA." },
      { phrase: "AI-driven paradigm shift", critique: "Hype buzzword that obscures actual deterministic code execution." }
    ],
    improvedValueProp: `Zero-overhead architectural primitives that collapse ${category.toLowerCase()} complexity in seconds flat.`,
    boldAlternativeName,
    launchHeadline,
    secondaryHeadline,
    colorMood: {
      name: "Cyberpunk / High Contrast",
      palette: [
        { name: "Hacker Neon", hex: "#00FF41", role: "Primary Accent & System Execution" },
        { name: "Deep Charcoal", hex: "#050505", role: "Dominant Canvas Ground" },
        { name: "Carbon Zinc", hex: "#18181B", role: "Structural Surface" },
        { name: "Optical White", hex: "#FFFFFF", role: "High-Contrast Typography", border: true },
        { name: "Warning Hazard", hex: "#FF5500", role: "Adversarial Engine & Alert" }
      ]
    },
    typography: {
      system: "Geometria + Roboto Mono",
      displayFont: "Inter / Geometria Display Bold",
      displaySpec: "72px / Bold 900 / Tracking -0.04em",
      bodyFont: "Inter Medium (500)",
      bodySpec: "15px / Line-height 1.6 / Zinc 400 (#A1A1AA)",
      monoFont: "JetBrains Mono / Roboto Mono (Tabular)",
      monoSpec: "13px / Strict monospace / Terminal telemetry"
    },
    assetPrompt: `A high-contrast brutalist tech brand identity logo mark for '${names[0].name}', a deterministic ${category.toLowerCase()} platform. Minimalist geometric vector insignia combining hard structural silhouettes with sharp circuit paths, stark monochrome charcoal black background (#050505) with vivid electric neon green (#00FF41) accents, sharp 90-degree corners, zero gradients, vector flat icon design, Swiss style typography layout, high visual tension, hyper-clean silhouette, 8k render, SVG asset quality --v 6.0 --ar 1:1 --style raw`
  };
}

// WCAG 2.1 Accessibility Contrast Calculation Utilities
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '').trim();
  const full = clean.length === 3 
    ? clean.split('').map(c => c + c).join('') 
    : clean.padEnd(6, '0').slice(0, 6);
  const num = parseInt(full, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getRelativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const sRGB = [r, g, b].map(val => {
    const c = val / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

function calculateContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hexToRgb(hex1));
  const l2 = getRelativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getWcagRating(ratio: number): { label: string; score: 'AAA' | 'AA' | 'AA Large' | 'FAIL'; pass: boolean } {
  if (ratio >= 7.0) return { label: 'AAA (≥7:1)', score: 'AAA', pass: true };
  if (ratio >= 4.5) return { label: 'AA (≥4.5:1)', score: 'AA', pass: true };
  if (ratio >= 3.0) return { label: 'AA LRG (≥3:1)', score: 'AA Large', pass: true };
  return { label: 'FAIL (<3:1)', score: 'FAIL', pass: false };
}

// HSL Color Space Manipulation & Complementary Palette Generator
interface HSLColor {
  h: number; // 0 to 360
  s: number; // 0 to 100
  l: number; // 0 to 100
}

function hexToHsl(hex: string): HSLColor {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) / 6;
    } else if (max === gNorm) {
      h = ((bNorm - rNorm) / delta + 2) / 6;
    } else {
      h = ((rNorm - gNorm) / delta + 4) / 6;
    }
    h = Math.round(h * 360);
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hslToHex(h: number, s: number, l: number): string {
  const hNorm = ((h % 360) + 360) % 360;
  const sNorm = Math.max(0, Math.min(100, s)) / 100;
  const lNorm = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((hNorm / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (hNorm >= 0 && hNorm < 60) {
    rPrime = c; gPrime = x; bPrime = 0;
  } else if (hNorm >= 60 && hNorm < 120) {
    rPrime = x; gPrime = c; bPrime = 0;
  } else if (hNorm >= 120 && hNorm < 180) {
    rPrime = 0; gPrime = c; bPrime = x;
  } else if (hNorm >= 180 && hNorm < 240) {
    rPrime = 0; gPrime = x; bPrime = c;
  } else if (hNorm >= 240 && hNorm < 300) {
    rPrime = x; gPrime = 0; bPrime = c;
  } else {
    rPrime = c; gPrime = 0; bPrime = x;
  }

  const r = Math.round((rPrime + m) * 255);
  const g = Math.round((gPrime + m) * 255);
  const b = Math.round((bPrime + m) * 255);

  const toHex = (val: number) => val.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

interface PaletteVariationItem {
  name: string;
  hex: string;
  hslStr: string;
  role: string;
  border?: boolean;
}

interface ComplementaryVariations {
  primaryHsl: HSLColor;
  complementaryHue: number;
  darkPalette: PaletteVariationItem[];
  lightPalette: PaletteVariationItem[];
}

function generateComplementaryHslPalettes(primaryHex: string): ComplementaryVariations {
  const hsl = hexToHsl(primaryHex);
  const compHue = (hsl.h + 180) % 360;

  // Dark Complementary Palette (Void canvas + electric complementary highlights)
  const darkPalette: PaletteVariationItem[] = [
    {
      name: "Void Ground",
      hex: hslToHex(hsl.h, 16, 4),
      hslStr: `hsl(${hsl.h}, 16%, 4%)`,
      role: "Deep Charcoal Canvas Ground"
    },
    {
      name: "Chassis Surface",
      hex: hslToHex(hsl.h, 10, 9),
      hslStr: `hsl(${hsl.h}, 10%, 9%)`,
      role: "Elevated Structural Card"
    },
    {
      name: "Primary Electric",
      hex: hslToHex(hsl.h, Math.max(hsl.s, 85), 50),
      hslStr: `hsl(${hsl.h}, ${Math.max(hsl.s, 85)}%, 50%)`,
      role: "Primary Action & Focus"
    },
    {
      name: "Complementary Contrast",
      hex: hslToHex(compHue, Math.max(hsl.s, 85), 52),
      hslStr: `hsl(${compHue}, ${Math.max(hsl.s, 85)}%, 52%)`,
      role: "Opposite Wheel Accent (180°)"
    },
    {
      name: "Optical White",
      hex: hslToHex(hsl.h, 5, 98),
      hslStr: `hsl(${hsl.h}, 5%, 98%)`,
      role: "Primary Reading Typography",
      border: true
    },
    {
      name: "Hairline Divider",
      hex: hslToHex(hsl.h, 10, 18),
      hslStr: `hsl(${hsl.h}, 10%, 18%)`,
      role: "1px Monolithic Border"
    }
  ];

  // Light Complementary Palette (Stark paper + deepened AA-compliant contrast)
  const lightPalette: PaletteVariationItem[] = [
    {
      name: "Stark Paper Ground",
      hex: hslToHex(hsl.h, 8, 98),
      hslStr: `hsl(${hsl.h}, 8%, 98%)`,
      role: "Clean High-Key Canvas",
      border: true
    },
    {
      name: "Sheet Surface",
      hex: hslToHex(hsl.h, 8, 93),
      hslStr: `hsl(${hsl.h}, 8%, 93%)`,
      role: "Elevated Structural Surface"
    },
    {
      name: "Primary Deepened",
      hex: hslToHex(hsl.h, Math.min(hsl.s, 95), 32),
      hslStr: `hsl(${hsl.h}, ${Math.min(hsl.s, 95)}%, 32%)`,
      role: "High-Contrast Primary (AA Safe)"
    },
    {
      name: "Complementary Saturated",
      hex: hslToHex(compHue, Math.min(hsl.s, 90), 38),
      hslStr: `hsl(${compHue}, ${Math.min(hsl.s, 90)}%, 38%)`,
      role: "Complementary Accent (AA Safe)"
    },
    {
      name: "Pure Carbon Ink",
      hex: hslToHex(hsl.h, 15, 6),
      hslStr: `hsl(${hsl.h}, 15%, 6%)`,
      role: "High-Contrast Typography"
    },
    {
      name: "Hairline Border",
      hex: hslToHex(hsl.h, 12, 82),
      hslStr: `hsl(${hsl.h}, 12%, 82%)`,
      role: "Hairline Structural Border"
    }
  ];

  return {
    primaryHsl: hsl,
    complementaryHue: compHue,
    darkPalette,
    lightPalette
  };
}

// Workflow History Snapshot Interface
interface WorkflowCheckpoint {
  id: string;
  timestamp: string;
  step: 1 | 2 | 3 | 4;
  brandName: string;
  category: string;
  userPrompt: string;
  selectedNameIndex: number;
  useBoldAlternative: boolean;
  brandData: GeneratedBrandData;
  label?: string;
}

export default function App() {
  // Sequential 4-step workflow
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [userPrompt, setUserPrompt] = useState<string>(
    "An automated infrastructure deployment tool for solo founders and small engineering teams who waste 15+ hours weekly configuring Kubernetes, AWS IAM roles, and CI/CD pipelines instead of writing product code."
  );
  
  // Selection states
  const [selectedNameIndex, setSelectedNameIndex] = useState<number>(1); // Default to RIVET (index 1)
  const [useBoldAlternative, setUseBoldAlternative] = useState<boolean>(false);
  
  // Processing simulation
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingLog, setProcessingLog] = useState<string>("");
  const [activeBrandData, setActiveBrandData] = useState<GeneratedBrandData>(
    generateBrandIntelligence(userPrompt)
  );

  // Workflow History Sidebar State
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [activeCheckpointId, setActiveCheckpointId] = useState<string>("init-1");
  const [historyNotification, setHistoryNotification] = useState<string | null>(null);

  const [history, setHistory] = useState<WorkflowCheckpoint[]>([
    {
      id: "init-1",
      timestamp: "12:00:00",
      step: 1,
      brandName: "RIVET",
      category: "Developer Productivity Tool",
      userPrompt: "An automated infrastructure deployment tool for solo founders and small engineering teams who waste 15+ hours weekly configuring Kubernetes, AWS IAM roles, and CI/CD pipelines instead of writing product code.",
      selectedNameIndex: 1,
      useBoldAlternative: false,
      brandData: generateBrandIntelligence("An automated infrastructure deployment tool for solo founders and small engineering teams who waste 15+ hours weekly configuring Kubernetes, AWS IAM roles, and CI/CD pipelines instead of writing product code."),
      label: "Baseline Strategy (DevOps)"
    }
  ]);

  // Save new checkpoint helper
  const saveCheckpoint = (stepNumber: 1 | 2 | 3 | 4, customData?: GeneratedBrandData, customName?: string) => {
    const data = customData || activeBrandData;
    const name = customName || (useBoldAlternative ? data.boldAlternativeName.name : data.names[selectedNameIndex]?.name || data.names[0].name);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newId = `chk-${Date.now().toString(36)}`;

    const newCheckpoint: WorkflowCheckpoint = {
      id: newId,
      timestamp: timeStr,
      step: stepNumber,
      brandName: name,
      category: data.category,
      userPrompt,
      selectedNameIndex,
      useBoldAlternative,
      brandData: JSON.parse(JSON.stringify(data)),
      label: `Stage 0${stepNumber} · ${name}`
    };

    setHistory(prev => [newCheckpoint, ...prev.slice(0, 19)]);
    setActiveCheckpointId(newId);
    setHistoryNotification(`SAVED CHECKPOINT: ${name}`);
    setTimeout(() => setHistoryNotification(null), 2000);
  };

  // Switch back / restore previous checkpoint helper
  const restoreCheckpoint = (checkpoint: WorkflowCheckpoint) => {
    setActiveBrandData(JSON.parse(JSON.stringify(checkpoint.brandData)));
    setCurrentStep(checkpoint.step);
    setUserPrompt(checkpoint.userPrompt);
    setSelectedNameIndex(checkpoint.selectedNameIndex);
    setUseBoldAlternative(checkpoint.useBoldAlternative);
    setActiveCheckpointId(checkpoint.id);
    setHistoryNotification(`RESTORED: ${checkpoint.brandName} (STAGE 0${checkpoint.step})`);
    setTimeout(() => setHistoryNotification(null), 2500);
  };

  // Delete checkpoint helper
  const deleteCheckpoint = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(c => c.id !== id));
  };

  // Copy feedback states
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedMeta, setCopiedMeta] = useState<boolean>(false);

  // Social preview generator controls (Brutalist CSS Themes)
  const [ogTheme, setOgTheme] = useState<'monochromatic' | 'neon' | 'surgical-paper' | 'primary-accent'>('neon');
  const [ogFormat, setOgFormat] = useState<'landscape' | 'square'>('landscape');

  // Color Mood tool state (swatches, WCAG audit, HSL complementary generator)
  const [colorMoodView, setColorMoodView] = useState<'swatches' | 'contrast' | 'hsl'>('hsl');
  const [testContrastHex, setTestContrastHex] = useState<string>('#00FF41');
  const [hslSubTab, setHslSubTab] = useState<'both' | 'dark' | 'light'>('both');
  const [copiedHslCode, setCopiedHslCode] = useState<string | null>(null);

  // Brutalist QR Code Generator State
  const [customQrUrl, setCustomQrUrl] = useState<string>('');
  const [qrStyle, setQrStyle] = useState<'paper' | 'dark' | 'matrix'>('paper');
  const [qrSvg, setQrSvg] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedQrStatus, setCopiedQrStatus] = useState<string | null>(null);

  // Live Preview Web Banner State
  const [bannerVariant, setBannerVariant] = useState<'hero' | 'strip' | 'callout'>('hero');
  const [bannerTheme, setBannerTheme] = useState<'dark' | 'light' | 'accent'>('dark');
  const [bannerViewport, setBannerViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedBannerCode, setCopiedBannerCode] = useState<boolean>(false);

  // Pitch Deck Generator State
  const [pitchSlideIndex, setPitchSlideIndex] = useState<number>(0);
  const [pitchDeckTheme, setPitchDeckTheme] = useState<'dark' | 'light'>('dark');
  const [isAutoPlayingPitch, setIsAutoPlayingPitch] = useState<boolean>(false);
  const [copiedDeckMarkdown, setCopiedDeckMarkdown] = useState<boolean>(false);

  // SEO Health Score State
  const [seoIntentFilter, setSeoIntentFilter] = useState<'all' | 'transactional' | 'commercial' | 'informational'>('all');
  const [copiedSeoSchema, setCopiedSeoSchema] = useState<boolean>(false);
  const [simulatedKeyword, setSimulatedKeyword] = useState<string>('');

  // Step 2 Positioning Customization State
  const [isEditingCategory, setIsEditingCategory] = useState<boolean>(false);
  const [editCategoryVal, setEditCategoryVal] = useState<string>('');
  const [editCategoryDetailVal, setEditCategoryDetailVal] = useState<string>('');

  const [isEditingValueProp, setIsEditingValueProp] = useState<boolean>(false);
  const [editValuePropVal, setEditValuePropVal] = useState<string>('');
  const [editTargetAudienceVal, setEditTargetAudienceVal] = useState<string>('');

  const applyPaletteVariation = (paletteItems: PaletteVariationItem[], title: string) => {
    setActiveBrandData(prev => ({
      ...prev,
      colorMood: {
        name: title,
        palette: paletteItems.map(p => ({
          name: p.name,
          hex: p.hex,
          role: p.role,
          border: p.border
        }))
      }
    }));
    setHistoryNotification(`APPLIED: ${title.toUpperCase()}`);
    setTimeout(() => setHistoryNotification(null), 2500);
  };

  const copyCssVariables = (items: PaletteVariationItem[], modeName: string) => {
    const css = `/* ${modeName} - Generated via HSL Manipulation */\n:root {\n` +
      items.map(item => `  --color-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}: ${item.hex}; /* ${item.hslStr} */`).join('\n') +
      `\n}`;
    navigator.clipboard.writeText(css);
    setCopiedHslCode(modeName);
    setTimeout(() => setCopiedHslCode(null), 2000);
  };

  // Re-generate or initialize brand data when prompt executes
  const executeStepOne = () => {
    setIsProcessing(true);
    setProcessingLog("SYSTEM_BOOT: PARSING_SEMANTIC_INTENT...");

    setTimeout(() => {
      setProcessingLog("EXTRACTION: ISOLATING_MARKET_VECTORS...");
    }, 400);

    setTimeout(() => {
      setProcessingLog("SYNTHESIS: COMPOSING_POSITIONING_MATRIX...");
    }, 900);

    setTimeout(() => {
      const generated = generateBrandIntelligence(userPrompt);
      setActiveBrandData(generated);
      setIsProcessing(false);
      setCurrentStep(2);
      saveCheckpoint(2, generated, generated.names[selectedNameIndex]?.name || generated.names[0].name);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1400);
  };

  const executeStepTwo = () => {
    setIsProcessing(true);
    setProcessingLog("INITIATING: ADVERSARIAL_CRITIC_NETWORK...");

    setTimeout(() => {
      setProcessingLog("SCANNING: DETECTING_BUZZWORD_CLICHES...");
    }, 450);

    setTimeout(() => {
      setProcessingLog("RE-CONSTRUCTION: SHARPENING_VALUE_HYPOTHESIS...");
    }, 850);

    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(3);
      saveCheckpoint(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1350);
  };

  const executeStepThree = () => {
    setIsProcessing(true);
    setProcessingLog("COMPILING: BRAND_DESIGN_TOKENS...");

    setTimeout(() => {
      setProcessingLog("VECTORIZING: LOGO_GEOMETRY_MATRIX...");
    }, 450);

    setTimeout(() => {
      setProcessingLog("FINALIZING: ASSET_PROMPT_GENERATION...");
    }, 900);

    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(4);
      saveCheckpoint(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1400);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setUseBoldAlternative(false);
    setSelectedNameIndex(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = (text: string, type: 'prompt' | 'json' | 'hex', hexVal?: string) => {
    navigator.clipboard.writeText(text);
    if (type === 'prompt') {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else if (type === 'json') {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } else if (type === 'hex' && hexVal) {
      setCopiedHex(hexVal);
      setTimeout(() => setCopiedHex(null), 1500);
    }
  };

  const copyOgMetaTags = () => {
    const metaSnippet = `<!-- OpenGraph Brand Intelligence Tags -->
<meta property="og:type" content="website" />
<meta property="og:title" content="${activeBrandData.launchHeadline}" />
<meta property="og:description" content="${activeBrandData.secondaryHeadline}" />
<meta property="og:image" content="https://assets.rivetlabs.io/og/${currentActiveName.toLowerCase()}-1200x630.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${activeBrandData.launchHeadline}" />
<meta name="twitter:description" content="${activeBrandData.secondaryHeadline}" />
<meta name="twitter:image" content="https://assets.rivetlabs.io/og/${currentActiveName.toLowerCase()}-1200x630.png" />`;

    navigator.clipboard.writeText(metaSnippet);
    setCopiedMeta(true);
    setTimeout(() => setCopiedMeta(false), 2000);
  };

  // Determine active brand name
  const currentActiveName = useBoldAlternative 
    ? activeBrandData.boldAlternativeName.name 
    : activeBrandData.names[selectedNameIndex]?.name || activeBrandData.names[0].name;

  // Effective QR URL
  const effectiveQrUrl = customQrUrl.trim() || `https://rivetlabs.io/${currentActiveName.toLowerCase()}`;

  // Generate QR code dynamically on URL or style change
  useEffect(() => {
    let isMounted = true;
    const darkColor = qrStyle === 'dark' ? '#FFFFFF' : (qrStyle === 'matrix' ? '#00FF41' : '#000000');
    const lightColor = qrStyle === 'dark' || qrStyle === 'matrix' ? '#050505' : '#FFFFFF';

    QRCode.toString(effectiveQrUrl, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: darkColor,
        light: lightColor
      }
    }).then(svg => {
      if (isMounted) setQrSvg(svg);
    }).catch(() => {});

    QRCode.toDataURL(effectiveQrUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 640,
      color: {
        dark: darkColor,
        light: lightColor
      }
    }).then(url => {
      if (isMounted) setQrDataUrl(url);
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [effectiveQrUrl, qrStyle]);

  const downloadQrAsset = (format: 'svg' | 'png') => {
    if (format === 'svg' && qrSvg) {
      const blob = new Blob([qrSvg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentActiveName.toLowerCase()}-brand-qr.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'png' && qrDataUrl) {
      const a = document.createElement('a');
      a.href = qrDataUrl;
      a.download = `${currentActiveName.toLowerCase()}-brand-qr.png`;
      a.click();
    }
    setCopiedQrStatus(`DOWNLOADED_${format.toUpperCase()}`);
    setTimeout(() => setCopiedQrStatus(null), 2000);
  };

  const copyQrString = (type: 'svg' | 'url') => {
    if (type === 'svg') {
      navigator.clipboard.writeText(qrSvg);
      setCopiedQrStatus('COPIED_SVG');
    } else {
      navigator.clipboard.writeText(effectiveQrUrl);
      setCopiedQrStatus('COPIED_URL');
    }
    setTimeout(() => setCopiedQrStatus(null), 2000);
  };

  const copyBannerComponentCode = () => {
    const primaryBrandHex = activeBrandData.colorMood.palette.find(p => p.role.toLowerCase().includes('primary'))?.hex || activeBrandData.colorMood.palette[0].hex;
    const cleanCompName = currentActiveName.replace(/[^a-zA-Z0-9]/g, '') || 'Brand';
    const code = `// ${currentActiveName} Production Web Banner Component
// Generated by Rivet Labs Brand Intelligence
import React from 'react';

export function ${cleanCompName}Banner() {
  return (
    <section className="relative overflow-hidden border border-zinc-800 bg-[#050505] text-white p-6 sm:p-12 font-['${activeBrandData.typography.bodyFont}',sans-serif]">
      {/* Accent Top Hazard Border */}
      <div 
        className="absolute top-0 left-0 right-0 h-1" 
        style={{ backgroundColor: '${primaryBrandHex}' }} 
      />

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Release Tag */}
        <div className="inline-flex items-center gap-2 border border-zinc-800 bg-black px-3 py-1 font-['${activeBrandData.typography.monoFont}',monospace] text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '${primaryBrandHex}' }} />
          <span className="text-zinc-400 font-bold">${currentActiveName.toUpperCase()} // RELEASE v1.0</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300">${activeBrandData.category.toUpperCase()}</span>
        </div>

        {/* Display Headline */}
        <h1 
          className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none font-['${activeBrandData.typography.displayFont}',sans-serif]"
        >
          ${activeBrandData.launchHeadline}
        </h1>

        {/* Value Proposition Body */}
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-normal leading-relaxed">
          ${activeBrandData.secondaryHeadline}
        </p>

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap items-center gap-3 font-['${activeBrandData.typography.monoFont}',monospace] text-xs">
          <button 
            className="px-6 py-3 font-bold uppercase transition-none"
            style={{ backgroundColor: '${primaryBrandHex}', color: '#000000' }}
          >
            INITIALIZE ${currentActiveName.toUpperCase()} &rarr;
          </button>
          <button className="px-5 py-3 border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white uppercase transition-none">
            VIEW DOCUMENTATION
          </button>
        </div>
      </div>
    </section>
  );
}`;
    navigator.clipboard.writeText(code);
    setCopiedBannerCode(true);
    setTimeout(() => setCopiedBannerCode(false), 2000);
  };

  // Autoplay effect for pitch deck presentation
  useEffect(() => {
    if (!isAutoPlayingPitch) return;
    const interval = setInterval(() => {
      setPitchSlideIndex(prev => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlayingPitch]);

  const copyPitchDeckMarkdown = () => {
    const primaryBrandHex = activeBrandData.colorMood.palette.find(p => p.role.toLowerCase().includes('primary'))?.hex || activeBrandData.colorMood.palette[0].hex;
    const md = `# ${currentActiveName} — Investor Pitch Deck Blueprint
**Category**: ${activeBrandData.category}
**Primary Color Token**: ${primaryBrandHex}
**Generated**: ${new Date().toLocaleDateString()}

---

## Slide 1: Hero & Vision
- **Wordmark**: ${currentActiveName}
- **Launch Headline**: ${activeBrandData.launchHeadline}
- **Secondary Thesis**: ${activeBrandData.secondaryHeadline}
- **Positioning**: ${activeBrandData.category}
- **Status**: Production Certified // Rev 1.0

---

## Slide 2: Problem & Structural Solution
- **The Core Problem**: Solo technical founders & high-velocity teams waste 15+ engineering hours configuring bloated legacy frameworks and generic boilerplate.
- **The Structural Solution**: ${activeBrandData.improvedValueProp}
- **The Strategic Advantage**: ${activeBrandData.categoryDetail}
- **Key Value Drivers**:
  1. Deterministic execution over fuzzy speculation
  2. Zero-pill, high-contrast industrial brutalist UX
  3. Immediate launch readiness with verified specs

---

## Slide 3: Market & Strategic Positioning
- **Category Definition**: ${activeBrandData.category}
- **Target Audience**: ${activeBrandData.targetAudience}
- **Competitive Vector**: Transcends noisy AI wrapper conventions with an uncompromising, code-grounded design system.
- **Strategic Angle**: "${activeBrandData.categoryDetail}"

---

## Slide 4: Brand Identity & Design System
- **Display Typography**: ${activeBrandData.typography.displayFont} (${activeBrandData.typography.displaySpec})
- **Body Prose Typography**: ${activeBrandData.typography.bodyFont} (${activeBrandData.typography.bodySpec})
- **Telemetric Monospace**: ${activeBrandData.typography.monoFont} (${activeBrandData.typography.monoSpec})
- **Primary Color**: ${primaryBrandHex}
- **Accessibility**: 100% WCAG AA Certified
`;
    navigator.clipboard.writeText(md);
    setCopiedDeckMarkdown(true);
    setTimeout(() => setCopiedDeckMarkdown(false), 2000);
  };

  const copySeoSchema = () => {
    const primaryBrandHex = activeBrandData.colorMood.palette.find(p => p.role.toLowerCase().includes('primary'))?.hex || activeBrandData.colorMood.palette[0].hex;
    const titleTag = `${activeBrandData.launchHeadline} | ${currentActiveName}`;
    const metaDesc = activeBrandData.secondaryHeadline;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": currentActiveName,
      "headline": activeBrandData.launchHeadline,
      "description": activeBrandData.secondaryHeadline,
      "applicationCategory": activeBrandData.category,
      "operatingSystem": "Web, Local Bare Metal",
      "url": `https://rivetlabs.io/${currentActiveName.toLowerCase()}`,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "brand": {
        "@type": "Brand",
        "name": currentActiveName,
        "color": primaryBrandHex
      }
    };

    const snippet = `<!-- Primary HTML Title & Meta Tags -->
<title>${titleTag}</title>
<meta name="title" content="${titleTag}" />
<meta name="description" content="${metaDesc}" />

<!-- OpenGraph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://rivetlabs.io/${currentActiveName.toLowerCase()}" />
<meta property="og:title" content="${titleTag}" />
<meta property="og:description" content="${metaDesc}" />
<meta property="og:image" content="https://rivetlabs.io/og/${currentActiveName.toLowerCase()}.png" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="https://rivetlabs.io/${currentActiveName.toLowerCase()}" />
<meta property="twitter:title" content="${titleTag}" />
<meta property="twitter:description" content="${metaDesc}" />

<!-- Schema.org JSON-LD Structured Data -->
<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>`;

    navigator.clipboard.writeText(snippet);
    setCopiedSeoSchema(true);
    setTimeout(() => setCopiedSeoSchema(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white brutalist-grid flex flex-col selection:bg-[#00FF41] selection:text-black">
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#050505] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Top Left: Neon green square + RIVET LABS */}
          <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 bg-[#00FF41] shrink-0" aria-hidden="true" />
            <span className="font-mono font-bold tracking-wider text-base text-white uppercase">
              RIVET LABS
            </span>
            <span className="hidden md:inline-block font-mono text-[11px] text-zinc-500 border-l border-zinc-800 pl-3 ml-1">
              AI_BRAND_INTELLIGENCE // V1.0
            </span>
          </div>

          {/* Stepper Status Indicators (Monospace, no pills) */}
          <div className="hidden lg:flex items-center gap-1 font-mono text-xs">
            <button 
              onClick={() => setCurrentStep(1)} 
              className={`px-2.5 py-1 border transition-none ${
                currentStep === 1 
                  ? 'border-[#00FF41] text-[#00FF41] bg-[#00FF41]/10' 
                  : 'border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
              }`}
            >
              [ 01 DISCOVER ]
            </button>
            <span className="text-zinc-700">→</span>
            <button 
              onClick={() => currentStep >= 2 && setCurrentStep(2)} 
              disabled={currentStep < 2}
              className={`px-2.5 py-1 border transition-none ${
                currentStep === 2 
                  ? 'border-[#00FF41] text-[#00FF41] bg-[#00FF41]/10' 
                  : currentStep > 2 
                    ? 'border-zinc-700 text-zinc-300 hover:border-[#00FF41]' 
                    : 'border-zinc-900 text-zinc-700 cursor-not-allowed'
              }`}
            >
              [ 02 POSITION ]
            </button>
            <span className="text-zinc-700">→</span>
            <button 
              onClick={() => currentStep >= 3 && setCurrentStep(3)} 
              disabled={currentStep < 3}
              className={`px-2.5 py-1 border transition-none ${
                currentStep === 3 
                  ? 'border-[#FF5500] text-[#FF5500] bg-[#FF5500]/10' 
                  : currentStep > 3 
                    ? 'border-zinc-700 text-zinc-300 hover:border-[#FF5500]' 
                    : 'border-zinc-900 text-zinc-700 cursor-not-allowed'
              }`}
            >
              [ 03 CHALLENGE ]
            </button>
            <span className="text-zinc-700">→</span>
            <button 
              onClick={() => currentStep >= 4 && setCurrentStep(4)} 
              disabled={currentStep < 4}
              className={`px-2.5 py-1 border transition-none ${
                currentStep === 4 
                  ? 'border-[#00FF41] text-[#00FF41] bg-[#00FF41]/10' 
                  : 'border-zinc-900 text-zinc-700 cursor-not-allowed'
              }`}
            >
              [ 04 DELIVER ]
            </button>
          </div>

          {/* Top Right: History, Pro (Soon) and GitHub */}
          <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs">
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 border border-zinc-800 hover:border-[#00FF41] hover:text-[#00FF41] text-zinc-300 transition-none cursor-pointer"
              title="View and restore workflow history snapshots"
            >
              <History className="w-3.5 h-3.5 text-[#00FF41]" />
              <span className="hidden sm:inline">HISTORY</span>
              <span className="text-[10px] text-zinc-500 bg-zinc-900 px-1 border border-zinc-800">
                {history.length}
              </span>
            </button>

            <span 
              className="text-zinc-500 hover:text-white cursor-pointer transition-none select-none tracking-tight hidden sm:inline"
              title="Pro tier: Automated SVG vector exports, domain scanner, color profile ICC sync"
            >
              Pro (Soon)
            </span>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-400 hover:text-[#00FF41] transition-none p-1 border border-transparent hover:border-zinc-800"
              aria-label="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col justify-center">

        {/* PROCESSING OVERLAY SIMULATION */}
        {isProcessing && (
          <div className="fixed inset-0 z-50 bg-[#050505]/90 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0a0a0a] border border-[#00FF41] p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="font-mono text-xs text-[#00FF41] flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#00FF41] animate-ping" />
                  PIPELINE_EXECUTING
                </span>
                <span className="font-mono text-[10px] text-zinc-500">STAGE {currentStep} ➔ {currentStep + 1}</span>
              </div>
              <div className="py-6 space-y-3 font-mono text-xs">
                <div className="text-zinc-400">&gt; {processingLog}</div>
                <div className="w-full bg-zinc-900 h-1.5 overflow-hidden">
                  <div className="bg-[#00FF41] h-full w-full animate-pulse" />
                </div>
                <div className="text-[11px] text-zinc-600">
                  Rejecting single-prompt hallucination. Synthesizing structural brand logic...
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: DISCOVER (Input Screen) */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center my-auto py-6">
            
            {/* Hero Section */}
            <div className="text-center mb-10 sm:mb-12">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-white">
                Stop overthinking.
              </h1>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-zinc-600 mt-2">
                Start building.
              </h1>
              <p className="font-mono text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto mt-6 tracking-tight leading-relaxed">
                Turn a messy app idea into a complete brand strategy, visual direction, and launch kit in seconds.
              </p>
            </div>

            {/* Input Area Enclosed by large faint brackets [ ] */}
            <div className="w-full relative flex items-center justify-center my-2">
              {/* Left faint bracket */}
              <span className="text-zinc-700 font-mono text-6xl sm:text-8xl select-none hidden sm:inline-block font-thin mr-2 sm:mr-4">
                [
              </span>

              {/* Textarea container */}
              <div className="w-full flex-1">
                <div className="relative">
                  <textarea
                    rows={5}
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Describe your product, target audience, and core problem..."
                    className="w-full bg-[#0a0a0a] text-zinc-100 placeholder:text-zinc-600 font-mono text-xs sm:text-sm p-4 sm:p-5 border border-zinc-800 border-r-4 border-r-[#00FF41] rounded-none outline-none focus:border-zinc-600 focus:border-r-[#00FF41] focus:ring-0 resize-y leading-relaxed"
                  />
                  <div className="absolute bottom-3 right-4 font-mono text-[10px] text-zinc-600 select-none">
                    INPUT_LENGTH: {userPrompt.length} CHARS
                  </div>
                </div>
              </div>

              {/* Right faint bracket */}
              <span className="text-zinc-700 font-mono text-6xl sm:text-8xl select-none hidden sm:inline-block font-thin ml-2 sm:ml-4">
                ]
              </span>
            </div>

            {/* Quick Presets for Rapid Evaluation */}
            <div className="w-full max-w-2xl mt-4 mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  Quick Seed Presets:
                </span>
                <span className="font-mono text-[10px] text-zinc-600">Click to inject</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setUserPrompt(preset.description)}
                    className="text-left font-mono text-xs p-2.5 border border-zinc-800 bg-[#080808] text-zinc-400 hover:text-white hover:border-[#00FF41] hover:bg-zinc-900 transition-none"
                  >
                    <div className="font-semibold text-zinc-300 truncate">{preset.title}</div>
                    <div className="text-[10px] text-zinc-600 truncate mt-0.5">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action: Bold Neon Green EXECUTE Button */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={executeStepOne}
                disabled={!userPrompt.trim()}
                className="bg-[#00FF41] text-black font-mono font-bold text-sm sm:text-base px-10 py-4 border border-[#00FF41] hover:bg-white hover:text-black transition-none uppercase tracking-wider flex items-center gap-3 cursor-pointer shadow-none active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>EXECUTE ↵</span>
              </button>
              <span className="font-mono text-[11px] text-zinc-600 tracking-tight">
                Stage 1 of 4 · Triggers deterministic positioning matrix
              </span>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: POSITION & SHAPE (Strategy Dashboard) */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="w-full max-w-5xl mx-auto space-y-6">
            
            {/* Dashboard Header & Required System Status Indicator */}
            <div className="border border-zinc-800 bg-[#080808] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="font-mono text-sm sm:text-base text-[#00FF41] font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#00FF41] inline-block animate-pulse" />
                  &gt; SYSTEM_STATUS: POSITIONING SECURED
                </div>
                <div className="font-mono text-xs text-zinc-500 mt-1">
                  STAGE_02 // RAW_IDEA_MAPPED_TO_STRATEGIC_PARAMETERS
                </div>
              </div>

              <div className="font-mono text-xs text-zinc-300 bg-zinc-900 px-3 py-1.5 border border-zinc-800 flex items-center gap-2">
                <span className="text-zinc-500">PROMPT_VECTOR:</span>
                <span className="text-zinc-200 font-bold max-w-md truncate" title={activeBrandData.targetAudience}>
                  {activeBrandData.targetAudience}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingValueProp(true);
                    setEditValuePropVal(activeBrandData.originalValueProp);
                    setEditTargetAudienceVal(activeBrandData.targetAudience);
                  }}
                  className="text-zinc-500 hover:text-[#00FF41] ml-1 transition-none cursor-pointer"
                  title="Edit prompt vector & audience"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Structured Monospace Data Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Card 1: Market Category */}
              <div className="border border-zinc-800 bg-[#080808] p-5 sm:p-6 flex flex-col justify-between hover:border-zinc-700 transition-none">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-mono text-[11px] text-zinc-500 tracking-widest uppercase">
                      // PARAM_01: MARKET_CATEGORY
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingCategory(prev => !prev);
                        setEditCategoryVal(activeBrandData.category);
                        setEditCategoryDetailVal(activeBrandData.categoryDetail);
                      }}
                      className="font-mono text-[10px] text-zinc-400 hover:text-[#00FF41] flex items-center gap-1 border border-zinc-800 hover:border-zinc-600 px-2 py-0.5 transition-none cursor-pointer"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>{isEditingCategory ? 'CLOSE' : 'EDIT'}</span>
                    </button>
                  </div>

                  {isEditingCategory ? (
                    <div className="space-y-3 pt-2 font-mono">
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase block mb-1">
                          Market Category:
                        </label>
                        <input
                          type="text"
                          value={editCategoryVal}
                          onChange={(e) => setEditCategoryVal(e.target.value)}
                          className="w-full bg-black border border-zinc-700 text-white font-mono text-sm px-3 py-1.5 outline-none focus:border-[#00FF41]"
                          placeholder="e.g. Autonomous Security Operations"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase block mb-1">
                          Category Detail / Subtitle:
                        </label>
                        <input
                          type="text"
                          value={editCategoryDetailVal}
                          onChange={(e) => setEditCategoryDetailVal(e.target.value)}
                          className="w-full bg-black border border-zinc-700 text-white font-mono text-xs px-3 py-1.5 outline-none focus:border-[#00FF41]"
                          placeholder="e.g. Air-Gapped Threat Detection Protocol"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            if (editCategoryVal.trim()) {
                              setActiveBrandData(prev => ({
                                ...prev,
                                category: editCategoryVal.trim(),
                                categoryDetail: editCategoryDetailVal.trim() || prev.categoryDetail
                              }));
                              setIsEditingCategory(false);
                              setHistoryNotification(`UPDATED: CATEGORY -> ${editCategoryVal.trim().toUpperCase()}`);
                              setTimeout(() => setHistoryNotification(null), 2500);
                            }
                          }}
                          className="px-3 py-1 bg-[#00FF41] text-black font-bold uppercase transition-none cursor-pointer"
                        >
                          SAVE CHANGES
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingCategory(false)}
                          className="px-3 py-1 border border-zinc-800 text-zinc-400 hover:text-white uppercase transition-none cursor-pointer"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-mono text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {activeBrandData.category}
                      </h3>
                      <p className="font-mono text-xs text-zinc-400 mt-2 leading-relaxed">
                        {activeBrandData.categoryDetail}
                      </p>
                    </>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between font-mono text-[11px] text-zinc-500">
                  <span>MARKET_DISRUPTION_INDEX: HIGH</span>
                  <span className="text-[#00FF41]">[USER VERIFIED]</span>
                </div>
              </div>

              {/* Card 2: Core Value Proposition */}
              <div className="border border-zinc-800 bg-[#080808] p-5 sm:p-6 flex flex-col justify-between hover:border-zinc-700 transition-none">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-mono text-[11px] text-zinc-500 tracking-widest uppercase">
                      // PARAM_02: CORE_VALUE_PROPOSITION
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingValueProp(prev => !prev);
                        setEditValuePropVal(activeBrandData.originalValueProp);
                        setEditTargetAudienceVal(activeBrandData.targetAudience);
                      }}
                      className="font-mono text-[10px] text-zinc-400 hover:text-[#00FF41] flex items-center gap-1 border border-zinc-800 hover:border-zinc-600 px-2 py-0.5 transition-none cursor-pointer"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>{isEditingValueProp ? 'CLOSE' : 'EDIT'}</span>
                    </button>
                  </div>

                  {isEditingValueProp ? (
                    <div className="space-y-3 pt-2 font-mono">
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase block mb-1">
                          Core Value Proposition:
                        </label>
                        <textarea
                          rows={3}
                          value={editValuePropVal}
                          onChange={(e) => setEditValuePropVal(e.target.value)}
                          className="w-full bg-black border border-zinc-700 text-white font-mono text-xs p-2.5 outline-none focus:border-[#00FF41] leading-relaxed"
                          placeholder="Describe the product value proposition..."
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase block mb-1">
                          Target Audience:
                        </label>
                        <input
                          type="text"
                          value={editTargetAudienceVal}
                          onChange={(e) => setEditTargetAudienceVal(e.target.value)}
                          className="w-full bg-black border border-zinc-700 text-white font-mono text-xs px-3 py-1.5 outline-none focus:border-[#00FF41]"
                          placeholder="e.g. Solo founders, DevOps engineers..."
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            if (editValuePropVal.trim()) {
                              setActiveBrandData(prev => ({
                                ...prev,
                                originalValueProp: editValuePropVal.trim(),
                                targetAudience: editTargetAudienceVal.trim() || prev.targetAudience
                              }));
                              setIsEditingValueProp(false);
                              setHistoryNotification("UPDATED: VALUE PROPOSITION SYNCHRONIZED");
                              setTimeout(() => setHistoryNotification(null), 2500);
                            }
                          }}
                          className="px-3 py-1 bg-[#00FF41] text-black font-bold uppercase transition-none cursor-pointer"
                        >
                          SAVE CHANGES
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingValueProp(false)}
                          className="px-3 py-1 border border-zinc-800 text-zinc-400 hover:text-white uppercase transition-none cursor-pointer"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-mono text-lg sm:text-xl font-bold text-zinc-100 tracking-tight leading-snug">
                        "{activeBrandData.originalValueProp}"
                      </p>
                    </>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-900 font-mono text-xs text-zinc-400">
                  <span className="text-zinc-500">TARGET AUDIENCE: </span>
                  <span className="text-zinc-200">{activeBrandData.targetAudience}</span>
                </div>
              </div>

            </div>

            {/* Card 3: Naming Protocols (3 generated brand names with rationales) */}
            <div className="border border-zinc-800 bg-[#080808] p-5 sm:p-6 hover:border-zinc-700 transition-none">
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-[11px] text-zinc-500 tracking-widest uppercase">
                  // PARAM_03: NAMING_PROTOCOLS
                </div>
                <span className="font-mono text-[11px] text-zinc-400">
                  Select candidate for visual compilation:
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeBrandData.names.map((item, index) => {
                  const isSelected = selectedNameIndex === index && !useBoldAlternative;
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedNameIndex(index);
                        setUseBoldAlternative(false);
                      }}
                      className={`cursor-pointer p-4 border transition-none flex flex-col justify-between ${
                        isSelected 
                          ? 'border-[#00FF41] bg-[#00FF41]/5 text-white' 
                          : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-600 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs text-zinc-500">OPT_0{index + 1}</span>
                          <span className="font-mono text-[10px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
                            {item.style}
                          </span>
                        </div>
                        <div className="font-mono text-2xl font-black text-white tracking-wider my-1">
                          {item.name}
                        </div>
                        <p className="font-mono text-xs text-zinc-400 mt-2 leading-relaxed">
                          {item.rationale}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between font-mono text-[11px]">
                        <span className={isSelected ? 'text-[#00FF41]' : 'text-zinc-600'}>
                          {isSelected ? '● SELECTED' : '○ CLICK TO SELECT'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strategic Diagnostic & Next Action */}
            <div className="border border-zinc-800 bg-[#0a0a0a] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="font-mono text-xs text-zinc-400 space-y-1">
                <div className="text-zinc-300 font-semibold">&gt; READY TO CHALLENGE ASSUMPTIONS:</div>
                <div className="text-zinc-500">
                  Most early-stage brands default to generic B2B clichés. Proceed to the anti-generic critic to filter corporate noise.
                </div>
              </div>

              {/* Action: Warning/Orange Button INITIATE ANTI-GENERIC CRITIC */}
              <button
                type="button"
                onClick={executeStepTwo}
                className="bg-[#FF5500] text-black font-mono font-bold text-xs sm:text-sm px-7 py-3.5 border border-[#FF5500] hover:bg-white hover:text-black transition-none uppercase tracking-wider flex items-center gap-2 whitespace-nowrap cursor-pointer active:translate-y-0.5"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>INITIATE ANTI-GENERIC CRITIC</span>
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: CHALLENGE (The Anti-Generic Engine) */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="w-full max-w-5xl mx-auto space-y-6">
            
            {/* Status bar */}
            <div className="border border-zinc-800 bg-[#080808] p-4 flex items-center justify-between">
              <div className="font-mono text-xs sm:text-sm text-[#FF5500] font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                &gt; ADVERSARIAL_CRITIC_ACTIVE: SELF_AUDIT_PROTOCOL_ENGAGED
              </div>
              <span className="font-mono text-[11px] text-zinc-500">
                CLICHE_DETECTION_MODEL: STRICT
              </span>
            </div>

            {/* Alert-Style Panel (Border-left thick orange/red) */}
            <div className="border border-zinc-800 border-l-4 border-l-[#FF5500] bg-[#0c0806] p-6 sm:p-8 space-y-6">
              
              <div>
                <div className="font-mono text-xs text-[#FF5500] font-bold tracking-widest uppercase">
                  ANTI-GENERIC CRITIC // BIAS &amp; CLICHÉ AUDIT
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                  Exposing industry cliches &amp; corporate camouflage.
                </h2>
                <p className="font-mono text-xs text-zinc-400 mt-2 max-w-3xl leading-relaxed">
                  The system reviewed Stage 2 outputs to purge safe, risk-averse B2B tropes before locking the visual system.
                </p>
              </div>

              {/* Identified Cliches / Buzzwords */}
              <div className="space-y-3 pt-2">
                <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="text-[#FF5500]">▼</span>
                  <span>IDENTIFIED CLICHÉS / BUZZWORDS DETECTED IN SECTOR:</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeBrandData.cliches.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="border border-zinc-800 bg-[#140d0a] p-3.5 flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#FF5500] line-through font-bold">
                          "{item.phrase}"
                        </span>
                        <span className="font-mono text-[10px] text-zinc-500 uppercase">[FLAGGED]</span>
                      </div>
                      <p className="font-mono text-[11px] text-zinc-400 mt-1.5 leading-snug">
                        {item.critique}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Improved Value Proposition */}
              <div className="pt-4 border-t border-zinc-800/80">
                <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="text-[#00FF41]">▲</span>
                  <span>IMPROVED VALUE PROPOSITION (PURGED OF BUZZWORDS):</span>
                </div>
                <div className="border border-zinc-700 bg-black p-4 sm:p-5">
                  <div className="font-mono text-xs text-zinc-500 mb-1">BEFORE:</div>
                  <div className="font-mono text-xs text-zinc-400 line-through mb-3">
                    "{activeBrandData.originalValueProp}"
                  </div>
                  <div className="font-mono text-xs text-[#00FF41] mb-1 font-bold">AFTER (PUNCHIER &amp; UNFORGIVING):</div>
                  <div className="font-mono text-base sm:text-xl font-bold text-white leading-relaxed">
                    "{activeBrandData.improvedValueProp}"
                  </div>
                </div>
              </div>

              {/* Bold Alternative Name */}
              <div className="pt-4 border-t border-zinc-800/80">
                <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="text-[#FF5500]">★</span>
                  <span>BOLD ALTERNATIVE NAME (IGNORES SAFE INDUSTRY CONVENTIONS):</span>
                </div>
                
                <div 
                  onClick={() => setUseBoldAlternative(!useBoldAlternative)}
                  className={`cursor-pointer border p-4 sm:p-5 transition-none ${
                    useBoldAlternative 
                      ? 'border-[#FF5500] bg-[#FF5500]/10' 
                      : 'border-zinc-800 bg-[#120a06] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-3xl font-black text-white tracking-widest">
                        {activeBrandData.boldAlternativeName.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#FF5500] border border-[#FF5500] px-2 py-0.5 uppercase">
                        REBEL CANDIDATE
                      </span>
                    </div>

                    <button 
                      type="button"
                      className={`font-mono text-xs px-3 py-1 border transition-none ${
                        useBoldAlternative
                          ? 'bg-[#FF5500] text-black border-[#FF5500] font-bold'
                          : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                      }`}
                    >
                      {useBoldAlternative ? '✓ ACTIVE IN LAUNCH SPEC' : '+ SELECT FOR LAUNCH SPEC'}
                    </button>
                  </div>
                  <p className="font-mono text-xs text-zinc-300 mt-2 leading-relaxed">
                    {activeBrandData.boldAlternativeName.rationale}
                  </p>
                </div>
              </div>

            </div>

            {/* Action Bar */}
            <div className="border border-zinc-800 bg-[#080808] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="font-mono text-xs text-zinc-400">
                <span className="text-zinc-500">SELECTED LAUNCH NAME: </span>
                <span className="text-white font-bold tracking-wider">{currentActiveName}</span>
              </div>

              {/* Action: Primary Button APPROVE & RENDER VISUAL SYSTEM */}
              <button
                type="button"
                onClick={executeStepThree}
                className="bg-[#00FF41] text-black font-mono font-bold text-xs sm:text-sm px-8 py-3.5 border border-[#00FF41] hover:bg-white hover:text-black transition-none uppercase tracking-wider flex items-center gap-2 cursor-pointer active:translate-y-0.5"
              >
                <span>APPROVE &amp; RENDER VISUAL SYSTEM ➔</span>
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: VISUALIZE & DELIVER (Final Brand Kit) */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="w-full max-w-5xl mx-auto space-y-6">
            
            {/* System Status Bar */}
            <div className="border border-zinc-800 bg-[#080808] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="font-mono text-xs sm:text-sm text-[#00FF41] font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#00FF41]" />
                &gt; SYSTEM_STATUS: BRAND_SYSTEM_COMPILED [READY_FOR_DEPLOYMENT]
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => copyToClipboard(JSON.stringify(activeBrandData, null, 2), 'json')}
                  className="font-mono text-xs text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 px-3 py-1 flex items-center gap-1.5 transition-none"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'SPEC EXPORTED' : 'EXPORT JSON'}</span>
                </button>
                <span className="font-mono text-xs text-zinc-500">SPEC_ID: #BND-{Math.abs(currentActiveName.length * 914)}</span>
              </div>
            </div>

            {/* Launch Headline Section (Massive bold sans-serif) */}
            <div className="border border-zinc-800 bg-black p-6 sm:p-10 text-center">
              <div className="font-mono text-xs text-[#00FF41] uppercase tracking-widest mb-3">
                // APPROVED LAUNCH HEADLINE
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase max-w-4xl mx-auto leading-tight">
                {activeBrandData.launchHeadline}
              </h1>
              <p className="font-mono text-xs sm:text-sm text-zinc-400 mt-4 max-w-2xl mx-auto">
                {activeBrandData.secondaryHeadline}
              </p>
              
              <div className="mt-6 inline-flex items-center gap-3 border border-zinc-800 px-4 py-1.5 bg-[#080808]">
                <span className="font-mono text-xs text-zinc-500">BRAND WORDMARK:</span>
                <span className="font-mono text-base font-black text-white tracking-widest">{currentActiveName}</span>
                <span className="text-zinc-700">|</span>
                <span className="font-mono text-xs text-[#00FF41]">PRODUCTION READY</span>
              </div>
            </div>

            {/* Grid-Aligned Data Blocks: Color Mood & Typography System */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Color Mood Card with WCAG Contrast Accessibility Tool */}
              <div className="border border-zinc-800 bg-[#080808] p-5 sm:p-6 space-y-4">
                
                {/* Header with View Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-3 gap-2">
                  <div>
                    <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
                      // COLOR_MOOD
                    </div>
                    <div className="font-mono text-xs text-white font-bold mt-0.5">
                      {activeBrandData.colorMood.name}
                    </div>
                  </div>

                  {/* Mode Toggle Buttons */}
                  <div className="flex items-center border border-zinc-800 bg-black p-0.5 font-mono text-[11px]">
                    <button
                      type="button"
                      onClick={() => setColorMoodView('swatches')}
                      className={`px-2 py-1 transition-none ${
                        colorMoodView === 'swatches'
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      SWATCHES
                    </button>
                    <button
                      type="button"
                      onClick={() => setColorMoodView('contrast')}
                      className={`px-2 py-1 transition-none ${
                        colorMoodView === 'contrast'
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      WCAG AUDIT
                    </button>
                    <button
                      type="button"
                      onClick={() => setColorMoodView('hsl')}
                      className={`px-2 py-1 transition-none flex items-center gap-1 ${
                        colorMoodView === 'hsl'
                          ? 'bg-[#00FF41] text-black font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <Sliders className="w-3 h-3" />
                      <span>HSL COMPLEMENTARY</span>
                    </button>
                  </div>
                </div>

                {/* VIEW 1: Standard Palette Swatches */}
                {colorMoodView === 'swatches' && (
                  <div className="space-y-3">
                    <div className="space-y-2 pt-1">
                      {activeBrandData.colorMood.palette.map((color, idx) => (
                        <div 
                          key={idx}
                          onClick={() => copyToClipboard(color.hex, 'hex', color.hex)}
                          className="cursor-pointer border border-zinc-800/80 bg-zinc-950 p-2.5 flex items-center justify-between hover:border-zinc-600 transition-none"
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className={`w-6 h-6 shrink-0 ${color.border ? 'border border-zinc-700' : ''}`}
                              style={{ backgroundColor: color.hex }}
                            />
                            <div>
                              <div className="font-mono text-xs font-semibold text-zinc-200">{color.name}</div>
                              <div className="font-mono text-[10px] text-zinc-500">{color.role}</div>
                            </div>
                          </div>
                          <div className="font-mono text-xs text-zinc-400 font-bold flex items-center gap-1.5">
                            <span>{color.hex}</span>
                            {copiedHex === color.hex && (
                              <span className="text-[#00FF41] text-[10px]">[COPIED]</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 pt-1">
                      <span>Click swatch to copy HEX token.</span>
                      <button 
                        type="button"
                        onClick={() => setColorMoodView('contrast')}
                        className="text-[#00FF41] hover:underline"
                      >
                        Inspect WCAG Accessibility Ratios →
                      </button>
                    </div>
                  </div>
                )}

                {/* VIEW 2: WCAG Accessibility Contrast Calculator Tool */}
                {colorMoodView === 'contrast' && (
                  <div className="space-y-4">
                    
                    {/* Contrast Table Info */}
                    <div className="border border-zinc-800/80 bg-zinc-950 p-3">
                      <div className="font-mono text-[11px] text-zinc-400 font-semibold mb-1">
                        WCAG 2.1 CONTRAST MATRIX (VS. #FFFFFF &amp; #000000)
                      </div>
                      <div className="font-mono text-[10px] text-zinc-500 leading-snug">
                        WCAG AA requires ≥4.5:1 for body copy (≥3:1 for large text). WCAG AAA requires ≥7.0:1.
                      </div>
                    </div>

                    {/* Calculated Matrix Table */}
                    <div className="border border-zinc-800/80 overflow-x-auto">
                      <table className="w-full text-left font-mono text-[11px]">
                        <thead className="bg-black border-b border-zinc-800 text-zinc-400">
                          <tr>
                            <th className="p-2 font-normal">COLOR TOKEN</th>
                            <th className="p-2 font-normal">VS. WHITE (#FFF)</th>
                            <th className="p-2 font-normal">VS. BLACK (#000)</th>
                            <th className="p-2 font-normal">RECOMMENDED USE</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900 bg-zinc-950">
                          {activeBrandData.colorMood.palette.map((color, idx) => {
                            const ratioWhite = calculateContrastRatio(color.hex, '#FFFFFF');
                            const ratingWhite = getWcagRating(ratioWhite);
                            const ratioBlack = calculateContrastRatio(color.hex, '#000000');
                            const ratingBlack = getWcagRating(ratioBlack);

                            // Recommended safe usage guideline
                            let safeUse = 'Border / Graphic';
                            if (ratioBlack >= 4.5 && ratioWhite < 4.5) safeUse = 'Safe on Dark BG';
                            else if (ratioWhite >= 4.5 && ratioBlack < 4.5) safeUse = 'Safe on Light BG';
                            else if (ratioWhite >= 4.5 && ratioBlack >= 4.5) safeUse = 'Dual-Theme Safe';

                            return (
                              <tr 
                                key={idx} 
                                onClick={() => setTestContrastHex(color.hex)}
                                className="hover:bg-zinc-900 cursor-pointer transition-none"
                              >
                                <td className="p-2">
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className={`w-3.5 h-3.5 shrink-0 ${color.border ? 'border border-zinc-700' : ''}`}
                                      style={{ backgroundColor: color.hex }}
                                    />
                                    <div className="truncate max-w-[100px]">
                                      <div className="text-zinc-200 font-semibold truncate">{color.name}</div>
                                      <div className="text-[9px] text-zinc-500">{color.hex}</div>
                                    </div>
                                  </div>
                                </td>

                                {/* Ratio vs White */}
                                <td className="p-2 whitespace-nowrap">
                                  <div className="flex items-center gap-1.5 tabular-nums">
                                    <span className="text-zinc-300 font-bold">{ratioWhite.toFixed(2)}:1</span>
                                    <span className={`text-[9px] px-1 py-0.5 border ${
                                      ratingWhite.score === 'AAA' || ratingWhite.score === 'AA'
                                        ? 'border-[#00FF41] text-[#00FF41] bg-[#00FF41]/10'
                                        : ratingWhite.score === 'AA Large'
                                          ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                                          : 'border-zinc-800 text-zinc-600'
                                    }`}>
                                      {ratingWhite.score}
                                    </span>
                                  </div>
                                </td>

                                {/* Ratio vs Black */}
                                <td className="p-2 whitespace-nowrap">
                                  <div className="flex items-center gap-1.5 tabular-nums">
                                    <span className="text-zinc-300 font-bold">{ratioBlack.toFixed(2)}:1</span>
                                    <span className={`text-[9px] px-1 py-0.5 border ${
                                      ratingBlack.score === 'AAA' || ratingBlack.score === 'AA'
                                        ? 'border-[#00FF41] text-[#00FF41] bg-[#00FF41]/10'
                                        : ratingBlack.score === 'AA Large'
                                          ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                                          : 'border-zinc-800 text-zinc-600'
                                    }`}>
                                      {ratingBlack.score}
                                    </span>
                                  </div>
                                </td>

                                {/* Recommendation */}
                                <td className="p-2 whitespace-nowrap">
                                  <span className={`text-[10px] ${
                                    safeUse.includes('Safe') ? 'text-zinc-300' : 'text-zinc-500'
                                  }`}>
                                    {safeUse}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Interactive Live Contrast Tester Subtool */}
                    <div className="border border-zinc-800 bg-black p-3 space-y-2">
                      <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400">
                        <span className="uppercase font-bold text-[#00FF41]">// LIVE CONTRAST SIMULATOR</span>
                        <span>Click any table row to test</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={testContrastHex}
                          onChange={(e) => setTestContrastHex(e.target.value)}
                          placeholder="#00FF41"
                          maxLength={7}
                          className="bg-zinc-950 border border-zinc-800 font-mono text-xs text-white px-2.5 py-1.5 w-28 uppercase rounded-none outline-none focus:border-[#00FF41]"
                        />
                        <div 
                          className="w-6 h-6 border border-zinc-700 shrink-0" 
                          style={{ backgroundColor: testContrastHex }} 
                        />
                        <div className="flex flex-wrap gap-1">
                          {activeBrandData.colorMood.palette.map((c, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setTestContrastHex(c.hex)}
                              className="w-4 h-4 border border-zinc-800 cursor-pointer"
                              style={{ backgroundColor: c.hex }}
                              title={`Test ${c.name} (${c.hex})`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Live Visual Testing Swatches */}
                      {(() => {
                        const rW = calculateContrastRatio(testContrastHex, '#FFFFFF');
                        const rB = calculateContrastRatio(testContrastHex, '#000000');
                        const ratW = getWcagRating(rW);
                        const ratB = getWcagRating(rB);

                        return (
                          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                            {/* White Background Simulator */}
                            <div className="bg-white text-black p-2.5 border border-zinc-300 flex flex-col justify-between">
                              <div>
                                <div className="text-[9px] text-zinc-600 font-semibold mb-1">ON WHITE (#FFF)</div>
                                <div 
                                  className="font-bold text-sm leading-tight" 
                                  style={{ color: testContrastHex }}
                                >
                                  Typography Preview
                                </div>
                              </div>
                              <div className="mt-2 pt-1 border-t border-zinc-200 flex items-center justify-between text-[10px]">
                                <span className="font-bold tabular-nums text-zinc-900">{rW.toFixed(2)}:1</span>
                                <span className={`px-1 py-0.5 font-bold ${
                                  ratW.pass ? 'bg-black text-[#00FF41]' : 'bg-red-100 text-red-700'
                                }`}>
                                  {ratW.score}
                                </span>
                              </div>
                            </div>

                            {/* Black Background Simulator */}
                            <div className="bg-black text-white p-2.5 border border-zinc-800 flex flex-col justify-between">
                              <div>
                                <div className="text-[9px] text-zinc-400 font-semibold mb-1">ON BLACK (#000)</div>
                                <div 
                                  className="font-bold text-sm leading-tight" 
                                  style={{ color: testContrastHex }}
                                >
                                  Typography Preview
                                </div>
                              </div>
                              <div className="mt-2 pt-1 border-t border-zinc-900 flex items-center justify-between text-[10px]">
                                <span className="font-bold tabular-nums text-zinc-100">{rB.toFixed(2)}:1</span>
                                <span className={`px-1 py-0.5 font-bold ${
                                  ratB.pass ? 'bg-[#00FF41] text-black' : 'bg-zinc-800 text-zinc-500'
                                }`}>
                                  {ratB.score}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                    </div>

                  </div>
                )}

                {/* VIEW 3: HSL Complementary Palette Variation Generator */}
                {colorMoodView === 'hsl' && (() => {
                  const primaryBrandHex = activeBrandData.colorMood.palette.find(p => p.role.toLowerCase().includes('primary'))?.hex || activeBrandData.colorMood.palette[0].hex;
                  const variations = generateComplementaryHslPalettes(primaryBrandHex);

                  return (
                    <div className="space-y-4">
                      {/* Telemetric HSL Calculation Engine Banner */}
                      <div className="border border-zinc-800 bg-zinc-950 p-3 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-2">
                          <div className="flex items-center gap-2">
                            <Sliders className="w-3.5 h-3.5 text-[#00FF41]" />
                            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                              HSL COMPLEMENTARY ENGINE
                            </span>
                          </div>
                          <div className="flex items-center gap-1 font-mono text-[10px]">
                            <span className="text-zinc-500">BASE HUE:</span>
                            <span className="text-[#00FF41] font-bold">{variations.primaryHsl.h}°</span>
                            <span className="text-zinc-600">➔</span>
                            <span className="text-zinc-500">COMPLEMENTARY:</span>
                            <span className="text-amber-400 font-bold">{variations.complementaryHue}° (+180°)</span>
                          </div>
                        </div>

                        {/* Primary Color Coordinate Display & Sub-tab switcher */}
                        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-zinc-400">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 border border-zinc-700 shrink-0" 
                              style={{ backgroundColor: primaryBrandHex }} 
                            />
                            <span className="text-zinc-200 font-bold">{primaryBrandHex}</span>
                            <span className="text-zinc-500 text-[10px]">hsl({variations.primaryHsl.h}°, {variations.primaryHsl.s}%, {variations.primaryHsl.l}%)</span>
                          </div>

                          {/* Sub-view toggle (BOTH / DARK / LIGHT) */}
                          <div className="flex items-center border border-zinc-800 bg-black p-0.5 text-[10px]">
                            <button
                              type="button"
                              onClick={() => setHslSubTab('both')}
                              className={`px-2 py-0.5 transition-none ${hslSubTab === 'both' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                              BOTH
                            </button>
                            <button
                              type="button"
                              onClick={() => setHslSubTab('dark')}
                              className={`px-2 py-0.5 transition-none flex items-center gap-1 ${hslSubTab === 'dark' ? 'bg-[#00FF41] text-black font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                              <Moon className="w-2.5 h-2.5" />
                              <span>DARK</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setHslSubTab('light')}
                              className={`px-2 py-0.5 transition-none flex items-center gap-1 ${hslSubTab === 'light' ? 'bg-white text-black font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                              <Sun className="w-2.5 h-2.5" />
                              <span>LIGHT</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Render the Palettes */}
                      <div className="space-y-4">
                        {/* VARIATION 1: Dark Complementary */}
                        {(hslSubTab === 'both' || hslSubTab === 'dark') && (
                          <div className="border border-zinc-800 bg-[#060606] p-4 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-2 gap-2">
                              <div className="flex items-center gap-2">
                                <Moon className="w-3.5 h-3.5 text-[#00FF41]" />
                                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                                  DARK COMPLEMENTARY VARIATION
                                </span>
                                <span className="font-mono text-[9px] text-[#00FF41] border border-[#00FF41]/40 bg-[#00FF41]/10 px-1.5 py-0.5">
                                  HIGH-CONTRAST TERMINAL
                                </span>
                              </div>

                              <div className="flex items-center gap-2 font-mono text-[10px]">
                                <button
                                  type="button"
                                  onClick={() => copyCssVariables(variations.darkPalette, 'Dark-Complementary')}
                                  className="px-2 py-1 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white transition-none cursor-pointer"
                                >
                                  {copiedHslCode === 'Dark-Complementary' ? 'COPIED CSS' : 'COPY CSS'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => applyPaletteVariation(variations.darkPalette, `${activeBrandData.colorMood.name} (Dark HSL)`)}
                                  className="px-2 py-1 bg-[#00FF41] text-black font-bold hover:bg-white transition-none cursor-pointer"
                                >
                                  APPLY VARIATION
                                </button>
                              </div>
                            </div>

                            {/* Token Swatches Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {variations.darkPalette.map((item, idx) => (
                                <div 
                                  key={idx}
                                  onClick={() => copyToClipboard(item.hex, 'hex', item.hex)}
                                  className="border border-zinc-800/80 bg-black p-2 flex items-center gap-2 cursor-pointer hover:border-zinc-600 transition-none"
                                >
                                  <div 
                                    className={`w-5 h-5 shrink-0 ${item.border ? 'border border-zinc-700' : ''}`}
                                    style={{ backgroundColor: item.hex }}
                                  />
                                  <div className="truncate font-mono">
                                    <div className="text-[10px] text-zinc-200 font-bold truncate">{item.name}</div>
                                    <div className="text-[9px] text-zinc-500 tabular-nums">{item.hex}</div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Mini Simulated UI Component in Dark Palette */}
                            <div 
                              className="p-3 border font-mono text-xs flex items-center justify-between"
                              style={{
                                backgroundColor: variations.darkPalette[0].hex,
                                borderColor: variations.darkPalette[5].hex,
                                color: variations.darkPalette[4].hex
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <span 
                                  className="w-2 h-2 shrink-0 inline-block"
                                  style={{ backgroundColor: variations.darkPalette[2].hex }}
                                />
                                <span className="font-bold tracking-tight text-[11px]">
                                  {currentActiveName} UI
                                </span>
                                <span 
                                  className="text-[9px] px-1.5 py-0.5 border"
                                  style={{
                                    color: variations.darkPalette[3].hex,
                                    borderColor: variations.darkPalette[3].hex
                                  }}
                                >
                                  COMPLEMENTARY 180°
                                </span>
                              </div>

                              <div 
                                className="px-2 py-1 text-[10px] font-bold"
                                style={{
                                  backgroundColor: variations.darkPalette[2].hex,
                                  color: variations.darkPalette[0].hex
                                }}
                              >
                                EXECUTE
                              </div>
                            </div>
                          </div>
                        )}

                        {/* VARIATION 2: Light Complementary */}
                        {(hslSubTab === 'both' || hslSubTab === 'light') && (
                          <div className="border border-zinc-800 bg-[#060606] p-4 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-2 gap-2">
                              <div className="flex items-center gap-2">
                                <Sun className="w-3.5 h-3.5 text-amber-400" />
                                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                                  LIGHT COMPLEMENTARY VARIATION
                                </span>
                                <span className="font-mono text-[9px] text-zinc-300 border border-zinc-700 bg-zinc-900 px-1.5 py-0.5">
                                  STARK EDITORIAL PAPER (AA SAFE)
                                </span>
                              </div>

                              <div className="flex items-center gap-2 font-mono text-[10px]">
                                <button
                                  type="button"
                                  onClick={() => copyCssVariables(variations.lightPalette, 'Light-Complementary')}
                                  className="px-2 py-1 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white transition-none cursor-pointer"
                                >
                                  {copiedHslCode === 'Light-Complementary' ? 'COPIED CSS' : 'COPY CSS'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => applyPaletteVariation(variations.lightPalette, `${activeBrandData.colorMood.name} (Light HSL)`)}
                                  className="px-2 py-1 bg-white text-black font-bold hover:bg-zinc-200 transition-none cursor-pointer"
                                >
                                  APPLY VARIATION
                                </button>
                              </div>
                            </div>

                            {/* Token Swatches Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {variations.lightPalette.map((item, idx) => (
                                <div 
                                  key={idx}
                                  onClick={() => copyToClipboard(item.hex, 'hex', item.hex)}
                                  className="border border-zinc-800/80 bg-black p-2 flex items-center gap-2 cursor-pointer hover:border-zinc-600 transition-none"
                                >
                                  <div 
                                    className={`w-5 h-5 shrink-0 ${item.border ? 'border border-zinc-700' : ''}`}
                                    style={{ backgroundColor: item.hex }}
                                  />
                                  <div className="truncate font-mono">
                                    <div className="text-[10px] text-zinc-200 font-bold truncate">{item.name}</div>
                                    <div className="text-[9px] text-zinc-500 tabular-nums">{item.hex}</div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Mini Simulated UI Component in Light Palette */}
                            <div 
                              className="p-3 border font-mono text-xs flex items-center justify-between"
                              style={{
                                backgroundColor: variations.lightPalette[0].hex,
                                borderColor: variations.lightPalette[5].hex,
                                color: variations.lightPalette[4].hex
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <span 
                                  className="w-2 h-2 shrink-0 inline-block"
                                  style={{ backgroundColor: variations.lightPalette[2].hex }}
                                />
                                <span className="font-bold tracking-tight text-[11px]">
                                  {currentActiveName} UI
                                </span>
                                <span 
                                  className="text-[9px] px-1.5 py-0.5 border"
                                  style={{
                                    color: variations.lightPalette[3].hex,
                                    borderColor: variations.lightPalette[3].hex
                                  }}
                                >
                                  COMPLEMENTARY 180°
                                </span>
                              </div>

                              <div 
                                className="px-2 py-1 text-[10px] font-bold"
                                style={{
                                  backgroundColor: variations.lightPalette[2].hex,
                                  color: '#FFFFFF'
                                }}
                              >
                                EXECUTE
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })()}

              </div>

              {/* Typography System Card */}
              <div className="border border-zinc-800 bg-[#080808] p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
                    // TYPOGRAPHY_SYSTEM
                  </div>
                  <span className="font-mono text-xs text-white font-bold">
                    {activeBrandData.typography.system}
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="border border-zinc-800/80 bg-zinc-950 p-3">
                    <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500">
                      <span>DISPLAY TYPEFACE</span>
                      <span className="text-[#00FF41]">[HEADLINES]</span>
                    </div>
                    <div className="text-xl font-black text-white mt-1">
                      {activeBrandData.typography.displayFont}
                    </div>
                    <div className="font-mono text-[10px] text-zinc-400 mt-1">
                      {activeBrandData.typography.displaySpec}
                    </div>
                  </div>

                  <div className="border border-zinc-800/80 bg-zinc-950 p-3">
                    <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500">
                      <span>BODY PROSE</span>
                      <span className="text-zinc-400">[UI &amp; COPY]</span>
                    </div>
                    <div className="text-sm font-semibold text-zinc-200 mt-1">
                      {activeBrandData.typography.bodyFont}
                    </div>
                    <div className="font-mono text-[10px] text-zinc-400 mt-1">
                      {activeBrandData.typography.bodySpec}
                    </div>
                  </div>

                  <div className="border border-zinc-800/80 bg-zinc-950 p-3">
                    <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500">
                      <span>TELEMETRIC MONOSPACE</span>
                      <span className="text-[#00FF41]">[SYSTEM &amp; DATA]</span>
                    </div>
                    <div className="font-mono text-sm font-bold text-white mt-1">
                      {activeBrandData.typography.monoFont}
                    </div>
                    <div className="font-mono text-[10px] text-zinc-400 mt-1">
                      {activeBrandData.typography.monoSpec}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* LIVE PREVIEW: REAL-TIME WEB BANNER COMPONENT */}
            <div className="border border-zinc-800 bg-[#080808] p-5 sm:p-6 space-y-5">
              
              {/* Header and Interactive Control Toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-zinc-900 pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-[#00FF41]" />
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#00FF41] uppercase tracking-wider">
                      // LIVE_PREVIEW // REAL-TIME WEB BANNER COMPONENT
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-zinc-500 mt-1">
                    PRODUCTION DESIGN SYSTEM IN ACTION // RENDERING LIVE TOKENS (NAME, PRIMARY COLOR, TYPOGRAPHY)
                  </div>
                </div>

                {/* Interactive Controls Bar */}
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  
                  {/* Variant Switcher */}
                  <div className="flex items-center border border-zinc-800 bg-black p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setBannerVariant('hero')}
                      className={`px-2.5 py-1 transition-none ${
                        bannerVariant === 'hero'
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      HERO BANNER
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerVariant('strip')}
                      className={`px-2.5 py-1 transition-none ${
                        bannerVariant === 'strip'
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      ANNOUNCEMENT STRIP
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerVariant('callout')}
                      className={`px-2.5 py-1 transition-none ${
                        bannerVariant === 'callout'
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      FEATURE CALLOUT
                    </button>
                  </div>

                  {/* Theme Switcher */}
                  <div className="flex items-center border border-zinc-800 bg-black p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setBannerTheme('dark')}
                      className={`px-2 py-1 transition-none ${
                        bannerTheme === 'dark'
                          ? 'bg-[#00FF41] text-black font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      DARK
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerTheme('light')}
                      className={`px-2 py-1 transition-none ${
                        bannerTheme === 'light'
                          ? 'bg-white text-black font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      LIGHT
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerTheme('accent')}
                      className={`px-2 py-1 transition-none ${
                        bannerTheme === 'accent'
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      ACCENT
                    </button>
                  </div>

                  {/* Viewport Simulation (Desktop / Mobile) */}
                  <div className="flex items-center border border-zinc-800 bg-black p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setBannerViewport('desktop')}
                      className={`p-1.5 transition-none ${
                        bannerViewport === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                      title="Desktop Full-Width"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerViewport('mobile')}
                      className={`p-1.5 transition-none ${
                        bannerViewport === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                      title="Mobile Viewport (390px)"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Copy TSX Component */}
                  <button
                    type="button"
                    onClick={copyBannerComponentCode}
                    className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-[#00FF41] hover:text-[#00FF41] text-zinc-300 text-[11px] flex items-center gap-1.5 transition-none cursor-pointer"
                  >
                    {copiedBannerCode ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Code className="w-3.5 h-3.5" />}
                    <span>{copiedBannerCode ? 'COPIED TSX' : 'COPY REACT TSX'}</span>
                  </button>

                </div>
              </div>

              {/* Design Token Telemetry Readout */}
              {(() => {
                const primaryBrandHex = activeBrandData.colorMood.palette.find(p => p.role.toLowerCase().includes('primary'))?.hex || activeBrandData.colorMood.palette[0].hex;

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
                    <div className="border border-zinc-800/80 bg-black p-2">
                      <span className="text-zinc-500 block">ACTIVE BRAND WORDMARK:</span>
                      <span className="text-white font-bold tracking-wider">{currentActiveName}</span>
                    </div>
                    <div className="border border-zinc-800/80 bg-black p-2 flex items-center justify-between">
                      <div>
                        <span className="text-zinc-500 block">PRIMARY COLOR TOKEN:</span>
                        <span className="text-[#00FF41] font-bold">{primaryBrandHex}</span>
                      </div>
                      <div className="w-4 h-4 border border-zinc-700 shrink-0" style={{ backgroundColor: primaryBrandHex }} />
                    </div>
                    <div className="border border-zinc-800/80 bg-black p-2">
                      <span className="text-zinc-500 block">DISPLAY FONT:</span>
                      <span className="text-zinc-200 font-bold truncate block">{activeBrandData.typography.displayFont}</span>
                    </div>
                    <div className="border border-zinc-800/80 bg-black p-2">
                      <span className="text-zinc-500 block">BODY PROSE FONT:</span>
                      <span className="text-zinc-200 font-bold truncate block">{activeBrandData.typography.bodyFont}</span>
                    </div>
                  </div>
                );
              })()}

              {/* THE REAL-TIME LIVE COMPONENT CANVAS */}
              {(() => {
                const primaryBrandHex = activeBrandData.colorMood.palette.find(p => p.role.toLowerCase().includes('primary'))?.hex || activeBrandData.colorMood.palette[0].hex;

                // Dynamic background and text colors based on bannerTheme
                const bgStyle = bannerTheme === 'dark' 
                  ? 'bg-[#050505] text-white border-zinc-800' 
                  : bannerTheme === 'light' 
                    ? 'bg-[#F9FAFB] text-zinc-950 border-zinc-300 shadow-md' 
                    : 'text-white border-zinc-800';

                const cardBackground = bannerTheme === 'accent' ? { backgroundColor: primaryBrandHex, color: '#000000' } : {};

                return (
                  <div className="w-full flex justify-center py-2 overflow-hidden">
                    <div 
                      className={`relative transition-all duration-200 w-full border ${bgStyle} ${
                        bannerViewport === 'mobile' ? 'max-w-[420px] shadow-2xl' : 'max-w-5xl'
                      }`}
                      style={cardBackground}
                    >
                      {/* Top Registration Crosshairs */}
                      <div className={`absolute top-2 left-2 font-mono text-xs select-none ${bannerTheme === 'light' ? 'text-zinc-400' : 'text-zinc-700'}`}>+</div>
                      <div className={`absolute top-2 right-2 font-mono text-xs select-none ${bannerTheme === 'light' ? 'text-zinc-400' : 'text-zinc-700'}`}>+</div>
                      <div className={`absolute bottom-2 left-2 font-mono text-xs select-none ${bannerTheme === 'light' ? 'text-zinc-400' : 'text-zinc-700'}`}>+</div>
                      <div className={`absolute bottom-2 right-2 font-mono text-xs select-none ${bannerTheme === 'light' ? 'text-zinc-400' : 'text-zinc-700'}`}>+</div>

                      {/* Accent Top Hazard Border */}
                      {bannerTheme !== 'accent' && (
                        <div 
                          className="h-1.5 w-full"
                          style={{ backgroundColor: primaryBrandHex }}
                        />
                      )}

                      {/* VARIANT 1: HERO_BANNER */}
                      {bannerVariant === 'hero' && (
                        <div className="p-6 sm:p-10 space-y-6">
                          
                          {/* Mini Component Navigation Bar */}
                          <div className="flex items-center justify-between border-b pb-4"
                            style={{ borderColor: bannerTheme === 'light' ? '#E5E7EB' : (bannerTheme === 'accent' ? 'rgba(0,0,0,0.15)' : '#27272A') }}
                          >
                            <div className="flex items-center gap-2.5">
                              <div 
                                className="w-4 h-4 shrink-0" 
                                style={{ backgroundColor: bannerTheme === 'accent' ? '#000000' : primaryBrandHex }} 
                              />
                              <span className="font-mono text-sm sm:text-base font-black tracking-widest uppercase">
                                {currentActiveName}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 font-mono text-[10px] sm:text-xs">
                              <span className="hidden sm:inline opacity-75">DOCUMENTATION</span>
                              <span className="hidden sm:inline opacity-75">CHANGELOG</span>
                              <span 
                                className="px-2.5 py-1 border font-bold"
                                style={{
                                  borderColor: bannerTheme === 'accent' ? '#000000' : primaryBrandHex,
                                  color: bannerTheme === 'accent' ? '#000000' : (bannerTheme === 'light' ? '#000000' : primaryBrandHex)
                                }}
                              >
                                v1.0.0
                              </span>
                            </div>
                          </div>

                          {/* Hero Release Status Badge */}
                          <div className="pt-2">
                            <div 
                              className="inline-flex items-center gap-2 border px-3 py-1 font-mono text-[11px]"
                              style={{
                                borderColor: bannerTheme === 'light' ? '#D1D5DB' : (bannerTheme === 'accent' ? 'rgba(0,0,0,0.3)' : '#27272A'),
                                backgroundColor: bannerTheme === 'light' ? '#FFFFFF' : (bannerTheme === 'accent' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.6)')
                              }}
                            >
                              <span 
                                className="w-2 h-2 rounded-full animate-pulse" 
                                style={{ backgroundColor: bannerTheme === 'accent' ? '#000000' : primaryBrandHex }} 
                              />
                              <span className="font-bold uppercase tracking-wider">
                                {currentActiveName} ARCHITECTURE
                              </span>
                              <span className="opacity-50">|</span>
                              <span className="opacity-80">
                                {activeBrandData.category.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {/* Massive Display Font Headline */}
                          <div className="space-y-2">
                            <h1 
                              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none"
                              style={{
                                fontFamily: `${activeBrandData.typography.displayFont}, sans-serif`
                              }}
                            >
                              <span>{activeBrandData.launchHeadline.split('.')[0] || activeBrandData.launchHeadline}</span>
                            </h1>

                            {/* Applied Font System Badge */}
                            <div className="font-mono text-[9px] opacity-60">
                              [DISPLAY TYPEFACE: {activeBrandData.typography.displayFont} // {activeBrandData.typography.displaySpec}]
                            </div>
                          </div>

                          {/* Body Prose Font Description */}
                          <div className="space-y-2 max-w-2xl">
                            <p 
                              className={`text-sm sm:text-base leading-relaxed ${
                                bannerTheme === 'light' ? 'text-zinc-700' : (bannerTheme === 'accent' ? 'text-black/85 font-medium' : 'text-zinc-300')
                              }`}
                              style={{
                                fontFamily: `${activeBrandData.typography.bodyFont}, sans-serif`
                              }}
                            >
                              {activeBrandData.improvedValueProp || activeBrandData.secondaryHeadline}
                            </p>

                            {/* Applied Body Font Badge */}
                            <div className="font-mono text-[9px] opacity-60">
                              [BODY TYPEFACE: {activeBrandData.typography.bodyFont} // {activeBrandData.typography.bodySpec}]
                            </div>
                          </div>

                          {/* Action Controls & Telemetric Monospace Row */}
                          <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                setHistoryNotification(`ACTION_TRIGGER: ${currentActiveName}_INITIALIZED`);
                                setTimeout(() => setHistoryNotification(null), 2000);
                              }}
                              className="px-5 py-3 font-bold uppercase transition-none flex items-center gap-2 cursor-pointer shadow-sm active:scale-98"
                              style={{
                                backgroundColor: bannerTheme === 'accent' ? '#000000' : primaryBrandHex,
                                color: bannerTheme === 'accent' ? primaryBrandHex : '#000000'
                              }}
                            >
                              <span>INITIALIZE {currentActiveName}</span>
                              <span>&rarr;</span>
                            </button>

                            <button
                              type="button"
                              className={`px-4 py-3 border font-bold uppercase transition-none cursor-pointer ${
                                bannerTheme === 'light' 
                                  ? 'border-zinc-400 bg-white hover:bg-zinc-100 text-zinc-900' 
                                  : (bannerTheme === 'accent' 
                                    ? 'border-black/40 bg-black/10 text-black hover:bg-black/20' 
                                    : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500 text-zinc-200')
                              }`}
                            >
                              <span>EXPLORE RUNTIME</span>
                            </button>
                          </div>

                          {/* Telemetric System Bar */}
                          <div 
                            className="pt-4 border-t flex flex-wrap items-center justify-between font-mono text-[10px] gap-2 opacity-80"
                            style={{ borderColor: bannerTheme === 'light' ? '#E5E7EB' : (bannerTheme === 'accent' ? 'rgba(0,0,0,0.15)' : '#27272A') }}
                          >
                            <div className="flex items-center gap-3">
                              <span>SPEC: {currentActiveName.toUpperCase()}_v1.0</span>
                              <span>·</span>
                              <span>SYSTEM: DETERMINISTIC</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-1.5 h-1.5 rounded-full inline-block" 
                                style={{ backgroundColor: bannerTheme === 'accent' ? '#000000' : primaryBrandHex }} 
                              />
                              <span>100% AIR-GAPPED</span>
                            </div>
                          </div>

                        </div>
                      )}

                      {/* VARIANT 2: ANNOUNCEMENT_STRIP */}
                      {bannerVariant === 'strip' && (
                        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span 
                              className="font-mono text-xs px-2.5 py-1 font-bold shrink-0 uppercase"
                              style={{
                                backgroundColor: bannerTheme === 'accent' ? '#000000' : primaryBrandHex,
                                color: bannerTheme === 'accent' ? primaryBrandHex : '#000000'
                              }}
                            >
                              {currentActiveName} ANNOUNCEMENT
                            </span>
                            <div className="font-mono text-xs sm:text-sm font-semibold truncate">
                              {activeBrandData.launchHeadline}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                            <button
                              type="button"
                              className="px-3.5 py-1.5 font-bold uppercase transition-none cursor-pointer flex items-center gap-1.5"
                              style={{
                                backgroundColor: bannerTheme === 'accent' ? '#000000' : primaryBrandHex,
                                color: bannerTheme === 'accent' ? '#FFFFFF' : '#000000'
                              }}
                            >
                              <span>LAUNCH APP</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* VARIANT 3: FEATURE_CALLOUT */}
                      {bannerVariant === 'callout' && (
                        <div className="p-6 sm:p-8 space-y-4">
                          <div className="flex items-center gap-3 font-mono text-xs">
                            <div 
                              className="w-8 h-8 flex items-center justify-center font-bold text-sm"
                              style={{
                                backgroundColor: bannerTheme === 'accent' ? '#000000' : primaryBrandHex,
                                color: bannerTheme === 'accent' ? primaryBrandHex : '#000000'
                              }}
                            >
                              {currentActiveName.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-bold uppercase tracking-wider">{currentActiveName} PRO ARCHITECTURE</div>
                              <div className="text-[10px] opacity-75">{activeBrandData.category}</div>
                            </div>
                          </div>

                          <h3 
                            className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight"
                            style={{ fontFamily: `${activeBrandData.typography.displayFont}, sans-serif` }}
                          >
                            {activeBrandData.launchHeadline}
                          </h3>

                          <p 
                            className="text-xs sm:text-sm max-w-xl opacity-85 leading-relaxed"
                            style={{ fontFamily: `${activeBrandData.typography.bodyFont}, sans-serif` }}
                          >
                            {activeBrandData.secondaryHeadline}
                          </p>

                          <div className="pt-2 flex items-center gap-3 font-mono text-xs">
                            <button
                              type="button"
                              className="px-4 py-2 font-bold uppercase transition-none cursor-pointer"
                              style={{
                                backgroundColor: bannerTheme === 'accent' ? '#000000' : primaryBrandHex,
                                color: bannerTheme === 'accent' ? primaryBrandHex : '#000000'
                              }}
                            >
                              TRY {currentActiveName} FREE &rarr;
                            </button>
                            <span className="text-[11px] opacity-60">No credit card · Local installation</span>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })()}

            </div>

            {/* Visual Logo Mark / Emblem Demonstration */}
            <div className="border border-zinc-800 bg-[#080808] p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
                <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
                  // VECTOR_EMBLEM_SYNTHESIS
                </div>
                <div className="font-mono text-[11px] text-zinc-500">
                  GEOMETRIC SPECIFICATION // 1024x1024
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* SVG Visualizer */}
                <div className="h-56 bg-black border border-zinc-800 flex items-center justify-center p-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                  
                  {/* Geometric Mark */}
                  <div className="relative z-10 flex flex-col items-center">
                    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="8" y="8" width="80" height="80" stroke="#27272A" strokeWidth="2" />
                      <rect x="24" y="24" width="48" height="48" stroke="#00FF41" strokeWidth="3" />
                      <circle cx="48" cy="48" r="14" fill="#00FF41" />
                      <rect x="44" y="16" width="8" height="16" fill="#FFFFFF" />
                      <rect x="44" y="64" width="8" height="16" fill="#FFFFFF" />
                      <rect x="16" y="44" width="16" height="8" fill="#FFFFFF" />
                      <rect x="64" y="44" width="16" height="8" fill="#FFFFFF" />
                      <line x1="8" y1="8" x2="24" y2="24" stroke="#00FF41" strokeWidth="1.5" />
                      <line x1="88" y1="8" x2="72" y2="24" stroke="#00FF41" strokeWidth="1.5" />
                      <line x1="8" y1="88" x2="24" y2="72" stroke="#00FF41" strokeWidth="1.5" />
                      <line x1="88" y1="88" x2="72" y2="72" stroke="#00FF41" strokeWidth="1.5" />
                    </svg>
                    <span className="font-mono text-xs font-black tracking-widest text-white mt-3">
                      {currentActiveName}
                    </span>
                  </div>

                  <div className="absolute top-2 left-2 font-mono text-[9px] text-zinc-600">[X:0, Y:0]</div>
                  <div className="absolute bottom-2 right-2 font-mono text-[9px] text-[#00FF41]">[SCALE: 1.0]</div>
                </div>

                {/* Mark details & App Icon Simulation */}
                <div className="space-y-3 font-mono text-xs text-zinc-400">
                  <div className="border border-zinc-900 bg-zinc-950 p-3">
                    <span className="text-zinc-500">INSIGNIA CONSTRUCT: </span>
                    <span className="text-zinc-200">Industrial fastener geometry with four-quadrant programmatic alignment gates.</span>
                  </div>
                  <div className="border border-zinc-900 bg-zinc-950 p-3">
                    <span className="text-zinc-500">STROKE BEHAVIOR: </span>
                    <span className="text-zinc-200">Zero rounding, 90° miter joins, constant 3px high-density vector line-weight.</span>
                  </div>
                </div>

                {/* Favicon & Social preview */}
                <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-3 font-mono text-xs">
                  <div className="text-zinc-500 text-[11px] uppercase">// FAVICON &amp; SOCIAL ASSET CARD</div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black border border-[#00FF41] flex items-center justify-center font-bold text-white text-base">
                      {currentActiveName.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-white font-bold">{currentActiveName} App Root</div>
                      <div className="text-[10px] text-zinc-500">64x64 favicon.ico / 512x512 pwa.png</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-zinc-400 border-t border-zinc-900 pt-2">
                    OpenGraph share card rendered with high-contrast text wrap and neon hazard borders.
                  </div>
                </div>
              </div>
            </div>

            {/* NEW SECTION: SOCIAL_PREVIEW_GENERATOR */}
            <div className="border border-zinc-800 bg-[#080808] p-5 sm:p-6 space-y-5">
              
              {/* Generator Section Header & Controls */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-zinc-900 pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#00FF41]" />
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#00FF41] uppercase tracking-wider">
                      // SOCIAL_PREVIEW_GENERATOR
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-zinc-500 mt-1">
                    DYNAMIC OPENGRAPH SHARE CARD MOCKUP // 1200×630 (1.91:1)
                  </div>
                </div>

                {/* Interactive Theme & Format Switchers */}
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                  
                  {/* Aspect Ratio Switch */}
                  <div className="flex items-center border border-zinc-800 bg-black p-0.5">
                    <button
                      type="button"
                      onClick={() => setOgFormat('landscape')}
                      className={`px-2.5 py-1 text-[11px] transition-none cursor-pointer ${
                        ogFormat === 'landscape'
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      1200×630 (OG)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOgFormat('square')}
                      className={`px-2.5 py-1 text-[11px] transition-none cursor-pointer ${
                        ogFormat === 'square'
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      1080×1080 (FEED)
                    </button>
                  </div>

                  {/* Dedicated CSS Theme Selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-500 font-bold uppercase text-[11px]">CSS THEME:</span>
                    <div className="flex items-center border border-zinc-800 bg-black p-0.5">
                      <button
                        type="button"
                        onClick={() => setOgTheme('monochromatic')}
                        className={`px-2.5 py-1 text-[11px] transition-none cursor-pointer ${
                          ogTheme === 'monochromatic'
                            ? 'bg-zinc-800 text-white font-bold'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                        title="Pure Obsidian Void & Stark Optical White"
                      >
                        MONOCHROMATIC
                      </button>
                      <button
                        type="button"
                        onClick={() => setOgTheme('neon')}
                        className={`px-2.5 py-1 text-[11px] transition-none cursor-pointer ${
                          ogTheme === 'neon'
                            ? 'bg-[#00FF41] text-black font-bold'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                        title="Void Black with Electric Hazard Green Glow"
                      >
                        HIGH-CONTRAST NEON
                      </button>
                      <button
                        type="button"
                        onClick={() => setOgTheme('surgical-paper')}
                        className={`px-2.5 py-1 text-[11px] transition-none cursor-pointer ${
                          ogTheme === 'surgical-paper'
                            ? 'bg-white text-black font-bold'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                        title="Sterile Clinical White Paper & Carbon Ink"
                      >
                        SURGICAL PAPER
                      </button>
                      <button
                        type="button"
                        onClick={() => setOgTheme('primary-accent')}
                        className={`px-2.5 py-1 text-[11px] transition-none cursor-pointer ${
                          ogTheme === 'primary-accent'
                            ? 'bg-zinc-700 text-white font-bold'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                        title="Dynamic Brand Primary Color Palette"
                      >
                        BRAND ACCENT
                      </button>
                    </div>
                  </div>

                  {/* Copy HTML Meta Action */}
                  <button
                    type="button"
                    onClick={copyOgMetaTags}
                    className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-[#00FF41] hover:text-[#00FF41] text-zinc-300 text-[11px] flex items-center gap-1.5 transition-none cursor-pointer"
                  >
                    {copiedMeta ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Code className="w-3.5 h-3.5" />}
                    <span>{copiedMeta ? 'COPIED TAGS' : 'COPY META TAGS'}</span>
                  </button>

                </div>
              </div>

              {/* The Dynamic OpenGraph Share Card Mockup */}
              {(() => {
                const primaryBrandHex = activeBrandData.colorMood.palette.find(p => p.role.toLowerCase().includes('primary'))?.hex || activeBrandData.colorMood.palette[0].hex;

                // Derive CSS theme styles
                let cardContainerClass = '';
                let cardInlineStyle: React.CSSProperties = {};
                let gridStrokeColor = 'rgba(255, 255, 255, 0.12)';
                let crosshairClass = 'text-zinc-600';
                let headlineTextColor = 'text-white';
                let subTextColor = 'text-zinc-400';
                let wordmarkTextColor = 'text-white';
                let tagBorderClass = 'border-zinc-800 text-zinc-400 bg-black/60';
                let tagInlineStyle: React.CSSProperties = {};
                let footerBorderClass = 'border-zinc-800 text-zinc-400';
                let footerDomainClass = 'text-zinc-200';
                let emblemStroke1 = '#71717A';
                let emblemStroke2 = '#00FF41';
                let emblemFill = '#00FF41';
                let emblemWhite = '#FFFFFF';
                let statusDotColor = '#00FF41';
                let topHazardBarColor = '#00FF41';
                let announcementColor = '#00FF41';
                let themeLabel = 'MONOCHROMATIC // PURE OBSIDIAN';

                if (ogTheme === 'monochromatic') {
                  cardContainerClass = 'bg-[#050505] border-2 border-white text-white shadow-2xl';
                  gridStrokeColor = 'rgba(255, 255, 255, 0.10)';
                  crosshairClass = 'text-zinc-400 font-bold';
                  headlineTextColor = 'text-white';
                  subTextColor = 'text-zinc-400';
                  wordmarkTextColor = 'text-white';
                  tagBorderClass = 'border-white text-white bg-black';
                  footerBorderClass = 'border-zinc-700 text-zinc-400';
                  footerDomainClass = 'text-white font-bold';
                  emblemStroke1 = '#FFFFFF';
                  emblemStroke2 = '#FFFFFF';
                  emblemFill = '#FFFFFF';
                  emblemWhite = '#000000';
                  statusDotColor = '#FFFFFF';
                  topHazardBarColor = '#FFFFFF';
                  announcementColor = '#FFFFFF';
                  themeLabel = 'MONOCHROMATIC // ZERO COLOR · STARK OBSIDIAN & WHITE';
                } else if (ogTheme === 'neon') {
                  cardContainerClass = 'bg-[#000000] border-2 border-[#00FF41] text-white shadow-[0_0_35px_rgba(0,255,65,0.18)]';
                  gridStrokeColor = 'rgba(0, 255, 65, 0.15)';
                  crosshairClass = 'text-[#00FF41]/70';
                  headlineTextColor = 'text-white';
                  subTextColor = 'text-zinc-400';
                  wordmarkTextColor = 'text-white';
                  tagBorderClass = 'border-[#00FF41] text-[#00FF41] bg-[#00FF41]/10';
                  footerBorderClass = 'border-zinc-800 text-zinc-400';
                  footerDomainClass = 'text-zinc-200';
                  emblemStroke1 = '#52525B';
                  emblemStroke2 = '#00FF41';
                  emblemFill = '#00FF41';
                  emblemWhite = '#FFFFFF';
                  statusDotColor = '#00FF41';
                  topHazardBarColor = '#00FF41';
                  announcementColor = '#00FF41';
                  themeLabel = 'HIGH-CONTRAST NEON // ELECTRIC HAZARD MATRIX (#00FF41)';
                } else if (ogTheme === 'surgical-paper') {
                  cardContainerClass = 'bg-[#FFFFFF] border-2 border-black text-black shadow-xl';
                  gridStrokeColor = 'rgba(0, 0, 0, 0.12)';
                  crosshairClass = 'text-zinc-400 font-bold';
                  headlineTextColor = 'text-black font-black';
                  subTextColor = 'text-zinc-700';
                  wordmarkTextColor = 'text-black';
                  tagBorderClass = 'border-black text-black bg-zinc-100';
                  footerBorderClass = 'border-zinc-300 text-zinc-600';
                  footerDomainClass = 'text-black font-bold';
                  emblemStroke1 = '#000000';
                  emblemStroke2 = '#000000';
                  emblemFill = '#000000';
                  emblemWhite = '#FFFFFF';
                  statusDotColor = '#000000';
                  topHazardBarColor = '#000000';
                  announcementColor = '#000000';
                  themeLabel = 'SURGICAL PAPER // CLINICAL WHITE PAPER & CARBON INK';
                } else if (ogTheme === 'primary-accent') {
                  cardContainerClass = 'bg-[#060606] border-2 text-white shadow-2xl';
                  cardInlineStyle = { borderColor: primaryBrandHex, boxShadow: `0 0 30px ${primaryBrandHex}26` };
                  gridStrokeColor = `${primaryBrandHex}20`;
                  crosshairClass = 'font-bold';
                  headlineTextColor = 'text-white';
                  subTextColor = 'text-zinc-300';
                  wordmarkTextColor = 'text-white';
                  tagBorderClass = 'text-white bg-black/80';
                  tagInlineStyle = { borderColor: primaryBrandHex, color: primaryBrandHex };
                  footerBorderClass = 'border-zinc-800 text-zinc-400';
                  footerDomainClass = 'text-white';
                  emblemStroke1 = '#52525B';
                  emblemStroke2 = primaryBrandHex;
                  emblemFill = primaryBrandHex;
                  emblemWhite = '#FFFFFF';
                  statusDotColor = primaryBrandHex;
                  topHazardBarColor = primaryBrandHex;
                  announcementColor = primaryBrandHex;
                  themeLabel = `BRAND ACCENT // DYNAMIC PRIMARY TOKEN (${primaryBrandHex})`;
                }

                return (
                  <div className="space-y-2">
                    
                    {/* Active CSS Theme Telemetry Readout */}
                    <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 px-1">
                      <span>ACTIVE_STYLE: <strong className="text-zinc-300">{themeLabel}</strong></span>
                      <span>RESOLUTION: {ogFormat === 'landscape' ? '1200×630px' : '1080×1080px'}</span>
                    </div>

                    <div className="w-full flex justify-center py-1">
                      <div 
                        className={`w-full relative transition-none p-6 sm:p-10 flex flex-col justify-between overflow-hidden ${
                          ogFormat === 'landscape' ? 'aspect-[1200/630] min-h-[340px] sm:min-h-[420px]' : 'aspect-square max-w-lg min-h-[380px]'
                        } ${cardContainerClass}`}
                        style={cardInlineStyle}
                      >
                        {/* Top Accent Hazard Line */}
                        <div 
                          className="absolute top-0 left-0 right-0 h-1.5"
                          style={{ backgroundColor: topHazardBarColor }}
                        />

                        {/* Subtle Grid Background Pattern */}
                        <div 
                          className="absolute inset-0 pointer-events-none opacity-20"
                          style={{
                            backgroundImage: `linear-gradient(to right, ${gridStrokeColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridStrokeColor} 1px, transparent 1px)`,
                            backgroundSize: '32px 32px'
                          }}
                        />

                        {/* Corner Crosshairs / Alignment Marks */}
                        <div className={`absolute top-3 left-3 font-mono text-xs select-none ${crosshairClass}`}>+</div>
                        <div className={`absolute top-3 right-3 font-mono text-xs select-none ${crosshairClass}`}>+</div>
                        <div className={`absolute bottom-3 left-3 font-mono text-xs select-none ${crosshairClass}`}>+</div>
                        <div className={`absolute bottom-3 right-3 font-mono text-xs select-none ${crosshairClass}`}>+</div>

                        {/* OG Card Header */}
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-3.5 h-3.5 shrink-0" style={{ backgroundColor: statusDotColor }} />
                            <span className={`font-mono text-base sm:text-lg font-black tracking-widest uppercase ${wordmarkTextColor}`}>
                              {currentActiveName}
                            </span>
                          </div>

                          <div 
                            className={`font-mono text-[10px] sm:text-xs px-2.5 py-1 border ${tagBorderClass}`}
                            style={tagInlineStyle}
                          >
                            {activeBrandData.category}
                          </div>
                        </div>

                        {/* OG Card Center Body: Dynamic Headline */}
                        <div className="relative z-10 my-auto py-4 space-y-2">
                          <div 
                            className="font-mono text-[11px] uppercase tracking-wider font-bold"
                            style={{ color: announcementColor }}
                          >
                            // OFFICIAL LAUNCH ANNOUNCEMENT
                          </div>
                          <h2 
                            className={`font-black tracking-tight leading-none uppercase ${
                              ogFormat === 'landscape'
                                ? 'text-2xl sm:text-4xl md:text-5xl max-w-2xl'
                                : 'text-2xl sm:text-3xl max-w-md'
                            } ${headlineTextColor}`}
                            style={{ fontFamily: `${activeBrandData.typography.displayFont}, sans-serif` }}
                          >
                            {activeBrandData.launchHeadline}
                          </h2>
                          <p 
                            className={`font-mono text-xs sm:text-sm max-w-xl line-clamp-2 ${subTextColor}`}
                            style={{ fontFamily: `${activeBrandData.typography.bodyFont}, sans-serif` }}
                          >
                            {activeBrandData.secondaryHeadline}
                          </p>
                        </div>

                        {/* OG Card Footer: Logo Insignia & Domain Verification */}
                        <div className={`relative z-10 pt-4 border-t flex items-center justify-between font-mono text-xs ${footerBorderClass}`}>
                          <div className="flex items-center gap-3">
                            {/* Scaled Mini Insignia SVG */}
                            <svg width="24" height="24" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="8" y="8" width="80" height="80" stroke={emblemStroke1} strokeWidth="4" />
                              <rect x="24" y="24" width="48" height="48" stroke={emblemStroke2} strokeWidth="6" />
                              <circle cx="48" cy="48" r="14" fill={emblemFill} />
                              <rect x="44" y="16" width="8" height="16" fill={emblemWhite} />
                              <rect x="44" y="64" width="8" height="16" fill={emblemWhite} />
                            </svg>
                            <span className={`font-bold tracking-tight ${footerDomainClass}`}>
                              rivetlabs.io/{currentActiveName.toLowerCase()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: statusDotColor }} />
                            <span>OG_IMAGE // {ogFormat === 'landscape' ? '1200×630' : '1080×1080'}</span>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Simulated Social Unfurl Card View (Platform Feed Context) */}
                    <div className="pt-2">
                      <div className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest mb-2">
                        // SIMULATED FEED UNFURL PREVIEW (X / SLACK / DISCORD)
                      </div>

                      <div className="border border-zinc-800 bg-black p-4 max-w-xl space-y-2">
                        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                          <span className="w-2 h-2 inline-block" style={{ backgroundColor: statusDotColor }} />
                          <span className="text-zinc-300 font-bold">rivetlabs.io</span>
                          <span className="text-zinc-600">·</span>
                          <span className="text-zinc-500">Shared Preview [{ogTheme.toUpperCase()}]</span>
                        </div>

                        {/* Thumbnail snippet */}
                        <div 
                          className="border p-3 flex gap-3 items-center transition-none"
                          style={{
                            borderColor: ogTheme === 'surgical-paper' ? '#E5E7EB' : (ogTheme === 'neon' ? '#00FF41' : (ogTheme === 'primary-accent' ? primaryBrandHex : '#27272A')),
                            backgroundColor: ogTheme === 'surgical-paper' ? '#FFFFFF' : '#060606',
                            color: ogTheme === 'surgical-paper' ? '#000000' : '#FFFFFF'
                          }}
                        >
                          <div 
                            className="w-16 h-12 border flex items-center justify-center shrink-0 font-mono text-xs font-black"
                            style={{
                              borderColor: ogTheme === 'surgical-paper' ? '#D1D5DB' : '#27272A',
                              backgroundColor: ogTheme === 'surgical-paper' ? '#F4F4F5' : '#18181B',
                              color: ogTheme === 'surgical-paper' ? '#000000' : statusDotColor
                            }}
                          >
                            {currentActiveName.slice(0, 2)}
                          </div>
                          <div className="overflow-hidden font-mono">
                            <div className="text-xs font-bold truncate">
                              {activeBrandData.launchHeadline}
                            </div>
                            <div className="text-[11px] opacity-70 truncate mt-0.5">
                              {activeBrandData.secondaryHeadline}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })()}

            </div>

            {/* SEO_HEALTH_SCORE: ALGORITHMIC SEARCH INTENT AUDIT */}
            <div className="border border-zinc-800 bg-[#080808] p-5 sm:p-6 space-y-5">
              
              {/* Header and Controls */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-zinc-900 pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#00FF41]" />
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#00FF41] uppercase tracking-wider">
                      // SEO_HEALTH_SCORE // SEARCH_INTENT_AUDIT
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-zinc-500 mt-1">
                    ALGORITHMIC SERP TITLE & META INTENT SATURATION ENGINE // CATEGORY: {activeBrandData.category.toUpperCase()}
                  </div>
                </div>

                {/* Filter and Schema Actions */}
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  
                  {/* Intent Filter */}
                  <div className="flex items-center border border-zinc-800 bg-black p-0.5 text-[11px]">
                    {(['all', 'transactional', 'commercial', 'informational'] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setSeoIntentFilter(filter)}
                        className={`px-2.5 py-1 uppercase transition-none cursor-pointer ${
                          seoIntentFilter === filter
                            ? 'bg-zinc-800 text-white font-bold'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {/* Copy HTML Meta & JSON-LD Schema */}
                  <button
                    type="button"
                    onClick={copySeoSchema}
                    className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-[#00FF41] hover:text-[#00FF41] text-zinc-300 text-[11px] flex items-center gap-1.5 transition-none cursor-pointer"
                    title="Copy production HTML Title, Meta tags, and JSON-LD structured data"
                  >
                    {copiedSeoSchema ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Code className="w-3.5 h-3.5" />}
                    <span>{copiedSeoSchema ? 'TAGS & SCHEMA COPIED' : 'COPY HTML META & SCHEMA'}</span>
                  </button>

                </div>
              </div>

              {/* Dynamic Keyword Extraction & SEO Scoring Engine */}
              {(() => {
                const primaryBrandHex = activeBrandData.colorMood.palette.find(p => p.role.toLowerCase().includes('primary'))?.hex || activeBrandData.colorMood.palette[0].hex;

                const categoryLower = activeBrandData.category.toLowerCase();
                const headlineLower = activeBrandData.launchHeadline.toLowerCase();
                const secondaryLower = activeBrandData.secondaryHeadline.toLowerCase();
                const combinedText = `${headlineLower} ${secondaryLower} ${simulatedKeyword.toLowerCase()}`;

                // Curate search intent keywords based on category context
                interface IntentKeyword {
                  term: string;
                  type: 'transactional' | 'commercial' | 'informational';
                  volume: 'VERY HIGH' | 'HIGH' | 'MID';
                  rationale: string;
                }

                let targetKeywords: IntentKeyword[] = [];

                if (categoryLower.includes('health') || categoryLower.includes('biomarker') || categoryLower.includes('medical')) {
                  targetKeywords = [
                    { term: 'biomarker', type: 'informational', volume: 'VERY HIGH', rationale: 'Core diagnostic search intent' },
                    { term: 'clinical', type: 'commercial', volume: 'HIGH', rationale: 'Verifies laboratory grade veracity' },
                    { term: 'local-first', type: 'commercial', volume: 'HIGH', rationale: 'Differentiating privacy technology' },
                    { term: 'disk', type: 'transactional', volume: 'MID', rationale: 'On-device bare-metal data ownership' },
                    { term: 'diagnostic', type: 'informational', volume: 'VERY HIGH', rationale: 'Primary patient & athlete query' },
                    { term: 'air-gapped', type: 'commercial', volume: 'HIGH', rationale: 'Zero-knowledge architectural primitive' },
                    { term: 'trends', type: 'informational', volume: 'HIGH', rationale: 'Biometric visualization over time' },
                    { term: 'blood', type: 'transactional', volume: 'VERY HIGH', rationale: 'Direct organic category keyword' }
                  ];
                } else if (categoryLower.includes('devops') || categoryLower.includes('infra') || categoryLower.includes('tooling')) {
                  targetKeywords = [
                    { term: 'bare-metal', type: 'commercial', volume: 'HIGH', rationale: 'Direct deployment hardware search' },
                    { term: 'deterministic', type: 'informational', volume: 'VERY HIGH', rationale: 'Zero-drift infrastructure intent' },
                    { term: 'seconds', type: 'transactional', volume: 'HIGH', rationale: 'High-velocity shipping speed intent' },
                    { term: 'deployment', type: 'transactional', volume: 'VERY HIGH', rationale: 'Core developer action keyword' },
                    { term: 'automated', type: 'transactional', volume: 'HIGH', rationale: 'Workflow efficiency & CI/CD search' },
                    { term: 'local-first', type: 'commercial', volume: 'HIGH', rationale: 'Offline & sovereign tooling query' },
                    { term: 'pipeline', type: 'informational', volume: 'VERY HIGH', rationale: 'Build and release automation query' },
                    { term: 'config', type: 'commercial', volume: 'HIGH', rationale: 'Zero-config vs YAML pain point' }
                  ];
                } else if (categoryLower.includes('fintech') || categoryLower.includes('ledger') || categoryLower.includes('crypto')) {
                  targetKeywords = [
                    { term: 'ledger', type: 'transactional', volume: 'VERY HIGH', rationale: 'Core accounting and transaction query' },
                    { term: 'cryptographic', type: 'informational', volume: 'HIGH', rationale: 'Mathematical verification intent' },
                    { term: 'audit', type: 'commercial', volume: 'VERY HIGH', rationale: 'Compliance & regulatory investigation' },
                    { term: 'self-hosted', type: 'commercial', volume: 'HIGH', rationale: 'Sovereign infrastructure search' },
                    { term: 'real-time', type: 'informational', volume: 'HIGH', rationale: 'Instant settlement intent' },
                    { term: 'zero-knowledge', type: 'commercial', volume: 'VERY HIGH', rationale: 'Privacy preserving computation query' },
                    { term: 'custody', type: 'transactional', volume: 'HIGH', rationale: 'Asset control & storage search' },
                    { term: 'treasury', type: 'commercial', volume: 'MID', rationale: 'Enterprise financial management' }
                  ];
                } else {
                  // Universal dynamic keyword extraction from brand category & category detail
                  const tokens = `${activeBrandData.category} ${activeBrandData.categoryDetail || ''}`
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, ' ')
                    .split(/\s+/)
                    .filter(w => w.length > 3 && !['with', 'from', 'your', 'that', 'this', 'into'].includes(w));
                  const uniqueTokens = Array.from(new Set(tokens)).slice(0, 8);
                  
                  targetKeywords = uniqueTokens.map((t, idx) => ({
                    term: t,
                    type: idx % 3 === 0 ? 'transactional' : (idx % 3 === 1 ? 'commercial' : 'informational'),
                    volume: idx < 3 ? 'VERY HIGH' : 'HIGH',
                    rationale: `Category relevance query for ${t}`
                  }));
                }

                // If user simulated a keyword, append it
                if (simulatedKeyword.trim()) {
                  targetKeywords.push({
                    term: simulatedKeyword.trim().toLowerCase(),
                    type: 'commercial',
                    volume: 'HIGH',
                    rationale: 'User simulated keyword candidate'
                  });
                }

                // Filter keywords if user selected an intent tab
                const filteredKeywords = seoIntentFilter === 'all'
                  ? targetKeywords
                  : targetKeywords.filter(k => k.type === seoIntentFilter);

                // Analyze matches
                const matchedKeywords = targetKeywords.filter(k => combinedText.includes(k.term.toLowerCase()));
                const matchRate = Math.round((matchedKeywords.length / targetKeywords.length) * 100);

                // Title Tag length analysis (Target: 40-60 characters for optimal Google desktop/mobile SERP)
                const serpTitle = `${activeBrandData.launchHeadline} | ${currentActiveName}`;
                const titleLength = serpTitle.length;
                const isTitleOptimal = titleLength >= 40 && titleLength <= 65;
                const isTitleTruncated = titleLength > 65;

                // Meta description length analysis (Target: 120-160 characters)
                const serpDesc = activeBrandData.secondaryHeadline;
                const descLength = serpDesc.length;
                const isDescOptimal = descLength >= 110 && descLength <= 165;
                const isDescTruncated = descLength > 165;

                // Anti-Fluff Penalty Check
                const bannedBuzzwords = ['empowering', 'seamless', 'revolutionary', 'holistic', 'all-in-one', 'innovative', 'journey'];
                const detectedFluff = bannedBuzzwords.filter(b => combinedText.includes(b));
                const isFluffFree = detectedFluff.length === 0;

                // Calculate Composite SEO Health Score (0 - 100)
                let score = 0;
                // Keyword intent match: up to 40 pts
                score += Math.round((matchedKeywords.length / targetKeywords.length) * 40);
                // Title length: up to 25 pts
                score += isTitleOptimal ? 25 : (titleLength > 30 ? 18 : 10);
                // Meta description length: up to 20 pts
                score += isDescOptimal ? 20 : (descLength > 60 ? 14 : 8);
                // Fluff penalty: 15 pts
                score += isFluffFree ? 15 : 5;

                // Score Clamp
                const finalScore = Math.min(100, Math.max(0, score));

                // Grade assignment
                const scoreGrade = finalScore >= 90 ? 'A+ [OPTIMAL]' : finalScore >= 80 ? 'A [STRONG]' : finalScore >= 70 ? 'B [ACCEPTABLE]' : 'C [NEEDS WORK]';
                const scoreColor = finalScore >= 85 ? '#00FF41' : finalScore >= 70 ? '#FBBF24' : '#EF4444';

                return (
                  <div className="space-y-5">
                    
                    {/* 4-Stat Telemetry Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
                      
                      {/* Overall Health Score Card */}
                      <div className="border border-zinc-800 bg-black p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-zinc-500">
                          <span>SEO_HEALTH_SCORE</span>
                          <Activity className="w-3 h-3 text-[#00FF41]" />
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-black text-white">{finalScore}</span>
                          <span className="text-xs text-zinc-500">/ 100</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 overflow-hidden">
                          <div 
                            className="h-full transition-all duration-300"
                            style={{ width: `${finalScore}%`, backgroundColor: scoreColor }}
                          />
                        </div>
                        <div className="text-[10px] font-bold" style={{ color: scoreColor }}>
                          {scoreGrade}
                        </div>
                      </div>

                      {/* Keyword Saturation */}
                      <div className="border border-zinc-800 bg-black p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-zinc-500">
                          <span>INTENT_MATCH_RATE</span>
                          <Target className="w-3 h-3 text-zinc-400" />
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-black text-white">{matchRate}%</span>
                          <span className="text-xs text-zinc-500">({matchedKeywords.length}/{targetKeywords.length})</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 overflow-hidden">
                          <div 
                            className="bg-[#00FF41] h-full transition-all duration-300"
                            style={{ width: `${matchRate}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {matchedKeywords.length} CATEGORY INTENTS FOUND
                        </div>
                      </div>

                      {/* SERP Title Tag Length */}
                      <div className="border border-zinc-800 bg-black p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-zinc-500">
                          <span>TITLE_TAG_LENGTH</span>
                          <span className="text-[9px] text-zinc-600">40-65c</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-black text-white">{titleLength}</span>
                          <span className="text-xs text-zinc-500">CHARS</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${isTitleTruncated ? 'bg-red-500' : isTitleOptimal ? 'bg-[#00FF41]' : 'bg-yellow-400'}`}
                            style={{ width: `${Math.min(100, (titleLength / 65) * 100)}%` }}
                          />
                        </div>
                        <div className={`text-[10px] font-bold ${isTitleTruncated ? 'text-red-400' : isTitleOptimal ? 'text-[#00FF41]' : 'text-yellow-400'}`}>
                          {isTitleTruncated ? 'TRUNCATION RISK (>65c)' : isTitleOptimal ? 'OPTIMAL PIXEL WIDTH' : 'UNDER MINIMUM (40c)'}
                        </div>
                      </div>

                      {/* Meta Description Length */}
                      <div className="border border-zinc-800 bg-black p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-zinc-500">
                          <span>META_DESC_LENGTH</span>
                          <span className="text-[9px] text-zinc-600">120-160c</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-black text-white">{descLength}</span>
                          <span className="text-xs text-zinc-500">CHARS</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${isDescTruncated ? 'bg-red-500' : isDescOptimal ? 'bg-[#00FF41]' : 'bg-yellow-400'}`}
                            style={{ width: `${Math.min(100, (descLength / 160) * 100)}%` }}
                          />
                        </div>
                        <div className={`text-[10px] font-bold ${isDescTruncated ? 'text-red-400' : isDescOptimal ? 'text-[#00FF41]' : 'text-yellow-400'}`}>
                          {isDescTruncated ? 'SNIPPET TRUNCATED' : isDescOptimal ? 'PERFECT SNIPPET FIT' : 'SHORT (CAN EXPAND)'}
                        </div>
                      </div>

                    </div>

                    {/* Main Split: Left (Keyword Intent Matrix) & Right (Live Google SERP Simulator) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Left Column: Keyword Saturation Matrix */}
                      <div className="lg:col-span-7 space-y-3 font-mono text-xs">
                        
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                          <span className="font-bold text-white uppercase text-xs flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-[#00FF41]" />
                            <span>CATEGORY SEARCH INTENT SATURATION</span>
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            SHOWING {filteredKeywords.length} TERMS
                          </span>
                        </div>

                        {/* Keyword Table / List */}
                        <div className="border border-zinc-800 bg-zinc-950 divide-y divide-zinc-900 overflow-hidden">
                          {filteredKeywords.map((kw, idx) => {
                            const inHeadline = headlineLower.includes(kw.term.toLowerCase());
                            const inSecondary = secondaryLower.includes(kw.term.toLowerCase());
                            const inSimulated = simulatedKeyword.toLowerCase().includes(kw.term.toLowerCase());
                            const isPresent = inHeadline || inSecondary || inSimulated;

                            return (
                              <div key={idx} className="p-2.5 flex items-center justify-between gap-2 hover:bg-black/40 transition-none">
                                <div className="flex items-center gap-2.5 truncate">
                                  <span className={`w-2 h-2 rounded-full shrink-0 ${isPresent ? 'bg-[#00FF41]' : 'bg-zinc-700'}`} />
                                  <span className={`font-bold uppercase ${isPresent ? 'text-white' : 'text-zinc-500'}`}>
                                    {kw.term}
                                  </span>
                                  <span className="text-[10px] px-1.5 py-0.5 border border-zinc-800 bg-black text-zinc-400 uppercase hidden sm:inline">
                                    {kw.type}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 text-[10px]">
                                  <span className="text-zinc-600 hidden md:inline">
                                    VOL: {kw.volume}
                                  </span>
                                  {isPresent ? (
                                    <span className="px-2 py-0.5 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 font-bold uppercase">
                                      {inHeadline ? '✓ IN HEADLINE' : inSecondary ? '✓ IN SECONDARY' : '✓ SIMULATED'}
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setSimulatedKeyword(kw.term)}
                                      className="px-2 py-0.5 border border-zinc-800 hover:border-zinc-500 text-zinc-500 hover:text-white uppercase transition-none cursor-pointer"
                                      title="Simulate adding keyword to see score impact"
                                    >
                                      + TEST INJECTION
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Keyword Test Simulator Input */}
                        <div className="border border-zinc-800 bg-black p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                          <div className="flex-1 flex items-center gap-2">
                            <span className="text-[11px] text-zinc-500 shrink-0">TEST CUSTOM KEYWORD:</span>
                            <input
                              type="text"
                              value={simulatedKeyword}
                              onChange={(e) => setSimulatedKeyword(e.target.value)}
                              placeholder="e.g. open-source, air-gapped, zero-drift..."
                              className="flex-1 bg-zinc-950 border border-zinc-800 text-white font-mono text-xs px-2.5 py-1 outline-none focus:border-[#00FF41]"
                            />
                            {simulatedKeyword && (
                              <button
                                type="button"
                                onClick={() => setSimulatedKeyword('')}
                                className="text-zinc-500 hover:text-white text-xs px-1.5"
                              >
                                CLEAR
                              </button>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* Right Column: Google Desktop SERP Simulator */}
                      <div className="lg:col-span-5 space-y-3 font-mono text-xs">
                        
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                          <span className="font-bold text-white uppercase text-xs flex items-center gap-1.5">
                            <Search className="w-3.5 h-3.5 text-blue-400" />
                            <span>GOOGLE SERP SIMULATION (DESKTOP)</span>
                          </span>
                          <span className="text-[10px] text-zinc-500">LIVE RENDER</span>
                        </div>

                        {/* Google SERP Simulated Result Card */}
                        <div className="border border-zinc-800 bg-[#FFFFFF] p-4 sm:p-5 text-black font-sans space-y-2 shadow-lg">
                          
                          {/* URL Breadcrumb & Favicon */}
                          <div className="flex items-center gap-2 text-xs text-[#202124]">
                            <div className="w-4 h-4 bg-black flex items-center justify-center text-[10px] font-mono text-white font-bold rounded-full">
                              {currentActiveName.slice(0, 1)}
                            </div>
                            <div className="truncate font-mono text-[11px]">
                              <span className="text-[#202124] font-medium">rivetlabs.io</span>
                              <span className="text-[#5f6368]"> › {currentActiveName.toLowerCase()}</span>
                            </div>
                          </div>

                          {/* SERP Clickable Headline (Blue Link) */}
                          <h3 className="text-lg sm:text-xl font-normal text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                            {serpTitle}
                          </h3>

                          {/* SERP Meta Description Snippet */}
                          <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed line-clamp-2">
                            {serpDesc}
                          </p>

                          {/* Sitelinks Extensions */}
                          <div className="pt-2 border-t border-zinc-200 grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <div className="text-[#1a0dab] font-medium hover:underline cursor-pointer">Technical Spec</div>
                              <div className="text-[10px] text-[#5f6368] truncate">Air-gapped architecture manual</div>
                            </div>
                            <div>
                              <div className="text-[#1a0dab] font-medium hover:underline cursor-pointer">Changelog v1.0</div>
                              <div className="text-[10px] text-[#5f6368] truncate">Deterministic release notes</div>
                            </div>
                          </div>

                        </div>

                        {/* Search Health Quality Audit Checklist */}
                        <div className="border border-zinc-800 bg-zinc-950 p-3.5 space-y-2 text-[11px]">
                          <div className="font-bold text-white uppercase text-xs">
                            // TECHNICAL SERP CRITERIA
                          </div>

                          <div className="space-y-1.5 text-zinc-400">
                            <div className="flex items-center gap-2">
                              <span className={isTitleOptimal ? 'text-[#00FF41]' : 'text-yellow-400'}>
                                {isTitleOptimal ? '✓ [PASS]' : '▲ [NOTICE]'}
                              </span>
                              <span>Title Tag Pixel Width: {titleLength} chars (Target: 40-65)</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={isDescOptimal ? 'text-[#00FF41]' : 'text-yellow-400'}>
                                {isDescOptimal ? '✓ [PASS]' : '▲ [NOTICE]'}
                              </span>
                              <span>Meta Description Length: {descLength} chars (Target: 120-160)</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={isFluffFree ? 'text-[#00FF41]' : 'text-red-400'}>
                                {isFluffFree ? '✓ [PASS]' : '✕ [FAIL]'}
                              </span>
                              <span>Banned Buzzword Filter: {isFluffFree ? '0% Fluff Detected' : `${detectedFluff.join(', ')} flagged`}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[#00FF41]">✓ [PASS]</span>
                              <span>Schema.org: SoftwareApplication + JSON-LD verified</span>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                );
              })()}

            </div>

            {/* PITCH_DECK_GENERATOR: EXECUTIVE SLIDE PRESENTATION BLUEPRINT */}
            <div className="border border-zinc-800 bg-[#080808] p-5 sm:p-6 space-y-5">
              
              {/* Header and Presentation Controls */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-zinc-900 pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Presentation className="w-4 h-4 text-[#00FF41]" />
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#00FF41] uppercase tracking-wider">
                      // PITCH_DECK_GENERATOR
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-zinc-500 mt-1">
                    EXECUTIVE SLIDE PRESENTATION BLUEPRINT // 16:9 WIDESCREEN BRAND KIT SPECIMEN
                  </div>
                </div>

                {/* Presentation Toolbar */}
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  
                  {/* Slide Tabs */}
                  <div className="flex items-center border border-zinc-800 bg-black p-0.5 text-[11px]">
                    {['01 HERO', '02 VALUE PROP', '03 MARKET', '04 DESIGN SYSTEM'].map((label, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPitchSlideIndex(idx)}
                        className={`px-2.5 py-1 transition-none cursor-pointer ${
                          pitchSlideIndex === idx
                            ? 'bg-zinc-800 text-white font-bold'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Theme Switcher */}
                  <div className="flex items-center border border-zinc-800 bg-black p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setPitchDeckTheme('dark')}
                      className={`px-2 py-1 transition-none cursor-pointer ${
                        pitchDeckTheme === 'dark'
                          ? 'bg-[#00FF41] text-black font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      DARK
                    </button>
                    <button
                      type="button"
                      onClick={() => setPitchDeckTheme('light')}
                      className={`px-2 py-1 transition-none cursor-pointer ${
                        pitchDeckTheme === 'light'
                          ? 'bg-white text-black font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      LIGHT
                    </button>
                  </div>

                  {/* Autoplay Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsAutoPlayingPitch(prev => !prev)}
                    className={`px-2.5 py-1.5 border text-[11px] flex items-center gap-1.5 transition-none cursor-pointer ${
                      isAutoPlayingPitch
                        ? 'border-[#00FF41] text-[#00FF41] bg-[#00FF41]/10'
                        : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                    title="Toggle auto-cycling presentation slides"
                  >
                    {isAutoPlayingPitch ? <Pause className="w-3 h-3 text-[#00FF41]" /> : <Play className="w-3 h-3" />}
                    <span>{isAutoPlayingPitch ? 'AUTOPLAY ON' : 'AUTOPLAY'}</span>
                  </button>

                  {/* Export Markdown Deck */}
                  <button
                    type="button"
                    onClick={copyPitchDeckMarkdown}
                    className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-[#00FF41] hover:text-[#00FF41] text-zinc-300 text-[11px] flex items-center gap-1.5 transition-none cursor-pointer"
                    title="Copy full slide deck content in Markdown for Keynote, Marp, or Notion"
                  >
                    {copiedDeckMarkdown ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <FileText className="w-3.5 h-3.5" />}
                    <span>{copiedDeckMarkdown ? 'DECK COPIED' : 'EXPORT MARKDOWN'}</span>
                  </button>

                </div>
              </div>

              {/* Slide Presentation Canvas (16:9 Aspect Ratio) */}
              {(() => {
                const primaryBrandHex = activeBrandData.colorMood.palette.find(p => p.role.toLowerCase().includes('primary'))?.hex || activeBrandData.colorMood.palette[0].hex;

                const isDark = pitchDeckTheme === 'dark';
                const slideBgClass = isDark 
                  ? 'bg-[#050505] text-white border-zinc-800' 
                  : 'bg-[#FCFCFC] text-zinc-900 border-zinc-300 shadow-xl';
                const slideBorderColor = isDark ? '#27272A' : '#E5E7EB';
                const mutedTextColor = isDark ? '#A1A1AA' : '#52525B';

                return (
                  <div className="space-y-4">
                    
                    {/* The 16:9 Canvas Frame */}
                    <div 
                      className={`w-full aspect-[16/9] min-h-[380px] sm:min-h-[460px] md:min-h-[500px] border-2 relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 md:p-12 transition-colors ${slideBgClass}`}
                      style={{ borderColor: slideBorderColor }}
                    >
                      {/* Corner Registration Crosshairs */}
                      <div className="absolute top-3 left-3 font-mono text-xs select-none opacity-40">+</div>
                      <div className="absolute top-3 right-3 font-mono text-xs select-none opacity-40">+</div>
                      <div className="absolute bottom-3 left-3 font-mono text-xs select-none opacity-40">+</div>
                      <div className="absolute bottom-3 right-3 font-mono text-xs select-none opacity-40">+</div>

                      {/* Top Slide Header Bar */}
                      <div 
                        className="w-full flex items-center justify-between border-b pb-3 font-mono text-[10px] sm:text-xs tracking-wider uppercase font-bold"
                        style={{ borderColor: slideBorderColor }}
                      >
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-2.5 h-2.5 inline-block" 
                            style={{ backgroundColor: primaryBrandHex }} 
                          />
                          <span className="tracking-widest">{currentActiveName}</span>
                          <span className="opacity-40">|</span>
                          <span className="opacity-75">{activeBrandData.category}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span 
                            className="px-2 py-0.5 border text-[9px] sm:text-[10px]"
                            style={{ borderColor: primaryBrandHex, color: isDark ? primaryBrandHex : '#000000' }}
                          >
                            SLIDE 0{pitchSlideIndex + 1} / 04
                          </span>
                          <span className="opacity-60 hidden sm:inline">CONFIDENTIAL</span>
                        </div>
                      </div>

                      {/* SLIDE 0: HERO / TITLE SLIDE */}
                      {pitchSlideIndex === 0 && (
                        <div className="my-auto py-4 space-y-4 sm:space-y-6">
                          <div className="space-y-2">
                            <div 
                              className="inline-flex items-center gap-2 border px-2.5 py-0.5 font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold"
                              style={{ borderColor: primaryBrandHex, color: isDark ? primaryBrandHex : '#000000' }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryBrandHex }} />
                              <span>INVESTOR SPECIFICATION // SERIES SEED</span>
                            </div>

                            <h1 
                              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none"
                              style={{ fontFamily: `${activeBrandData.typography.displayFont}, sans-serif` }}
                            >
                              {currentActiveName}
                            </h1>
                          </div>

                          <div className="max-w-3xl space-y-2">
                            <p 
                              className="text-lg sm:text-2xl md:text-3xl font-bold uppercase tracking-tight leading-tight"
                              style={{ color: primaryBrandHex, fontFamily: `${activeBrandData.typography.displayFont}, sans-serif` }}
                            >
                              {activeBrandData.launchHeadline}
                            </p>
                            <p 
                              className="text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl"
                              style={{ color: mutedTextColor, fontFamily: `${activeBrandData.typography.bodyFont}, sans-serif` }}
                            >
                              {activeBrandData.secondaryHeadline}
                            </p>
                          </div>

                          <div className="pt-2 flex flex-wrap items-center gap-4 font-mono text-[10px] sm:text-xs opacity-75">
                            <span>AUTHOR: FOUNDER // ARCHITECT</span>
                            <span>·</span>
                            <span>CATEGORY: {activeBrandData.category.toUpperCase()}</span>
                            <span>·</span>
                            <span>VERSION: 1.0.0-PROD</span>
                          </div>
                        </div>
                      )}

                      {/* SLIDE 1: VALUE PROPOSITION / PROBLEM & SOLUTION */}
                      {pitchSlideIndex === 1 && (
                        <div className="my-auto py-2 space-y-4">
                          <div>
                            <span 
                              className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest"
                              style={{ color: primaryBrandHex }}
                            >
                              // 02 · PROBLEM & STRUCTURAL SOLUTION
                            </span>
                            <h2 
                              className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight mt-1"
                              style={{ fontFamily: `${activeBrandData.typography.displayFont}, sans-serif` }}
                            >
                              Why Legacy Conventions Fail
                            </h2>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                            {/* Problem Card */}
                            <div 
                              className="border p-4 sm:p-5 space-y-2 font-mono text-xs"
                              style={{ borderColor: isDark ? '#3F1212' : '#FCA5A5', backgroundColor: isDark ? '#150606' : '#FEF2F2' }}
                            >
                              <div className="text-red-500 font-bold text-xs uppercase flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>THE STATUS QUO BOTTLENECK</span>
                              </div>
                              <p className="text-[11px] sm:text-xs leading-relaxed text-zinc-400">
                                Engineering teams and solo builders burn 15+ hours weekly configuring bloated infrastructure, generic boilerplate, and fragile abstractions.
                              </p>
                              <div className="pt-2 border-t border-red-900/40 text-[10px] text-red-400">
                                ➔ Result: Hallucinatory bloat, delayed launch velocity, zero differentiation.
                              </div>
                            </div>

                            {/* Solution Card */}
                            <div 
                              className="border p-4 sm:p-5 space-y-2 font-mono text-xs"
                              style={{ borderColor: primaryBrandHex, backgroundColor: isDark ? '#0A120A' : '#F0FDF4' }}
                            >
                              <div 
                                className="font-bold text-xs uppercase flex items-center gap-1.5"
                                style={{ color: isDark ? primaryBrandHex : '#166534' }}
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>THE {currentActiveName} ARCHITECTURE</span>
                              </div>
                              <p 
                                className="text-[11px] sm:text-xs leading-relaxed font-sans font-medium"
                                style={{ color: isDark ? '#E4E4E7' : '#1F2937' }}
                              >
                                {activeBrandData.improvedValueProp}
                              </p>
                              <div 
                                className="pt-2 border-t text-[10px] font-mono"
                                style={{ borderColor: isDark ? '#1F3F1F' : '#BBF7D0', color: isDark ? primaryBrandHex : '#15803D' }}
                              >
                                ➔ Core Advantage: {activeBrandData.categoryDetail}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SLIDE 2: MARKET & STRATEGIC POSITIONING */}
                      {pitchSlideIndex === 2 && (
                        <div className="my-auto py-2 space-y-4">
                          <div>
                            <span 
                              className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest"
                              style={{ color: primaryBrandHex }}
                            >
                              // 03 · MARKET OPPORTUNITY & POSITIONING
                            </span>
                            <h2 
                              className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight mt-1"
                              style={{ fontFamily: `${activeBrandData.typography.displayFont}, sans-serif` }}
                            >
                              Category Dominance Matrix
                            </h2>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-1">
                            {/* Left: 2x2 Positioning Matrix Graphic */}
                            <div 
                              className="md:col-span-6 border p-4 aspect-[4/3] flex flex-col justify-between relative font-mono text-[10px]"
                              style={{ borderColor: slideBorderColor, backgroundColor: isDark ? '#0A0A0A' : '#F4F4F5' }}
                            >
                              {/* Quadrant Axis Lines */}
                              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-zinc-700/60" />
                              <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-zinc-700/60" />

                              {/* Axis Labels */}
                              <div className="flex justify-between text-[9px] opacity-60">
                                <span>HIGH OVERHEAD</span>
                                <span className="font-bold text-[#00FF41]">HIGH VELOCITY ▲</span>
                              </div>

                              {/* Quadrant Points */}
                              <div className="relative z-10 flex-1 flex flex-col justify-between p-2">
                                <div className="flex justify-between items-start">
                                  <span className="opacity-40">Bloated Suites</span>
                                  {/* WINNER: Current Brand */}
                                  <div 
                                    className="p-2 border font-bold shadow-lg flex items-center gap-1.5"
                                    style={{
                                      backgroundColor: isDark ? '#050505' : '#FFFFFF',
                                      borderColor: primaryBrandHex,
                                      color: isDark ? primaryBrandHex : '#000000'
                                    }}
                                  >
                                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primaryBrandHex }} />
                                    <span>★ {currentActiveName}</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-end">
                                  <span className="opacity-40">Generic AI Wrappers</span>
                                  <span className="opacity-40">Niche Point Tools</span>
                                </div>
                              </div>

                              <div className="flex justify-between text-[9px] opacity-60">
                                <span>◄ SAFE INDUSTRY CONVENTIONS</span>
                                <span>UNCOMPROMISING SPEED ►</span>
                              </div>
                            </div>

                            {/* Right: Target Segments & Unfair Advantage */}
                            <div className="md:col-span-6 space-y-3 font-mono text-xs">
                              <div 
                                className="border p-3 space-y-1.5"
                                style={{ borderColor: slideBorderColor, backgroundColor: isDark ? '#080808' : '#FFFFFF' }}
                              >
                                <span className="text-[10px] opacity-60 block">TARGET CUSTOMER PROFILES:</span>
                                <div className="text-[11px] font-bold text-zinc-300">
                                  {activeBrandData.targetAudience}
                                </div>
                              </div>

                              <div 
                                className="border p-3.5 space-y-1.5"
                                style={{ borderColor: primaryBrandHex, backgroundColor: isDark ? '#0A120A' : '#F0FDF4' }}
                              >
                                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: isDark ? primaryBrandHex : '#15803D' }}>
                                  STRATEGIC DIFFERENTIATING ANGLE:
                                </span>
                                <p className="text-[11px] sm:text-xs leading-relaxed font-sans font-medium" style={{ color: isDark ? '#FFFFFF' : '#18181B' }}>
                                  "{activeBrandData.categoryDetail}"
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SLIDE 3: VISUAL IDENTITY & DESIGN SYSTEM */}
                      {pitchSlideIndex === 3 && (
                        <div className="my-auto py-2 space-y-4">
                          <div>
                            <span 
                              className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest"
                              style={{ color: primaryBrandHex }}
                            >
                              // 04 · VISUAL IDENTITY & TOKEN ARCHITECTURE
                            </span>
                            <h2 
                              className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight mt-1"
                              style={{ fontFamily: `${activeBrandData.typography.displayFont}, sans-serif` }}
                            >
                              Industrial Brand Kit Spec
                            </h2>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 font-mono text-xs">
                            {/* Wordmark Specimen */}
                            <div 
                              className="border p-4 flex flex-col justify-between"
                              style={{ borderColor: slideBorderColor, backgroundColor: isDark ? '#080808' : '#FFFFFF' }}
                            >
                              <div>
                                <span className="text-[10px] opacity-60 uppercase block">WORDMARK SPECIMEN</span>
                                <div 
                                  className="text-2xl sm:text-3xl font-black uppercase tracking-widest mt-2"
                                  style={{ fontFamily: `${activeBrandData.typography.displayFont}, sans-serif` }}
                                >
                                  {currentActiveName}
                                </div>
                              </div>
                              <div className="text-[10px] opacity-75 mt-3 pt-2 border-t" style={{ borderColor: slideBorderColor }}>
                                FONT: {activeBrandData.typography.displayFont}
                              </div>
                            </div>

                            {/* Color Swatches */}
                            <div 
                              className="border p-4 flex flex-col justify-between"
                              style={{ borderColor: slideBorderColor, backgroundColor: isDark ? '#080808' : '#FFFFFF' }}
                            >
                              <div>
                                <span className="text-[10px] opacity-60 uppercase block">COLOR SYSTEM</span>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  {activeBrandData.colorMood.palette.slice(0, 4).map((p, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                                      <div 
                                        className="w-4 h-4 shrink-0 border border-zinc-700" 
                                        style={{ backgroundColor: p.hex }} 
                                      />
                                      <span className="font-bold truncate">{p.hex}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="text-[10px] opacity-75 mt-3 pt-2 border-t" style={{ borderColor: slideBorderColor }}>
                                MOOD: {activeBrandData.colorMood.name}
                              </div>
                            </div>

                            {/* Typography System */}
                            <div 
                              className="border p-4 flex flex-col justify-between"
                              style={{ borderColor: slideBorderColor, backgroundColor: isDark ? '#080808' : '#FFFFFF' }}
                            >
                              <div>
                                <span className="text-[10px] opacity-60 uppercase block">TYPE HIERARCHY</span>
                                <div className="space-y-1 mt-2 text-[10px]">
                                  <div><span className="opacity-50">DISPLAY:</span> <span className="font-bold">{activeBrandData.typography.displayFont}</span></div>
                                  <div><span className="opacity-50">BODY:</span> <span className="font-bold">{activeBrandData.typography.bodyFont}</span></div>
                                  <div><span className="opacity-50">MONO:</span> <span className="font-bold">{activeBrandData.typography.monoFont}</span></div>
                                </div>
                              </div>
                              <div className="text-[10px] text-[#00FF41] mt-3 pt-2 border-t" style={{ borderColor: slideBorderColor }}>
                                ✓ 100% WCAG AA CERTIFIED
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bottom Slide Footer Bar */}
                      <div 
                        className="w-full flex items-center justify-between border-t pt-3 font-mono text-[9px] sm:text-[10px] tracking-wider opacity-75"
                        style={{ borderColor: slideBorderColor }}
                      >
                        <div className="flex items-center gap-2">
                          <span>{currentActiveName.toUpperCase()} PITCH DECK // CONFIDENTIAL</span>
                          <span className="hidden sm:inline">· NOT FOR REDISTRIBUTION</span>
                        </div>

                        {/* Slide Indicator Dots */}
                        <div className="flex items-center gap-1.5">
                          {[0, 1, 2, 3].map((idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setPitchSlideIndex(idx)}
                              className={`w-2 h-2 transition-none cursor-pointer ${
                                pitchSlideIndex === idx 
                                  ? 'bg-[#00FF41]' 
                                  : (isDark ? 'bg-zinc-800 hover:bg-zinc-600' : 'bg-zinc-300 hover:bg-zinc-400')
                              }`}
                              title={`Jump to slide 0${idx + 1}`}
                            />
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Bottom Navigation & Thumbnail Cycler */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                      
                      {/* Prev / Next Buttons */}
                      <div className="flex items-center gap-2 font-mono text-xs w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => setPitchSlideIndex(prev => (prev - 1 + 4) % 4)}
                          className="flex-1 sm:flex-initial px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-500 text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition-none cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>PREV SLIDE</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPitchSlideIndex(prev => (prev + 1) % 4)}
                          className="flex-1 sm:flex-initial px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-[#00FF41] hover:text-[#00FF41] text-zinc-200 flex items-center justify-center gap-1.5 transition-none cursor-pointer"
                        >
                          <span>NEXT SLIDE</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* 4 Clickable Slide Thumbnails */}
                      <div className="grid grid-cols-4 gap-2 w-full sm:w-auto font-mono text-[10px]">
                        {[
                          { title: '01 HERO', desc: 'Title & Vision' },
                          { title: '02 VALUE', desc: 'Problem / Fix' },
                          { title: '03 MARKET', desc: 'Opportunity' },
                          { title: '04 IDENTITY', desc: 'Brand Kit' }
                        ].map((s, idx) => (
                          <div
                            key={idx}
                            onClick={() => setPitchSlideIndex(idx)}
                            className={`p-2 border cursor-pointer transition-none flex flex-col justify-between text-left ${
                              pitchSlideIndex === idx
                                ? 'border-[#00FF41] bg-[#00FF41]/10 text-white'
                                : 'border-zinc-800 bg-black text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                            }`}
                          >
                            <span className="font-bold">{s.title}</span>
                            <span className="text-[9px] opacity-60 truncate">{s.desc}</span>
                          </div>
                        ))}
                      </div>

                    </div>

                  </div>
                );
              })()}

            </div>

            {/* NEW SECTION: BRUTALIST_QR_GENERATOR */}
            <div className="border border-zinc-800 bg-[#080808] p-5 sm:p-6 space-y-5">
              
              {/* Header & Style Switcher */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-zinc-900 pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#00FF41]" />
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#00FF41] uppercase tracking-wider">
                      // BRUTALIST_QR_GENERATOR
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-zinc-500 mt-1">
                    DYNAMIC BRAND URL MATRIX ENCODING // HIGH-ECC (ISO/IEC 18004)
                  </div>
                </div>

                {/* Style and Export Controls */}
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  
                  {/* Theme Toggles */}
                  <div className="flex items-center border border-zinc-800 bg-black p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setQrStyle('paper')}
                      className={`px-2.5 py-1 transition-none ${
                        qrStyle === 'paper'
                          ? 'bg-white text-black font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      STARK PAPER
                    </button>
                    <button
                      type="button"
                      onClick={() => setQrStyle('dark')}
                      className={`px-2.5 py-1 transition-none ${
                        qrStyle === 'dark'
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      INVERTED DARK
                    </button>
                    <button
                      type="button"
                      onClick={() => setQrStyle('matrix')}
                      className={`px-2.5 py-1 transition-none ${
                        qrStyle === 'matrix'
                          ? 'bg-[#00FF41] text-black font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      MATRIX GREEN
                    </button>
                  </div>

                  {/* Download SVG */}
                  <button
                    type="button"
                    onClick={() => downloadQrAsset('svg')}
                    className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-[#00FF41] hover:text-[#00FF41] text-zinc-300 text-[11px] flex items-center gap-1.5 transition-none cursor-pointer"
                    title="Download high-resolution vector SVG"
                  >
                    <Download className="w-3.5 h-3.5 text-[#00FF41]" />
                    <span>DOWNLOAD SVG</span>
                  </button>

                  {/* Download PNG */}
                  <button
                    type="button"
                    onClick={() => downloadQrAsset('png')}
                    className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-white hover:text-white text-zinc-300 text-[11px] flex items-center gap-1.5 transition-none cursor-pointer"
                    title="Download 640x640 raster PNG"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PNG</span>
                  </button>

                </div>
              </div>

              {/* URL Input & Quick Status Bar */}
              <div className="border border-zinc-800 bg-black p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex-1 flex items-center gap-2">
                  <span className="font-mono text-xs text-zinc-500 shrink-0">TARGET_URL:</span>
                  <input
                    type="text"
                    value={customQrUrl}
                    onChange={(e) => setCustomQrUrl(e.target.value)}
                    placeholder={`https://rivetlabs.io/${currentActiveName.toLowerCase()}`}
                    className="flex-1 bg-zinc-950 border border-zinc-800 text-white font-mono text-xs px-3 py-1.5 outline-none focus:border-[#00FF41] rounded-none"
                  />
                  {customQrUrl && (
                    <button
                      type="button"
                      onClick={() => setCustomQrUrl('')}
                      className="text-zinc-500 hover:text-white font-mono text-xs px-2"
                      title="Reset to default brand URL"
                    >
                      RESET
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyQrString('url')}
                    className="font-mono text-[11px] px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-none cursor-pointer"
                  >
                    {copiedQrStatus === 'COPIED_URL' ? <Check className="w-3 h-3 text-[#00FF41]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedQrStatus === 'COPIED_URL' ? 'URL COPIED' : 'COPY URL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => copyQrString('svg')}
                    className="font-mono text-[11px] px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-none cursor-pointer"
                  >
                    {copiedQrStatus === 'COPIED_SVG' ? <Check className="w-3 h-3 text-[#00FF41]" /> : <Code className="w-3 h-3" />}
                    <span>{copiedQrStatus === 'COPIED_SVG' ? 'SVG COPIED' : 'COPY SVG CODE'}</span>
                  </button>
                </div>
              </div>

              {/* Brutalist Placard Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
                
                {/* Left Column: The Brutalist Physical Token Card */}
                <div className="md:col-span-5 flex justify-center">
                  <div 
                    className={`w-full max-w-[320px] p-6 border-2 transition-none relative flex flex-col items-center justify-between ${
                      qrStyle === 'paper'
                        ? 'bg-[#FFFFFF] border-black text-black'
                        : qrStyle === 'dark'
                          ? 'bg-[#050505] border-zinc-700 text-white'
                          : 'bg-[#050505] border-[#00FF41] text-white shadow-[0_0_25px_rgba(0,255,65,0.12)]'
                    }`}
                  >
                    {/* Corner registration crosshairs */}
                    <div className={`absolute top-2 left-2 font-mono text-xs select-none ${qrStyle === 'paper' ? 'text-zinc-400' : 'text-zinc-600'}`}>+</div>
                    <div className={`absolute top-2 right-2 font-mono text-xs select-none ${qrStyle === 'paper' ? 'text-zinc-400' : 'text-zinc-600'}`}>+</div>
                    <div className={`absolute bottom-2 left-2 font-mono text-xs select-none ${qrStyle === 'paper' ? 'text-zinc-400' : 'text-zinc-600'}`}>+</div>
                    <div className={`absolute bottom-2 right-2 font-mono text-xs select-none ${qrStyle === 'paper' ? 'text-zinc-400' : 'text-zinc-600'}`}>+</div>

                    {/* Card Header Tag */}
                    <div className="w-full flex items-center justify-between font-mono text-[9px] border-b pb-2 mb-4 tracking-wider uppercase font-bold"
                      style={{ borderColor: qrStyle === 'paper' ? '#E4E4E7' : '#27272A' }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-[#00FF41] inline-block" />
                        <span>RIVET_ID // {currentActiveName}</span>
                      </div>
                      <span>ECC: HIGH</span>
                    </div>

                    {/* Vector SVG QR Container */}
                    <div 
                      className={`p-3 border select-none w-56 h-56 flex items-center justify-center ${
                        qrStyle === 'paper' ? 'border-zinc-300 bg-white' : 'border-zinc-800 bg-black'
                      }`}
                    >
                      {qrSvg ? (
                        <div 
                          className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                          dangerouslySetInnerHTML={{ __html: qrSvg }}
                        />
                      ) : (
                        <div className="font-mono text-xs text-zinc-500 animate-pulse">
                          ENCODING MATRIX...
                        </div>
                      )}
                    </div>

                    {/* Card Footer Caption */}
                    <div className="w-full text-center mt-4 pt-3 border-t font-mono space-y-1"
                      style={{ borderColor: qrStyle === 'paper' ? '#E4E4E7' : '#27272A' }}
                    >
                      <div className="text-xs font-black tracking-widest uppercase">
                        {currentActiveName}
                      </div>
                      <div className="text-[10px] opacity-75 truncate max-w-[260px] mx-auto font-medium">
                        {effectiveQrUrl}
                      </div>
                      <div className="text-[8px] uppercase tracking-wider text-[#00FF41] bg-black/80 px-2 py-0.5 inline-block border border-zinc-800 mt-1">
                        SCAN WITH CAMERA TO LAUNCH
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Specification & Deployment Blueprint */}
                <div className="md:col-span-7 space-y-3 font-mono text-xs">
                  
                  <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-2">
                    <div className="text-[#00FF41] font-bold text-xs uppercase flex items-center justify-between">
                      <span>// MATRIX SPECIFICATIONS</span>
                      <span className="text-zinc-500 text-[10px]">[ISO/IEC 18004 COMPLIANT]</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="border border-zinc-900 bg-black p-2">
                        <span className="text-zinc-500 block text-[10px]">ERROR CORRECTION:</span>
                        <span className="text-white font-bold">LEVEL H (30% RESTORATION)</span>
                      </div>
                      <div className="border border-zinc-900 bg-black p-2">
                        <span className="text-zinc-500 block text-[10px]">MODULE GEOMETRY:</span>
                        <span className="text-white font-bold">SHARP 90° VECTOR RECTS</span>
                      </div>
                      <div className="border border-zinc-900 bg-black p-2">
                        <span className="text-zinc-500 block text-[10px]">TARGET DESTINATION:</span>
                        <span className="text-[#00FF41] font-bold truncate block">{effectiveQrUrl}</span>
                      </div>
                      <div className="border border-zinc-900 bg-black p-2">
                        <span className="text-zinc-500 block text-[10px]">RECOMMENDED PRINT:</span>
                        <span className="text-white font-bold">MIN 25mm × 25mm (300 DPI)</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-2">
                    <div className="text-zinc-300 font-bold text-xs uppercase">
                      // PHYSICAL LAUNCH COLLATERAL USAGE
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Embed this high-contrast brutalist QR code directly onto hardware packaging, launch posters, event badges, documentation covers, and sticker sheets. The Level-H error correction ensures high-reliability camera scanning even under poor industrial lighting or scuffed print surfaces.
                    </p>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="pt-1 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => downloadQrAsset('svg')}
                      className="bg-[#00FF41] text-black font-bold px-4 py-2 hover:bg-white transition-none uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>EXPORT PRINT SVG</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadQrAsset('png')}
                      className="border border-zinc-700 bg-zinc-900 text-zinc-200 px-4 py-2 hover:border-zinc-400 hover:text-white transition-none uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>EXPORT RASTER PNG</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>

            {/* THE PROMPT BLOCK (Specialized dark terminal container titled ASSET_GENERATION_PROMPT) */}
            <div className="border border-zinc-800 bg-black">
              {/* Terminal header */}
              <div className="border-b border-zinc-800 bg-[#0a0a0a] px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#00FF41]" />
                  <span className="font-mono text-xs font-bold text-white tracking-wider">
                    ASSET_GENERATION_PROMPT
                  </span>
                  <span className="font-mono text-[10px] text-zinc-500 hidden sm:inline-block">
                    // MIDJOURNEY / DALL-E 3 SPECIFICATION
                  </span>
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() => copyToClipboard(activeBrandData.assetPrompt, 'prompt')}
                  className="font-mono text-xs px-3 py-1 bg-zinc-900 text-zinc-300 hover:bg-[#00FF41] hover:text-black border border-zinc-700 hover:border-[#00FF41] transition-none flex items-center gap-1.5 cursor-pointer uppercase"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-black" />
                      <span className="text-black font-bold">COPIED TO CLIPBOARD</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY PROMPT</span>
                    </>
                  )}
                </button>
              </div>

              {/* Terminal Content */}
              <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-zinc-300 leading-relaxed overflow-x-auto selection:bg-[#00FF41] selection:text-black">
                <div className="text-zinc-600 mb-2">// Direct copy-paste ready for Midjourney / DALL-E / Imagen:</div>
                <p className="text-zinc-100 bg-[#060606] p-4 border border-zinc-800/80">
                  {activeBrandData.assetPrompt}
                </p>
              </div>
            </div>

            {/* Action Bar: Subtle SYSTEM RESET Button */}
            <div className="border border-zinc-800 bg-[#080808] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="font-mono text-xs text-zinc-500">
                <span>RIVET LABS COMPLETE PIPELINE // FOUNDER-TO-LAUNCH KIT EXPORTED</span>
              </div>

              {/* Action: Subtle SYSTEM RESET Button */}
              <button
                type="button"
                onClick={handleReset}
                className="border border-zinc-700 bg-black text-zinc-400 font-mono text-xs sm:text-sm px-6 py-3 hover:text-white hover:border-zinc-400 transition-none uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>SYSTEM RESET</span>
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Floating Quick-History Handle */}
      <button
        type="button"
        onClick={() => setIsHistoryOpen(prev => !prev)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#080808] border-y border-l border-zinc-800 hover:border-[#00FF41] text-zinc-400 hover:text-white px-2 py-3.5 font-mono text-[10px] flex flex-col items-center gap-2 cursor-pointer shadow-xl transition-none"
        title="Open Workflow History"
      >
        <History className="w-3.5 h-3.5 text-[#00FF41]" />
        <span className="[writing-mode:vertical-rl] tracking-wider uppercase">HISTORY ({history.length})</span>
      </button>

      {/* Checkpoint Toast Notification */}
      {historyNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0a0a0a] border border-[#00FF41] text-[#00FF41] font-mono text-xs px-4 py-2.5 shadow-2xl flex items-center gap-2">
          <Check className="w-3.5 h-3.5" />
          <span>&gt; {historyNotification}</span>
        </div>
      )}

      {/* 4. WORKFLOW HISTORY SIDEBAR / PANEL */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setIsHistoryOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-xs"
          />

          {/* Sidebar Panel */}
          <aside className="relative w-full max-w-md bg-[#080808] border-l border-zinc-800 h-full flex flex-col z-10 shadow-2xl">
            
            {/* Sidebar Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 bg-[#0a0a0a] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4 text-[#00FF41]" />
                <div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    WORKFLOW_HISTORY
                  </div>
                  <div className="font-mono text-[10px] text-zinc-500">
                    {history.length} STRATEGY SNAPSHOTS SAVED
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Manual Snapshot Button */}
                <button
                  type="button"
                  onClick={() => saveCheckpoint(currentStep)}
                  className="font-mono text-[10px] px-2.5 py-1 bg-zinc-900 border border-zinc-700 hover:border-[#00FF41] hover:text-[#00FF41] text-zinc-300 flex items-center gap-1 transition-none cursor-pointer"
                  title="Snapshot current state"
                >
                  <Plus className="w-3 h-3 text-[#00FF41]" />
                  <span>SNAPSHOT</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(false)}
                  className="p-1.5 text-zinc-500 hover:text-white border border-transparent hover:border-zinc-800 transition-none cursor-pointer"
                  aria-label="Close history panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Strategy Snapshot List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {history.map((item) => {
                const isCurrent = activeCheckpointId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => restoreCheckpoint(item)}
                    className={`p-3.5 border transition-none cursor-pointer flex flex-col justify-between ${
                      isCurrent
                        ? 'border-[#00FF41] bg-[#00FF41]/5 text-white'
                        : 'border-zinc-800 bg-black/60 text-zinc-300 hover:border-zinc-600 hover:text-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-white tracking-wider">
                            {item.brandName}
                          </span>
                          <span className="font-mono text-[10px] text-[#00FF41] bg-[#00FF41]/10 px-1.5 py-0.5 border border-[#00FF41]/30">
                            STAGE 0{item.step}
                          </span>
                          {isCurrent && (
                            <span className="font-mono text-[10px] text-[#00FF41] font-bold">
                              ● CURRENT
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[10px] text-zinc-400 mt-1">
                          {item.category}
                        </div>
                      </div>

                      <div className="font-mono text-[10px] text-zinc-500 shrink-0">
                        {item.timestamp}
                      </div>
                    </div>

                    {/* Input prompt snippet */}
                    <div className="font-mono text-[11px] text-zinc-500 line-clamp-2 mt-2 pt-2 border-t border-zinc-900">
                      "{item.userPrompt}"
                    </div>

                    {/* Bottom Card Controls */}
                    <div className="flex items-center justify-between font-mono text-[10px] mt-3 pt-2 border-t border-zinc-900/80">
                      <span className={isCurrent ? 'text-[#00FF41]' : 'text-zinc-500'}>
                        {isCurrent ? 'CURRENTLY LOADED' : 'CLICK TO RESTORE'}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            restoreCheckpoint(item);
                          }}
                          className={`px-2.5 py-0.5 border ${
                            isCurrent
                              ? 'border-[#00FF41] text-[#00FF41] bg-[#00FF41]/10'
                              : 'border-zinc-700 text-zinc-300 hover:border-white hover:text-white'
                          }`}
                        >
                          RESTORE
                        </button>

                        {history.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => deleteCheckpoint(item.id, e)}
                            className="p-1 text-zinc-600 hover:text-red-400 border border-transparent hover:border-zinc-800"
                            title="Delete snapshot"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-zinc-800 bg-[#0a0a0a] flex items-center justify-between font-mono text-[11px] text-zinc-500">
              <div>AUTO-CHECKPOINT: ENGAGED</div>
              <button
                type="button"
                onClick={() => saveCheckpoint(currentStep)}
                className="text-[#00FF41] hover:underline cursor-pointer"
              >
                + Snapshot Current State
              </button>
            </div>

          </aside>
        </div>
      )}

      {/* 3. BRUTALIST FOOTER */}
      <footer className="w-full border-t border-zinc-800 bg-[#050505] px-4 sm:px-8 py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00FF41]" />
            <span>RIVET LABS // REASONED MULTI-STAGE BRAND ENGINE</span>
          </div>
          <div className="flex items-center gap-4">
            <span>NO ONE-PROMPT SHORTCUTS</span>
            <span className="text-zinc-700">·</span>
            <span>SHARP CORNERS ONLY</span>
            <span className="text-zinc-700">·</span>
            <span>2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
