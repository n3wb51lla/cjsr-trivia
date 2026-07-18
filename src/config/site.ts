import instanceConfig from './instance.config.json';

export interface SiteConfig {
  readonly headerText: string;
  readonly lobbyHeadline: string;
  readonly joinHeadline: string;
  readonly joinDescription: string;
  readonly territoryText: string | null;
  readonly teamIdStorageKey: string;
  readonly maxPlayersPerTeam: number;
}

export interface ThemeColor {
  readonly dark: string;
  readonly light: string;
}

export interface InstanceColors {
  readonly brandRed: ThemeColor;
  readonly brandRedLight: ThemeColor;
  readonly brandBlack: ThemeColor;
  readonly brandSurface: ThemeColor;
  readonly brandInk: ThemeColor;
  readonly brandCorrect: ThemeColor;
  readonly brandYellow: ThemeColor;
  readonly brandCyan: ThemeColor;
  readonly brandPaper: ThemeColor;
}

export interface InstanceConfig extends SiteConfig {
  readonly siteTitle: string;
  readonly themeStorageKey: string;
  readonly colors: InstanceColors;
}

export const COLOR_TOKENS = [
  'brandRed', 'brandRedLight', 'brandBlack', 'brandSurface',
  'brandInk', 'brandCorrect', 'brandYellow', 'brandCyan', 'brandPaper',
] as const;

const config: InstanceConfig = parseInstanceConfig(instanceConfig);

export const siteConfig: SiteConfig = config;
export const instanceBranding: InstanceConfig = config;

function parseInstanceConfig(value: unknown): InstanceConfig {
  if (!isRecord(value)) throw new Error('instance.config.json must contain an object.');

  const requiredStrings = ['siteTitle', 'headerText', 'lobbyHeadline', 'joinHeadline', 'joinDescription', 'teamIdStorageKey', 'themeStorageKey'] as const;
  for (const key of requiredStrings) {
    if (typeof value[key] !== 'string' || value[key] === '') {
      throw new Error(`instance.config.json: "${key}" must be a non-empty string.`);
    }
  }

  if (value.territoryText !== null && typeof value.territoryText !== 'string') {
    throw new Error('instance.config.json: "territoryText" must be a string or null.');
  }

  if (typeof value.maxPlayersPerTeam !== 'number' || !Number.isInteger(value.maxPlayersPerTeam) || value.maxPlayersPerTeam < 1) {
    throw new Error('instance.config.json: "maxPlayersPerTeam" must be a positive integer.');
  }

  const colors = parseColors(value.colors);

  return {
    siteTitle: value.siteTitle as string,
    headerText: value.headerText as string,
    lobbyHeadline: value.lobbyHeadline as string,
    joinHeadline: value.joinHeadline as string,
    joinDescription: value.joinDescription as string,
    territoryText: value.territoryText as string | null,
    teamIdStorageKey: value.teamIdStorageKey as string,
    themeStorageKey: value.themeStorageKey as string,
    maxPlayersPerTeam: value.maxPlayersPerTeam as number,
    colors,
  };
}

function parseColors(value: unknown): InstanceColors {
  if (!isRecord(value)) throw new Error('instance.config.json: "colors" must be an object.');
  const parsed: Record<string, ThemeColor> = {};
  for (const token of COLOR_TOKENS) {
    const entry = value[token];
    if (!isRecord(entry) || !isHexColor(entry.dark) || !isHexColor(entry.light)) {
      throw new Error(`instance.config.json: colors.${token} must be { dark: "#rrggbb", light: "#rrggbb" }.`);
    }
    parsed[token] = { dark: entry.dark, light: entry.light };
  }
  return parsed as unknown as InstanceColors;
}

function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
