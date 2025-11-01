import api from "../api";
import { mapApiSessionToModel } from "./mappers";
import { ApiSessionSchema } from "./schema/session";

// export async function startSession() {
//   try {
//     const res = await api.post("/session/start");
//     const { token, message, expiresIn } = res.data;
//     console.log(message)
//     localStorage.setItem("session_token", token);
//     localStorage.setItem(
//       "session_exp",
//       (Date.now() + expiresIn * 1000).toString()
//     );
//     return token;
//   } catch (err) {
//     console.error("Failed to start session", err);
//     throw err;
//   }
// }

export async function startSession() {
  try {
    const res = await api.post("/session/start");

    const parse = ApiSessionSchema.safeParse(res.data);
    if (!parse.success) {
      console.error("Invalid session API response", parse.error);
      throw new Error("Invalid session API response", parse.error);
    }

    const session = mapApiSessionToModel(parse.data);

    if (session.token) {
      localStorage.setItem("session_token", session.token);
    }

    const expiresAt = session.expiresAt ?? Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem("session_exp", String(expiresAt));

    return session.token ?? null;
  } catch (err) {
    console.error("Failed to start session", err);
    throw err;
  }
}
