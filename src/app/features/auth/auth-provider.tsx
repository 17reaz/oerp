import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Platform } from "react-native";

import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();

type AuthContextValue = {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Failed to restore session:", error);
      }

      if (mounted) {
        setSession(data.session);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      throw error;
    }
  }

  async function signInWithGoogle() {
    if (Platform.OS === "web") {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        throw error;
      }

      return;
    }

    /*
     * Native Android callback:
     *
     * oerp://auth/callback
     *
     * app.json already has:
     *
     * "scheme": "oerp"
     */
    const redirectTo = makeRedirectUri({
      scheme: "oerp",
      path: "auth/callback",
    });

    console.log("Google redirect URL:", redirectTo);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      throw error;
    }

    if (!data?.url) {
      throw new Error("Unable to start Google sign-in.");
    }

    console.log("Google OAuth URL:", data.url);

    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectTo,
    );

    console.log("Google auth result:", result);

    if (result.type === "cancel" || result.type === "dismiss") {
      return;
    }

    if (result.type !== "success" || !result.url) {
      throw new Error("Google sign-in was not completed.");
    }

    console.log("Google callback URL:", result.url);

    /*
     * Supabase PKCE returns:
     *
     * oerp://auth/callback?code=xxxxx
     */
    const callbackUrl = new URL(result.url);

    const code = callbackUrl.searchParams.get("code");

    /*
     * OAuth errors can also be returned in the callback.
     */
    const errorParam = callbackUrl.searchParams.get("error");
    const errorDescription =
      callbackUrl.searchParams.get("error_description");

    if (errorParam) {
      throw new Error(
        errorDescription ?? errorParam,
      );
    }

    if (!code) {
      console.error(
        "Google callback did not contain an auth code:",
        result.url,
      );

      throw new Error(
        "Google callback failed: authorization code was not returned.",
      );
    }

    console.log("Google authorization code received.");

    /*
     * Exchange Supabase PKCE authorization code
     * for the actual Supabase session.
     */
    const { data: sessionData, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error(
        "Google session exchange failed:",
        exchangeError,
      );

      throw exchangeError;
    }

    /*
     * onAuthStateChange() normally updates the state,
     * but keeping this here makes the native flow explicit.
     */
    if (sessionData.session) {
      setSession(sessionData.session);
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        signIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}