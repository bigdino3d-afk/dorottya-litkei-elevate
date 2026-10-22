// Dorottya's own photography used by the workshop pages and the artwork builder.
import stagePole from "@/assets/g3.jpg";
import inverted from "@/assets/hero.jpg";
import goldenPole from "@/assets/g4.jpg";
import studioBw from "@/assets/g2.jpg";
import invertedStudio from "@/assets/g1.jpg";
import grip from "@/assets/grip.jpg";

export const PHOTOS = {
  hero: { src: stagePole, w: 1080, h: 1471, alt: "Dorottya Litkei on stage beside the competition pole" },
  acrobatic: { src: inverted, w: 1079, h: 1617, alt: "Dorottya Litkei performing an inverted acrobatic pole hold in competition" },
  spinning: { src: goldenPole, w: 1160, h: 1600, alt: "Dorottya Litkei in a flowing pose on a golden pole at sunset light" },
  instructor: { src: studioBw, w: 1066, h: 1600, alt: "Black and white studio portrait of Dorottya Litkei" },
  studio: { src: invertedStudio, w: 1065, h: 1600, alt: "Dorottya Litkei holding an inverted position on a studio pole" },
  split: { src: grip, w: 1800, h: 1350, alt: "Dorottya Litkei in a split on the pole in a sunlit studio" },
} as const;

export type PhotoKey = keyof typeof PHOTOS;

export const OG_IMAGE_PATH = "/og/athens-workshops.jpg";
