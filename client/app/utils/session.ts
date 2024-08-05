import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  accountId: string;
  accountType: string;
};

type SessionFlashCard = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashCard>({
    cookie: {
      name: "__session",
      maxAge: 6000,
      path: "/",
      sameSite: "lax",
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
