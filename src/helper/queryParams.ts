export function getQueryParam(param?: string | string[]) {
    return Array.isArray(param) ? param[0] : param;
}

export function setQueryParam(param: string): void {
    
}