import api from "./axios";

export const getDeviceId = () => {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_id", id);
  }
  return id;
};

export const getTokenFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("token");
};

// ✅ verifies token and locks to first device
export const verifyInviteToken = async () => {
  const token = getTokenFromUrl();
  const device_id = getDeviceId();

  if (!token) {
    return { allowed: false, msg: "Token missing" };
  }

  try {
    const res = await api.post("/invite/verify", { token, device_id });
    return { allowed: true, msg: res.data?.msg || "Allowed" };
  } catch (err: any) {
    return {
      allowed: false,
      msg: err?.response?.data?.msg || "Access blocked",
    };
  }
};
