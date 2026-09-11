import { VideoItem, FeaturedGateway, SkillCategory, EducationItem } from '../types';

export const PERSONAL_INFO = {
  name: 'Shahbaz Ahmed',
  shortName: 'Shahbaz',
  handle: 'shahbazflan',
  title: 'Senior Motion Graphics Designer & Visual Director',
  experience: '15+ Years UAE Market Experience',
  email: 'shahbazflan@gmail.com',
  linkedin: 'https://www.linkedin.com/in/shabaz-ghias-21907b37',
  canvaPortfolio: 'https://shahbazflan.my.canva.site/shahbaz',
  bioShort: 'Specializing in broadcast commercials, kinetic motion graphics, high-retention video advertising, and next-generation generative AI workflows.',
  bioFull:
    'I offer an extensive agency background specializing in branding-centric graphic design and custom digital solutions. My portfolio highlights my ability to seamlessly integrate static layouts with high-end motion graphics, all anchored by a strict attention to typography, color, and minute visual details. Additionally, I develop bespoke client applications designed to centralize brand DNA—storing color palettes, fonts, and visual identities—and automate regular monthly social media content publishing.',
  profileStatement:
    'An experienced designer and editor with 15+ years of success in the UAE market. I bridge the gap between Graphic Design and Dynamic Motion, utilizing a modern toolkit that includes advanced Video Editing and AI-assisted workflows. I focus on creating seamless visual experiences, whether through 2D animations, product mockups, or cinematic cuts, ensuring every project is technically sound and visually compelling.',
  heroTagline: 'Ideas Given Form. Stories Set in Motion.',
  heroDescription:
    'High-end motion design is more than fluid easing—it is visual momentum. Bringing decade-honed advertising intuition, disciplined composition, and breakthrough synthetic workflows to transform complex ideas into magnetic screen experiences.',
  punchline: 'Designing Motion. Engineering the Future.',
};

/**
 * ------------------------------------------------------------------
 * FOUR CORE GATEWAY IMAGES
 * ------------------------------------------------------------------
 * 1. AI Concept Lab: /images/01.jpg
 * 2. Master Showreel: /images/02.jpg
 * 3. UGC & Mobile Ads: /images/03.jpg
 * 4. Profile & Expertise: /images/04.jpg
 */
export const GATEWAY_IMAGES = {
  aiConceptLab: '/images/01.jpg',
  masterShowreel: '/images/02.jpg',
  ugcMobileAds: '/images/03.jpg',
  profileExpertise: '/images/04.jpg',
};

export const FEATURED_GATEWAYS: FeaturedGateway[] = [
  {
    id: 'ai-ideation',
    title: 'AI Concept Lab',
    subtitle: 'Synthetic Cinematography & Product Commercials',
    description: 'Breakthrough synthetic workflows, fluid morphing, high-speed beverage splashes, and generative kinetic visual stories.',
    imageUrl: GATEWAY_IMAGES.aiConceptLab,
    tag: '14 Concepts',
  },
  {
    id: 'showreel',
    title: 'Master Showreel',
    subtitle: 'Broadcast, Motion & Commercial Direction',
    description: 'A curated compilation showcasing broadcast commercials, kinetic typography, and high-impact visual design.',
    imageUrl: GATEWAY_IMAGES.masterShowreel,
    tag: 'Featured Video',
  },
  {
    id: 'ucg-ads',
    title: 'UGC & Mobile Ads',
    subtitle: 'High-Retention 9:16 Social Campaigns',
    description: 'Direct-response vertical video creatives, influencer campaigns, and beauty routines engineered for social algorithms.',
    imageUrl: GATEWAY_IMAGES.ugcMobileAds,
    tag: '4 Vertical Reels',
  },
  {
    id: 'about',
    title: 'Profile & Expertise',
    subtitle: '15+ Years UAE Agency Experience',
    description: 'Discover the philosophy, extensive Adobe mastery, generative AI toolkits, and academic background.',
    imageUrl: GATEWAY_IMAGES.profileExpertise,
    tag: 'Bio & Skills',
  },
];

export const SHOWREEL_VIDEO: VideoItem = {
  id: '1ia8jflogs',
  title: 'Final Show Reel',
  category: 'Master Reel',
  role: 'Senior Visual Director & Lead Animator',
  context: '15+ Years UAE Agency & Commercial Compilation',
  recognitions: 'Broadcast TVC Master • 4K 60FPS Direction',
  year: '2025',
  description:
    'Comprehensive showcase demonstrating high-end broadcast commercials, kinetic typography, motion graphics, and visual momentum direction.',
  thumbnail:
    'https://embed-ssl.wistia.com/deliveries/cb5801d66205456150465c0c697d4ea8.jpg?image_crop_resized=960x540',
  aspect: '16:9',
  tools: ['After Effects', 'Premiere Pro', 'AI Workflows', 'Photoshop', 'Illustrator', 'DaVinci Resolve'],
};

