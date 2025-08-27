import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./Testimonials.module.css";

const testimonialsData = [
  {
    id: 1,
    text: "NMG Zembeta transformed our office with their exceptional cleaning services.",
    author: "Jane Doe",
    rating: "★★★★★",
  },
  {
    id: 2,
    text: "The catering for our event was flawless. Highly recommend!",
    author: "John Smith",
    rating: "★★★★☆",
  },
  {
    id: 3,
    text: "Their branding gave our business a fresh look. Outstanding work!",
    author: "Emily Johnson",
    rating: "★★★★★",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const testimonialRef = useRef(null);

  // Cycle through testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonialsData.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // Animate on change
  useEffect(() => {
    if (testimonialRef.current) {
      gsap.fromTo(
        testimonialRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [current]);

  return (
    <div className={styles.testimonialsCarousel}>
      <div className={`${styles.testimonialItem} ${styles.active}`} ref={testimonialRef}>
        <p className={styles.text}>{testimonialsData[current].text}</p>
        <div className={styles.rating}>{testimonialsData[current].rating}</div>
        <h4 className={styles.author}>{testimonialsData[current].author}</h4>
      </div>
    </div>
  );
}
