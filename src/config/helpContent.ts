import { ReactNode } from 'react';

export interface HelpSection {
  title: string;
  content: string | ReactNode;
  subsections?: HelpSection[];
}

export interface HelpContent {
  title: string;
  sections: HelpSection[];
}

export const helpContent: Record<string, HelpContent> = {
  general: {
    title: 'General Help',
    sections: [
      {
        title: 'Getting Started',
        content: 'Welcome to Amethyst! This guide will help you understand the basic features and how to use them effectively.',
        subsections: [
          {
            title: 'Navigation',
            content: 'Use the sidebar menu to navigate between different sections of the application. Click on the menu icon in the top-left corner to collapse or expand the sidebar.'
          },
          {
            title: 'Settings',
            content: 'Access application settings through the gear icon in the top-right corner. Here you can customize your experience and manage preferences.'
          }
        ]
      },
      {
        title: 'Basic Operations',
        content: 'Learn about the fundamental operations you can perform:',
        subsections: [
          {
            title: 'Creating Items',
            content: 'Click the "+" button to create new items. Fill in the required information in the form and click "Save" to confirm.'
          },
          {
            title: 'Editing Items',
            content: 'Select an item and click the edit icon (pencil) to modify its details. Make your changes and save them.'
          },
          {
            title: 'Deleting Items',
            content: 'To delete an item, select it and click the delete icon (trash bin). Confirm the deletion when prompted.'
          }
        ]
      }
    ]
  },
  workspace: {
    title: 'Workspace Guide',
    sections: [
      {
        title: 'Workspace Overview',
        content: 'The workspace is your main working area where you can organize and manage your projects.',
        subsections: [
          {
            title: 'Layout',
            content: 'The workspace consists of a main content area and various panels that can be resized or hidden as needed.'
          },
          {
            title: 'Customization',
            content: 'Customize your workspace layout by dragging and resizing panels. Your layout preferences will be saved automatically.'
          }
        ]
      },
      {
        title: 'Features',
        content: 'Explore the various features available in your workspace:',
        subsections: [
          {
            title: 'Search',
            content: 'Use the search bar to quickly find items. The search supports filtering and advanced queries.'
          },
          {
            title: 'Shortcuts',
            content: 'Learn keyboard shortcuts to work more efficiently. Access the full list of shortcuts in the settings menu.'
          }
        ]
      }
    ]
  },
  settings: {
    title: 'Settings Guide',
    sections: [
      {
        title: 'Preferences',
        content: 'Customize your application settings to match your workflow:',
        subsections: [
          {
            title: 'Theme',
            content: 'Choose between light and dark themes, or set it to follow your system preferences.'
          },
          {
            title: 'Notifications',
            content: 'Configure notification preferences to stay informed about important updates and events.'
          }
        ]
      },
      {
        title: 'Account Settings',
        content: 'Manage your account and security preferences:',
        subsections: [
          {
            title: 'Profile',
            content: 'Update your profile information, including name, email, and profile picture.'
          },
          {
            title: 'Security',
            content: 'Manage security settings, including password changes and two-factor authentication.'
          }
        ]
      }
    ]
  }
};