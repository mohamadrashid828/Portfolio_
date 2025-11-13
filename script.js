const root = document.documentElement;
const modeToggle = document.querySelector(".mode-toggle");
const modeIcon = modeToggle?.querySelector(".mode-icon");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const yearEl = document.getElementById("year");

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

function setTheme(theme) {
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
    if (modeIcon) {
      modeIcon.textContent = "🌙";
    }
  } else {
    root.removeAttribute("data-theme");
    if (modeIcon) {
      modeIcon.textContent = "☀️";
    }
  }
  localStorage.setItem("portfolio-theme", theme);
}

function detectTheme() {
  const saved = localStorage.getItem("portfolio-theme");
  if (saved) {
    setTheme(saved);
  } else if (prefersDark.matches) {
    setTheme("dark");
  } else {
    setTheme("light");
  }
}

modeToggle?.addEventListener("click", () => {
  const isDark = root.getAttribute("data-theme") === "dark";
  setTheme(isDark ? "light" : "dark");
});

prefersDark.addEventListener("change", (event) => {
  const saved = localStorage.getItem("portfolio-theme");
  if (!saved) {
    setTheme(event.matches ? "dark" : "light");
  }
});

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    }
  });
});

const setText = (id, text) => {
  if (typeof text !== "string") {
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    el.textContent = text;
  }
};

const populateHero = (hero = {}) => {
  if (!hero || typeof hero !== "object") return;

  if (hero.intro) setText("hero-intro", hero.intro);
  if (hero.title) setText("hero-title", hero.title);
  if (hero.copy) setText("hero-copy", hero.copy);
  if (hero.cardTitle) setText("hero-card-title", hero.cardTitle);

  const photoWrapper = document.getElementById("hero-photo-wrapper");
  const photoEl = document.getElementById("hero-photo");
  if (photoWrapper && photoEl) {
    if (hero.photo && hero.photo.src) {
      photoEl.src = hero.photo.src;
      photoEl.alt = hero.photo.alt || hero.title || "Portrait";
      
      // Apply flexible style options
      photoWrapper.classList.remove("circular", "portrait", "landscape");
      if (hero.photo.style) {
        photoWrapper.classList.add(hero.photo.style);
      }
      
      // Apply custom object position if specified
      if (hero.photo.objectPosition) {
        photoEl.style.objectPosition = hero.photo.objectPosition;
      }
      
      photoWrapper.hidden = false;
    } else {
      photoEl.removeAttribute("src");
      photoWrapper.hidden = true;
    }
  }

  const metrics = document.getElementById("hero-metrics");
  if (metrics && Array.isArray(hero.metrics)) {
    metrics.innerHTML = "";
    hero.metrics.forEach((metric = {}) => {
      if (!metric) return;
      const card = document.createElement("div");
      const value = document.createElement("span");
      value.className = "metric-value";
      value.textContent = metric.value != null ? String(metric.value) : "";
      const label = document.createElement("span");
      label.className = "metric-label";
      label.textContent = metric.label != null ? String(metric.label) : "";
      card.append(value, label);
      metrics.append(card);
    });
  }

  const exploring = document.getElementById("hero-exploring");
  if (exploring && Array.isArray(hero.exploring)) {
    exploring.innerHTML = "";
    hero.exploring.forEach((topic) => {
      const li = document.createElement("li");
      li.textContent = topic != null ? String(topic) : "";
      exploring.append(li);
    });
  }
};

