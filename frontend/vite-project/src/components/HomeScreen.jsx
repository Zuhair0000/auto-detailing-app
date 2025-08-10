import React from "react";
import HeroSlider from "./HeroSlider";
import NavBar from "./NavBar";
import Services from "./Services";
import Footer from "./Footer";

export default function HomeScreen() {
  return (
    <>
      <NavBar />
      <HeroSlider />
      <Services />
      <Footer />
    </>
  );
}
