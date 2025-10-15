import React from "react";
import { Link } from "react-router-dom";
import "./css/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Twitter",
      url: "https://twitter.com",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"
            fill="currentColor"
          />
          <circle cx="4" cy="4" r="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      url: "https://github.com",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "Discord",
      url: "https://discord.com",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0188 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ];

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "About Us", url: "/about" },
        { name: "Features", url: "/features" },
        { name: "Pricing", url: "/pricing" },
        { name: "API", url: "/api" },
        { name: "Careers", url: "/careers" },
      ],
    },
    {
      title: "Content",
      links: [
        { name: "Categories", url: "/categories" },
        { name: "Authors", url: "/authors" },
        { name: "Archive", url: "/archive" },
        { name: "Trending", url: "/trending" },
        { name: "Newsletter", url: "/newsletter" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", url: "/blog" },
        { name: "Documentation", url: "/docs" },
        { name: "Community", url: "/community" },
        { name: "Events", url: "/events" },
        { name: "Webinars", url: "/webinars" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", url: "/help" },
        { name: "Contact Us", url: "/contact" },
        { name: "Privacy Policy", url: "/privacy" },
        { name: "Terms of Service", url: "/terms" },
        { name: "Cookie Policy", url: "/cookies" },
      ],
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <h3>NewsNet</h3>
              <span className="logo-icon">📰</span>
            </div>
            <p className="footer-tagline">
              Shaping tomorrow's stories today with cutting-edge journalism and
              innovative insights.
            </p>
            <div className="footer-social">
              <h4>Follow Us</h4>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="footer-links">
            {footerSections.map((section, index) => (
              <div key={index} className="footer-section">
                <h4 className="footer-section-title">{section.title}</h4>
                <ul className="footer-section-links">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link to={link.url} className="footer-link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Subscription
        <div className="footer-newsletter">
          <div className="newsletter-content">
            <h4>Stay Updated</h4>
            <p>Get the latest news and insights delivered to your inbox.</p>
          </div>
          <div className="newsletter-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
                aria-label="Email address for newsletter"
              />
              <button type="submit" className="newsletter-button">
                Subscribe
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div> */}

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {currentYear} NewsNet. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/cookies">Cookies</Link>
              <Link to="/sitemap">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
