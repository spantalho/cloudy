// import api from "@/api";
// let sessionPromise: Promise<void> | null = null

// export async function ensureSession(): Promise<string | null> {
//   const token = localStorage.getItem("session_token");
//   const exp = localStorage.getItem("session_exp");
//   const now = Date.now();

//   if (token && exp) {
//     const expNum = Number(exp);
//     if (!Number.isNaN(expNum) && now < expNum) {
//       return token;
//     }
//   }

//   if (sessionPromise) {
//     return await sessionPromise;
//   }

//   sessionPromise = (async () => {
//     try {
//       const newToken = await startSession();
//       return newToken;
//     } finally {
//       sessionPromise = null;
//     }
//   })();

//   return await sessionPromise;
// }

// export async function ensureSession(): Promise<void> {
//   if (sessionPromise) {
//     return await sessionPromise;
//   }

//   sessionPromise = (async () => {
//     try {
//       await api.post("/session");
//     } finally {
//       sessionPromise = null;
//     }
//   })();

//   return await sessionPromise;
// }

// export async function checkSession(): Promise<boolean> {
//   try {
//     await api.get("/health");
//     return true;
//   } catch (err: any) {
//     if (err.response?.status === 401) {
//       return false;
//     }
//     throw err;
//   }
// }
