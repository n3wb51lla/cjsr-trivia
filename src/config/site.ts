export interface SiteConfig {
  readonly headerText: string;
  readonly lobbyHeadline: string;
  readonly joinHeadline: string;
  readonly joinDescription: string;
  readonly territoryText: string | null;
  readonly teamIdStorageKey: string;
}

export const siteConfig: SiteConfig = {
  headerText: 'CJSR Trivia',
  lobbyHeadline: 'Volunteer Appreciation Trivia',
  joinHeadline: 'Join CJSR Volunteer Appreciation Trivia',
  joinDescription:
    "Thirty questions, one hour, no pee breaks. Stakes climb as we go, so pace yourself. Each team has 15 seconds to answer AND LOCK IN their answers. Don't forget to lock in your answers or they won't count and your huge brains will feel bad about it. We're dialed in on Canadian music from the deep past through to present day. As radio aficionados, you all SHOULD ace this. Don't let me down. Most points at the end take it all. The prizes are CJSR swag and glory, sweet sweet glory.",
  territoryText:
    'CJSR is located in amiskwaciy-waskahikan, the city of Edmonton, on Treaty 6 territory and region 4 of the Metis Nation of Alberta.',
  teamIdStorageKey: 'cjsr-trivia.teamId',
};
