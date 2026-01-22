import api from "./axios";
import { getTokenFromUrl } from "./token";

export interface Saree {
  id: string;
  name: string;
  price: number;
  images: string[];
  remarks?: string;
}

export const fetchSarees = async (): Promise<Saree[]> => {
  const token = getTokenFromUrl();

  const res = await api.get("/client/sarees", {
    headers: {
      "X-Invite-Token": token || "",
    },
  });

  return res.data?.data || [];
};

export const fetchSingleSaree = async (id: string): Promise<Saree> => {
  const token = getTokenFromUrl();

  const res = await api.get(`/client/sarees/${id}`, {
    headers: {
      "X-Invite-Token": token || "",
    },
  });

  return res.data?.data;
};
