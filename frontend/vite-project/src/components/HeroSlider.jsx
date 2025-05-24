import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import image1 from "../assets/image-1.webp";
import image2 from "../assets/image-2.webp";
import image3 from "../assets/image-3.jpg";
import "./HeroSlider.css";

const images = [image1, image2, image3];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const previous = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  return (
    <div className="hero-slider">
      <img src={images[index]} alt="slide" />

      <div className="hero-overlay">
        <h2 className="hero-title">Book you car wash today!</h2>
        <button className="hero-button" onClick={() => navigate("/booking")}>
          Book now!
        </button>
      </div>

      <button className="nav-btn nav-left" onClick={previous}>
        <ChevronLeft />
      </button>

      <button className="nav-btn nav-right" onClick={next}>
        <ChevronRight />
      </button>
    </div>
  );
}
