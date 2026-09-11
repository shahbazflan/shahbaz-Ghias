export type PageTab = 'home' | 'works' | 'ai-ideation' | 'showreel' | 'ucg-ads' | 'about';

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  client?: string;
  role?: string;
  context?: string;
  recognitions?: string;
  year?: string;
  description: string;
  thumbnail: string;
  aspect: '16:9' | '9:16';
  tools?: string[];
}

export interface FeaturedGateway {
  id: PageTab;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  tag: string;
}

export interface SkillCategory {
  title: string;
  description?: string;
  skills: { name: string; level?: string; highlight?: boolean }[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  location: string;
  period?: string;
}
