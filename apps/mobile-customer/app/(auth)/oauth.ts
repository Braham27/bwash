import { useCallback } from "react";
import { useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

export function useWarmUpBrowser() {
  useCallback(() => {
    // Warm up the browser for Android
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
}

export function useOAuthFlow(strategy: "oauth_google" | "oauth_apple" | "oauth_facebook") {
  const { startOAuthFlow } = useOAuth({ strategy });

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(tabs)/home"),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error:", err);
    }
  }, [startOAuthFlow]);

  return { onPress };
}
