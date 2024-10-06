function updateLocalStorageAccessToken(newToken: string | null) {
  localStorage.setItem("accessToken", newToken || "");
  window.dispatchEvent(new Event("accessTokenUpdated"));
}

function removeLocalStorageAccessToken() {
  localStorage.removeItem("accessToken");
  window.dispatchEvent(new Event("accessTokenUpdated"));
}

export { updateLocalStorageAccessToken, removeLocalStorageAccessToken };
