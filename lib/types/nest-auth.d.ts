import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { UserRole } from "./user-role.enum";

declare module 'next-auth' {
    interface Session {
        user: {
            id: string,
            name: string,
            email: string,
            role: UserRole
        } & DefaultUser;
        refreshToken: string;
        accessToken: string;
        expiresAt: string;
    }

    interface User {
        id: string;
        name: string;
        email: string;
        role: UserRole;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        accessToken: string;
        refreshToken: string;
        expiresAt: string;
    }
}