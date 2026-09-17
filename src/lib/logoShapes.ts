// Negative Space Brand Logos Geometry & Particle Path Generator for Side Areas
// Implements Facebook, Instagram, YouTube, and TikTok using the same celestial negative-space approach

export interface SideLogo {
  id: 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'snapchat' | 'linkedin' | 'x' | 'pinterest';
  name: string;
  tag: string;
  tier?: 'inner' | 'outer';
  x: number;
  y: number;
  radius: number;
  orbitAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
  z?: number;
  scale?: number;
  hovered?: boolean;
}

export interface LogoContourPoint {
  x: number;
  y: number;
  colorType: 'core' | 'gold' | 'amber' | 'stardust';
  baseRadius: number;
  alpha: number;
}

// Utility: draw rounded rectangle safely across all canvas implementations
export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// Compute responsive orbiting positions and geometry for brand logos
// Features a two-tier celestial distribution: inner tier near the circle + outer tier far in space
export function getOrbitingLogos(
  width: number,
  _height: number,
  eventHorizonRadius: number
): SideLogo[] {
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  // Inner tier (near the circle / accretion disk)
  const innerLogoRadius = isMobile ? 16 : isTablet ? 20 : 25;
  const innerOrbitRadius = isMobile ? eventHorizonRadius * 1.95 : eventHorizonRadius * 2.15;
  const innerOrbitSpeed = 0.0022; // Hypnotic primary revolution

  // Outer tier (far in space, smaller, distributed along wide perimeter)
  const outerLogoRadius = isMobile ? 10.5 : isTablet ? 13 : 16;
  const outerOrbitRadius = isMobile ? eventHorizonRadius * 2.85 : eventHorizonRadius * 3.35;
  const outerOrbitSpeed = 0.0013; // Slower Keplerian outer orbit

  return [
    // --- INNER TIER (4 primary motion platforms near the circle: 45°, 135°, 225°, 315°) ---
    {
      id: 'facebook',
      name: 'Facebook',
      tag: 'Meta Ads',
      tier: 'inner',
      x: 0,
      y: 0,
      radius: innerLogoRadius,
      orbitAngle: -Math.PI * 0.25, // 315° (top-right)
      orbitRadius: innerOrbitRadius,
      orbitSpeed: innerOrbitSpeed,
    },
    {
      id: 'youtube',
      name: 'YouTube',
      tag: 'Video TVC',
      tier: 'inner',
      x: 0,
      y: 0,
      radius: innerLogoRadius,
      orbitAngle: Math.PI * 0.25, // 45° (bottom-right)
      orbitRadius: innerOrbitRadius,
      orbitSpeed: innerOrbitSpeed,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      tag: 'Reels & Stories',
      tier: 'inner',
      x: 0,
      y: 0,
      radius: innerLogoRadius,
      orbitAngle: Math.PI * 0.75, // 135° (bottom-left)
      orbitRadius: innerOrbitRadius,
      orbitSpeed: innerOrbitSpeed,
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      tag: 'Commercials',
      tier: 'inner',
      x: 0,
      y: 0,
      radius: innerLogoRadius,
      orbitAngle: Math.PI * 1.25, // 225° (top-left)
      orbitRadius: innerOrbitRadius,
      orbitSpeed: innerOrbitSpeed,
    },

    // --- OUTER TIER (Far in space, smaller, interleaved at cardinal angles 0°, 90°, 180°, 270°) ---
    {
      id: 'snapchat',
      name: 'Snapchat',
      tag: 'UGC Motion',
      tier: 'outer',
      x: 0,
      y: 0,
      radius: outerLogoRadius,
      orbitAngle: 0, // 0° (East - right)
      orbitRadius: outerOrbitRadius,
      orbitSpeed: outerOrbitSpeed,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      tag: 'B2B Video',
      tier: 'outer',
      x: 0,
      y: 0,
      radius: outerLogoRadius,
      orbitAngle: Math.PI * 0.5, // 90° (South - bottom)
      orbitRadius: outerOrbitRadius,
      orbitSpeed: outerOrbitSpeed,
    },
    {
      id: 'x',
      name: 'X',
      tag: 'Platform Feed',
      tier: 'outer',
      x: 0,
      y: 0,
      radius: outerLogoRadius,
      orbitAngle: Math.PI, // 180° (West - left)
      orbitRadius: outerOrbitRadius,
      orbitSpeed: outerOrbitSpeed,
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      tag: 'Vertical Motion',
      tier: 'outer',
      x: 0,
      y: 0,
      radius: outerLogoRadius,
      orbitAngle: Math.PI * 1.5, // 270° (North - top)
      orbitRadius: outerOrbitRadius,
      orbitSpeed: outerOrbitSpeed,
    },
  ];
}

