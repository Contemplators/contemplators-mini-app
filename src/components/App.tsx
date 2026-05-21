"use client";

import { useEffect } from "react";
import { useMiniApp } from "@neynar/react";
import { HomeTab } from "~/components/ui/tabs";
import { useNeynarUser } from "../hooks/useNeynarUser";

// --- Types ---
export interface AppProps {
  title?: string;
}

/**
 * App component — root container for the Contemplators Mini App.
 *
 * Simplified from the Neynar starter template:
 *   - Removed the tab bar (Home / Actions / Context / Wallet) — the app
 *     is single-purpose ("Discover your Contemplator")
 *   - Removed the Header component (the welcome banner with the project name)
 *   - HomeTab now occupies the entire viewport and renders its own background
 *
 * The Neynar SDK is still initialized (we need isSDKLoaded so the Mini App
 * can be embedded in Farcaster correctly), but its tab/state machinery
 * is no longer surfaced in the UI.
 */
export default function App(
  { title: _title }: AppProps = { title: "Discover your Contemplator" }
) {
  // --- Neynar SDK ---
  const { isSDKLoaded, context } = useMiniApp();

  // --- Neynar user (kept for parity with template, unused in UI for now) ---
  useNeynarUser(context || undefined);

  // --- Effects ---
  useEffect(() => {
    if (isSDKLoaded) {
      // SDK ready — nothing to do here for now, HomeTab is self-contained
    }
  }, [isSDKLoaded]);

  // --- Early return: loading state ---
  if (!isSDKLoaded) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#2a2e26",
          color: "#f0ebdc",
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontSize: "12px",
          letterSpacing: "0.1em",
        }}
      >
        LOADING...
      </div>
    );
  }

  // --- Render ---
  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
        backgroundColor: "#2a2e26",
        minHeight: "100vh",
      }}
    >
      <HomeTab />
    </div>
  );
}
