// Utilitários de tema para facilitar o gerenciamento de cores

export const themeColors = {
  // Cores primárias da empresa (facilmente alteráveis)
  primary: 'oklch(0.5 0.2 240)', // Azul principal
  secondary: 'oklch(0.4 0.15 250)', // Azul secundário
  accent: 'oklch(0.6 0.18 230)', // Azul accent
  
  // Cores de status
  success: 'oklch(0.6 0.15 140)', // Verde sucesso
  error: 'oklch(0.65 0.2 25)', // Vermelho erro
  warning: 'oklch(0.75 0.15 85)', // Amarelo aviso
};

// Função para alterar as cores primárias da empresa dinamicamente
export const updateThemeColors = (newColors: Partial<typeof themeColors>) => {
  const root = document.documentElement;
  
  if (newColors.primary) {
    root.style.setProperty('--company-primary', newColors.primary);
  }
  
  if (newColors.secondary) {
    root.style.setProperty('--company-secondary', newColors.secondary);
  }
  
  if (newColors.accent) {
    root.style.setProperty('--company-accent', newColors.accent);
  }
  
  if (newColors.success) {
    root.style.setProperty('--status-success', newColors.success);
  }
  
  if (newColors.error) {
    root.style.setProperty('--status-error', newColors.error);
  }
  
  if (newColors.warning) {
    root.style.setProperty('--status-warning', newColors.warning);
  }
};

// Classes CSS para facilitar o uso em componentes
export const themeClasses = {
  // Cores de texto
  text: {
    primary: 'theme-primary',
    secondary: 'theme-secondary', 
    accent: 'theme-accent',
    success: 'text-success',
    error: 'text-destructive',
    warning: 'text-warning',
  },
  
  // Cores de fundo
  background: {
    primary: 'bg-theme-primary',
    secondary: 'bg-theme-secondary',
    accent: 'bg-theme-accent', 
    success: 'bg-success',
    error: 'bg-destructive',
    warning: 'bg-warning',
  },
  
  // Bordas
  border: {
    primary: 'border-primary',
    secondary: 'border-secondary',
    success: 'border-success',
    error: 'border-destructive', 
    warning: 'border-warning',
  },
  
  // Estados hover
  hover: {
    primary: 'hover:bg-primary/90',
    secondary: 'hover:bg-secondary/90',
    success: 'hover:bg-success',
    error: 'hover:bg-destructive/90',
    warning: 'hover:bg-warning',
  },
};

// Paletas pré-definidas para diferentes empresas
export const themePalettes = {
  purple: {
    primary: 'oklch(0.45 0.28 285)', // #8e11c0 - Roxo vibrante
    secondary: 'oklch(0.38 0.22 290)', // Roxo secundário harmonioso
    accent: 'oklch(0.55 0.25 280)', // Roxo accent complementar
  },
  
  blue: {
    primary: 'oklch(0.5 0.2 240)',
    secondary: 'oklch(0.4 0.15 250)',
    accent: 'oklch(0.6 0.18 230)',
  },
  
  green: {
    primary: 'oklch(0.5 0.15 140)',
    secondary: 'oklch(0.4 0.12 150)',
    accent: 'oklch(0.6 0.18 130)',
  },
  
  orange: {
    primary: 'oklch(0.6 0.18 50)',
    secondary: 'oklch(0.5 0.15 60)',
    accent: 'oklch(0.7 0.2 40)',
  },
};

// Função para aplicar uma paleta pré-definida
export const applyThemePalette = (paletteName: keyof typeof themePalettes) => {
  const palette = themePalettes[paletteName];
  updateThemeColors(palette);
}; 