import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import WhatsAppNav from "../navigation/Navigation";
import { NavigationActions } from "react-navigation";

const NavContainer = () => {
  const isAuth = useSelector((state) => state.auth.token);
  const navref = useRef();
  useEffect(() => {
    if (!isAuth) {
      navref.current.dispatch(
        NavigationActions.navigate({ routeName: "Auth" })
      );
    }
  }, [isAuth]);
  return <WhatsAppNav ref={navref} />;
};

export default NavContainer;
