import { ApiSearchSchema } from "./schema/search";
import { mapApiSearchToModel } from "./mappers";
import type { AppConfig } from "@/interfaces/config";
import { apiWrapper } from "./api-wrapper";

export async function fetchSearch(
  query: string,
  appConfig: AppConfig,
  lang?: string
) {
  if (!query.trim()) return [];

  const res = await apiWrapper.get(
    `${appConfig.URLS.internal.api_base}/search`,
    {
      params: {
        query,
        lang: lang || "en",
      },
    }
  );

  const parse = ApiSearchSchema.safeParse(res);
  if (!parse.success) {
    console.error("Invalid search API response", parse.error);
    throw new Error("Invalid search API response");
  }

  return mapApiSearchToModel(parse.data);
}

export async function fetchSearchByIp(appConfig?: AppConfig) {
  const API_BASE = appConfig ? appConfig.URLS.internal.api_base : "/api";
  const res = await apiWrapper.get(`${API_BASE}/search/ip`);
  return res;
}