export const AI_IDEATION_VIDEOS: VideoItem[] = [
  {
    id: 'x0j3uy4xlx',
    title: 'Tamper — Crushing Coffee Grounds',
    category: 'Product Macro',
    role: 'Creative Director & AI Technologist',
    context: 'Coffee Brand Concept Lab',
    recognitions: 'High-Density Tactile Simulation',
    year: '2025',
    description: 'Ultra-close kinetic particle dynamics capturing tactile coffee bean crushing and texture density.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/5bb125bafae1d9ad502bf319b69b95bcb3dcc160.jpg?image_crop_resized=960x540',
    aspect: '16:9',
    tools: ['Veo 3', 'Kling AI', 'After Effects'],
  },
  {
    id: 'kf08rlvohy',
    title: 'Liquid Silk',
    category: 'Fluid Simulation',
    role: 'Motion Designer & Look-Dev Lead',
    context: 'Textile Luxury Concept',
    recognitions: 'Volumetric Ethereal Sheen Study',
    year: '2025',
    description: 'Ethereal fluid cloth mechanics and micro-gloss sheen floating through atmospheric volumetric shadows.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/78e715a3687a02d3eb64baf45dcb8158dc99c7c4.jpg?image_crop_resized=960x540',
    aspect: '16:9',
    tools: ['Runway Gen-3', 'After Effects'],
  },
  {
    id: '6il6ytwqqd',
    title: 'JellyLand — Fluid Morphing Commercial',
    category: 'Commercial TVC',
    role: 'Visual Director & Animator',
    context: 'Confectionery Broadcast Pitch',
    recognitions: 'Tactile Deformation Dynamics',
    year: '2025',
    description: 'Playful gelatinous deformation physics, tactile candy translucency, and seamless shape-shifting transitions.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/ab5d07f8dd6b6736d55ec5d905228e8e.jpg?image_crop_resized=960x540',
    aspect: '16:9',
    tools: ['Midjourney', 'Kling AI', 'Premiere Pro'],
  },
  {
    id: 'gljjm2uaiv',
    title: 'Smile Biscuit TV Commercial',
    category: 'Commercial TVC',
    role: 'Senior Motion Designer',
    context: 'Broadcast Television Commercial',
    recognitions: 'Prime Pacing & Character Gesture',
    year: '2024',
    description: 'Vibrant broadcast commercial pacing combining energetic character gestures and golden-baked product reveals.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/315f8a3c0901fa667a7fd0747b985be0.jpg?image_crop_resized=960x540',
    aspect: '16:9',
    tools: ['After Effects', 'Premiere Pro', 'AI Workflows'],
  },
  {
    id: 'x7v1dz201m',
    title: 'Catfood Chosen',
    category: 'Commercial TVC',
    role: 'Lead Compositor & Art Director',
    context: 'Pet Nutrition Campaign',
    recognitions: 'Photorealistic Atmospheric Lighting',
    year: '2024',
    description: 'Warm cinematic pet nutrition commercial featuring photorealistic lighting and emotive pacing.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/11b2b3f8d1e1d97f1407d37c676c9fe0c7217344.jpg?image_crop_resized=960x550',
    aspect: '16:9',
    tools: ['Veo 3', 'After Effects'],
  },
  {
    id: 'ovsd2f314r',
    title: 'Awesome Juice — High-Speed Splash',
    category: 'Beverage & Splash',
    role: 'CGI Fluid Specialist & Editor',
    context: 'Beverage Commercial Campaign',
    recognitions: 'Hyper-Vivid High-Speed Fluid Study',
    year: '2025',
    description: 'Hyper-vivid citrus burst, high-speed droplet suspension, and luminous beverage illumination.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/8cf2ea45e0d04fa7f288cc039c99f6a0d1a7e5cb.jpg?image_crop_resized=960x540',
    aspect: '16:9',
    tools: ['Kling AI', 'Magnific AI', 'Premiere Pro'],
  },
  {
    id: 'a4z525c29j',
    title: 'Dodge Muscle Car — Night Drift',
    category: 'Automotive Motion',
    role: 'Cinematographer & Motion Lead',
    context: 'Automotive Spec Commercial',
    recognitions: 'Low-Angle Neon Camera Tracking',
    year: '2024',
    description: 'Low-angle cinematic tracking shot capturing tire smoke friction, neon specular highlights, and roar momentum.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/3b46f9e2617b17f24050697915c6c24c.jpg?image_crop_resized=960x540',
    aspect: '16:9',
    tools: ['Runway Gen-3', 'After Effects'],
  },
  {
    id: 'teq93t9dk2',
    title: 'Video Generation — High-Speed Athlete',
    category: 'Synthetic Human Motion',
    role: 'AI Generative Director',
    context: 'Sports Performance Visual Lab',
    recognitions: 'Biomechanical Sprint Simulation',
    year: '2025',
    description: 'Dynamic biomechanical sprint capture with high-contrast stadium floodlight reflections.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/3048da4c328838224aaa963b3bfa4f1b.jpg?image_crop_resized=960x540',
    aspect: '16:9',
    tools: ['Google Flow Omni', 'Veo 3'],
  },
  {
    id: 'gabzknvghb',
    title: 'APEX Energy Drink Campaign',
    category: 'Commercial TVC',
    role: 'Visual Director & Compositor',
    context: 'Energy Drink Product Launch',
    recognitions: 'Kinetic Type & Electrified Reveal',
    year: '2024',
    description: 'High-octane commercial with electrified can reveal, carbonated vortex, and punchy kinetic type locks.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/ce9abfd66eedfd1040b1e47f513ada26.jpg?image_crop_resized=960x540',
    aspect: '16:9',
    tools: ['After Effects', 'Midjourney', 'Premiere Pro'],
  },
  {
    id: 'ne2w60mac3',
    title: 'Puma — Velocity & Streetwear',
    category: 'Brand & Fashion',
    role: 'Motion Director & Editor',
    context: 'Urban Streetwear Campaign',
    recognitions: 'Rhythmic Velocity Curve Editing',
    year: '2024',
    description: 'Aggressive street tempo, dynamic footwear angles, and rhythmic speed-ramped transitions.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/c93b860516e9a7ab0de52729db20a92c1eee6761.jpg?image_crop_resized=960x540',
    aspect: '16:9',
    tools: ['Runway Gen-3', 'After Effects'],
  },
  {
    id: 'njalx996w9',
    title: 'Extreme Cola — Freeze & Fizz (Cut 1)',
    category: 'Beverage & Splash',
    role: 'CGI Fluid Specialist',
    context: 'Soft Drink Broadcast Spec',
    recognitions: 'Macro Condensation Dynamics',
    year: '2024',
    description: 'Explosive ice shattering, condensation droplet beads, and frosty carbonated eruption.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/a54dfb6209a3d68e4ae877291768ca47.jpg?image_crop_resized=960x540',
    aspect: '16:9',
    tools: ['Veo 3', 'After Effects'],
  },
  {
    id: 'szm40e47v2',
    title: 'Extreme Cola — Rhythmic Beat (Cut 2)',
    category: 'Beverage & Splash',
    role: 'Lead Commercial Editor',
    context: 'Social First Cutdown',
    recognitions: 'Audio-Reactive Synced Motion',
    year: '2024',
    description: 'Rapid-tempo edit highlighting audio-reactive kinetic momentum and macro lockups.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/7cf3cf7da1f2911b715147454295ae7d.jpg?image_crop_resized=960x540',
    aspect: '16:9',
    tools: ['Veo 3', 'Premiere Pro'],
  },
  {
    id: 's8778by0wx',
    title: 'Fruit Punch — Tropical Slice & Splash',
    category: 'Product Macro',
    role: 'Look-Dev Artist & Animator',
    context: 'Beverage CGI Simulation',
    recognitions: 'Pristine Fluid Transparency',
    year: '2024',
    description: 'Tropical fruit collision and splash interaction rendered with pristine fluid transparency.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/1e05d467026b35fb54646b895a239fb8c4ddda53.jpg?image_crop_resized=960x540',
    aspect: '16:9',
    tools: ['Midjourney', 'Kling AI', 'After Effects'],
  },
  {
    id: 'qqtnl23kia',
    title: 'Flag Day Celebration',
    category: 'Cultural & Motion',
    role: 'Art Director & Senior Animator',
    context: 'National Broadcast Commemoration',
    recognitions: 'Ceremonial Fabric Aerodynamics',
    year: '2024',
    description: 'Ceremonial fabric aerodynamics and golden hour volumetric atmospheric lighting.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/2aae0fcb1920389e976cd553c3f8103e.jpg?image_crop_resized=960x540',
    aspect: '16:9',
    tools: ['After Effects', 'AI Workflows'],
  },
];

