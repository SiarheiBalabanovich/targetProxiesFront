import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setStoreUserInfo } from "src/store/slices/userInfoSlice.ts";
import { getUserInfo, googleAuth } from "src/core/services/auth";

export const handleGoogle = async () => {
  await googleAuth().then((response) => {
    if (response && typeof response === "string") {
      window.location.href = response;
    }
  });
};

export const useGoogleAuthEffect = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("authToken", token);
      getUserInfo(token)
        .then((userInfo) => {
          dispatch(setStoreUserInfo(userInfo));

          if (userInfo.role === "customer") {
            window.location.href = "/dashboard";
          } else if (userInfo.role === "admin") {
            window.location.href = "/admin";
          }
        })
        .catch(() => {
          console.log("Login or password is incorrect");
        });
    }
  }, [dispatch]);
};
