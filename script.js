"use strict";

const entrance = document.getElementById("entrance");
const enterButton = document.getElementById("enterButton");
const site = document.getElementById("site");
const header = document.getElementById("header");
const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");
const navLinks = document.querySelectorAll(".navigation a");
const accordionButtons = document.querySelectorAll(".accordion-button");
const revealElements = document.querySelectorAll(".reveal");

/* 입장 */
function enterArchive() {
  site.classList.add("visible");
  site.setAttribute("aria-hidden", "false");
  document.body.classList.remove("locked");

  window.scrollTo({
    top: 0,
    behavior: "auto"
  });

  requestAnimationFrame(() => {
    entrance.classList.add("hidden");
    startRevealObserver();
  });

  window.setTimeout(() => {
    entrance.style.display = "none";
  }, 950);
}

document.body.classList.add("locked");
enterButton.addEventListener("click", enterArchive);

/* 헤더 */
function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 30);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* 모바일 메뉴 */
function closeMenu() {
  menuButton.classList.remove("open");
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "메뉴 열기");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");

  menuButton.classList.toggle("open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/* 계급 아코디언 */
accordionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const content = button.nextElementSibling;

    if (!content || !content.classList.contains("accordion-content")) {
      return;
    }

    const panel = button.closest(".class-panel");
    const wasOpen = button.classList.contains("open");

    panel.querySelectorAll(".accordion-button.open").forEach((openedButton) => {
      openedButton.classList.remove("open");

      const openedContent = openedButton.nextElementSibling;

      if (openedContent) {
        openedContent.classList.remove("open");
      }
    });

    if (!wasOpen) {
      button.classList.add("open");
      content.classList.add("open");
    }
  });
});

/* 스크롤 등장 효과 */
let revealObserver;

function startRevealObserver() {
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px"
      }
    );
  }

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

/* 현재 메뉴 표시 */
const observedSections = document.querySelectorAll(
  "#world, #classes, #districts, #institutions, #artifacts"
);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => {
          const targetId = link.getAttribute("href").replace("#", "");

          link.classList.toggle(
            "active",
            targetId === entry.target.id
          );
        });
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0
    }
  );

  observedSections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

/* ESC로 메뉴 닫기 */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

/* 이미지 경로 오류 확인 */
document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    console.warn("이미지를 불러오지 못했습니다:", image.src);
  });
});
