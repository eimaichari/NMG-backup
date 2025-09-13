import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className="bg-[#1E2A38] py-6 px-4 text-[#E6E6E6] font-['Inter',_sans-serif]">
      <div className="container mx-auto flex justify-between items-start flex-wrap gap-4">
        {/* Quick Links */}
        <div className="flex flex-col">
          <h4 className="text-lg font-semibold text-[#FFB703] mb-2">Quick Links</h4>
          <ul className="flex flex-col gap-1">
            <li>
              <Link to="/about" className="text-sm text-[#E6E6E6] hover:text-[#2EC4B6] transition-colors duration-200">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm text-[#E6E6E6] hover:text-[#2EC4B6] transition-colors duration-200">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/products" className="text-sm text-[#E6E6E6] hover:text-[#2EC4B6] transition-colors duration-200">
                Products
              </Link>
            </li>
          </ul>
        </div>
        {/* Contact Info and Social Media */}
        <div className="flex flex-col items-end text-right">
          <h4 className="text-lg font-semibold text-[#FFB703] mb-2">Contact Us</h4>
          <p className="text-sm mb-1">Email: nasiphizembeta@gmail.com</p>
          <p className="text-sm mb-2">Phone: (+27)73 974-0331</p>
          <div className="flex gap-2">
            <a href="https://www.facebook.com/share/1F33u4amC7/" target="_blank" rel="noopener noreferrer" className="group">
              <svg className="w-5 h-5 text-[#FFB703] group-hover:text-[#2EC4B6] transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8v-6.9H7.9v-2.9H10v-2.36c0-2.1 1.25-3.25 3.16-3.25.92 0 1.88.16 1.88.16v2.06h-1.06c-1.04 0-1.37.65-1.37 1.32v1.57h2.32l-.37 2.9h-1.95V21.8c4.56-.93 8-4.96 8-9.8z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/nmgm439?utm_source=qr&igsh=NmZyZW9rNnZuaGd1" target="_blank" rel="noopener noreferrer" className="group">
              <svg className="w-5 h-5 text-[#FFB703] group-hover:text-[#2EC4B6] transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.16c3.21 0 3.58.02 4.84.07 1.17.05 1.8.24 2.22.4.56.22.96.49 1.38.91.42.42.69.82.91 1.38.16.42.35 1.05.4 2.22.05 1.26.07 1.63.07 4.84s-.02 3.58-.07 4.84c-.05 1.17-.24 1.8-.4 2.22-.22.56-.49.96-.91 1.38-.42.42-.82.69-1.38.91-.42.16-1.05.35-2.22.4-1.26.05-1.63.07-4.84.07s-3.58-.02-4.84-.07c-1.17-.05-1.8-.24-2.22-.4-.56-.22-.96-.49-1.38-.91-.42-.42-.69-.82-.91-1.38-.16-.42-.35-1.05-.4-2.22-.05-1.26-.07-1.63-.07-4.84s.02-3.58.07-4.84c.05-1.17.24-1.8.4-2.22.22-.56.49-.96.91-1.38.42-.42.82-.69 1.38-.91.42-.16 1.05-.35 2.22-.4 1.26-.05 1.63-.07 4.84-.07zm0-2.16C8.74 0 8.33.02 7.05.07 5.78.12 4.76.33 3.9.61c-.87.29-1.6.71-2.33 1.44S.44 3.81.15 4.68c-.28.86-.49 1.88-.54 3.15C-.02 8.33 0 8.74 0 12s.02 3.67.07 4.95c.05 1.27.26 2.29.54 3.15.29.87.71 1.6 1.44 2.33s1.46 1.15 2.33 1.44c.86.28 1.88.49 3.15.54 1.28.05 1.69.07 4.95.07s3.67-.02 4.95-.07c1.27-.05 2.29-.26 3.15-.54.87-.29 1.6-.71 2.33-1.44s1.15-1.46 1.44-2.33c.28-.86.49-1.88.54-3.15.05-1.28.07-1.69.07-4.95s-.02-3.67-.07-4.95c-.05-1.27-.26-2.29-.54-3.15-.29-.87-.71-1.6-1.44-2.33s-1.46-1.15-2.33-1.44c-.86-.28-1.88-.49-3.15-.54C15.67-.02 15.26 0 12 0z"/>
                <path d="M12 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zm0 10.16a4 4 0 110-8 4 4 0 010 8zm6.4-10.4a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@nasie325?_t=ZS-8z96uUQ1TeB&_r=1" target="_blank" rel="noopener noreferrer" className="group">
              <svg className="w-5 h-5 text-[#FFB703] group-hover:text-[#2EC4B6] transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.81 2.89 2.89 0 011.81.61V9.81a6.34 6.34 0 00-5.83-1.29 6.34 6.34 0 00-4.4 7.39 6.34 6.34 0 0010.41 2.72 6.34 6.34 0 001.16-7.39V6.27a8.28 8.28 0 004.66 1.61V4.41a4.83 4.83 0 01-.9 2.28z"/>
              </svg>
            </a>
            <a href="https://youtube.com/@nasie6302/community?si=Oglk3z9MhHV0yr3L" target="_blank" rel="noopener noreferrer" className="group">
              <svg className="w-5 h-5 text-[#FFB703] group-hover:text-[#2EC4B6] transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.5 6.5a3 3 0 00-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 00.5 6.5c-.4 2.2-.4 6.8-.4 6.8s0 4.6.4 6.8a3 3 0 002.1 2.1c1.9.4 9.4.4 9.4.4s7.5 0 9.4-.4a3 3 0 002.1-2.1c.4-2.2.4-6.8.4-6.8s0-4.6-.4-6.8zM9.75 15.02V8.98l6.25 3.02-6.25 3.02z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p className="text-xs text-[#cccccc]">
          &copy; 2025 NMG-Zembeta. All rights reserved. Built By{" "}
          <a
            href="https://www.linkedin.com/in/jeremie-kazadi-013a55372?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E6E6E6] underline hover:text-[#2EC4B6] transition-colors duration-200"
          >
            JAY_K
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;