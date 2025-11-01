import api from "../api";
import { ApiSearchSchema } from "./schema/search";
import { mapApiSearchToModel } from "./mappers";
import type { AppConfig } from "@/interfaces/config";

export async function fetchSearch(
  query: string,
  appConfig: AppConfig,
  lang?: string
) {
  if (!query.trim()) return [];

  const res = await api.get(`${appConfig.URLS.internal.api_base}/search`, {
    params: {
      query,
      lang: lang || "en",
    },
  });

  const parse = ApiSearchSchema.safeParse(res.data);
  if (!parse.success) {
    console.error("Invalid search API response", parse.error);
    throw new Error("Invalid search API response");
  }

  return mapApiSearchToModel(parse.data);
}

export async function fetchSearchByIp() {
  const res = await api.get(`/api/search/ip`);
  return res.data;
}
