$(document).ready(function () {
	let menu = $('.menu');
	menu.on('click', (e) => {
		if (e.target.nodeName == 'A')
			return;

		menu.toggleClass('show');
		e.preventDefault();
		e.stopPropagation();
	});
});


document.addEventListener('scroll', function () {
	let header = document.querySelector('header');
	if (window.scrollY > 0) {
		header.classList.add('is-scrolling');
	} else {
		header.classList.remove('is-scrolling');
	}
});

document.addEventListener("DOMContentLoaded", () => {
	const header = document.querySelector("header");
	const containers = document.querySelectorAll("[data-bg]"); // Sélectionner tous les éléments avec data-bg
  
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
		threshold: [0, 1], 
	  }
	);
  
	containers.forEach((container) => observer.observe(container));
  });
  
  