export const UGC_ADS_VIDEOS: VideoItem[] = [
  {
    id: 'jm38n74s0r',
    title: 'Organic Face Care Routine',
    category: 'Skincare Routine',
    client: 'Organic Face Care',
    role: 'Vertical Video Director & Editor',
    context: 'Direct-Response UGC Campaign',
    recognitions: 'Hook-Tested 3s Retention',
    year: '2024',
    description:
      'Hook-driven UGC video featuring natural creator testimonial, product texture close-ups, and skin hydration reveal.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/fd6f0a454a536e8764fc5ea95e62b6d2.jpg?image_crop_resized=720x1280',
    aspect: '9:16',
    tools: ['Premiere Pro', 'Kinetic Typography', 'Color Grading'],
  },
  {
    id: '88lnryyomj',
    title: 'Ellovi Hair Oil Transformation',
    category: 'Haircare & Beauty',
    client: 'Ellovi Hair Oil',
    role: 'Motion Editor & Copywriter',
    context: 'TikTok / Instagram Ads',
    recognitions: 'High ROAS Direct-Response',
    year: '2024',
    description:
      'High-conversion direct-response ad with unboxing excitement, application technique, and radiant shine outcome.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/3e5348b70a344be929886ceb9cf23bac.jpg?image_crop_resized=720x1280',
    aspect: '9:16',
    tools: ['Premiere Pro', 'After Effects', 'Subtitles'],
  },
  {
    id: 'k1b9154764',
    title: 'Beplain Clean Skincare',
    category: 'Clean Beauty',
    client: 'Beplain',
    role: 'Video Editor & Sound Designer',
    context: 'Social Campaign',
    recognitions: 'Sound-Off Optimized Captions',
    year: '2024',
    description:
      'Minimalist, calming aesthetic optimized for TikTok & Meta Reels with crisp sound design and hook pacing.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/37e1bf100e7506a0c1ff4c2417138337.jpg?image_crop_resized=720x1280',
    aspect: '9:16',
    tools: ['Premiere Pro', 'Motion Design'],
  },
  {
    id: '8qvvm7yu08',
    title: 'Vince Beauty Campaign',
    category: 'Influencer Testimonial',
    client: 'Vince Cosmetics',
    role: 'Motion Editor & Art Director',
    context: 'Beauty Brand Campaign',
    recognitions: 'Problem-Solution Social Proof Edit',
    year: '2024',
    description:
      'Dynamic influencer storytelling highlighting problem-solution narrative and social proof testimonials.',
    thumbnail:
      'https://embed-ssl.wistia.com/deliveries/00ddefcf37cfef38f48d88c574846d49.jpg?image_crop_resized=720x1280',
    aspect: '9:16',
    tools: ['Premiere Pro', 'Kinetic Captions'],
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Adobe Creative Cloud Mastery',
    description: 'Industry-standard motion design, compositing, and editing suite.',
    skills: [
      { name: 'After Effects', level: 'Advanced / 15+ Yrs', highlight: true },
      { name: 'Premiere Pro', level: 'Advanced / 15+ Yrs', highlight: true },
      { name: 'Photoshop', level: 'Mastery', highlight: true },
      { name: 'Illustrator', level: 'Mastery', highlight: true },
      { name: 'DaVinci Resolve (Color Grading)', level: 'Skilled' },
    ],
  },
  {
    title: 'Generative AI & Synthetic Workflows',
    description: 'Cutting-edge AI video generation and synthetic cinematography pipelines.',
    skills: [
      { name: 'Runway Gen-3', level: 'High Velocity', highlight: true },
      { name: 'Midjourney v6', level: 'Prompt Mastery', highlight: true },
      { name: 'Google Veo 3', level: 'Cinematic Workflows', highlight: true },
      { name: 'Kling AI', level: 'Motion Generation', highlight: true },
      { name: 'Adobe Firefly', level: 'Vector & Raster' },
      { name: 'Google Flow Omni', level: 'Multi-Modal Generation' },
      { name: 'Magnific AI Suite', level: 'Upscaling & Detailing', highlight: true },
    ],
  },
  {
    title: 'Design & Automation Platforms',
    description: 'Rapid deployment, brand identity centralization, and social automation.',
    skills: [
      { name: 'Canva Pro Enterprise', level: 'Expert' },
      { name: 'Adobe Express', level: 'Expert' },
      { name: 'Brand DNA Centralization', level: 'Systemized' },
      { name: 'Social Content Automation', level: 'Workflows' },
    ],
  },
];

export const EDUCATION_LIST: EducationItem[] = [
  {
    institution: 'Karachi School of Arts',
    degree: '4-Year Professional Degree in Graphic Design',
    location: 'Karachi, Pakistan',
    period: '2010 – 2014',
  },
  {
    institution: 'University of Karachi',
    degree: 'Bachelor of Commerce (B.Com)',
    location: 'Karachi, Pakistan',
  },
];

export const ALL_PORTFOLIO_WORKS: VideoItem[] = [
  SHOWREEL_VIDEO,
  ...AI_IDEATION_VIDEOS,
  ...UGC_ADS_VIDEOS,
];

