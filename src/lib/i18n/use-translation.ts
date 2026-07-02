import { useLanguage } from "./language-context";
import { t as translate } from "./translations";

export function useTranslation() {
  const { lang, dir } = useLanguage();

  const t = (key: string) => translate(lang, key);

  return { t, lang, dir };
}
