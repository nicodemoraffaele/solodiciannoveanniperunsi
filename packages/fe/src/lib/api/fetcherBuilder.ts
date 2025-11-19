import { Fetcher } from '@efebia-com/fetcher';
// import { OpenApi } from '@efebia-com/fetcher/openapi';
// import { paths } from "./generated/schema";

const baseUrl = new URL('BE_URL');

// TYPED ENDPOINTS
// export const fetcher = new Fetcher<OpenApi<paths>>({ baseUrl });

export const fetcher = new Fetcher({ baseUrl });
