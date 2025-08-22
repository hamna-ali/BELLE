import React from "react";
import "./About.css";
import aboutImg from "../assets/images/about_1ed.jpg";

export default function AboutUs() {
  return (
    <div className="au-page">
      {/* Hero */}
      <section className="au-hero">
        <img src={aboutImg} alt="Fashion moodboard" className="au-hero-img" />
        <div className="au-hero-overlay" />
        <div className="au-hero-content">
          <h1 className="au-title">About Belle</h1>
          <p className="au-subtitle">
            Stories, style, and the culture of getting dressed.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="au-container au-intro">
        <div className="au-intro-col">
          <h2 className="au-h2">Our Mission</h2>
          <p className="au-body">
            We celebrate personal style and empower emerging voices in fashion.
            From runway edits to street style diaries and beauty deep dives, our
            pages are a curated space for inspiration and honest conversation.
          </p>
          <p className="au-body">
            Belle blends thoughtful writing with practical guides—highlighting
            designers, sustainable labels, and the communities shaping what we
            wear next.
          </p>
        </div>
        <div className="au-intro-card">
          <div className="au-stat">
            <span className="au-stat-num">500+</span>
            <span className="au-stat-label">Features</span>
          </div>
          <div className="au-stat">
            <span className="au-stat-num">120k</span>
            <span className="au-stat-label">Monthly Readers</span>
          </div>
          <div className="au-stat">
            <span className="au-stat-num">90</span>
            <span className="au-stat-label">Contributors</span>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="au-container au-timeline">
        <h2 className="au-h2">Our Story</h2>
        <div className="au-timeline-list">
          <article className="au-time-card">
            <div className="au-dot" />
            <h3 className="au-h3">2019 — The Notebook</h3>
            <p className="au-body">
              Belle began as a passion project—documenting street style,
              vintage finds, and designer lookbooks.
            </p>
          </article>
          <article className="au-time-card">
            <div className="au-dot" />
            <h3 className="au-h3">2021 — Community First</h3>
            <p className="au-body">
              We opened our platform to guest editors and micro‑mag columns,
              elevating new voices across global cities.
            </p>
          </article>
          <article className="au-time-card">
            <div className="au-dot" />
            <h3 className="au-h3">2024 — Beyond the Feed</h3>
            <p className="au-body">
              Beauty, sustainability, and craftsmanship became core pillars, with
              long‑form features and brand spotlights.
            </p>
          </article>
        </div>
      </section>

      {/* Values */}
      <section className="au-values">
        <div className="au-container au-values-inner">
          <h2 className="au-h2">What We Believe</h2>
          <div className="au-values-grid">
            <div className="au-value">
              <span className="au-kicker">Curation</span>
              <p className="au-body">
                No noise—just refined picks and perspectives that matter.
              </p>
            </div>
            <div className="au-value">
              <span className="au-kicker">Craft</span>
              <p className="au-body">
                We honor technique, tailoring, and the people behind the seams.
              </p>
            </div>
            <div className="au-value">
              <span className="au-kicker">Conscience</span>
              <p className="au-body">
                Fashion can be beautiful and responsible—we champion both.
              </p>
            </div>
            <div className="au-value">
              <span className="au-kicker">Community</span>
              <p className="au-body">
                From stylists to students—everyone is invited to the table.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team highlight (placeholder cards) */}
      <section className="au-container au-team">
        <h2 className="au-h2">Editors & Contributors</h2>
        <div className="au-team-grid">
          <div className="au-team-card">
            <div className="au-avatar" />
            <div className="au-team-meta">
              <h4 className="au-h4">Editor-in-Chief</h4>
              <p className="au-body-sm">
                Leads our editorial vision—runway recaps, designer profiles, and
                culture commentary.
              </p>
            </div>
          </div>
          <div className="au-team-card">
            <div className="au-avatar" />
            <div className="au-team-meta">
              <h4 className="au-h4">Beauty Director</h4>
              <p className="au-body-sm">
                Skin science, fragrance diaries, and artist‑backed tutorials.
              </p>
            </div>
          </div>
          <div className="au-team-card">
            <div className="au-avatar" />
            <div className="au-team-meta">
              <h4 className="au-h4">Sustainability Editor</h4>
              <p className="au-body-sm">
                Investigations into circular fashion and ethical supply chains.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="au-cta">
        <div className="au-container au-cta-inner">
          <h3 className="au-h3">Join the list</h3>
          <p className="au-body">
            Weekly edits, exclusive interviews, and first look at drops.
          </p>
          <form
            className="au-cta-form"
            onSubmit={(e) => {
              e.preventDefault();
              // hook up to your newsletter endpoint
            }}
          >
            <input
              type="email"
              className="au-input"
              placeholder="Enter email address"
              required
            />
            <button className="au-btn au-btn-wine" type="submit">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
