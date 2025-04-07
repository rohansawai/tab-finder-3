"use client"

import { useState } from 'react'
import { config } from '../src/config/config'
import Link from 'next/link'
import Image from 'next/image'
import '../src/styles/landing.css'

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('features')

  return (
    <div className="landing-page">
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>{config.app.name}</h1>
          </div>
          <nav className="nav">
            <a href="#features" onClick={() => setActiveTab('features')} className={activeTab === 'features' ? 'active' : ''}>Features</a>
            <a href="#how-it-works" onClick={() => setActiveTab('how-it-works')} className={activeTab === 'how-it-works' ? 'active' : ''}>How It Works</a>
            <a href="#demo" onClick={() => setActiveTab('demo')} className={activeTab === 'demo' ? 'active' : ''}>Demo</a>
            <a href="#pricing" onClick={() => setActiveTab('pricing')} className={activeTab === 'pricing' ? 'active' : ''}>Pricing</a>
          </nav>
          <div className="cta">
            <a href="https://chrome.google.com/webstore/detail/tab-finder/your-extension-id" className="button primary">Add to Chrome</a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Find Any Tab Instantly with AI</h1>
            <p>Tab Finder uses natural language processing to help you find any open tab by describing what you're looking for, even if you don't remember the exact title or URL.</p>
            <div className="hero-buttons">
              <a href="https://chrome.google.com/webstore/detail/tab-finder/your-extension-id" className="button primary">Get Started</a>
              <a href="#demo" className="button secondary">See How It Works</a>
            </div>
          </div>
          <div className="hero-image">
            <div className="browser-mockup">
              <div className="browser-header">
                <div className="browser-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="browser-address">chrome://extensions</div>
              </div>
              <div className="browser-content">
                <img 
                  src="/tab-finder-screenshot.png" 
                  alt="Tab Finder Extension Screenshot" 
                  className="screenshot"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <h2>Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Natural Language Search</h3>
              <p>Find tabs using everyday language like "the article about AI I was reading yesterday" or "my shopping cart on Amazon".</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>AI-Powered Matching</h3>
              <p>Our advanced AI understands context and meaning, not just keywords, to find exactly what you're looking for.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Search across hundreds of tabs in milliseconds with our optimized search algorithm.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Privacy Focused</h3>
              <p>All processing happens locally in your browser. Your tab data never leaves your computer.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2>How Tab Finder Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Install the Extension</h3>
              <p>Add Tab Finder to Chrome with just one click from the Chrome Web Store.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Click the Extension Icon</h3>
              <p>When you need to find a tab, click the Tab Finder icon in your browser toolbar.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Describe What You're Looking For</h3>
              <p>Type a natural language description of the tab you want to find.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Find Your Tab Instantly</h3>
              <p>Tab Finder shows you the most relevant matches, ranked by relevance.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="demo">
        <div className="container">
          <h2>Try It Yourself</h2>
          <p className="section-description">Experience how Tab Finder works with this interactive demo.</p>
          
          <div className="demo-container">
            <div className="demo-sidebar">
              <h3>Sample Tabs</h3>
              <ul className="sample-tabs">
                <li>
                  <span className="tab-icon">📄</span>
                  <span className="tab-title">How to Build a React App - Medium</span>
                </li>
                <li>
                  <span className="tab-icon">🛒</span>
                  <span className="tab-title">Shopping Cart - Amazon</span>
                </li>
                <li>
                  <span className="tab-icon">📊</span>
                  <span className="tab-title">Q2 Sales Report - Google Sheets</span>
                </li>
                <li>
                  <span className="tab-icon">📧</span>
                  <span className="tab-title">Unread (3) - Gmail</span>
                </li>
                <li>
                  <span className="tab-icon">🎥</span>
                  <span className="tab-title">How to Use Tab Finder - YouTube</span>
                </li>
                <li>
                  <span className="tab-icon">📚</span>
                  <span className="tab-title">JavaScript: The Good Parts - GitHub</span>
                </li>
                <li>
                  <span className="tab-icon">🗓️</span>
                  <span className="tab-title">Team Meeting - Google Calendar</span>
                </li>
                <li>
                  <span className="tab-icon">📝</span>
                  <span className="tab-title">Project Notes - Notion</span>
                </li>
              </ul>
            </div>
            
            <div className="demo-main">
              <div className="demo-search">
                <input 
                  type="text" 
                  placeholder="Describe the tab you're looking for..." 
                  className="demo-input"
                />
                <button className="demo-button">Search</button>
              </div>
              
              <div className="demo-results">
                <h3>Search Results</h3>
                <p className="demo-instruction">Type a description like "the article about React" or "my shopping cart" and click Search.</p>
                <div className="results-placeholder">
                  <p>Results will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing">
        <div className="container">
          <h2>Simple Pricing</h2>
          <div className="pricing-cards">
            <div className="pricing-card">
              <h3>Free</h3>
              <div className="price">$0</div>
              <ul className="features-list">
                <li>Up to 50 tabs</li>
                <li>Basic search</li>
                <li>Community support</li>
              </ul>
              <a href="https://chrome.google.com/webstore/detail/tab-finder/your-extension-id" className="button secondary">Get Started</a>
            </div>
            <div className="pricing-card featured">
              <div className="featured-badge">Most Popular</div>
              <h3>Pro</h3>
              <div className="price">$4.99<span>/month</span></div>
              <ul className="features-list">
                <li>Unlimited tabs</li>
                <li>Advanced AI search</li>
                <li>Priority support</li>
                <li>Custom categories</li>
                <li>Search history</li>
              </ul>
              <a href="#" className="button primary">Subscribe Now</a>
            </div>
            <div className="pricing-card">
              <h3>Team</h3>
              <div className="price">$9.99<span>/month</span></div>
              <ul className="features-list">
                <li>Everything in Pro</li>
                <li>Team sharing</li>
                <li>Admin dashboard</li>
                <li>API access</li>
                <li>Dedicated support</li>
              </ul>
              <a href="#" className="button secondary">Contact Sales</a>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <h2>What Our Users Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Tab Finder has completely changed how I manage my browser tabs. I can find anything instantly!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👤</div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <p>Product Manager</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"As a developer with 50+ tabs open, this extension is a lifesaver. The AI search is incredibly accurate."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👤</div>
                <div className="author-info">
                  <h4>Michael Chen</h4>
                  <p>Software Engineer</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"I've tried other tab managers, but Tab Finder's natural language search is in a league of its own."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👤</div>
                <div className="author-info">
                  <h4>Emily Rodriguez</h4>
                  <p>Digital Marketer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How does Tab Finder work?</h3>
              <p>Tab Finder uses advanced natural language processing to understand your search queries and match them with your open tabs. It analyzes tab titles, URLs, and content to find the most relevant matches.</p>
            </div>
            <div className="faq-item">
              <h3>Is my data secure?</h3>
              <p>Yes, Tab Finder is designed with privacy in mind. All processing happens locally in your browser, and your tab data never leaves your computer.</p>
            </div>
            <div className="faq-item">
              <h3>Can I use Tab Finder with other browsers?</h3>
              <p>Currently, Tab Finder is only available for Chrome. We're working on versions for Firefox, Edge, and Safari.</p>
            </div>
            <div className="faq-item">
              <h3>How many tabs can Tab Finder handle?</h3>
              <p>The free version supports up to 50 tabs, while the Pro version can handle unlimited tabs with no performance impact.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h2>{config.app.name}</h2>
              <p>Find any tab instantly with AI</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h3>Product</h3>
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#pricing">Pricing</a>
                <a href="#demo">Demo</a>
              </div>
              <div className="footer-column">
                <h3>Company</h3>
                <a href="#">About Us</a>
                <a href="#">Blog</a>
                <a href="#">Careers</a>
                <a href="#">Contact</a>
              </div>
              <div className="footer-column">
                <h3>Resources</h3>
                <a href="#">Documentation</a>
                <a href="#">Support</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Tab Finder. All rights reserved.</p>
            <div className="social-links">
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="GitHub">GitHub</a>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}