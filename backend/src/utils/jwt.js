import jwt from "jsonwebtoken";

// Use getter or check immediately.  for debugging purposes
// A fallback is useful for dev, but we should log a warning if it's missing.
const getSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error("FATAL: JWT_SECRET is not defined in environment variables.");
        }
        console.warn("[WARN] JWT_SECRET not found in env, using fallback secret.");
        return "fallback-dev-secret-do-not-use-in-prod";
    }
    return secret;
};

export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, getSecret(), (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded);
        })
    })
}

export const signToken = (payload) => {
    return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}