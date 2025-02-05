import { useState } from 'react';

export type HelpSection = 'usage' | 'tips' | 'advanced' | 'credits' | 'contact';

interface UseHelpContentReturn {
  activeSection: HelpSection;
  setActiveSection: (section: HelpSection) => void;
  isValidSection: (section: string) => boolean;
  getDefaultSection: () => HelpSection;
}

export const useHelpContent = (): UseHelpContentReturn => {
  const [activeSection, setActiveSection] = useState<HelpSection>('usage');

  const isValidSection = (section: string): section is HelpSection => {
    const validSections: HelpSection[] = ['usage', 'tips', 'advanced', 'credits', 'contact'];
    return validSections.includes(section as HelpSection);
  };

  const getDefaultSection = (): HelpSection => 'usage';

  return {
    activeSection,
    setActiveSection,
    isValidSection,
    getDefaultSection,
  };
};