// Backwards-compatibility wrapper
export function getSideLogos(width: number, height: number, eventHorizonRadius = 120): SideLogo[] {
  return getOrbitingLogos(width, height, eventHorizonRadius);
}

// Update 3D orbital position of a logo revolving around the circle center
export function updateLogoOrbitPosition(
  logo: SideLogo,
  cx: number,
  cy: number,
  cosX: number,
  sinX: number,
  cosY: number,
  sinY: number,
  fov: number,
  speedFactor: number
) {
  logo.orbitAngle += logo.orbitSpeed * speedFactor;

  // 3D coordinates on the accretion orbital plane
  const lX = Math.cos(logo.orbitAngle) * logo.orbitRadius;
  const lY = Math.sin(logo.orbitAngle) * (logo.orbitRadius * 0.94); // slight elliptical perspective
  const lZ = Math.sin(logo.orbitAngle * 2) * 14; // gentle orbital vertical undulation

  // Rotate with the 3D inclination of the central disk
  const rx1 = lX * cosY + lZ * sinY;
  const rz1 = -lX * sinY + lZ * cosY;
  const ry1 = lY * cosX - rz1 * sinX;
  const rz2 = lY * sinX + rz1 * cosX;

  const scale = Math.max(fov / (fov + rz2), 0.55);
  logo.x = cx + rx1 * scale;
  logo.y = cy + ry1 * scale;
  logo.z = rz2;
  logo.scale = scale;
}

// Helper to interpolate points along a 2D line segment
function sampleLine(
  p1: [number, number],
  p2: [number, number],
  count: number,
  colorType: 'core' | 'gold' | 'amber' | 'stardust' = 'amber'
): LogoContourPoint[] {
  const points: LogoContourPoint[] = [];
  for (let i = 0; i <= count; i++) {
    const t = count === 0 ? 0.5 : i / count;
    points.push({
      x: p1[0] + (p2[0] - p1[0]) * t,
      y: p1[1] + (p2[1] - p1[1]) * t,
      colorType,
      baseRadius: Math.random() * 0.45 + 0.75,
      alpha: Math.random() * 0.25 + 0.75,
    });
  }
  return points;
}

// -------------------------------------------------------------
// 1. FACEBOOK: Circular Badge with iconic 'f' negative-space cutout
// -------------------------------------------------------------
export function getFacebookContourPoints(r: number): LogoContourPoint[] {
  const points: LogoContourPoint[] = [];

  // Outer circular rim (dense photon rim)
  const outerCount = 36;
  for (let i = 0; i < outerCount; i++) {
    const angle = (i / outerCount) * Math.PI * 2;
    points.push({
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      colorType: Math.random() < 0.35 ? 'core' : Math.random() < 0.7 ? 'gold' : 'amber',
      baseRadius: Math.random() * 0.45 + 0.75,
      alpha: Math.random() * 0.25 + 0.75,
    });
  }

  // Inner 'f' perimeter contour lines
  // Stem & crossbar coordinates relative to center
  const pStemBL: [number, number] = [-0.05 * r, 0.62 * r];
  const pStemTL: [number, number] = [-0.05 * r, 0.04 * r];
  const pCrossArmL_B: [number, number] = [-0.28 * r, 0.04 * r];
  const pCrossArmL_T: [number, number] = [-0.28 * r, -0.14 * r];
  const pStemML: [number, number] = [-0.05 * r, -0.14 * r];
  const pStemUL: [number, number] = [-0.05 * r, -0.36 * r];

  // Top Hook
  const pHookApex: [number, number] = [0.14 * r, -0.62 * r];
  const pHookEnd: [number, number] = [0.36 * r, -0.58 * r];
  const pHookInnerEnd: [number, number] = [0.36 * r, -0.40 * r];
  const pHookInnerApex: [number, number] = [0.20 * r, -0.42 * r];
  const pStemMR: [number, number] = [0.16 * r, -0.14 * r];

  // Crossbar Right
  const pCrossArmR_T: [number, number] = [0.34 * r, -0.14 * r];
  const pCrossArmR_B: [number, number] = [0.31 * r, 0.04 * r];
  const pStemTR: [number, number] = [0.16 * r, 0.04 * r];
  const pStemBR: [number, number] = [0.16 * r, 0.62 * r];

  // Sample 'f' outline segments
  points.push(...sampleLine(pStemBL, pStemTL, 4, 'gold'));
  points.push(...sampleLine(pStemTL, pCrossArmL_B, 3, 'amber'));
  points.push(...sampleLine(pCrossArmL_B, pCrossArmL_T, 2, 'core'));
  points.push(...sampleLine(pCrossArmL_T, pStemML, 3, 'gold'));
  points.push(...sampleLine(pStemML, pStemUL, 3, 'amber'));
  points.push(...sampleLine(pStemUL, pHookApex, 4, 'core'));
  points.push(...sampleLine(pHookApex, pHookEnd, 3, 'gold'));
  points.push(...sampleLine(pHookEnd, pHookInnerEnd, 2, 'amber'));
  points.push(...sampleLine(pHookInnerEnd, pHookInnerApex, 2, 'core'));
  points.push(...sampleLine(pHookInnerApex, pStemMR, 3, 'gold'));
  points.push(...sampleLine(pStemMR, pCrossArmR_T, 3, 'amber'));
  points.push(...sampleLine(pCrossArmR_T, pCrossArmR_B, 2, 'core'));
  points.push(...sampleLine(pCrossArmR_B, pStemTR, 2, 'gold'));
  points.push(...sampleLine(pStemTR, pStemBR, 4, 'amber'));
  points.push(...sampleLine(pStemBR, pStemBL, 2, 'core'));

  return points;
}

