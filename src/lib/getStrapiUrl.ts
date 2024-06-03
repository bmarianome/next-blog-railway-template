import qs from "qs";
import { env } from "~/env";

export default function getStrapiUrl({
  path, query
}: {
  path: `/${string}`;
  query: string | object;
}) {
  return `${env.API_URL}${path}?${qs.stringify(query)}`
}