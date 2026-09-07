import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Placeholder for future SAML/OIDC providers (Azure AD, Okta, etc.)
// import AzureADProvider from "next-auth/providers/azure-ad";
// import OktaProvider from "next-auth/providers/okta";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@parilink.com" },
        password: { label: "Password", type: "password" },
        mfaToken: { label: "MFA Token", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

          // Send ONLY what LoginDto declares (email, password, optional
          // mfaToken). NextAuth passes the entire posted form body into
          // authorize(), which for the credentials callback includes its own
          // csrfToken and callbackUrl fields. Forwarding `credentials`
          // wholesale sent those to the API, whose ValidationPipe runs with
          // forbidNonWhitelisted: true, so every login returned:
          //   400 {"message":["property csrfToken should not exist",
          //                   "property callbackUrl should not exist"]}
          // and authorize() returned null -- login:302 back to the sign-in
          // page with no session cookie. Destructure; never spread credentials.
          const payload: Record<string, string> = {
            email: credentials.email,
            password: credentials.password,
          };
          if (credentials.mfaToken) payload.mfaToken = credentials.mfaToken;

          const res = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" }
          });

          const data = await res.json();

          if (!res.ok) {
            console.error(
              `[auth] ${baseUrl}/auth/login -> ${res.status}`,
              JSON.stringify(data?.message ?? data),
            );
          }

          if (res.ok && data.user) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              tenantId: data.user.tenantId,
              accessToken: data.access_token,
              onboardingCompleted: data.user.onboardingCompleted,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    }),
    /*
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),
    OktaProvider({
      clientId: process.env.OKTA_CLIENT_ID!,
      clientSecret: process.env.OKTA_CLIENT_SECRET!,
      issuer: process.env.OKTA_ISSUER!,
    }),
    */
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.tenantId = (user as any).tenantId;
        token.accessToken = (user as any).accessToken;
        token.onboardingCompleted = (user as any).onboardingCompleted;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).tenantId = token.tenantId;
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).onboardingCompleted = token.onboardingCompleted;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || "default_development_secret_do_not_use_in_prod",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