// -------------------------------------------------------------
// 2. INSTAGRAM: Squircle Body + Center Lens + Flash Dot
// -------------------------------------------------------------
export function getInstagramContourPoints(r: number): LogoContourPoint[] {
  const points: LogoContourPoint[] = [];

  // Outer squircle boundary
  const w = 1.34 * r;
  const h = 1.34 * r;
  const cr = 0.32 * r;
  const halfW = w / 2;
  const halfH = h / 2;

  // 4 corners of squircle with circular arcs
  const cornerCenters = [
    { cx: halfW - cr, cy: halfH - cr, start: 0, end: Math.PI / 2 },
    { cx: -halfW + cr, cy: halfH - cr, start: Math.PI / 2, end: Math.PI },
    { cx: -halfW + cr, cy: -halfH + cr, start: Math.PI, end: (Math.PI * 3) / 2 },
    { cx: halfW - cr, cy: -halfH + cr, start: (Math.PI * 3) / 2, end: Math.PI * 2 },
  ];

  cornerCenters.forEach((corner) => {
    const steps = 6;
    for (let i = 0; i < steps; i++) {
      const a = corner.start + (corner.end - corner.start) * (i / steps);
      points.push({
        x: corner.cx + Math.cos(a) * cr,
        y: corner.cy + Math.sin(a) * cr,
        colorType: Math.random() < 0.4 ? 'gold' : 'amber',
        baseRadius: Math.random() * 0.45 + 0.75,
        alpha: Math.random() * 0.25 + 0.75,
      });
    }
  });

  // Flat edges between corners
  points.push(...sampleLine([-halfW + cr, -halfH], [halfW - cr, -halfH], 5, 'amber'));
  points.push(...sampleLine([halfW, -halfH + cr], [halfW, halfH - cr], 5, 'gold'));
  points.push(...sampleLine([halfW - cr, halfH], [-halfW + cr, halfH], 5, 'amber'));
  points.push(...sampleLine([-halfW, halfH - cr], [-halfW, -halfH + cr], 5, 'gold'));

  // Center Camera Lens (circle at 0, 0)
  const lensR = 0.34 * r;
  const lensCount = 24;
  for (let i = 0; i < lensCount; i++) {
    const angle = (i / lensCount) * Math.PI * 2;
    points.push({
      x: Math.cos(angle) * lensR,
      y: Math.sin(angle) * lensR,
      colorType: Math.random() < 0.5 ? 'core' : 'gold',
      baseRadius: Math.random() * 0.45 + 0.8,
      alpha: Math.random() * 0.2 + 0.8,
    });
  }

  // Flash Dot at upper right
  const flashCX = 0.38 * r;
  const flashCY = -0.38 * r;
  const flashR = 0.08 * r;
  const flashCount = 8;
  for (let i = 0; i < flashCount; i++) {
    const angle = (i / flashCount) * Math.PI * 2;
    points.push({
      x: flashCX + Math.cos(angle) * flashR,
      y: flashCY + Math.sin(angle) * flashR,
      colorType: 'core',
      baseRadius: Math.random() * 0.4 + 0.85,
      alpha: 0.95,
    });
  }

  return points;
}

