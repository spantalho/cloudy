export function setSession(key: string, value: string) {
  // if (!token || !exp || now > Number(exp)) return;
  sessionStorage.clear();
  sessionStorage.setItem(key, value);
  return { key, value };
}

export function getSession(key: string) {
  // if (!token || !exp ||a now > Number(exp)) return;
  return sessionStorage.getItem(key);
}
