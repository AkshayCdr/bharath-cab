import argon, { argon2id } from "argon2";

const options = {
    type: argon2id,
    memoryCost: 19 * 1024,
    timeCost: 2,
    parallelism: 1,
    // salt: 16,
};

export async function createHash(password: string) {
    try {
        const hash = await argon.hash(password, options);
        return hash;
    } catch (error) {
        console.error(error);
        throw new Error("Could not hash password");
    }
}

export async function verifyPassword(password: string, hash: string) {
    try {
        const match = await argon.verify(hash, password);
        console.log(match);
        return match;
    } catch (error) {
        console.log(error);
        throw new Error("Internal failure");
    }
}
