export type QueryParams = Record<string, string | string[]>;

/**
 * Read a single query param.
 * - If called from server API handlers with `req.query` values (string | string[]),
 *   it keeps previous behaviour and returns the first value.
 * - If called in the browser with a key name (e.g. `getQueryParam('startDate')`),
 *   it will attempt to read the key from `window.location.search` and return its value.
 */
export function getQueryParam(param: string): string | null{
    if (!param) return null;

    // If running in the browser and the param looks like a key, read it from the URL
    if (typeof window !== 'undefined') {
        const sp = new URLSearchParams(window.location.search);
        if (sp.has(param)) return sp.get(param) ?? null;
    }

    // Fallback: return the value passed in (keeps backward compatibility)
    return null;
}

/**
 * Read all query parameters from the current URL (browser) or from an optional
 * query string. Returns an object where values are either string or string[].
 */
export function getAllQueryParams(search?: string): QueryParams {
    if (typeof window === 'undefined' && !search) return {};

    const query = search ?? (typeof window !== 'undefined' ? window.location.search : '');
    const sp = new URLSearchParams(query);
    const result: QueryParams = {};

    // Use a Set to avoid processing duplicate keys multiple times
    for (const key of new Set(Array.from(sp.keys()))) {
        const values = sp.getAll(key);
        result[key] = values.length > 1 ? values : values[0] ?? '';
    }

    return result;
}

/**
 * Replace the full set of query params in the browser URL.
 * - `params` may contain string, number, boolean, or string[] values.
 * - By default this uses history.replaceState to avoid adding history entries;
 *   pass { replace: false } to push a new entry instead.
 * - To ensure Next.js detects the change (so components update), pass a Router
 *   instance via `options.router` and this will call `router.replace`/`router.push`.
 */
export function setAllQueryParams(
    params: Record<string, string | number | boolean | string[] | null | undefined>,
    options?: { replace?: boolean; router?: import('next/router').NextRouter }
): void {
    if (typeof window === 'undefined') return;

    // normalize to string or string[]
    const queryObj: Record<string, string | string[]> = {};
    for (const [key, raw] of Object.entries(params)) {
        if (raw == null) continue;
        if (Array.isArray(raw)) queryObj[key] = raw.map(v => String(v));
        else queryObj[key] = String(raw);
    }

    // If a Next.js router is provided, use it so Next can detect query changes
    if (options?.router) {
        const { router } = options;
        const method = (options?.replace ?? true) ? 'replace' : 'push';
        // router.replace({ pathname: window.location.pathname, query: queryObj }, undefined, { shallow: true });
        // Use the router method dynamically
        (router as any)[method]({ pathname: window.location.pathname, query: queryObj }, undefined, { shallow: true });
        return;
    }

    // Fallback: update history directly
    const sp = new URLSearchParams();

    for (const [key, raw] of Object.entries(queryObj)) {
        if (Array.isArray(raw)) {
            for (const v of raw) sp.append(key, v);
        } else {
            sp.set(key, raw);
        }
    }

    const newSearch = sp.toString();
    const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}${window.location.hash || ''}`;

    if (options?.replace ?? true) {
        window.history.replaceState(null, '', newUrl);
    } else {
        window.history.pushState(null, '', newUrl);
    }
}

/**
 * Set or remove a single query param in the URL (browser). Uses existing
 * query params and calls `setAllQueryParams` to update the URL.
 */
export function setQueryParam(
    key: string,
    value: string | number | boolean | string[] | null | undefined,
    options?: { replace?: boolean; router?: import('next/router').NextRouter }
): void {
    if (typeof window === 'undefined') return;

    const params = getAllQueryParams();
    if (value == null) {
        delete params[key];
    } else {
        params[key] = Array.isArray(value) ? value : String(value);
    }

    setAllQueryParams(params as Record<string, string | string[]>, options);
}