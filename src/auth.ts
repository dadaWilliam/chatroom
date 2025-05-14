import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { ConvexAdapter } from "./convexAdapter"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  adapter: ConvexAdapter,
})