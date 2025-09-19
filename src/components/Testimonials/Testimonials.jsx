import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import styles from "./Testimonials.module.css";

const testimonialsData = [
  {
    id: 1,
    text: "The lunchbox packs came in handyyyy! Delicious and convenient.!",
    author: "Suzanne",
    rating: "★★★★★",
  },
  {
    id: 2,
    text: "The embroidery service was top-notch. Highly recommend!",
    author: "Junior",
    rating: "★★★★☆",
  },
  {
    id: 3,
    text: "My kids love the lunchbox packs! Thank you for making mealtime fun.",
    author: "Jenifer",
    rating: "★★★★★",
  },
   {
    id: 4,
    text: "I  recently tried Golf 's noodles, and I was blown away! The flavors were rich and savory, and the texture was just right.The portion size was generous, and the price was reasonable.",
    author: "Bennie",
    rating: "★★★★★",
  },
  {
    id: 5,
    text: "If you're a noodle lover like me, you should definitely give Golf Noodles a try. The service was friendly and attentive.",
    author: "Bennie",
    rating: "★★★★★",
  },
  {
    id: 6,
    text: "This pie tastes so good! I love the fact that it's easy to make in the microwave. The crust is perfectly flaky, and the filling is rich and flavorful. A true culinary gem! Highly recommended!",
    author: "Sharon",
    rating: "★★★★★",
  },
  {
    id: 7,
    text: "Yooh friends , pies are yummy very nice and noodles that's my bestie now 😋 so delish.",
    author: "Doris",
    rating: "★★★★★",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const testimonialRef = useRef(null);
  const dotsRef = useRef([]);

  // Animation function
  const animateTestimonial = useCallback(() => {
    if (testimonialRef.current) {
      gsap.fromTo(
        testimonialRef.current,
        { x: current === 0 ? 0 : 100, opacity: 0, rotationY: 10 },
        {
          x: 0,
          opacity: 1,
          rotationY: 0,
          duration: 1,
          ease: "power3.out",
          onComplete: () => {
            gsap.fromTo(
              [testimonialRef.current.querySelector(`.${styles.author}`), testimonialRef.current.querySelector(`.${styles.rating}`)],
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, stagger: 0.2 }
            );
          },
        }
      );
    }
  }, [current]);

  // Cycle through testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonialsData.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // Trigger animation on current change
  useEffect(() => {
    animateTestimonial();
  }, [current, animateTestimonial]);

  // Handle dot click
  const handleDotClick = (index) => {
    setCurrent(index);
  };

  return (
    <div className={styles.testimonialsSection}>
      <div className={styles.testimonialsContent}>
        <h2 className={styles.testimonialsTitle}>What Our Customers Say</h2>
        <div className={styles.testimonialsCarousel}>
          <div
            className={`${styles.testimonialItem} ${styles.active}`}
            ref={testimonialRef}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, rotationY: 5, duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, rotationY: 0, duration: 0.3 })}
          >
            <p className={styles.text}>{testimonialsData[current].text}</p>
            <div className={styles.rating}>{testimonialsData[current].rating}</div>
            <h4 className={styles.author}>{testimonialsData[current].author}</h4>
            <svg className={styles.wave} viewBox="0 0 1440 100" preserveAspectRatio="none">
              <path d="M0,50 C300,150 600,-50 900,50 L900,100 L0,100 Z" fill="#2EC4B6" opacity="0.3" />
            </svg>
          </div>
        </div>
        <div className={styles.dots}>
          {testimonialsData.map((_, index) => (
            <span
              key={index}
              ref={(el) => (dotsRef.current[index] = el)}
              className={`${styles.dot} ${current === index ? styles.activeDot : ""}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}