const populateAbout = (about = {}) => {
  if (!about || typeof about !== "object") return;

  if (about.eyebrow) setText("about-eyebrow", about.eyebrow);
  if (about.heading) setText("about-heading", about.heading);
  if (about.summary) setText("about-summary", about.summary);

  const aboutWhoEl = document.getElementById("about-who");
  if (aboutWhoEl && about.who) {
    const highlight = aboutWhoEl.dataset.highlight;
    if (highlight && about.who.includes(highlight)) {
      const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedHighlight, "g");
      aboutWhoEl.innerHTML = about.who.replace(
        regex,
        `<span class="highlight">${highlight}</span>`
      );
    } else {
      aboutWhoEl.textContent = about.who;
    }
  }

  const bringList = document.getElementById("about-bring");
  if (bringList && Array.isArray(about.bring)) {
    bringList.innerHTML = "";
    about.bring.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item != null ? String(item) : "";
      bringList.append(li);
    });
  }

  const factsList = document.getElementById("about-facts");
  if (factsList && Array.isArray(about.facts)) {
    factsList.innerHTML = "";
    about.facts.forEach((fact = {}) => {
      const wrapper = document.createElement("div");
      const dt = document.createElement("dt");
      dt.textContent = fact.term != null ? String(fact.term) : "";
      const dd = document.createElement("dd");
      dd.textContent = fact.description != null ? String(fact.description) : "";
      wrapper.append(dt, dd);
      factsList.append(wrapper);
    });
  }
};

const populateSkills = (skills = {}) => {
  if (!skills || typeof skills !== "object") return;

  if (skills.eyebrow) setText("skills-eyebrow", skills.eyebrow);
  if (skills.heading) setText("skills-heading", skills.heading);

  const grid = document.getElementById("skills-grid");
  if (grid && Array.isArray(skills.groups)) {
    grid.innerHTML = "";
    skills.groups.forEach((group = {}) => {
      const article = document.createElement("article");
      article.className = "skills-card";

      const title = document.createElement("h3");
      title.textContent = group.title != null ? String(group.title) : "";
      article.append(title);

      if (Array.isArray(group.items)) {
        const ul = document.createElement("ul");
        ul.className = "skill-tags";
        group.items.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item != null ? String(item) : "";
          ul.append(li);
        });
        article.append(ul);
      }

      grid.append(article);
    });
  }
};

const populateExperience = (experience = {}) => {
  if (!experience || typeof experience !== "object") return;

  if (experience.eyebrow) setText("experience-eyebrow", experience.eyebrow);
  if (experience.heading) setText("experience-heading", experience.heading);

  const timeline = document.getElementById("timeline");
  if (timeline && Array.isArray(experience.items)) {
    timeline.innerHTML = "";
    experience.items.forEach((item = {}) => {
      const article = document.createElement("article");
      article.className = "timeline-item";

      const year = document.createElement("span");
      year.className = "timeline-year";
      year.textContent = item.year != null ? String(item.year) : "";
      article.append(year);

      const content = document.createElement("div");
      content.className = "timeline-content";

      const title = document.createElement("h3");
      title.textContent = item.title != null ? String(item.title) : "";
      content.append(title);

      if (item.description) {
        const description = document.createElement("p");
        description.textContent = item.description;
        content.append(description);
      }

      if (Array.isArray(item.bullets) && item.bullets.length) {
        const ul = document.createElement("ul");
        item.bullets.forEach((bullet) => {
          const li = document.createElement("li");
          li.textContent = bullet != null ? String(bullet) : "";
          ul.append(li);
        });
        content.append(ul);
      }

      article.append(content);
      timeline.append(article);
    });
  }
};