// -------------------------------------------------------------
// 3. YOUTUBE: Rounded Screen Rectangle + Play Button Triangle
// -------------------------------------------------------------
export function getYouTubeContourPoints(r: number): LogoContourPoint[] {
  const points: LogoContourPoint[] = [];

  // Outer rounded screen
  const w = 1.48 * r;
  const h = 1.05 * r;
  const cr = 0.28 * r;
  const halfW = w / 2;
  const halfH = h / 2;

  const cornerCenters = [
    { cx: halfW - cr, cy: halfH - cr, start: 0, end: Math.PI / 2 },
    { cx: -halfW + cr, cy: halfH - cr, start: Math.PI / 2, end: Math.PI },
    { cx: -halfW + cr, cy: -halfH + cr, start: Math.PI, end: (Math.PI * 3) / 2 },
    { cx: halfW - cr, cy: -halfH + cr, start: (Math.PI * 3) / 2, end: Math.PI * 2 },
  ];

  cornerCenters.forEach((corner) => {
    const steps = 6;
    for (let i = 0; i < steps; i++) {
      const a = corner.start + (corner.end - corner.start) * (i / steps);
      points.push({
        x: corner.cx + Math.cos(a) * cr,
        y: corner.cy + Math.sin(a) * cr,
        colorType: Math.random() < 0.4 ? 'gold' : 'amber',
        baseRadius: Math.random() * 0.45 + 0.75,
        alpha: Math.random() * 0.25 + 0.75,
      });
    }
  });

  // Edges of screen
  points.push(...sampleLine([-halfW + cr, -halfH], [halfW - cr, -halfH], 5, 'amber'));
  points.push(...sampleLine([halfW, -halfH + cr], [halfW, halfH - cr], 4, 'gold'));
  points.push(...sampleLine([halfW - cr, halfH], [-halfW + cr, halfH], 5, 'amber'));
  points.push(...sampleLine([-halfW, halfH - cr], [-halfW, -halfH + cr], 4, 'gold'));

  // Center Play Triangle (Points to the right ▶)
  const vTop: [number, number] = [-0.16 * r, -0.25 * r];
  const vBottom: [number, number] = [-0.16 * r, 0.25 * r];
  const vApex: [number, number] = [0.26 * r, 0];

  points.push(...sampleLine(vTop, vBottom, 7, 'gold'));
  points.push(...sampleLine(vBottom, vApex, 7, 'core'));
  points.push(...sampleLine(vApex, vTop, 7, 'core'));

  return points;
}

// -------------------------------------------------------------
// 4. TIKTOK: The iconic musical note 'd' glyph with wave hook
// -------------------------------------------------------------
export function getTikTokContourPoints(r: number): LogoContourPoint[] {
  const points: LogoContourPoint[] = [];

  // Outer circular container rim
  const rimCount = 36;
  for (let i = 0; i < rimCount; i++) {
    const angle = (i / rimCount) * Math.PI * 2;
    points.push({
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      colorType: Math.random() < 0.35 ? 'core' : Math.random() < 0.7 ? 'gold' : 'amber',
      baseRadius: Math.random() * 0.45 + 0.75,
      alpha: Math.random() * 0.25 + 0.75,
    });
  }

  // 1. Bottom-Left Circular Note Head
  const headCX = -0.14 * r;
  const headCY = 0.24 * r;
  const headR = 0.22 * r;
  const headCount = 20;
  for (let i = 0; i < headCount; i++) {
    const angle = (i / headCount) * Math.PI * 2;
    points.push({
      x: headCX + Math.cos(angle) * headR,
      y: headCY + Math.sin(angle) * headR,
      colorType: Math.random() < 0.5 ? 'core' : 'gold',
      baseRadius: Math.random() * 0.45 + 0.8,
      alpha: Math.random() * 0.2 + 0.8,
    });
  }

  // 2. Vertical Stem
  const stemLeftB: [number, number] = [0.04 * r, 0.24 * r];
  const stemLeftT: [number, number] = [0.04 * r, -0.38 * r];
  const stemRightT: [number, number] = [0.18 * r, -0.38 * r];
  const stemRightB: [number, number] = [0.18 * r, 0.24 * r];

  points.push(...sampleLine(stemLeftB, stemLeftT, 6, 'amber'));
  points.push(...sampleLine(stemLeftT, stemRightT, 2, 'core'));
  points.push(...sampleLine(stemRightT, stemRightB, 6, 'gold'));

  // 3. Upper Wave / Hook (curves out to upper right)
  const hookStart: [number, number] = [0.18 * r, -0.38 * r];
  const hookApex1: [number, number] = [0.38 * r, -0.52 * r];
  const hookTip: [number, number] = [0.40 * r, -0.34 * r];
  const hookInner: [number, number] = [0.28 * r, -0.22 * r];
  const hookEnd: [number, number] = [0.18 * r, -0.18 * r];

  points.push(...sampleLine(hookStart, hookApex1, 5, 'core'));
  points.push(...sampleLine(hookApex1, hookTip, 3, 'gold'));
  points.push(...sampleLine(hookTip, hookInner, 4, 'amber'));
  points.push(...sampleLine(hookInner, hookEnd, 3, 'core'));

  return points;
}

