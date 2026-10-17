// The access token lives only in memory: never in localStorage, sessionStorage or a cookie.
// A page reload clears it, and the session is restored from the HttpOnly refresh cookie.
let accessToken: string | null = null;

export const tokenStore = {
  get: (): string | null => accessToken,
  set: (token: string | null): void => {
    accessToken = token;
  },
};
