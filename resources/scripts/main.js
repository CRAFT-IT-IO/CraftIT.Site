var button = document.querySelector(".hero-button");
var buttonText = document.querySelector(".button-text");
var svgArrow = document.querySelector(".svg-arrow");
var svgPath = document.querySelector(".arrow-path");
var callToAction = document.querySelector(".call-to-action");
var mainContent = document.querySelector("main");

document.addEventListener('scroll', function () {
  
  const header = document.querySelector('header');
  
  if (window.scrollY > 0) {
    header.classList.add('is-scrolling');
  } else {
    header.classList.remove('is-scrolling');
  }
});

// HERO ANIMATION TEXT

document.addEventListener("DOMContentLoaded", function () {
    // Sélectionner tous les éléments avec la classe 'scroll-fade'
    var textWrappers = document.querySelectorAll('.scroll-fade');

    // Parcourir chaque élément
    textWrappers.forEach(function (textWrapper) {
        // Récupérer le contenu avant et après le <br>
        var parts = textWrapper.innerHTML.split('<br>');

        // Fonction pour envelopper chaque mot dans une <div> et chaque lettre dans un <span>
        function wrapWordsInDiv(text) {
            return text.split(' ').map(word => {
                var wrappedLetters = word.split('').map(letter => `<span>${letter}</span>`).join('');
                return `<div class="hero-word">${wrappedLetters}</div>`; // Enveloppe chaque mot dans une <div>
            }).join(' ');
        }

        // Ajouter des <div> autour de chaque mot et des <span> autour de chaque lettre pour les parties avant et après le <br>
        var wrappedBefore = wrapWordsInDiv(parts[0]);
        var wrappedAfter = wrapWordsInDiv(parts[1]);

        // Réassembler le HTML avec les <div> autour de chaque mot
        textWrapper.innerHTML = `${wrappedBefore}<br>${wrappedAfter}`;

        // Anime chaque lettre à l'intérieur des mots
        anime.timeline({ loop: false })
            .add({
                targets: textWrapper.querySelectorAll('.hero-word span'),
                translateY: [50, 0], // Transition de bas en haut
                opacity: [0, 1],     // Fade-in progressif
                easing: "easeOutExpo",
                duration: 550,
                delay: (el, i) => 10 * i // Ajout d'un délai pour chaque lettre
            });
    });
});


// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Apply animation to elements with the 'disap' class
gsap.utils.toArray('.disap').forEach((element) => {
    gsap.fromTo(element,
        { opacity: 0, y: 20 }, // Start state: hidden and translated down
        {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out', // Ease for smooth transition
            scrollTrigger: {
                trigger: element,
                start: 'top 100%', // When the top of the element reaches 50% of the viewport, the animation starts
                toggleActions: 'play none none reverse', // Play when scrolling down, reverse when scrolling up
                onLeaveBack: () => {
                    gsap.to(element, { opacity: 1, y: 20, duration: 1, ease: 'power2.out' }); // Fade out on exit
                }
            }
        }
    );
});


// Initialisation de Lenis pour un défilement fluide
const lenis = new Lenis({
    smooth: true,
    lerp: 0.1, // Ajuste la fluidité (0.1 = très fluide, 0.5 = plus rapide)
  });
  
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  
  // Décomposition des mots dans chaque paragraphe
  document.querySelectorAll(".content_text").forEach((el) => {
    const html = el.innerHTML;
  
    // Séparer les parties par <br> (on garde les balises <br> en les réinsérant après traitement)
    const parts = html.split(/<br\s*\/?>/i);
  
    const wrapped = parts.map(part => {
      return part
        .trim()
        .split(" ")
        .map(word => `<span class="word">${word}</span>`)
        .join(" ");
    });
  
    el.innerHTML = wrapped.join("<br>");
  });

  
  // Animation GSAP pour les mots
  gsap.registerPlugin(ScrollTrigger);
  
  document.querySelectorAll(".content_text").forEach((el) => {
    const words = el.querySelectorAll(".word");
    gsap.from(words, {
      opacity: .1,
      y: 100, 
      stagger: 0.5, 
      duration: 1,
      ease: "power2.out",
      delay: 0.5, 
      scrollTrigger: {
        trigger: el, 
        start: "top 100%", 
        end: "top 40%", 
        scrub: true, 
      },
    });
  });

// HOVER DECODE EFFECT

const textElements = document.querySelectorAll(".coding");
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%!@#";

// Gestion caractère aléatoire
function randomChar() {
  return chars[Math.floor(Math.random() * chars.length)];
}

// Fonction de decoding 
function temporaryDecode(element, finalText) {
  let iterations = 0;

  const interval = setInterval(() => {
    element.innerText = finalText
      .split("")
      .map((char, i) => (i < iterations ? finalText[i] : randomChar()))
      .join("");

    if (iterations >= finalText.length) clearInterval(interval);
    iterations += 1;
  }, 50);
}

// Effet au hover 
textElements.forEach((element) => {
  const finalText = element.innerText;

  element.addEventListener("mouseenter", () => temporaryDecode(element, finalText));
  element.addEventListener("mouseleave", () => {
    element.innerText = finalText; 
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const sections = document.querySelectorAll(".section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bgColor = entry.target.getAttribute("data-bg");
          header.style.backgroundColor = bgColor;
        }
      });
    },
    {
      threshold: 0.5, // La section est considérée visible si 50% est dans le viewport
    }
  );

  sections.forEach((section) => observer.observe(section));
});