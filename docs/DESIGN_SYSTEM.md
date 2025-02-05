# Design System Amethyst

## Charte Graphique

### 1. Couleurs

#### Palette Principale
```css
--primary: #7C3AED;    /* Violet principal */
--primary-light: #8B5CF6;
--primary-dark: #6D28D9;

--secondary: #4F46E5;  /* Indigo */
--secondary-light: #6366F1;
--secondary-dark: #4338CA;

--accent: #EC4899;     /* Rose */
--accent-light: #F472B6;
--accent-dark: #DB2777;
```

#### Palette Neutre
```css
--background: #0F172A;  /* Dark mode */
--background-light: #1E293B;
--foreground: #F8FAFC;

--surface: #1E293B;
--surface-light: #334155;
--surface-dark: #0F172A;

--border: #334155;
--border-light: #475569;
```

#### États
```css
--success: #22C55E;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### 2. Typographie

#### Fonts
```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
--font-display: 'Cal Sans', sans-serif;
```

#### Tailles
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### 3. Espacement

```css
--spacing-px: 1px;
--spacing-0.5: 0.125rem;  /* 2px */
--spacing-1: 0.25rem;     /* 4px */
--spacing-2: 0.5rem;      /* 8px */
--spacing-3: 0.75rem;     /* 12px */
--spacing-4: 1rem;        /* 16px */
--spacing-6: 1.5rem;      /* 24px */
--spacing-8: 2rem;        /* 32px */
--spacing-12: 3rem;       /* 48px */
--spacing-16: 4rem;       /* 64px */
```

### 4. Bordures & Ombres

```css
--radius-sm: 0.25rem;    /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;

--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

## Composants UI

### 1. Boutons

#### Variantes
```tsx
// Primary
<Button variant="primary">
  Générer
</Button>

// Secondary
<Button variant="secondary">
  Paramètres
</Button>

// Ghost
<Button variant="ghost">
  Annuler
</Button>

// Destructive
<Button variant="destructive">
  Supprimer
</Button>
```

#### États
- Normal
- Hover
- Focus
- Active
- Disabled
- Loading

### 2. Inputs

#### Text Input
```tsx
<Input
  className="w-full px-4 py-2 rounded-md"
  placeholder="Votre texte ici..."
/>
```

#### Textarea
```tsx
<Textarea
  className="min-h-[100px] resize-none"
  placeholder="Décrivez l'image..."
/>
```

### 3. Cards

```tsx
<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Contenu
  </CardContent>
  <CardFooter>
    Actions
  </CardFooter>
</Card>
```

### 4. Modals

```tsx
<Dialog>
  <DialogTrigger>Ouvrir</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Titre</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    Contenu
  </DialogContent>
</Dialog>
```

## Layouts

### 1. Grille Principale
```tsx
<div className="grid grid-cols-12 gap-4">
  <div className="col-span-3">Sidebar</div>
  <div className="col-span-9">Content</div>
</div>
```

### 2. Container
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  Contenu
</div>
```

### 3. Responsive Design

#### Breakpoints
```css
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
--screen-2xl: 1536px;
```

## Animations

### 1. Transitions
```css
--transition-all: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
--transition-transform: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
--transition-opacity: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
```

### 2. Keyframes
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(10px); }
  to { transform: translateY(0); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

## Icônes

### 1. Set d'icônes
Utilisation de Lucide Icons pour la cohérence :
```tsx
import { 
  Settings,
  User,
  Image,
  Download,
  Trash,
  Plus,
  Minus,
  ChevronDown
} from 'lucide-react';
```

### 2. Tailles standards
```css
--icon-sm: 1rem;    /* 16px */
--icon-md: 1.25rem; /* 20px */
--icon-lg: 1.5rem;  /* 24px */
--icon-xl: 2rem;    /* 32px */
```

## Accessibilité

### 1. Focus Styles
```css
--focus-ring: 0 0 0 2px var(--background), 0 0 0 4px var(--primary);
```

### 2. Contrastes
- Texte sur fond clair : minimum 4.5:1
- Texte sur fond foncé : minimum 4.5:1
- Grands textes : minimum 3:1

### 3. États interactifs
- Focus visible
- Hover states
- Active states
- Disabled states

## Médias

### 1. Images
```css
.image-container {
  aspect-ratio: 1;
  background: var(--surface-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
```

### 2. Loaders
```tsx
<div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
```

## Documentation des composants

Chaque composant doit inclure :
1. Description
2. Props
3. Exemples d'utilisation
4. Variantes
5. États
6. Accessibilité
7. Notes d'implémentation

## Guides d'utilisation

### 1. Espacement
- Utiliser les variables d'espacement
- Maintenir une hiérarchie visuelle cohérente
- Respecter la grille de 8px

### 2. Typographie
- Limiter les tailles de police
- Maintenir une échelle typographique cohérente
- Utiliser les bonnes familles de polices

### 3. Couleurs
- Respecter la palette définie
- Utiliser les couleurs sémantiques
- Maintenir un contraste suffisant

### 4. Composants
- Réutiliser les composants existants
- Maintenir la cohérence des props
- Documenter les modifications 