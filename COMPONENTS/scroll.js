const scrollLinks = document.querySelectorAll('a[href^="#"]');

scrollLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').slice(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const top = targetElement.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  });
});
