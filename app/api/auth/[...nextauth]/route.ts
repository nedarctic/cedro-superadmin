import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

function decodeExp(token: string) {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], "base64").toString());
    if (payload.exp) return payload.exp * 1000;
    if (payload.expires_in) return Date.now() + payload.expires_In * 1000;
    throw new Error('No expiration field found in JWT')
}

async function refreshToken(refreshAccessToken: string, oldToken: any) {
    const res = await fetch(`${process.env.NEST_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: refreshAccessToken })
    });

    if (!res.ok) {
        return null;
    }

    const { data, success } = await res.json();

    if (!success) {
        return null;
    }

    const { refreshToken, accessToken } = data;
    const expiresAt = decodeExp(accessToken);

    return {
        ...oldToken,
        refreshToken,
        accessToken,
        expiresAt
    }
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "text" }
            },
            async authorize(credentials) {

                const res = await fetch(`${process.env.NEST_API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: credentials?.email, password: credentials?.password }),
                })

                if (!res.ok) {
                    return null;
                }

                const { data, success } = await res.json();

                if (!success) {
                    return null;
                };

                const { user, accessToken, refreshToken } = data;

                const expiresAt = decodeExp(accessToken);

                if (isNaN(expiresAt)) throw new Error('Invalid expiration on token');

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    accessToken,
                    refreshToken,
                    expiresAt
                }
            }
        })
    ],
    callbacks: {
        async jwt({ user, token }: any) {
            if (user) {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    expiresAt: user.expiresAt
                }
            }

            if (token.expiresAt > Date.now()) return token;

            return await refreshToken(token.refreshToken, token);
        },
        async session({ token, session }) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.role = token.role;
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.expiresAt = token.expiresAt;

            return session;
        }
    },
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt"
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }