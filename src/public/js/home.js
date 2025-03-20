console.log("Home frontend javascript file");

document.addEventListener("DOMContentLoaded", () => {
  // Animation for the cards
  anime({
    targets: ".card",
    translateY: function (el, i) {
      return anime.random(-30, 30);
    },
    translateX: function (el, i) {
      return anime.random(-30, 30);
    },
    scale: function (el, i) {
      return anime.random(0.8, 1.2);
    },
    rotate: function () {
      return anime.random(-15, 15);
    },
    boxShadow: function () {
      const color = `rgba(${anime.random(0, 255)}, ${anime.random(
        0,
        255
      )}, ${anime.random(0, 255)}, 0.4)`;
      return `0 5px 15px ${color}`;
    },
    duration: 3000,
    delay: anime.stagger(200),
    direction: "alternate",
    loop: true,
    easing: "easeInOutQuad",
  });

  // Animation for the welcome text
  anime({
    targets: ".welcome-text h1, .welcome-text p",
    opacity: [0, 1],
    translateY: [20, 0],
    delay: anime.stagger(300),
    duration: 1500,
    easing: "easeOutExpo",
  });
});
