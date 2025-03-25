
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Timeline principale pour l'animation GSAP
  let masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.container-outer-box',
      start: 'top center',
      end: 'bottom center',
      scrub: false,
      markers: false
    }
  });

  masterTimeline
    .to('.svg-wrapper1', { opacity: 1, duration: 0.6, ease: 'power1.out' })
    .to('.svg-wrapper2', { opacity: 1, duration: 0.5, ease: 'power1.out' })
    .to('.svg-c-dot-layer', { y: 50, duration: 0.5, ease: 'power1.out' }, "<")
    .to('.svg-text-wrapper2', { y: 0, duration: 0.5, ease: 'power1.out' }, "<")
    .to('.svg-wrapper3', { opacity: 1, duration: 0.5, ease: 'power1.out' })
    .to('.svg-text-wrapper3', { y: -50, duration: 0.5, ease: 'power1.out' }, "<")
    .to('.svg-c-dot-layer', { y: 50, duration: 0.5, ease: 'power1.out' }, "<");

  // Interaction dynamique avec les sections d'approche
  const approachSections = document.querySelectorAll('.approach');
  const svgLayers = [
    document.querySelector('.svg-c-dot-layer'),
    document.querySelector('.svg-text-wrapper2'),
    document.querySelector('.svg-text-wrapper3')
  ];

  const scaleActive = 1.1;
  const opacityInactive = 0.1;

  // Enregistrement des positions initiales
  let originalTransforms = svgLayers.map(layer => layer.style.transform || window.getComputedStyle(layer).transform);

  // Fonction d'animation au survol
  function animateLayer(index, activate) {
    svgLayers.forEach((layer, i) => {
      if (i === index) {
        gsap.to(layer, {
          scale: activate ? scaleActive : 1,
          opacity: 1,
          zIndex: activate ? 10 : 1,
          duration: 0.3
        });
      } else {
        gsap.to(layer, {
          opacity: activate ? opacityInactive : 1,
          scale: 1,
          zIndex: 1,
          duration: 0.3
        });
      }
    });
  }

  // Ajout des événements sur chaque section
  approachSections.forEach((section, index) => {
    section.addEventListener('mouseenter', () => animateLayer(index, true));
    section.addEventListener('mouseleave', () => animateLayer(index, false));
  });
});