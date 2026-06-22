import { useEffect, useRef } from 'react';

export default function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current || document;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        });
      },
      {
        threshold: options.threshold ?? 0.12,
        rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
      }
    );

    const observe = (el) => {
      if (el.classList?.contains('reveal') && !el.classList.contains('revealed')) {
        io.observe(el);
      }
    };

    container.querySelectorAll('.reveal').forEach(observe);

    const mo = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          observe(node);
          node.querySelectorAll?.('.reveal').forEach(observe);
        });
      });
    });

    mo.observe(container === document ? document.body : container, {
      childList: true,
      subtree: true,
    });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [options.threshold, options.rootMargin]);

  return ref;
}