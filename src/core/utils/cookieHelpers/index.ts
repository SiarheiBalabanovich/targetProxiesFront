export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(
  name: string,
  value: string,
  days = 7,
  domain = "targetedproxies-dev.com",
) {
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000,
  ).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; domain=${domain}`;
}

export function deleteCookie(name: string, domain = "targetedproxies-dev.com") {
  document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
}
