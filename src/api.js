export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const HEADERS = { "X-Requested-With": "synchro" };

async function parse(response) {
  let data = {};
  try {
    data = await response.json();
  } catch (e) {
    // Non-JSON response, e.g. a server error page.
  }
  if (!response.ok) {
    throw new ApiError(data.error || "Something went wrong. Please try again.", response.status);
  }
  return data;
}

export async function api(path, { method = "GET", body } = {}) {
  const options = { method, headers: { ...HEADERS }, credentials: "same-origin" };
  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`/api/${path}`, options);
  } catch (e) {
    throw new ApiError("Unable to reach the server. Check your connection and try again.", 0);
  }
  return parse(response);
}

export function downloadUrl(fileId) {
  return `/api/download.php?id=${encodeURIComponent(fileId)}`;
}
