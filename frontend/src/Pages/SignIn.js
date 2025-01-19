import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { redirect } from "react-router-dom";
import app from "../firebaseconfig";
import { useNavigate } from "react-router-dom";
import {
  faCommentDots,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
// import { initializeApp } from "firebase/app";


const SignIn = ({setIsSignInVisible}) => {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("User signed in:", result);
        let email = result.user.email
        console.log(email);
        setIsSignInVisible(false)
        window.location.href = `http://localhost:5173/?${email.split("@")[0]}`; // Redirect to the external site
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
      });
  };

  const styles = {
   
    box: {
      background: "#fff",
      padding: "40px",
      borderRadius: "12px",
      textAlign: "center",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
      maxWidth: "400px",
      width: "90%",
      boxSizing: "border-box",
    },
    heading: {
      marginBottom: "10px",
      fontSize: "26px",
      fontWeight: "bold",
      color: "#333",
    },
    subHeading: {
      marginBottom: "30px",
      fontSize: "18px",
      color: "#555",
    },
    button: {
      backgroundColor: "#4285f4",
      color: "#fff",
      border: "none",
      padding: "12px 20px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      fontFamily: "'Rubik', sans-serif",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#357ae8",
    },
    navbarSign: {
      fontSize: "20px",
      color: "#4285f4",
      fontWeight: "bold",
      marginLeft: "5px",
    },
  };
  
  return (
    // <div style={styles.container}>
      <div style={styles.box}>
        <div>
      <h1 className="navbar-title">
          Heal.<span className="navbar-sign">AR</span>
      </h1>
        </div>
        <h2 style={styles.heading}>Welcome!</h2>
        <p style={styles.subHeading}>Sign in with Google to continue.</p>
        <button
          style={styles.button}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = styles.button.backgroundColor)
          }
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </button>
      </div>
    // </div>
  );
  
  
};

export default SignIn;

