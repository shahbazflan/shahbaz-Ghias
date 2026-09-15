import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  SideLogo,
  getSideLogos,
  getOrbitingLogos,
  updateLogoOrbitPosition,
  getFacebookContourPoints,
  getInstagramContourPoints,
  getYouTubeContourPoints,
  getTikTokContourPoints,
  getSnapchatContourPoints,
  getLinkedInContourPoints,
  getXContourPoints,
  getPinterestContourPoints,
  drawLogoNegativeSpace,
} from '../lib/logoShapes';

interface InteractiveCanvasProps {
  className?: string;
  exclusionId?: string;
  hideControlDock?: boolean;
}

interface VortexDot {
  id: number;
  // Scattered initial state
  scatterX: number;
  scatterY: number;
  scatterZ: number;
  scatterAngle: number;
  scatterDist: number;

  // Circular target state (Accretion disk physics)
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
  orbitZ: number;
  spiralArm: number; // Spiral arm index for fibrous wisps
  wispPhase: number;
  wispSpeed: number;
  wispAmp: number;

  // Appearance & Identity
  baseRadius: number;
  currentRadius: number;
  colorType: 'core' | 'gold' | 'amber' | 'copper' | 'crimson' | 'stardust';
  baseAlpha: number;
  layer: 'ring' | 'disk' | 'wisp' | 'dust' | 'bgDust' | 'logoRim' | 'logoCorona'; // Structural zone
  twinklePhase: number;
  twinkleSpeed: number;

  // Negative space side logo attachment (FB, IG, YT, TT)
  logoIndex?: number;
  relTargetX?: number;
  relTargetY?: number;
  isContour?: boolean;

  // Motion history for visual momentum trailing effect
  prevX?: number;
  prevY?: number;
  prevX2?: number;
  prevY2?: number;
}

interface CursorSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rgb: string;
  hex: string;
  alpha: number;
  life: number;
  maxLife: number;
}

// Temporary glowing burst particles spawned along scroll direction
interface ScrollParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rgb: string;
  alpha: number;
  life: number;
  maxLife: number;
  prevX: number;
  prevY: number;
}

// Palette sampled directly from the fiery cosmic accretion reference image
type RGBTuple = [number, number, number];

interface PaletteStop {
  core: RGBTuple;
  gold: RGBTuple;
  amber: RGBTuple;
  copper: RGBTuple;
  crimson: RGBTuple;
  stardust: RGBTuple;
}

// 1. Header Palette (Authentic fiery solar / orange cosmic accretion disk from reference)
const PALETTE_HEADER: PaletteStop = {
  core: [255, 244, 219],     // incandescent white-gold
  gold: [255, 192, 67],      // solar gold
  amber: [255, 138, 24],     // intense fiery orange
  copper: [216, 93, 58],     // signature terracotta
  crimson: [166, 36, 8],     // deep flame ember
  stardust: [220, 235, 255], // pale celestial
};

// 2. Mid-Page Palette (Warm sunset coral, rose-gold, and magenta)
const PALETTE_MID: PaletteStop = {
  core: [255, 240, 232],     // warm pearl
  gold: [255, 155, 95],      // peach solar
  amber: [255, 92, 75],      // vibrant coral-orange
  copper: [215, 65, 110],    // rose terracotta
  crimson: [165, 30, 75],    // deep ruby ember
  stardust: [235, 222, 255], // soft lilac stardust
};

// 3. Footer Palette (Electric amethyst, aurora cyan-teal, and deep twilight indigo)
const PALETTE_FOOTER: PaletteStop = {
  core: [220, 248, 255],     // luminous crystal cyan
  gold: [58, 224, 214],      // aurora cyan-teal
  amber: [195, 90, 255],     // electric violet / neon amethyst
  copper: [115, 85, 230],    // twilight deep indigo
  crimson: [68, 45, 185],    // midnight violet
  stardust: [215, 200, 255], // celestial lavender
};

function lerpRGB(c1: RGBTuple, c2: RGBTuple, t: number): RGBTuple {
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * t),
    Math.round(c1[1] + (c2[1] - c1[1]) * t),
    Math.round(c1[2] + (c2[2] - c1[2]) * t),
  ];
}

