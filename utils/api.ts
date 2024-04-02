export async function getRequestHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${await useAuth().profile?.getIdToken()}`,
  };
}

type Endpoints = "/profile" | "/profile/:uid";
function replaceUserId(endpoint: Endpoints) {
  let hasUID = endpoint.includes(":uid");
  if (!hasUID) return endpoint;

  return endpoint.replace(":uid", useAuth().profile?.uid || "null");
}
export default function getRequestEndpoint(endpoint: Endpoints) {
  if (process.env.NODE_ENV === "development") {
    return `http://127.0.0.1:5001/notez-e2410/us-central1/v1${replaceUserId(
      endpoint
    )}`;
  } else {
    return `${useRuntimeConfig().public.firebaseEnpoint}${replaceUserId(
      endpoint
    )}`;
  }
}
