import isUrlHttp from "is-url-http"

export function validateUrlLink(url: string): boolean {
    return isUrlHttp(url)
}