function getInterpolatedPalette(scrollFraction: number): Record<keyof PaletteStop, string> {
  const clamped = Math.max(0, Math.min(scrollFraction, 1));
  let stop1: PaletteStop;
  let stop2: PaletteStop;
  let localT: number;

  if (clamped < 0.5) {
    stop1 = PALETTE_HEADER;
    stop2 = PALETTE_MID;
    localT = clamped / 0.5;
  } else {
    stop1 = PALETTE_MID;
    stop2 = PALETTE_FOOTER;
    localT = (clamped - 0.5) / 0.5;
  }

  return {
    core: lerpRGB(stop1.core, stop2.core, localT).join(', '),
    gold: lerpRGB(stop1.gold, stop2.gold, localT).join(', '),
    amber: lerpRGB(stop1.amber, stop2.amber, localT).join(', '),
    copper: lerpRGB(stop1.copper, stop2.copper, localT).join(', '),
    crimson: lerpRGB(stop1.crimson, stop2.crimson, localT).join(', '),
    stardust: lerpRGB(stop1.stardust, stop2.stardust, localT).join(', '),
  };
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  className = '',
  exclusionId = 'hero-content-exclusion',
  hideControlDock = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSlowMode, setIsSlowMode] = useState(true);
  const [formationState, setFormationState] = useState<'scattered' | 'forming' | 'circular'>('forming');
  const exclusionIdRef = useRef(exclusionId);

  // Animation progress ref for smooth 60fps interpolation without React re-renders
  const animProgressRef = useRef<number>(0);
  const isFormingRef = useRef<boolean>(true);
  const triggerScatterRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    exclusionIdRef.current = exclusionId;
  }, [exclusionId]);

  const mouseRef = useRef<{
    x: number;
    y: number;
    px: number;
    py: number;
    vx: number;
    vy: number;
    active: boolean;
  }>({
    x: -1000,
    y: -1000,
    px: -1000,
    py: -1000,
    vx: 0,
    vy: 0,
    active: false,
  });

  const triggerScatterAnimation = useCallback(() => {
    animProgressRef.current = 0;
    isFormingRef.current = true;
    setFormationState('forming');
  }, []);

  useEffect(() => {
    triggerScatterRef.current = triggerScatterAnimation;
  }, [triggerScatterAnimation]);

  useEffect(() => {
    if (!isEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const totalDots = isMobile ? 3600 : 6200;

    // Central Event Horizon Geometry (Positioned to frame hero section elegantly)
    const getVortexCenter = () => {
      const cx = width * 0.5;
      const cy = height * 0.44; // Matches the hero title focal height
      const eventHorizonRadius = isMobile
        ? Math.min(width * 0.26, 95)
        : Math.min(width * 0.18, height * 0.25, 175);
      return { cx, cy, eventHorizonRadius };
    };

    const { cx: initialCx, cy: initialCy, eventHorizonRadius: initialHorizonRadius } = getVortexCenter();
    let currentSideLogos = getOrbitingLogos(width, height, initialHorizonRadius);

    // Exclusion zone for text area
    let exclusionBox: { left: number; top: number; right: number; bottom: number } | null = null;
    const updateExclusionBox = () => {
      const targetId = exclusionIdRef.current || 'hero-content-exclusion';
      const el = document.getElementById(targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.bottom > 0 && rect.top < height) {
          const padX = isMobile ? 12 : 24;
          const padY = isMobile ? 10 : 18;
          exclusionBox = {
            left: rect.left - padX,
            top: rect.top - padY,
            right: rect.right + padX,
            bottom: rect.bottom + padY,
          };
          return;
        }
      }
      exclusionBox = null;
    };

    updateExclusionBox();

    // -------------------------------------------------------------
    // GENERATE PARTICLES (Center Accretion Vortex + 8 Orbiting Brand Logos)
    // -------------------------------------------------------------
    const dots: VortexDot[] = [];
    const { eventHorizonRadius } = getVortexCenter();
    let dotIdCounter = 0;

    // Helper for random scatter distribution across full screen
    const createScatterCoord = (scaleMultiplier = 1.35) => {
      const spreadX = (Math.random() - 0.5) * width * scaleMultiplier;
      const spreadY = (Math.random() - 0.5) * height * scaleMultiplier;
      const spreadZ = (Math.random() - 0.5) * 450;
      const scatterDist = Math.hypot(spreadX, spreadY);
      const scatterAngle = Math.atan2(spreadY, spreadX);
      return { spreadX, spreadY, spreadZ, scatterDist, scatterAngle };
    };

    // -------------------------------------------------------------
    // 1. FOUR NEGATIVE-SPACE BRAND LOGOS ON SIDE AREAS (FB, IG, YT, TT)
    // -------------------------------------------------------------
    currentSideLogos.forEach((logo, logoIndex) => {
      let contourPoints: Array<{
        x: number;
        y: number;
        colorType: 'core' | 'gold' | 'amber' | 'stardust';
        baseRadius: number;
        alpha: number;
      }> = [];

      if (logo.id === 'facebook') {
        contourPoints = getFacebookContourPoints(logo.radius);
      } else if (logo.id === 'instagram') {
        contourPoints = getInstagramContourPoints(logo.radius);
      } else if (logo.id === 'youtube') {
        contourPoints = getYouTubeContourPoints(logo.radius);
      } else if (logo.id === 'tiktok') {
        contourPoints = getTikTokContourPoints(logo.radius);
      } else if (logo.id === 'snapchat') {
        contourPoints = getSnapchatContourPoints(logo.radius);
      } else if (logo.id === 'linkedin') {
        contourPoints = getLinkedInContourPoints(logo.radius);
      } else if (logo.id === 'x') {
        contourPoints = getXContourPoints(logo.radius);
      } else if (logo.id === 'pinterest') {
        contourPoints = getPinterestContourPoints(logo.radius);
      }

      // A. Incandescent contour rim dots tracing the negative-space silhouette
      for (let p = 0; p < contourPoints.length; p++) {
        const pt = contourPoints[p];
        const { spreadX, spreadY, spreadZ, scatterDist, scatterAngle } = createScatterCoord(1.35);
        dots.push({
          id: dotIdCounter++,
          scatterX: spreadX,
          scatterY: spreadY,
          scatterZ: spreadZ,
          scatterAngle,
          scatterDist,
          orbitRadius: Math.hypot(pt.x, pt.y),
          orbitAngle: Math.atan2(pt.y, pt.x),
          orbitSpeed: 0,
          orbitZ: (Math.random() - 0.5) * 16,
          spiralArm: 0,
          wispPhase: Math.random() * Math.PI * 2,
          wispSpeed: 0.02,
          wispAmp: 0,
          baseRadius: pt.baseRadius,
          currentRadius: pt.baseRadius,
          colorType: pt.colorType,
          baseAlpha: pt.alpha,
          layer: 'logoRim',
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.025 + Math.random() * 0.035,
          logoIndex,
          relTargetX: pt.x,
          relTargetY: pt.y,
          isContour: true,
        });
      }

      // B. Orbiting corona halo dots swirling around each logo (scaled for outer tier)
      const isOuter = logo.tier === 'outer';
      const coronaCount = isOuter ? (isMobile ? 18 : 34) : (isMobile ? 32 : 64);
      for (let c = 0; c < coronaCount; c++) {
        const { spreadX, spreadY, spreadZ, scatterDist, scatterAngle } = createScatterCoord(1.4);
        const angle = Math.random() * Math.PI * 2;
        const orbitRadius = logo.radius * (1.02 + Math.pow(Math.random(), 1.5) * 0.48);
        const colorRoll = Math.random();
        const colorType: 'core' | 'gold' | 'amber' | 'copper' =
          colorRoll < 0.22 ? 'core' : colorRoll < 0.65 ? 'amber' : 'gold';
        const baseRadius = Math.random() * 0.5 + 0.72;

        dots.push({
          id: dotIdCounter++,
          scatterX: spreadX,
          scatterY: spreadY,
          scatterZ: spreadZ,
          scatterAngle,
          scatterDist,
          orbitRadius,
          orbitAngle: angle,
          orbitSpeed: (0.0032 + Math.random() * 0.0022) * (Math.random() < 0.5 ? 1 : -1),
          orbitZ: (Math.random() - 0.5) * 22,
          spiralArm: 0,
          wispPhase: Math.random() * Math.PI * 2,
          wispSpeed: 0.02,
          wispAmp: 0,
          baseRadius,
          currentRadius: baseRadius,
          colorType,
          baseAlpha: Math.random() * 0.28 + 0.68,
          layer: 'logoCorona',
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.02 + Math.random() * 0.03,
          logoIndex,
          isContour: false,
        });
      }
    });

    // -------------------------------------------------------------
    // 2. CENTRAL BLACK HOLE ACCRETION VORTEX PARTICLES
    // -------------------------------------------------------------
    const centerDots = Math.max(totalDots - dots.length, 1200);

    const orangeNearCircleCount = Math.floor(centerDots * 0.30);
    const photonRingCount = Math.floor(centerDots * 0.12);
    const accretionDiskCount = Math.floor(centerDots * 0.28);
    const spiralWispCount = Math.floor(centerDots * 0.14);
    const bgDustCount = centerDots - (orangeNearCircleCount + photonRingCount + accretionDiskCount + spiralWispCount);

    // 1. Dedicated Doubled Orange Dots Near the Circle (Intense fiery orange corona)
    for (let i = 0; i < orangeNearCircleCount; i++) {
      const { spreadX, spreadY, spreadZ, scatterDist, scatterAngle } = createScatterCoord(1.2);
      const angle = Math.random() * Math.PI * 2;
      // High density exponential cluster immediately hugging the circular event horizon edge
      const rDist = Math.pow(Math.random(), 1.45);
      const orbitRadius = eventHorizonRadius * (1.015 + rDist * 0.46);
      const baseRadius = Math.random() * 0.55 + 0.75;

      dots.push({
        id: dotIdCounter++,
        scatterX: spreadX,
        scatterY: spreadY,
        scatterZ: spreadZ,
        scatterAngle,
        scatterDist,
        orbitRadius,
        orbitAngle: angle,
        orbitSpeed: (0.0034 + Math.random() * 0.002) * Math.sqrt(eventHorizonRadius / orbitRadius),
        orbitZ: (Math.random() - 0.5) * 32,
        spiralArm: 0,
        wispPhase: Math.random() * Math.PI * 2,
        wispSpeed: 0.02 + Math.random() * 0.025,
        wispAmp: Math.random() * 3.5 + 1.5,
        baseRadius,
        currentRadius: baseRadius,
        colorType: 'amber', // Pure fiery orange
        baseAlpha: Math.random() * 0.28 + 0.72,
        layer: 'ring',
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.025 + Math.random() * 0.035,
      });
    }

    // 2. Photon Ring Dots (The intense luminous inner circular rim)
    for (let i = 0; i < photonRingCount; i++) {
      const { spreadX, spreadY, spreadZ, scatterDist, scatterAngle } = createScatterCoord(1.2);
      const angle = Math.random() * Math.PI * 2;
      // Tightly bounded just outside the event horizon
      const rRatio = Math.pow(Math.random(), 2.2);
      const orbitRadius = eventHorizonRadius * (1.01 + rRatio * 0.28);
      const isCore = Math.random() < 0.45;
      const colorType: 'core' | 'gold' | 'amber' = isCore ? 'core' : (Math.random() < 0.4 ? 'gold' : 'amber');
      const baseRadius = isCore
        ? (Math.random() * 0.65 + 1.05) // Crisp white-hot pinpoint
        : (Math.random() * 0.5 + 0.75);

      dots.push({
        id: dotIdCounter++,
        scatterX: spreadX,
        scatterY: spreadY,
        scatterZ: spreadZ,
        scatterAngle,
        scatterDist,
        orbitRadius,
        orbitAngle: angle,
        // Faster near event horizon (Keplerian differential rotation)
        orbitSpeed: 0.0036 + Math.random() * 0.0018,
        orbitZ: (Math.random() - 0.5) * 30,
        spiralArm: 0,
        wispPhase: Math.random() * Math.PI * 2,
        wispSpeed: 0.02 + Math.random() * 0.03,
        wispAmp: Math.random() * 4 + 2,
        baseRadius,
        currentRadius: baseRadius,
        colorType,
        baseAlpha: Math.random() * 0.25 + 0.75,
        layer: 'ring',
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.03 + Math.random() * 0.04,
      });
    }

    // 3. Accretion Disk Dots (Concentric fiery plasma disk)
    for (let i = 0; i < accretionDiskCount; i++) {
      const { spreadX, spreadY, spreadZ, scatterDist, scatterAngle } = createScatterCoord(1.3);
      const angle = Math.random() * Math.PI * 2;
      // Exponential distribution falling off towards the outer perimeter
      const distFactor = Math.pow(Math.random(), 1.5);
      const orbitRadius = eventHorizonRadius * (1.25 + distFactor * 2.1);

      const colorRoll = Math.random();
      let colorType: 'gold' | 'amber' | 'copper' | 'crimson';
      if (orbitRadius < eventHorizonRadius * 1.8) {
        // Heavy orange concentration in inner accretion zone
        colorType = colorRoll < 0.65 ? 'amber' : (colorRoll < 0.85 ? 'gold' : 'copper');
      } else {
        colorType = colorRoll < 0.35 ? 'amber' : (colorRoll < 0.80 ? 'copper' : 'crimson');
      }
      const baseRadius = Math.random() * 0.55 + 0.75;

      dots.push({
        id: dotIdCounter++,
        scatterX: spreadX,
        scatterY: spreadY,
        scatterZ: spreadZ,
        scatterAngle,
        scatterDist,
        orbitRadius,
        orbitAngle: angle,
        orbitSpeed: (0.0018 + Math.random() * 0.0012) * Math.sqrt(eventHorizonRadius / orbitRadius),
        orbitZ: (Math.random() - 0.5) * (40 + (orbitRadius / eventHorizonRadius) * 20),
        spiralArm: Math.floor(Math.random() * 4),
        wispPhase: Math.random() * Math.PI * 2,
        wispSpeed: 0.015 + Math.random() * 0.02,
        wispAmp: Math.random() * 8 + 3,
        baseRadius,
        currentRadius: baseRadius,
        colorType,
        baseAlpha: Math.random() * 0.35 + 0.55,
        layer: 'disk',
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    // 4. Spiral Wisps & Outer Streamer Filaments (The sweeping arms from reference photo)
    for (let i = 0; i < spiralWispCount; i++) {
      const { spreadX, spreadY, spreadZ, scatterDist, scatterAngle } = createScatterCoord(1.4);
      // 2 major spiral arms: upper right streamer and lower left curl
      const armIndex = i % 2;
      const t = Math.random();
      const baseArmAngle = armIndex === 0 ? 0.3 : Math.PI + 0.3;
      // Logarithmic spiral progression
      const spiralAngle = baseArmAngle + t * Math.PI * 1.8 + (Math.random() - 0.5) * 0.45;
      const orbitRadius = eventHorizonRadius * (1.4 + t * 2.8 + (Math.random() - 0.5) * 0.5);

      const colorRoll = Math.random();
      const colorType: 'amber' | 'copper' | 'crimson' =
        colorRoll < 0.40 ? 'amber' : (colorRoll < 0.78 ? 'copper' : 'crimson');
      const baseRadius = Math.random() * 0.5 + 0.7;

      dots.push({
        id: dotIdCounter++,
        scatterX: spreadX,
        scatterY: spreadY,
        scatterZ: spreadZ,
        scatterAngle,
        scatterDist,
        orbitRadius,
        orbitAngle: spiralAngle,
        orbitSpeed: (0.0013 + Math.random() * 0.0008) * Math.sqrt(eventHorizonRadius / orbitRadius),
        orbitZ: (Math.random() - 0.5) * 70,
        spiralArm: armIndex + 1,
        wispPhase: Math.random() * Math.PI * 2,
        wispSpeed: 0.012 + Math.random() * 0.015,
        wispAmp: Math.random() * 14 + 5,
        baseRadius,
        currentRadius: baseRadius,
        colorType,
        baseAlpha: Math.random() * 0.35 + 0.45,
        layer: 'wisp',
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.025,
      });
    }

    // 5. Background Stardust & Embers (Replaces background glow with crisp fine dots across screen)
    for (let i = 0; i < bgDustCount; i++) {
      const { spreadX, spreadY, spreadZ, scatterDist, scatterAngle } = createScatterCoord(1.55);
      const angle = Math.random() * Math.PI * 2;
      // Sweeping wide orbits filling the surrounding background field
      const orbitRadius = eventHorizonRadius * (1.6 + Math.pow(Math.random(), 0.8) * 4.2);

      const colorRoll = Math.random();
      let colorType: 'stardust' | 'gold' | 'amber' | 'copper' | 'crimson';
      if (colorRoll < 0.32) {
        colorType = 'stardust'; // Sparkling celestial points
      } else if (colorRoll < 0.54) {
        colorType = 'gold';     // Solar dust
      } else if (colorRoll < 0.76) {
        colorType = 'amber';    // Fiery embers
      } else if (colorRoll < 0.90) {
        colorType = 'copper';   // Warm terracotta specks
      } else {
        colorType = 'crimson';  // Deep space embers
      }

      // Tiny sharp pinpoint dots (no blur)
      const baseRadius = Math.random() * 0.45 + 0.5;

      dots.push({
        id: dotIdCounter++,
        scatterX: spreadX,
        scatterY: spreadY,
        scatterZ: spreadZ,
        scatterAngle,
        scatterDist,
        orbitRadius,
        orbitAngle: angle,
        orbitSpeed: (0.0004 + Math.random() * 0.0006) * Math.sqrt(eventHorizonRadius / orbitRadius),
        orbitZ: (Math.random() - 0.5) * 220,
        spiralArm: 0,
        wispPhase: Math.random() * Math.PI * 2,
        wispSpeed: 0.008 + Math.random() * 0.012,
        wispAmp: Math.random() * 6 + 2,
        baseRadius,
        currentRadius: baseRadius,
        colorType,
        baseAlpha: Math.random() * 0.38 + 0.32,
        layer: 'bgDust',
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.015 + Math.random() * 0.03,
      });
    }

    // Interactive cursor sparks
    const cursorSparks: CursorSpark[] = [];

    // Scroll momentum burst particles
    const scrollParticles: ScrollParticle[] = [];
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();

    const getScrollFraction = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
      return Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    };

    let targetScrollProgress = getScrollFraction();
    let smoothScrollProgress = targetScrollProgress;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const { eventHorizonRadius: resizedHorizonRadius } = getVortexCenter();
      currentSideLogos = getOrbitingLogos(width, height, resizedHorizonRadius);
      updateExclusionBox();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - mouseRef.current.x;
      const dy = e.clientY - mouseRef.current.y;
      const speed = Math.hypot(dx, dy);

      mouseRef.current.px = mouseRef.current.x;
      mouseRef.current.py = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.vx = dx * 0.2;
      mouseRef.current.vy = dy * 0.2;
      mouseRef.current.active = true;

      // Emit glowing cursor sparks with current scroll color
      const currentPal = getInterpolatedPalette(smoothScrollProgress);
      const sparkCount = Math.min(Math.max(Math.floor(speed / 9), 1), 3);
      for (let s = 0; s < sparkCount; s++) {
        if (cursorSparks.length >= 60) cursorSparks.shift();
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 1.8 + 0.4;
        const colRgb = Math.random() < 0.5 ? currentPal.gold : currentPal.amber;
        const life = Math.floor(Math.random() * 22 + 16);

        cursorSparks.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * spd + mouseRef.current.vx * 0.1,
          vy: Math.sin(angle) * spd + mouseRef.current.vy * 0.1 - 0.15,
          radius: Math.random() * 1.4 + 0.8,
          rgb: colRgb,
          hex: '#ffffff',
          alpha: 0.8,
          life,
          maxLife: life,
        });
      }

      // Proximity flare when cursor hovers near any negative-space side logo
      for (let l = 0; l < currentSideLogos.length; l++) {
        const logo = currentSideLogos[l];
        const dist = Math.hypot(e.clientX - logo.x, e.clientY - logo.y);
        if (dist < logo.radius * 1.6) {
          if (cursorSparks.length >= 60) cursorSparks.shift();
          const sparkAngle = Math.random() * Math.PI * 2;
          const sparkSpd = Math.random() * 1.5 + 0.6;
          cursorSparks.push({
            x: logo.x + Math.cos(sparkAngle) * (logo.radius * 0.95),
            y: logo.y + Math.sin(sparkAngle) * (logo.radius * 0.95),
            vx: Math.cos(sparkAngle) * sparkSpd,
            vy: Math.sin(sparkAngle) * sparkSpd,
            radius: Math.random() * 1.6 + 0.9,
            rgb: currentPal.core,
            hex: '#ffffff',
            alpha: 0.92,
            life: 28,
            maxLife: 28,
          });
          break;
        }
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleScroll = () => {
      updateExclusionBox();
      targetScrollProgress = getScrollFraction();

      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      const now = performance.now();
      const dt = Math.max(now - lastScrollTime, 8);
      const scrollSpeed = deltaY / dt; // px per ms
      lastScrollY = currentScrollY;
      lastScrollTime = now;

      // Spawn temporary burst / trail of glowing smaller particles following scroll direction
      if (Math.abs(deltaY) > 2) {
        const currentPal = getInterpolatedPalette(smoothScrollProgress);
        // scrollDir: 1 for scrolling downward (content scrolls up), -1 for scrolling upward
        const scrollDir = Math.sign(deltaY);
        const burstCount = Math.min(Math.max(Math.floor(Math.abs(deltaY) / 8), 4), 16);
        const baseSpeed = Math.min(Math.abs(scrollSpeed) * 10 + 4, 34);

        for (let i = 0; i < burstCount; i++) {
          if (scrollParticles.length >= 200) scrollParticles.shift();

          // Spread across screen width with focus near active interaction or across view
          const spawnX = mouseRef.current.active
            ? mouseRef.current.x + (Math.random() - 0.5) * (width * 0.55)
            : Math.random() * width;

          // Spawn near the edge or mid-screen matching scroll flow
          const spawnY = scrollDir > 0
            ? height * 0.8 + (Math.random() - 0.5) * (height * 0.35)
            : height * 0.2 + (Math.random() - 0.5) * (height * 0.35);

          // Flow in the direction of momentum with slight horizontal flutter
          const pAngle = scrollDir > 0
            ? -Math.PI * 0.5 + (Math.random() - 0.5) * 0.55
            : Math.PI * 0.5 + (Math.random() - 0.5) * 0.55;

          const pVel = (Math.random() * 0.6 + 0.6) * baseSpeed;
          const life = Math.floor(Math.random() * 26 + 22);

          const colRand = Math.random();
          const rgb = colRand < 0.35
            ? currentPal.core
            : colRand < 0.72
              ? currentPal.gold
              : currentPal.amber;

          scrollParticles.push({
            x: spawnX,
            y: spawnY,
            vx: Math.cos(pAngle) * (pVel * 0.2) + (Math.random() - 0.5) * 1.6,
            vy: Math.sin(pAngle) * pVel,
            radius: Math.random() * 1.5 + 0.7,
            rgb,
            alpha: Math.random() * 0.35 + 0.55,
            life,
            maxLife: life,
            prevX: spawnX,
            prevY: spawnY,
          });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // 3D Gyroscope & Camera State
    let cameraTiltX = 0;
    let cameraTiltY = 0;
    let frameCount = 0;
    const diskInclination = 0.38; // ~22° natural 3D tilt as in reference image

    // Start in scattered formation, then smoothly transition into circular vortex
    animProgressRef.current = 0;
    isFormingRef.current = true;

    // Cubic easing for majestic organic transition
    const easeInOutCubic = (x: number): number => {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    };

    const render = () => {
      frameCount++;
      if (frameCount % 30 === 0) {
        updateExclusionBox();
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth scroll progress interpolation for silky gradient color shift
      smoothScrollProgress += (targetScrollProgress - smoothScrollProgress) * 0.08;
      const activePalette = getInterpolatedPalette(smoothScrollProgress);

      // Respiratory phase for organic breathing pulse animation (~3.7s full period)
      const now = performance.now();
      const breathingPhase = now * 0.0017;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = mouseRef.current.active;
      const { cx, cy, eventHorizonRadius } = getVortexCenter();

      // Update Formation Progress (0 = scattered, 1 = circular vortex)
      if (isFormingRef.current) {
        // Smoothly advance transition over ~2.8 seconds
        animProgressRef.current += 0.0075;
        if (animProgressRef.current >= 1) {
          animProgressRef.current = 1;
          isFormingRef.current = false;
          setFormationState('circular');
        }
      }

      const formationProgress = easeInOutCubic(Math.min(animProgressRef.current, 1));

      // 3D Camera tilt smoothly tracks cursor
      const targetTiltY = mouseActive ? ((mx - cx) / (width * 0.5)) * 0.28 : 0;
      const targetTiltX = mouseActive ? -((my - cy) / (height * 0.5)) * 0.22 : 0;
      cameraTiltY += (targetTiltY - cameraTiltY) * 0.04;
      cameraTiltX += (targetTiltX - cameraTiltX) * 0.04;

      const rotX = diskInclination + cameraTiltX;
      const rotY = cameraTiltY;
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

      // Speed control factor (Slow mode is hypnotic as requested)
      const speedFactor = isSlowMode ? 0.75 : 1.45;

      const fov = 800;

      // Update Orbiting Brand Logos revolving along the circle's accretion orbit in 3D perspective
      for (let l = 0; l < currentSideLogos.length; l++) {
        updateLogoOrbitPosition(
          currentSideLogos[l],
          cx,
          cy,
          cosX,
          sinX,
          cosY,
          sinY,
          fov,
          speedFactor
        );
      }



      // -------------------------------------------------------------
      // 1. DRAW CLEAN NEGATIVE SPACE VOIDS (CENTER BLACK HOLE + 4 ORBITING BRAND LOGOS)
      // -------------------------------------------------------------
      if (formationProgress > 0.25) {
        const coreAlpha = (formationProgress - 0.25) / 0.75;

        // Clean, pitch black event horizon core void (Pure dark disc, zero blurry glow)
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, eventHorizonRadius * 0.98, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(9, 10, 12, ${0.98 * coreAlpha})`;
        ctx.fill();
        ctx.restore();

        // Four Negative-Space Brand Logos (Facebook, Instagram, YouTube, TikTok) orbiting with the circles
        for (let l = 0; l < currentSideLogos.length; l++) {
          drawLogoNegativeSpace(ctx, currentSideLogos[l], coreAlpha, activePalette.gold);
        }
      }

      // -------------------------------------------------------------
      // 2. UPDATE PARTICLES & DRAW CIRCULAR ACCRETION STREAM WITH TRAILS
      // -------------------------------------------------------------
      // Batch particles by color palette for high performance
      type DrawItem = {
        x: number;
        y: number;
        r: number;
        alpha: number;
        z: number;
        hasTrail: boolean;
        prevX: number;
        prevY: number;
        prevX2: number;
        prevY2: number;
        moveDist: number;
      };

      const buckets: Record<string, DrawItem[]> = {
        core: [],
        gold: [],
        amber: [],
        copper: [],
        crimson: [],
        stardust: [],
      };

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // -----------------------------------------------------------
        // A. ORBITING BRAND LOGO PARTICLES (Negative space contour rim + orbiting corona)
        // -----------------------------------------------------------
        if (dot.logoIndex !== undefined && dot.logoIndex >= 0 && dot.logoIndex < currentSideLogos.length) {
          const logo = currentSideLogos[dot.logoIndex];
          const logoScale = logo.scale || 1;

          // Breathing pulse animation with phase offset per logo
          const logoBreathWave = Math.sin(breathingPhase + dot.logoIndex * 0.85);
          const logoBreathScale = 1 + logoBreathWave * 0.08;
          const logoBreathAlpha = 0.94 + logoBreathWave * 0.06;

          let targetRelX = 0;
          let targetRelY = 0;

          if (dot.isContour) {
            targetRelX = (dot.relTargetX || 0) * logoScale * logoBreathScale;
            targetRelY = (dot.relTargetY || 0) * logoScale * logoBreathScale;
          } else {
            dot.orbitAngle += dot.orbitSpeed * speedFactor;
            targetRelX = Math.cos(dot.orbitAngle) * (dot.orbitRadius * logoScale) * logoBreathScale;
            targetRelY = Math.sin(dot.orbitAngle) * (dot.orbitRadius * 0.96 * logoScale) * logoBreathScale;
          }

          const targetWorldX = logo.x + targetRelX;
          const targetWorldY = logo.y + targetRelY;

          // Inward swirl transition during scatter-and-form
          const spiralAngle = dot.scatterAngle + (1 - formationProgress) * 2.8;
          const spiralDist = dot.scatterDist * (1 - formationProgress);
          const swirlX = cx + Math.cos(spiralAngle) * spiralDist;
          const swirlY = cy + Math.sin(spiralAngle) * spiralDist;

          let finalX = swirlX * (1 - formationProgress) + targetWorldX * formationProgress;
          let finalY = swirlY * (1 - formationProgress) + targetWorldY * formationProgress;

          // Magnetic mouse attraction around orbiting logo particles
          if (mouseActive) {
            const dx = mx - finalX;
            const dy = my - finalY;
            const dist = Math.hypot(dx, dy);
            const magneticRadius = 160;
            if (dist < magneticRadius && dist > 2) {
              const norm = 1 - dist / magneticRadius;
              // Smooth magnetic curve attracting toward cursor
              const magneticPull = Math.sin(norm * (Math.PI * 0.5)) * 18;
              finalX += (dx / dist) * magneticPull;
              finalY += (dy / dist) * magneticPull;
            }
          }

          // Visual momentum trailing calculation
          if (dot.prevX === undefined) {
            dot.prevX = finalX;
            dot.prevY = finalY;
            dot.prevX2 = finalX;
            dot.prevY2 = finalY;
          }
          const moveDist = Math.hypot(finalX - dot.prevX, finalY - dot.prevY);
          const hasTrail = moveDist > 0.35 && moveDist < 60;
          const prevX = dot.prevX;
          const prevY = dot.prevY;
          const prevX2 = dot.prevX2 ?? prevX;
          const prevY2 = dot.prevY2 ?? prevY;

          dot.prevX2 = dot.prevX;
          dot.prevY2 = dot.prevY;
          dot.prevX = finalX;
          dot.prevY = finalY;

          dot.twinklePhase += dot.twinkleSpeed;
          const twinkle = 0.82 + Math.sin(dot.twinklePhase) * 0.18;
          const dotRadius = Math.max(dot.baseRadius * logoScale * logoBreathScale, 0.52);
          const alpha = dot.baseAlpha * twinkle * logoBreathAlpha * (0.35 + formationProgress * 0.65);

          buckets[dot.colorType].push({
            x: finalX,
            y: finalY,
            r: dotRadius,
            alpha,
            z: logo.z || 0,
            hasTrail,
            prevX,
            prevY,
            prevX2,
            prevY2,
            moveDist,
          });
          continue;
        }

        // Advance circular orbital angle
        dot.orbitAngle += dot.orbitSpeed * speedFactor;
        dot.wispPhase += dot.wispSpeed * speedFactor;

        // Subtle plasma undulating along spiral arm filaments
        const wispOffset = Math.sin(dot.wispPhase) * dot.wispAmp;
        const currentTargetRadius = Math.max(dot.orbitRadius + wispOffset, eventHorizonRadius * 0.95);

        // Circular 3D disk coordinates
        const diskX = Math.cos(dot.orbitAngle) * currentTargetRadius;
        const diskY = Math.sin(dot.orbitAngle) * currentTargetRadius;
        const diskZ = dot.orbitZ;

        // Inward spiral interpolation during transition
        // Instead of a straight line, particles swirl inward like cosmic matter pulled into a vortex
        const spiralInwardTurns = (1 - formationProgress) * 3.5;
        const interpolatedRadius = (1 - formationProgress) * dot.scatterDist + formationProgress * currentTargetRadius;
        const interpolatedAngle = dot.scatterAngle + spiralInwardTurns * (dot.layer === 'ring' ? 1.4 : 0.9) + formationProgress * dot.orbitAngle;

        // Blended 3D position
        const posX = Math.cos(interpolatedAngle) * interpolatedRadius;
        const posY = Math.sin(interpolatedAngle) * interpolatedRadius;
        const posZ = (1 - formationProgress) * dot.scatterZ + formationProgress * diskZ;

        // 3D Perspective Rotation
        // Yaw
        const rx1 = posX * cosY + posZ * sinY;
        const rz1 = -posX * sinY + posZ * cosY;
        // Pitch (inclination)
        const ry1 = posY * cosX - rz1 * sinX;
        const rz2 = posY * sinX + rz1 * cosX;

        // Perspective Projection
        const scale = Math.max(fov / (fov + rz2), 0.3);
        const screenX = cx + rx1 * scale;
        const screenY = cy + ry1 * scale;

        // Magnetic mouse interaction: subtly attract toward cursor position
        let finalX = screenX;
        let finalY = screenY;

        if (mouseActive) {
          const dx = mx - screenX;
          const dy = my - screenY;
          const dist = Math.hypot(dx, dy);
          const magneticRadius = isMobile ? 160 : 240;
          if (dist < magneticRadius && dist > 2) {
            const norm = 1 - dist / magneticRadius;
            // Cosine curve gives smooth, responsive magnetic pull without jarring jumps
            const magneticPull = Math.sin(norm * (Math.PI * 0.5)) * 28;
            
            // Subtle cosmic swirl along the magnetic field line
            const tangentX = -dy / dist;
            const tangentY = dx / dist;
            const swirlForce = norm * 3.8;

            finalX += (dx / dist) * magneticPull + tangentX * swirlForce;
            finalY += (dy / dist) * magneticPull + tangentY * swirlForce;
          }
        }

        // Subtle 'breathing' pulse animation: dots gently expand and contract over time
        // Propagation delay based on distance creates a natural respiratory ripple
        const distFromCenterRatio = dot.orbitRadius / Math.max(eventHorizonRadius, 1);
        const breathWave = Math.sin(breathingPhase - distFromCenterRatio * 0.28);
        const breathScale = 1 + breathWave * 0.14; // ±14% gentle radius oscillation
        const breathAlpha = 0.94 + breathWave * 0.06; // subtle luminance breath

        // Visual momentum trailing calculation
        if (dot.prevX === undefined) {
          dot.prevX = finalX;
          dot.prevY = finalY;
          dot.prevX2 = finalX;
          dot.prevY2 = finalY;
        }
        const dx = finalX - dot.prevX;
        const dy = finalY - dot.prevY;
        const moveDist = Math.hypot(dx, dy);
        const hasTrail = moveDist > 0.35 && moveDist < 60;
        const prevX = dot.prevX;
        const prevY = dot.prevY;
        const prevX2 = dot.prevX2 ?? prevX;
        const prevY2 = dot.prevY2 ?? prevY;

        dot.prevX2 = dot.prevX;
        dot.prevY2 = dot.prevY;
        dot.prevX = finalX;
        dot.prevY = finalY;

        // Particle size & alpha scaling with 3D depth, twinkle, breathing, and formation
        dot.twinklePhase += dot.twinkleSpeed;
        const twinkle = 0.82 + Math.sin(dot.twinklePhase) * 0.18;
        const depthNorm = Math.max(0, Math.min((rz2 + 200) / 400, 1));
        const dotRadius = Math.max(dot.baseRadius * scale * (0.8 + depthNorm * 0.4) * breathScale, 0.52);
        const alpha = dot.baseAlpha * twinkle * breathAlpha * (0.4 + depthNorm * 0.6) * (0.45 + formationProgress * 0.55);

        buckets[dot.colorType].push({
          x: finalX,
          y: finalY,
          r: dotRadius,
          alpha,
          z: rz2,
          hasTrail,
          prevX,
          prevY,
          prevX2,
          prevY2,
          moveDist,
        });
      }

      // -------------------------------------------------------------
      // 3. RENDER BATCHED PARTICLES & VISUAL MOMENTUM TRAILS WITH SCROLL TINT
      // -------------------------------------------------------------
      // Render order: crimson -> copper -> amber -> stardust -> gold -> core (back-to-front brilliance)
      const renderOrder: (keyof PaletteStop)[] = [
        'crimson',
        'copper',
        'amber',
        'stardust',
        'gold',
        'core',
      ];

      for (const colorKey of renderOrder) {
        const items = buckets[colorKey];
        if (!items || items.length === 0) continue;

        const rgbString = activePalette[colorKey];

        // 1. Primary visual momentum trailing path (subtle, short-lived path in direction of movement)
        ctx.beginPath();
        let hasTrails = false;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.hasTrail) {
            ctx.moveTo(item.prevX, item.prevY);
            ctx.lineTo(item.x, item.y);
            hasTrails = true;
          }
        }
        if (hasTrails) {
          ctx.strokeStyle = `rgba(${rgbString}, 0.38)`;
          ctx.lineWidth = 1.15;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // 2. Secondary decaying trail segment for particles with high visual momentum (accelerating or fast orbit)
        ctx.beginPath();
        let hasSecondaryTrails = false;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.hasTrail && item.moveDist > 1.1) {
            ctx.moveTo(item.prevX2, item.prevY2);
            ctx.lineTo(item.prevX, item.prevY);
            hasSecondaryTrails = true;
          }
        }
        if (hasSecondaryTrails) {
          ctx.strokeStyle = `rgba(${rgbString}, 0.16)`;
          ctx.lineWidth = 0.75;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // 3. Draw crisp pinpoint batch with clean vector arcs and dynamic scroll-tinted color
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgbString}, ${item.alpha})`;
          ctx.fill();
        }
      }

      // -------------------------------------------------------------
      // 4. DRAW CURSOR MICRO-SPARKS (CRISP EMBERS)
      // -------------------------------------------------------------
      if (cursorSparks.length > 0) {
        for (let k = cursorSparks.length - 1; k >= 0; k--) {
          const spark = cursorSparks[k];
          spark.x += spark.vx;
          spark.y += spark.vy;
          spark.vx *= 0.93;
          spark.vy *= 0.93;
          spark.life -= 1;

          const progress = spark.life / spark.maxLife;
          spark.alpha = Math.max(progress * 0.85, 0);

          if (spark.life <= 0 || spark.alpha <= 0.02) {
            cursorSparks.splice(k, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(spark.x, spark.y, spark.radius * progress, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${spark.rgb}, ${spark.alpha})`;
          ctx.fill();
        }
      }

      // -------------------------------------------------------------
      // 5. DRAW SCROLL BURST / STREAM PARTICLES & MOMENTUM TRAILS
      // -------------------------------------------------------------
      if (scrollParticles.length > 0) {
        ctx.save();
        for (let k = scrollParticles.length - 1; k >= 0; k--) {
          const sp = scrollParticles[k];
          sp.prevX = sp.x;
          sp.prevY = sp.y;

          sp.x += sp.vx * speedFactor;
          sp.y += sp.vy * speedFactor;
          sp.vx *= 0.95;
          sp.vy *= 0.95;
          sp.life -= 1;

          const prog = sp.life / sp.maxLife;
          sp.alpha = prog * 0.88;

          if (sp.life <= 0 || sp.alpha <= 0.02) {
            scrollParticles.splice(k, 1);
            continue;
          }

          // Glowing momentum trail line following scroll direction
          ctx.beginPath();
          ctx.moveTo(sp.prevX, sp.prevY);
          ctx.lineTo(sp.x, sp.y);
          ctx.strokeStyle = `rgba(${sp.rgb}, ${sp.alpha * 0.72})`;
          ctx.lineWidth = Math.max(sp.radius * 0.95 * prog, 0.75);
          ctx.lineCap = 'round';
          ctx.stroke();

          // Glowing particle head
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.radius * (0.6 + prog * 0.4), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${sp.rgb}, ${sp.alpha})`;
          ctx.fill();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isEnabled, isSlowMode]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-0 h-full w-full opacity-100 transition-opacity duration-700 ${className}`}
      />
      {/* Interactive Vortex Control Dock */}
      {!hideControlDock && (
        <div className="fixed bottom-3 right-3 z-30 flex items-center gap-2">
          {/* Re-scatter & Form button */}
          <button
            type="button"
            onClick={triggerScatterAnimation}
            className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-light tracking-wider uppercase bg-neutral-900/85 hover:bg-neutral-800 text-[#ff8a18] hover:text-[#ffc043] border border-[#ff8a18]/40 hover:border-[#ff8a18]/80 rounded-full backdrop-blur shadow-lg transition-colors group cursor-pointer"
            title="Re-scatter dots and watch them form into circular vortex"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff8a18] animate-ping" />
            <span>SCATTER & FORM</span>
          </button>

          {/* Speed Toggle */}
          <button
            type="button"
            onClick={() => setIsSlowMode(!isSlowMode)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-light tracking-wider uppercase bg-neutral-900/85 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 rounded-full backdrop-blur shadow-lg transition-colors cursor-pointer"
            title="Toggle vortex orbit speed"
          >
            <span>{isSlowMode ? 'SPEED: SLOW' : 'SPEED: DYNAMIC'}</span>
          </button>

          {/* FX Live Toggle */}
          <button
            type="button"
            onClick={() => setIsEnabled(!isEnabled)}
            className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-light tracking-wider uppercase bg-neutral-900/85 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800/80 rounded-full backdrop-blur shadow-lg transition-colors group cursor-pointer"
            title="Toggle cosmic accretion vortex FX"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isEnabled ? 'bg-amber-400 animate-pulse' : 'bg-neutral-500'
              }`}
            />
            <span>VORTEX: {isEnabled ? 'LIVE' : 'PAUSED'}</span>
          </button>
        </div>
      )}
    </>
  );
};
