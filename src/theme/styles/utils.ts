// ----------------------------------------------------------------------

export const stylesMode = {
  light: '[data-mui-color-scheme="light"] &',
  dark: '[data-mui-color-scheme="dark"] &',
};

export const mediaQueries = {
  upXs: '@media (min-width:0px)',
  upSm: '@media (min-width:600px)',
  upMd: '@media (min-width:900px)',
  upLg: '@media (min-width:1200px)',
  upXl: '@media (min-width:1536px)',
};

/**
 * Color with alpha channel
 */
export function varAlpha(color: string, opacity = 1) {
  const unsupported =
    color.startsWith('#') ||
    color.startsWith('rgb') ||
    color.startsWith('rgba') ||
    (!color.includes('var') && color.includes('Channel'));

  if (unsupported) {
    throw new Error(`[Alpha]: Unsupported color format "${color}".
     Supported formats are:
     - RGB channels: "0 184 217".
     - CSS variables with "Channel" prefix: "var(--palette-common-blackChannel, #000000)".
     Unsupported formats are:
     - Hex: "#00B8D9".
     - RGB: "rgb(0, 184, 217)".
     - RGBA: "rgba(0, 184, 217, 1)".
     `);
  }

  return `rgba(${color} / ${opacity})`;
}
