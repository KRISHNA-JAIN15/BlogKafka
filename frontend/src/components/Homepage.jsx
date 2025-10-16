import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Hyperspeed from "./Hyperspeed";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./css/Homepage.css";

const Homepage = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch featured articles on component mount
  useEffect(() => {
    const fetchFeaturedNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/news/featured?limit=6`
        );
        setFeaturedArticles(response.data.news);
        setError(null);
      } catch (err) {
        console.error("Error fetching featured news:", err);
        setError("Failed to load featured stories");
        setFeaturedArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedNews();
  }, []);

  const newsCategories = [
    {
      title: "Tech and Innovation",
      count: "2.3k",
      color: "finance",
      description: "AI breakthroughs and cutting-edge technology",
      icon: "🤖",
      trending: "Quantum Computing",
    },
    {
      title: "Finance and Money",
      count: "1.8k",
      color: "finance",
      description: "Market trends and financial insights",
      icon: "💰",
      trending: "Crypto Surge",
    },
    {
      title: "World and Politics",
      count: "1.2k",
      color: "politics",
      description: "Global affairs and political developments",
      icon: "🌍",
      trending: "UN Summit",
    },
  ];

  return (
    <div className="homepage">
      {/* Responsive Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-gradient"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Discover the
              <span className="gradient-text"> Future</span>
              <br />
              of Innovation
            </h1>
            <p className="hero-subtitle">
              Stay ahead with cutting-edge insights, breakthrough discoveries,
              and the stories that shape tomorrow's world.
            </p>
            <div className="hero-actions">
              <button className="cta-primary">
                <span>Explore Stories</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <Link to="/signup" className="cta-secondary">
                Join Community
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <img
              src="/src/assets/Male Character Holding Toa.png"
              alt="3D Character with Megaphone"
              className="hero-character"
            />
          </div>
        </div>
      </section>

      {/* Experience the Future with Categories */}
      <section className="hyperspeed-section">
        <div className="hyperspeed-container">
          <Hyperspeed
            effectOptions={{
              onSpeedUp: () => {},
              onSlowDown: () => {},
              distortion: "turbulentDistortion",
              length: 400,
              roadWidth: 9,
              islandWidth: 2,
              lanesPerRoad: 3,
              fov: 90,
              fovSpeedUp: 150,
              speedUp: 2,
              carLightsFade: 0.4,
              totalSideLightSticks: 50,
              lightPairsPerRoadWay: 50,
              shoulderLinesWidthPercentage: 0.05,
              brokenLinesWidthPercentage: 0.1,
              brokenLinesLengthPercentage: 0.5,
              lightStickWidth: [0.12, 0.5],
              lightStickHeight: [1.3, 1.7],
              movingAwaySpeed: [60, 80],
              movingCloserSpeed: [-120, -160],
              carLightsLength: [400 * 0.05, 400 * 0.15],
              carLightsRadius: [0.05, 0.14],
              carWidthPercentage: [0.3, 0.5],
              carShiftX: [-0.2, 0.2],
              carFloorSeparation: [0.05, 1],
              colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0x131318,
                brokenLines: 0x131318,
                leftCars: [0xdc5b20, 0xdca320, 0xdc2020],
                rightCars: [0x334bf7, 0xe5e6ed, 0xbfc6f3],
                sticks: 0xc5e8eb,
              },
            }}
          />
          <div className="hyperspeed-overlay">
            <div className="container">
              <h2 className="section-title hyperspeed-title">
                Experience the Future
              </h2>
              <p className="hyperspeed-subtitle">
                Dive into tomorrow's technology with immersive storytelling and
                cutting-edge insights. Explore breakthrough innovations that are
                reshaping our world.
              </p>
              <div className="future-categories-grid">
                {newsCategories.map((category, index) => (
                  <div
                    key={index}
                    className={`future-category-card ${category.color}`}
                  >
                    <div className="future-category-icon">{category.icon}</div>
                    <div className="future-category-content">
                      <h3 className="future-category-title">
                        {category.title}
                      </h3>
                      {/* <p className="future-category-description">
                        {category.description}
                      </p> */}
                      <div className="future-category-stats">
                        <span className="future-article-count">
                          {category.count} articles
                        </span>
                        {/* <span className="future-trending-topic">
                          🔥 {category.trending}
                        </span> */}
                      </div>
                    </div>
                    <div className="future-category-arrow">→</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section id="stories" className="featured">
        <div className="container">
          <h2 className="section-title">Featured Stories</h2>
          <div className="articles-grid">
            {loading ? (
              <div className="loading-state">
                <p>Loading featured stories...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
              </div>
            ) : featuredArticles.length === 0 ? (
              <div className="empty-state">
                <p>No featured stories available at the moment.</p>
              </div>
            ) : (
              featuredArticles.map((article) => (
                <article key={article._id} className="article-card">
                  <div className="article-image">
                    <img
                      src={
                        article.image ||
                        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&auto=format"
                      }
                      alt={article.title}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&auto=format";
                      }}
                    />
                    <div className="image-overlay">
                      <span className="article-category">
                        {article.category || "General"}
                      </span>
                    </div>
                  </div>
                  <div className="article-content">
                    <div className="article-header">
                      <span className="article-time">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-excerpt">
                      {article.content.length > 150
                        ? `${article.content.substring(0, 150)}...`
                        : article.content}
                    </p>
                    <div className="article-footer">
                      <div className="article-author">
                        <div className="author-avatar">
                          <span>{article.author.charAt(0)}</span>
                        </div>
                        <span>{article.author}</span>
                      </div>
                      <Link
                        to={`/article/${article._id}`}
                        className="read-more"
                      >
                        Read More
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 12h14M12 5l7 7-7 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay in the Loop</h2>
            <p>Get the latest insights delivered straight to your inbox</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button type="submit">Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;
