export function setSession(key: string, value: string) {
  sessionStorage.clear();
  sessionStorage.setItem(key, value);
  return { key, value };
}

export function getSession(key: string) {
  return sessionStorage.getItem(key);
}
