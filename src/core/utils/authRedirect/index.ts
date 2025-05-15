import { getUserInfo } from "src/core/services/auth";

export const authRedirect = async (): Promise<void> => {
  const token = localStorage.getItem("authToken");

  if (token) {
    try {
      const userInfo = await getUserInfo(token);
      if (userInfo.role === "customer") {
        window.location.href = "/dashboard";
      } else if (userInfo.role === "admin") {
        window.location.href = "/admin";
      }
    } catch {
      localStorage.removeItem("authToken");
    }
  }
};
