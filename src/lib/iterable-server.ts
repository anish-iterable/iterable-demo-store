type IterableUserUpdatePayload = {
  email: string;
  dataFields?: Record<string, unknown>;
  mergeNestedObjects?: boolean;
  preferUserId?: boolean;
};

type IterableTrackEventPayload = {
  email: string;
  eventName: string;
  dataFields?: Record<string, unknown>;
};

type IterablePurchaseItem = {
  id: string;
  sku?: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
  url?: string;
  categories?: string[];
};

type IterableTrackPurchasePayload = {
  email: string;
  items: IterablePurchaseItem[];
  total: number;
  dataFields?: Record<string, unknown>;
};

function getIterableConfig() {
  const baseUrl = process.env.ITERABLE_API_BASE_URL;
  const apiKey = process.env.ITERABLE_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error("Missing Iterable backend configuration");
  }

  return { baseUrl, apiKey };
}

async function iterableFetch<T>(
  path: string,
  body: Record<string, unknown>
): Promise<T> {
  const { baseUrl, apiKey } = getIterableConfig();

  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": apiKey,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      (data && (data.msg || data.message)) ||
        `Iterable request failed: ${response.status}`
    );
  }

  return data as T;
}

export async function iterableUsersUpdate(
  payload: IterableUserUpdatePayload
) {
  return iterableFetch("/api/users/update", {
    email: payload.email,
    dataFields: payload.dataFields ?? {},
    mergeNestedObjects: payload.mergeNestedObjects ?? true,
    preferUserId: payload.preferUserId ?? false,
  });
}

export async function iterableTrackEvent(
  payload: IterableTrackEventPayload
) {
  return iterableFetch("/api/events/track", {
    email: payload.email,
    eventName: payload.eventName,
    dataFields: payload.dataFields ?? {},
  });
}

export async function iterableTrackPurchase(
  payload: IterableTrackPurchasePayload
) {
  return iterableFetch("/api/commerce/trackPurchase", {
    user: {
      email: payload.email,
    },
    items: payload.items,
    total: payload.total,
    dataFields: payload.dataFields ?? {},
  });
}