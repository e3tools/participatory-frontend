import { User } from "./state/state.types"

export interface LoginResponse {
  loggedIn: boolean
  user?: User,
  error?: string
}