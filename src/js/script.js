const menuToggler = document.querySelector(".menu-btn");
const header = document.querySelector(".header");

const links = document.querySelectorAll('a:link');

menuToggler.addEventListener('click', () => {
    header.classList.toggle("nav--open");
})

links.forEach(function(link){
   link.addEventListener("click", function(event){
        event.preventDefault();
        const href = link.getAttribute('href');

        if(href === "#") {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
        }
        else if (href !== "#" && href.startsWith('#')){
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: "smooth"
            });
            
        }
        if(header.classList.contains("nav--open")) {
            header.classList.remove("nav--open");
        }
   })
})