const populateProjects = (projects = {}) => {
  if (!projects || typeof projects !== "object") return;

  if (projects.eyebrow) setText("projects-eyebrow", projects.eyebrow);
  if (projects.heading) setText("projects-heading", projects.heading);
  if (projects.summary) setText("projects-summary", projects.summary);

  const grid = document.getElementById("projects-grid");
  if (grid && Array.isArray(projects.items)) {
    grid.innerHTML = "";
    projects.items.forEach((item = {}) => {
      const card = document.createElement("article");
      card.className = "project-card";

      const media = document.createElement("div");
      media.className = ["project-media", item.mediaClass]
        .filter(Boolean)
        .join(" ");
      if (item.image && item.image.src) {
        media.classList.add("has-image");
        const img = document.createElement("img");
        img.src = item.image.src;
        img.alt = item.image.alt || item.title || "Project preview";
        img.loading = "lazy";
        media.append(img);
      }
      card.append(media);

      const content = document.createElement("div");
      content.className = "project-content";

      const title = document.createElement("h3");
      title.textContent = item.title != null ? String(item.title) : "";
      content.append(title);

      if (item.description) {
        const description = document.createElement("p");
        description.textContent = item.description;
        content.append(description);
      }

      if (Array.isArray(item.tags) && item.tags.length) {
        const tagList = document.createElement("ul");
        tagList.className = "project-tags";
        item.tags.forEach((tag) => {
          const li = document.createElement("li");
          li.textContent = tag != null ? String(tag) : "";
          tagList.append(li);
        });
        content.append(tagList);
      }

      if (item.link && item.link.href) {
        const link = document.createElement("a");
        link.className = "text-link";
        link.href = item.link.href;
        link.textContent = item.link.label || "Learn more →";
        if (item.link.ariaLabel) {
          link.setAttribute("aria-label", item.link.ariaLabel);
        }
        content.append(link);
      }

      card.append(content);
      grid.append(card);
    });
  }
};

const populateHighlights = (highlights = {}) => {
  if (!highlights || typeof highlights !== "object") return;

  if (highlights.eyebrow) setText("highlights-eyebrow", highlights.eyebrow);
  if (highlights.heading) setText("highlights-heading", highlights.heading);

  const grid = document.getElementById("highlights-grid");
  if (grid && Array.isArray(highlights.items)) {
    grid.innerHTML = "";
    highlights.items.forEach((item = {}) => {
      const figure = document.createElement("figure");
      figure.className = "testimonial-card";

      if (item.quote) {
        const blockquote = document.createElement("blockquote");
        blockquote.textContent = item.quote;
        figure.append(blockquote);
      }

      if (item.caption) {
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = item.caption;
        figure.append(figcaption);
      }

      grid.append(figure);
    });
  }
};

const populateContact = (contact = {}) => {
  if (!contact || typeof contact !== "object") return;

  if (contact.eyebrow) setText("contact-eyebrow", contact.eyebrow);
  if (contact.heading) setText("contact-heading", contact.heading);
  if (contact.summary) setText("contact-summary", contact.summary);

  const emailLink = document.getElementById("contact-email");
  if (emailLink && contact.email) {
    emailLink.href = `mailto:${contact.email}`;
    emailLink.textContent = contact.email;
  }

  const phoneLink = document.getElementById("contact-phone");
  if (phoneLink && contact.phone) {
    const telHref =
      contact.phoneHref ||
      contact.phone.replace(/[^+\d]/g, "");
    phoneLink.href = `tel:${telHref}`;
    phoneLink.textContent = contact.phone;
  }

  const linkedinLink = document.getElementById("contact-linkedin");
  if (linkedinLink && contact.linkedin) {
    linkedinLink.href = contact.linkedin.url || linkedinLink.href;
    linkedinLink.textContent = contact.linkedin.label || linkedinLink.textContent;
  }

  const resumeLink = document.getElementById("contact-resume");
  if (resumeLink && contact.resume) {
    resumeLink.href = contact.resume.file || resumeLink.getAttribute("href");
    resumeLink.textContent = contact.resume.label || resumeLink.textContent;
  }
};

const loadContent = async () => {
  if (typeof fetch !== "function") return;

  try {
    const response = await fetch("data/content.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const content = await response.json();
    populateHero(content.hero);
    populateAbout(content.about);
    populateSkills(content.skills);
    populateExperience(content.experience);
    populateProjects(content.projects);
    populateHighlights(content.highlights);
    populateContact(content.contact);
  } catch (error) {
    console.error("Failed to load portfolio content.json", error);
    if (window.location.protocol === "file:") {
      console.info(
        "Tip: Run a local server (e.g., `python3 -m http.server`) to preview dynamic content."
      );
    }
  }
};

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

detectTheme();
loadContent();