// -------------------------------------------------------------
// 5. SNAPCHAT: Iconic Ghost Silhouette inside Celestial Rim
// -------------------------------------------------------------
export function getSnapchatContourPoints(r: number): LogoContourPoint[] {
  const points: LogoContourPoint[] = [];

  // Outer container rim
  const rimCount = 26;
  for (let i = 0; i < rimCount; i++) {
    const a = (i / rimCount) * Math.PI * 2;
    points.push({
      x: Math.cos(a) * r,
      y: Math.sin(a) * r,
      colorType: Math.random() < 0.35 ? 'core' : Math.random() < 0.7 ? 'gold' : 'amber',
      baseRadius: Math.random() * 0.4 + 0.7,
      alpha: Math.random() * 0.25 + 0.75,
    });
  }

  // Ghost head (semicircle)
  const headR = 0.20 * r;
  const headSteps = 10;
  for (let i = 0; i <= headSteps; i++) {
    const a = Math.PI + (i / headSteps) * Math.PI;
    points.push({
      x: Math.cos(a) * headR,
      y: -0.16 * r + Math.sin(a) * headR,
      colorType: 'core',
      baseRadius: Math.random() * 0.4 + 0.75,
      alpha: 0.9,
    });
  }

  // Ghost arms and torso
  points.push(...sampleLine([-headR, -0.16 * r], [-0.30 * r, -0.02 * r], 4, 'gold'));
  points.push(...sampleLine([-0.30 * r, -0.02 * r], [-0.20 * r, 0.12 * r], 3, 'amber'));
  points.push(...sampleLine([-0.20 * r, 0.12 * r], [-0.24 * r, 0.26 * r], 3, 'core'));

  points.push(...sampleLine([headR, -0.16 * r], [0.30 * r, -0.02 * r], 4, 'gold'));
  points.push(...sampleLine([0.30 * r, -0.02 * r], [0.20 * r, 0.12 * r], 3, 'amber'));
  points.push(...sampleLine([0.20 * r, 0.12 * r], [0.24 * r, 0.26 * r], 3, 'core'));

  // Scalloped bottom hem waves
  points.push(...sampleLine([-0.24 * r, 0.26 * r], [-0.10 * r, 0.28 * r], 3, 'amber'));
  points.push(...sampleLine([-0.10 * r, 0.28 * r], [0, 0.24 * r], 2, 'gold'));
  points.push(...sampleLine([0, 0.24 * r], [0.10 * r, 0.28 * r], 2, 'gold'));
  points.push(...sampleLine([0.10 * r, 0.28 * r], [0.24 * r, 0.26 * r], 3, 'amber'));

  return points;
}

// -------------------------------------------------------------
// 6. LINKEDIN: Squircle Container + 'in' Monogram
// -------------------------------------------------------------
export function getLinkedInContourPoints(r: number): LogoContourPoint[] {
  const points: LogoContourPoint[] = [];

  const w = 1.34 * r;
  const h = 1.34 * r;
  const cr = 0.28 * r;
  const halfW = w / 2;
  const halfH = h / 2;

  const corners = [
    { cx: halfW - cr, cy: halfH - cr, start: 0, end: Math.PI / 2 },
    { cx: -halfW + cr, cy: halfH - cr, start: Math.PI / 2, end: Math.PI },
    { cx: -halfW + cr, cy: -halfH + cr, start: Math.PI, end: (Math.PI * 3) / 2 },
    { cx: halfW - cr, cy: -halfH + cr, start: (Math.PI * 3) / 2, end: Math.PI * 2 },
  ];

  corners.forEach((corner) => {
    for (let i = 0; i < 4; i++) {
      const a = corner.start + (corner.end - corner.start) * (i / 4);
      points.push({
        x: corner.cx + Math.cos(a) * cr,
        y: corner.cy + Math.sin(a) * cr,
        colorType: Math.random() < 0.5 ? 'gold' : 'amber',
        baseRadius: Math.random() * 0.35 + 0.7,
        alpha: 0.85,
      });
    }
  });

  // Container edges
  points.push(...sampleLine([-halfW + cr, -halfH], [halfW - cr, -halfH], 4, 'amber'));
  points.push(...sampleLine([halfW, -halfH + cr], [halfW, halfH - cr], 4, 'gold'));
  points.push(...sampleLine([halfW - cr, halfH], [-halfW + cr, halfH], 4, 'amber'));
  points.push(...sampleLine([-halfW, halfH - cr], [-halfW, -halfH + cr], 4, 'gold'));

  // 'i' dot
  points.push({
    x: -0.22 * r,
    y: -0.25 * r,
    colorType: 'core',
    baseRadius: 1.05,
    alpha: 0.95,
  });

  // 'i' stem
  points.push(...sampleLine([-0.22 * r, -0.06 * r], [-0.22 * r, 0.28 * r], 6, 'core'));

  // 'n' left stem
  points.push(...sampleLine([-0.04 * r, -0.06 * r], [-0.04 * r, 0.28 * r], 6, 'gold'));

  // 'n' arch & right stem
  points.push(...sampleLine([-0.04 * r, 0.02 * r], [0.09 * r, -0.08 * r], 3, 'core'));
  points.push(...sampleLine([0.09 * r, -0.08 * r], [0.22 * r, 0.02 * r], 3, 'gold'));
  points.push(...sampleLine([0.22 * r, 0.02 * r], [0.22 * r, 0.28 * r], 6, 'amber'));

  return points;
}

