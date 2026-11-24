import { api } from "../../api";

/** POST a registration. Throws ApiError (with a user-facing message) on failure. */
export function submitRegistration(payload) {
  return api("register.php", { method: "POST", body: payload });
}
