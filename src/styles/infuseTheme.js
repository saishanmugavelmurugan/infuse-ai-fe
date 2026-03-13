/**
 * Infuse Brand Theme Configuration
 * ================================
 * 
 * This file documents the Infuse brand color system derived from the logo.
 * The colors range from golden-yellow (#FFB800) to orange (#E55A00).
 * 
 * USAGE IN COMPONENTS:
 * --------------------
 * 
 * 1. CUSTOM COLORS (use infuse-* prefix):
 *    - bg-infuse-500        -> Primary orange
 *    - text-infuse-600      -> Darker orange for text
 *    - border-infuse-200    -> Light orange border
 *    - bg-infuse-gold       -> Golden yellow accent
 *    - bg-infuse-flame      -> Deep orange accent
 * 
 * 2. GRADIENTS (use bg-infuse-* prefix):
 *    - bg-infuse-gradient       -> Primary button gradient (orange to amber)
 *    - bg-infuse-gradient-hover -> Hover state gradient
 *    - bg-infuse-bg             -> Page background gradient
 *    - bg-infuse-card           -> Card background gradient
 *    - bg-infuse-hero           -> Hero section gradient
 * 
 * 3. STANDARD TAILWIND (still works):
 *    - from-orange-500 to-amber-500   -> Standard gradient
 *    - bg-orange-50                   -> Light background
 *    - text-amber-600                 -> Amber text
 * 
 * COLOR PALETTE:
 * --------------
 * 
 * Primary Scale (infuse-50 to infuse-900):
 * - infuse-50:  #FFF7ED (very light, backgrounds)
 * - infuse-100: #FFEDD5 (light backgrounds)
 * - infuse-200: #FED7AA (borders, hover states)
 * - infuse-300: #FDBA74 (highlights)
 * - infuse-400: #FB923C (secondary buttons)
 * - infuse-500: #F97316 (primary buttons, icons) ★ PRIMARY
 * - infuse-600: #EA580C (hover states)
 * - infuse-700: #C2410C (active states)
 * - infuse-800: #9A3412 (dark accents)
 * - infuse-900: #7C2D12 (very dark accents)
 * 
 * Brand Accents:
 * - infuse-gold:   #FFB800 (golden yellow from logo)
 * - infuse-amber:  #F59E0B (amber accent)
 * - infuse-sunset: #FF9A3B (warm orange)
 * - infuse-flame:  #E55A00 (deep orange from logo)
 * 
 * COMMON PATTERNS:
 * ----------------
 * 
 * Primary Button:
 *   className="bg-gradient-to-r from-orange-500 to-amber-500 
 *              hover:from-orange-600 hover:to-amber-600 
 *              text-white shadow-md"
 * 
 * OR using custom class:
 *   className="bg-infuse-gradient hover:bg-infuse-gradient-hover text-white shadow-md"
 * 
 * Secondary/Outline Button:
 *   className="border border-orange-200 text-orange-600 
 *              hover:bg-orange-50"
 * 
 * Page Background:
 *   className="bg-gradient-to-br from-orange-50 via-white to-amber-50"
 * 
 * OR using custom class:
 *   className="bg-infuse-bg"
 * 
 * Card with Brand Styling:
 *   className="bg-white rounded-xl border border-orange-100 shadow-sm"
 * 
 * Active Tab:
 *   className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
 * 
 * Inactive Tab:
 *   className="bg-gray-100 text-gray-600 hover:bg-orange-50"
 * 
 * Input Focus:
 *   className="focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
 * 
 * Icon Colors:
 *   - Primary: text-orange-500
 *   - Secondary: text-amber-500
 *   - Accent: text-infuse-flame
 */

export const infuseTheme = {
  colors: {
    primary: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316', // Primary
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
    },
    accent: {
      gold: '#FFB800',
      amber: '#F59E0B',
      sunset: '#FF9A3B',
      flame: '#E55A00',
    }
  },
  gradients: {
    primary: 'linear-gradient(to right, #F97316, #F59E0B)',
    primaryHover: 'linear-gradient(to right, #EA580C, #D97706)',
    background: 'linear-gradient(to bottom right, #FFF7ED, #FFFFFF, #FFFBEB)',
    card: 'linear-gradient(to bottom right, #FFF7ED, #FEF3C7)',
    hero: 'linear-gradient(to right, #F97316, #FBBF24)',
  },
  // Tailwind class shortcuts
  classes: {
    button: {
      primary: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md transition',
      secondary: 'border border-orange-200 text-orange-600 hover:bg-orange-50 transition',
      outline: 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50 transition',
    },
    background: {
      page: 'bg-gradient-to-br from-orange-50 via-white to-amber-50',
      card: 'bg-gradient-to-br from-orange-50 to-amber-50',
      hero: 'bg-gradient-to-r from-orange-500 to-amber-500',
    },
    tab: {
      active: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md',
      inactive: 'bg-gray-100 text-gray-600 hover:bg-orange-50',
    },
    input: {
      focus: 'focus:ring-2 focus:ring-orange-300 focus:border-orange-300',
      border: 'border-orange-200',
    },
    text: {
      primary: 'text-orange-600',
      secondary: 'text-amber-600',
      accent: 'text-infuse-flame',
    }
  }
};

export default infuseTheme;
