import React, { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  const { isAuthorized } = useContext(Context);
  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>&copy; copyright 2024.</div>
      <div>
        <Link to={""} target="">
          <FaFacebookF />
        </Link>
        <Link to={""} target="">
          <FaYoutube />
        </Link>
        <Link to={""} target="">
          <FaLinkedin />
        </Link>
        <Link to={""} target="">
          <RiInstagramFill />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