// -------------------------------------------------------------
// 7. X: Minimalist Crossed Geometric Kinetic Monogram
// -------------------------------------------------------------
export function getXContourPoints(r: number): LogoContourPoint[] {
  const points: LogoContourPoint[] = [];

  // Outer circular rim
  const rimCount = 26;
  for (let i = 0; i < rimCount; i++) {
    const a = (i / rimCount) * Math.PI * 2;
    points.push({
      x: Math.cos(a) * r,
      y: Math.sin(a) * r,
      colorType: Math.random() < 0.35 ? 'core' : Math.random() < 0.7 ? 'gold' : 'amber',
      baseRadius: Math.random() * 0.4 + 0.7,
      alpha: 0.85,
    });
  }

  // Diagonal 1 (\): main thick bar
  points.push(...sampleLine([-0.26 * r, -0.28 * r], [0.26 * r, 0.28 * r], 9, 'core'));
  points.push(...sampleLine([-0.22 * r, -0.28 * r], [0.30 * r, 0.28 * r], 8, 'gold'));

  // Diagonal 2 (/): crossing bar
  points.push(...sampleLine([0.26 * r, -0.28 * r], [-0.26 * r, 0.28 * r], 9, 'amber'));

  return points;
}

// -------------------------------------------------------------
// 8. PINTEREST: Circular Badge + Stylized Script 'P' Pin
// -------------------------------------------------------------
export function getPinterestContourPoints(r: number): LogoContourPoint[] {
  const points: LogoContourPoint[] = [];

  // Outer circular rim
  const rimCount = 26;
  for (let i = 0; i < rimCount; i++) {
    const a = (i / rimCount) * Math.PI * 2;
    points.push({
      x: Math.cos(a) * r,
      y: Math.sin(a) * r,
      colorType: Math.random() < 0.35 ? 'core' : Math.random() < 0.7 ? 'gold' : 'amber',
      baseRadius: Math.random() * 0.4 + 0.7,
      alpha: 0.85,
    });
  }

  // Needle stem
  points.push(...sampleLine([-0.05 * r, -0.32 * r], [-0.02 * r, 0.35 * r], 10, 'core'));

  // Upper loop of the P
  const loopSteps = 9;
  for (let i = 0; i <= loopSteps; i++) {
    const a = -Math.PI * 0.5 + (i / loopSteps) * Math.PI;
    points.push({
      x: -0.05 * r + Math.cos(a) * (0.22 * r),
      y: -0.16 * r + Math.sin(a) * (0.16 * r),
      colorType: Math.random() < 0.5 ? 'gold' : 'amber',
      baseRadius: Math.random() * 0.35 + 0.75,
      alpha: 0.9,
    });
  }

  return points;
}

