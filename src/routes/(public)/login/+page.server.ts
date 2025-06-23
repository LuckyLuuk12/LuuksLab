import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { database } from '$lib/server/db';

// --- PBKDF2 helpers ---
const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_HASH = 'SHA-256';
const PBKDF2_KEYLEN = 32;

async function hashPassword(password: string, salt: Uint8Array): Promise<string> {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt as BufferSource,
            iterations: PBKDF2_ITERATIONS,
            hash: PBKDF2_HASH
        },
        key,
        PBKDF2_KEYLEN * 8
    );
    // Store as: salt:hash (both base64)
    return `${btoa(String.fromCharCode(...salt))}:${btoa(String.fromCharCode(...new Uint8Array(derivedBits)))}`
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
    const [saltB64, hashB64] = stored.split(':');
    if (!saltB64 || !hashB64) return false;
    const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
    const hash = Uint8Array.from(atob(hashB64), c => c.charCodeAt(0));
    const testHash = await hashPassword(password, salt);
    const [, testHashB64] = testHash.split(':');
    return hashB64 === testHashB64;
}

// ---

export const load: PageServerLoad = async (event) => {
    if (event.locals.user) {
        return redirect(302, '/');
    }
    return { user: null };
};

export const actions: Actions = {
    login: async (event) => {
        const formData = await event.request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        if (!validateUsername(username)) {
            return fail(400, { message: 'Invalid username' });
        }
        if (!validatePassword(password)) {
            return fail(400, { message: 'Invalid password' });
        }
				const db = await database(event);
        const results = await db
            .select()
            .from(table.user)
            .where(eq(table.user.username, username));

        const existingUser = results.at(0);
        if (!existingUser) {
            return fail(400, { message: 'Incorrect username or password' });
        }

        // If the user registered with Google, passwordHash will be null/undefined
        if (!existingUser.passwordHash) {
            return fail(400, { message: 'This account uses Google login. Please use "Login with Google".' });
        }

        const validPassword = await verifyPassword(password as string, existingUser.passwordHash);
        if (!validPassword) {
            return fail(400, { message: 'Incorrect username or password' });
        }

        const sessionToken = auth.generateSessionToken();
        const session = await auth.createSession(db, sessionToken, existingUser.id);
        auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

        return redirect(302, '/');
    },
    register: async (event) => {
        const formData = await event.request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        if (!validateUsername(username)) {
            return fail(400, { message: 'Invalid username' });
        }
        if (!validatePassword(password)) {
            return fail(400, { message: 'Invalid password' });
        }

        const userId = generateUserId();
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const passwordHash = await hashPassword(password as string, salt);

        try {
            const db = await database(event);
            await db.insert(table.user).values({ id: userId, username, passwordHash });

            const sessionToken = auth.generateSessionToken();
            const session = await auth.createSession(db, sessionToken, userId);
            auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
        } catch (e) {
            console.error('Error during registration:', e);
            return fail(500, { message: 'An error has occurred' });
        }
        return redirect(302, '/');
    },
};

function generateUserId() {
    // ID with 120 bits of entropy, or about the same as UUID v4.
    const bytes = crypto.getRandomValues(new Uint8Array(15));
    const id = encodeBase32LowerCase(bytes);
    return id;
}

function validateUsername(username: unknown): username is string {
    return (
        typeof username === 'string' &&
        username.length >= 3 &&
        username.length <= 31 &&
        /^[A-Za-z0-9_-]+$/.test(username)
    );
}

function validatePassword(password: unknown): password is string {
    return (
        typeof password === 'string' &&
        password.length >= 6 &&
        password.length <= 255 &&
        /[a-z]/.test(password) &&      // at least one lowercase letter
        /[A-Z]/.test(password) &&      // at least one uppercase letter
        /[0-9]/.test(password) &&      // at least one digit
        /[^A-Za-z0-9]/.test(password)  // at least one symbol
    );
}