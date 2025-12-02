import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo: credentials.email, password: credentials.password })
        });
        if (!res.ok) return null;
        const data = await res.json();
        const u = data.usuario;
        return { id: String(u.id_usuario), name: u.nombre, email: u.correo, token: data.token } as any;
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.accessToken = (user as any).token;
      return token as any;
    },
    async session({ session, token }) {
      (session as any).accessToken = (token as any).accessToken;
      return session as any;
    }
  }
};

export default NextAuth(authOptions);
