"use client";

import {
  initializeWithConfig,
  updateUser,
  track,
  updateCart,
  trackPurchase,
} from "@iterable/web-sdk";

let isInitialized = false;

let setEmailFn: ((email: string) => Promise<string>) | undefined;
let setUserIDFn: ((userId: string) => Promise<string>) | undefined;
let logoutFn: (() => void) | undefined;
let setVisitorUsageTrackedFn: ((consent: boolean) => void) | undefined;

async function generateJWT(email?: string, userId?: string) {
  const response = await fetch("/api/iterable/jwt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, userId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch Iterable JWT");
  }

  return data.token as string;
}

export async function initIterableWebSdk() {
  if (isInitialized) return;

  const webApiKey = process.env.NEXT_PUBLIC_ITERABLE_WEB_API_KEY;

  if (!webApiKey) {
    throw new Error("Missing NEXT_PUBLIC_ITERABLE_WEB_API_KEY");
  }

  const { setEmail, setUserID, logout, setVisitorUsageTracked } =
    initializeWithConfig({
      authToken: webApiKey,
      configOptions: {
        isEuIterableService: true,
        enableUnknownActivation: true,
        identityResolution: {
          replayOnVisitorToKnown: true,
          mergeOnUnknownToKnown: true,
        },
        eventThresholdLimit: 100,
      },
      generateJWT: ({ email, userID }) => generateJWT(email, userID),
    });

  setEmailFn = setEmail;
  setUserIDFn = setUserID;
  logoutFn = logout;
  setVisitorUsageTrackedFn = setVisitorUsageTracked;

  setVisitorUsageTrackedFn?.(true);

  isInitialized = true;
}

export async function identifyIterableUser(email: string) {
  if (!isInitialized) {
    await initIterableWebSdk();
  }

  if (!setEmailFn) {
    throw new Error("Iterable Web SDK not initialized correctly");
  }

  await setEmailFn(email);

  await updateUser({
    dataFields: {},
  });
}

export async function identifyIterableUserById(userId: string) {
  if (!isInitialized) {
    await initIterableWebSdk();
  }

  if (!setUserIDFn) {
    throw new Error("Iterable Web SDK not initialized correctly");
  }

  await setUserIDFn(userId);

  await updateUser({
    dataFields: {},
  });
}

export async function logoutIterableUser() {
  if (!isInitialized) return;
  logoutFn?.();
}

export async function trackIterableEvent(
  eventName: string,
  dataFields?: Record<string, unknown>
) {
  if (!isInitialized) {
    await initIterableWebSdk();
  }

  await track({
    eventName,
    dataFields: dataFields ?? {},
  });
}

export async function updateIterableCart(items: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}[]) {
  if (!isInitialized) {
    await initIterableWebSdk();
  }

  await updateCart({
    items,
  });
}

export async function trackIterablePurchase(items: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}[]) {
  if (!isInitialized) {
    await initIterableWebSdk();
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  await trackPurchase({
    items,
    total,
  });
}