// -------------------------------------------------------------
// RENDER NEGATIVE SPACE VOID ON CANVAS
// Fills the negative space silhouettes with pure dark background
// so background stardust passing behind is cleanly obscured
// -------------------------------------------------------------
export function drawLogoNegativeSpace(
  ctx: CanvasRenderingContext2D,
  logo: SideLogo,
  alpha: number,
  rgbString: string
) {
  if (alpha <= 0.01) return;

  const { x, y, radius: baseR } = logo;
  const scale = logo.scale || 1;
  const r = baseR * scale;
  ctx.save();
  ctx.translate(x, y);

  // Pure dark background tone identical to app body
  const voidColor = `rgba(9, 10, 12, ${0.98 * alpha})`;
  const subtleBorder = `rgba(${rgbString}, ${0.22 * alpha})`;

  if (logo.id === 'facebook') {
    // 1. Dark Circular Disc Void
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.98, 0, Math.PI * 2);
    ctx.fillStyle = voidColor;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = subtleBorder;
    ctx.stroke();

    // 2. Subtle 'f' negative-space groove
    ctx.beginPath();
    ctx.moveTo(-0.05 * r, 0.62 * r);
    ctx.lineTo(-0.05 * r, 0.04 * r);
    ctx.lineTo(-0.28 * r, 0.04 * r);
    ctx.lineTo(-0.28 * r, -0.14 * r);
    ctx.lineTo(-0.05 * r, -0.14 * r);
    ctx.lineTo(-0.05 * r, -0.36 * r);
    ctx.bezierCurveTo(-0.05 * r, -0.62 * r, 0.14 * r, -0.64 * r, 0.36 * r, -0.58 * r);
    ctx.lineTo(0.36 * r, -0.40 * r);
    ctx.bezierCurveTo(0.24 * r, -0.40 * r, 0.16 * r, -0.34 * r, 0.16 * r, -0.22 * r);
    ctx.lineTo(0.16 * r, -0.14 * r);
    ctx.lineTo(0.34 * r, -0.14 * r);
    ctx.lineTo(0.31 * r, 0.04 * r);
    ctx.lineTo(0.16 * r, 0.04 * r);
    ctx.lineTo(0.16 * r, 0.62 * r);
    ctx.closePath();
    ctx.fillStyle = `rgba(9, 10, 12, ${0.92 * alpha})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${rgbString}, ${0.12 * alpha})`;
    ctx.stroke();
  } else if (logo.id === 'instagram') {
    // Squircle camera body void
    const w = 1.34 * r;
    const h = 1.34 * r;
    const cr = 0.32 * r;

    drawRoundRect(ctx, -w / 2, -h / 2, w, h, cr);
    ctx.fillStyle = voidColor;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = subtleBorder;
    ctx.stroke();

    // Center circular lens void
    ctx.beginPath();
    ctx.arc(0, 0, 0.34 * r, 0, Math.PI * 2);
    ctx.fillStyle = voidColor;
    ctx.fill();
    ctx.strokeStyle = `rgba(${rgbString}, ${0.25 * alpha})`;
    ctx.stroke();

    // Flash dot
    ctx.beginPath();
    ctx.arc(0.38 * r, -0.38 * r, 0.08 * r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgbString}, ${0.5 * alpha})`;
    ctx.fill();
  } else if (logo.id === 'youtube') {
    // Rounded TV rectangle void
    const w = 1.48 * r;
    const h = 1.05 * r;
    const cr = 0.28 * r;

    drawRoundRect(ctx, -w / 2, -h / 2, w, h, cr);
    ctx.fillStyle = voidColor;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = subtleBorder;
    ctx.stroke();

    // Play triangle void in center
    ctx.beginPath();
    ctx.moveTo(-0.16 * r, -0.25 * r);
    ctx.lineTo(0.26 * r, 0);
    ctx.lineTo(-0.16 * r, 0.25 * r);
    ctx.closePath();
    ctx.fillStyle = `rgba(9, 10, 12, ${0.94 * alpha})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${rgbString}, ${0.25 * alpha})`;
    ctx.stroke();
  } else if (logo.id === 'tiktok') {
    // Circular badge void
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.98, 0, Math.PI * 2);
    ctx.fillStyle = voidColor;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = subtleBorder;
    ctx.stroke();

    // Note head void
    ctx.beginPath();
    ctx.arc(-0.14 * r, 0.24 * r, 0.22 * r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(9, 10, 12, ${0.9 * alpha})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${rgbString}, ${0.15 * alpha})`;
    ctx.stroke();
  } else if (logo.id === 'snapchat') {
    // 5. Circular disc void + ghost silhouette
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.98, 0, Math.PI * 2);
    ctx.fillStyle = voidColor;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = subtleBorder;
    ctx.stroke();

    // Ghost body void
    ctx.beginPath();
    ctx.arc(0, -0.16 * r, 0.18 * r, Math.PI, 0);
    ctx.bezierCurveTo(0.18 * r, -0.08 * r, 0.30 * r, -0.04 * r, 0.28 * r, 0.04 * r);
    ctx.bezierCurveTo(0.22 * r, 0.08 * r, 0.18 * r, 0.12 * r, 0.22 * r, 0.24 * r);
    ctx.bezierCurveTo(0.12 * r, 0.22 * r, 0.06 * r, 0.28 * r, 0, 0.24 * r);
    ctx.bezierCurveTo(-0.06 * r, 0.28 * r, -0.12 * r, 0.22 * r, -0.22 * r, 0.24 * r);
    ctx.bezierCurveTo(-0.18 * r, 0.12 * r, -0.22 * r, 0.08 * r, -0.28 * r, 0.04 * r);
    ctx.bezierCurveTo(-0.30 * r, -0.04 * r, -0.18 * r, -0.08 * r, -0.18 * r, -0.16 * r);
    ctx.closePath();
    ctx.fillStyle = `rgba(9, 10, 12, ${0.92 * alpha})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${rgbString}, ${0.22 * alpha})`;
    ctx.stroke();
  } else if (logo.id === 'linkedin') {
    // 6. Squircle box void + 'in' monogram
    const w = 1.34 * r;
    const h = 1.34 * r;
    const cr = 0.28 * r;
    drawRoundRect(ctx, -w / 2, -h / 2, w, h, cr);
    ctx.fillStyle = voidColor;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = subtleBorder;
    ctx.stroke();

    // Dot of 'i'
    ctx.beginPath();
    ctx.arc(-0.22 * r, -0.25 * r, 0.055 * r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgbString}, ${0.7 * alpha})`;
    ctx.fill();

    // Stem of 'i'
    ctx.beginPath();
    ctx.rect(-0.26 * r, -0.06 * r, 0.08 * r, 0.34 * r);
    ctx.fillStyle = `rgba(9, 10, 12, ${0.92 * alpha})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${rgbString}, ${0.25 * alpha})`;
    ctx.stroke();

    // 'n' glyph
    ctx.beginPath();
    ctx.moveTo(-0.05 * r, 0.28 * r);
    ctx.lineTo(-0.05 * r, -0.06 * r);
    ctx.lineTo(0.03 * r, -0.06 * r);
    ctx.lineTo(0.03 * r, 0.01 * r);
    ctx.bezierCurveTo(0.09 * r, -0.08 * r, 0.18 * r, -0.08 * r, 0.21 * r, 0.01 * r);
    ctx.bezierCurveTo(0.24 * r, 0.06 * r, 0.24 * r, 0.14 * r, 0.24 * r, 0.28 * r);
    ctx.lineTo(0.16 * r, 0.28 * r);
    ctx.lineTo(0.16 * r, 0.08 * r);
    ctx.bezierCurveTo(0.16 * r, 0.01 * r, 0.12 * r, -0.01 * r, 0.06 * r, 0.03 * r);
    ctx.lineTo(0.06 * r, 0.28 * r);
    ctx.closePath();
    ctx.fillStyle = `rgba(9, 10, 12, ${0.92 * alpha})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${rgbString}, ${0.22 * alpha})`;
    ctx.stroke();
  } else if (logo.id === 'x') {
    // 7. Circular disc void + X geometric monogram
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.98, 0, Math.PI * 2);
    ctx.fillStyle = voidColor;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = subtleBorder;
    ctx.stroke();

    // Geometric X
    ctx.beginPath();
    ctx.moveTo(-0.25 * r, -0.28 * r);
    ctx.lineTo(0.25 * r, 0.28 * r);
    ctx.moveTo(0.25 * r, -0.28 * r);
    ctx.lineTo(-0.25 * r, 0.28 * r);
    ctx.lineWidth = Math.max(1.8 * scale, 1.2);
    ctx.strokeStyle = `rgba(${rgbString}, ${0.5 * alpha})`;
    ctx.stroke();
  } else if (logo.id === 'pinterest') {
    // 8. Circular disc void + P pin monogram
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.98, 0, Math.PI * 2);
    ctx.fillStyle = voidColor;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = subtleBorder;
    ctx.stroke();

    // Needle stem
    ctx.beginPath();
    ctx.moveTo(-0.05 * r, -0.30 * r);
    ctx.lineTo(-0.02 * r, 0.34 * r);
    ctx.lineWidth = Math.max(1.6 * scale, 1.1);
    ctx.strokeStyle = `rgba(${rgbString}, ${0.5 * alpha})`;
    ctx.stroke();

    // P loop
    ctx.beginPath();
    ctx.arc(0.06 * r, -0.15 * r, 0.14 * r, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.fillStyle = `rgba(9, 10, 12, ${0.92 * alpha})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${rgbString}, ${0.35 * alpha})`;
    ctx.stroke();
  }

  // Clean floating text labels underneath each brand logo (enlarged & regular weight for enhanced readability)
  const nameFontSize = Math.max(Math.round(11 * scale), 10);
  ctx.font = `500 ${nameFontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(${rgbString}, ${0.9 * alpha})`;
  ctx.fillText(logo.name.toUpperCase(), 0, r + 15 * scale);

  const tagFontSize = Math.max(Math.round(9.5 * scale), 8.5);
  ctx.font = `400 ${tagFontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = `rgba(180, 190, 205, ${0.75 * alpha})`;
  ctx.fillText(logo.tag, 0, r + 26 * scale);

  ctx.restore();
}
