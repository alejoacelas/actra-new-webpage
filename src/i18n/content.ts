import type { Lang } from "./translations";

import enCommon from "../content/en/common.json";
import esCommon from "../content/es/common.json";
import enHome from "../content/en/home.json";
import esHome from "../content/es/home.json";
import enProgram from "../content/en/program.json";
import esProgram from "../content/es/program.json";
import enSupport from "../content/en/support.json";
import esSupport from "../content/es/support.json";

const content = {
  en: { common: enCommon, home: enHome, program: enProgram, support: enSupport },
  es: { common: esCommon, home: esHome, program: esProgram, support: esSupport },
} as const;

export function getContent<T extends keyof (typeof content)["en"]>(
  page: T,
  lang: Lang,
): (typeof content)["en"][T] {
  return content[lang][page] as (typeof content)["en"][T];
}
