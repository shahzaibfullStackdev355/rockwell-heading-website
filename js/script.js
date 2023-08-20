  // search-box open close js code
  let navbar = document.querySelector(".navbar");
  let searchBox = document.querySelector(".search-box .bx-search");


  
 // -----------------------------------nav bar fixed when scroll--------------------------------//

document.addEventListener("DOMContentLoaded", function(){
  window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        document.getElementById('navbar_top').classList.add('fixed-top');
        // add padding top to show content behind navbar
        navbar_height = document.querySelector('.navbar-fixed').offsetHeight;
        document.body.style.paddingTop = navbar_height + 'px';
      } else {
        document.getElementById('navbar_top').classList.remove('fixed-top');
         // remove padding top from body
        document.body.style.paddingTop = '0';
      } 
  });
}); 
// -----------------------------------nav bar fixed when scroll--------------------------------// 


  // let searchBoxCancel = document.querySelector(".search-box .bx-x");
  
//   searchBox.addEventListener("click", ()=>{
//     navbar.classList.toggle("showInput");
//     if(navbar.classList.contains("showInput")){
//       searchBox.classList.replace("bx-search" ,"bx-x");
//     }else {
//       searchBox.classList.replace("bx-x" ,"bx-search");
//     }
//   });
  
  // sidebar open close js code
  let navLinks = document.querySelector(".nav-links");
  let menuOpenBtn = document.querySelector(".navbar .bx-menu");
  let menuCloseBtn = document.querySelector(".nav-links .bx-x");
  menuOpenBtn.onclick = function() {
  navLinks.style.left = "0";
  }
  menuCloseBtn.onclick = function() {
  navLinks.style.left = "-100%";
  }
  
  
  // sidebar submenu open close js code
  let htmlcssArrow = document.querySelector(".htmlcss-arrow");
  htmlcssArrow.onclick = function() {
   navLinks.classList.toggle("show1");
  }
//   let moreArrow = document.querySelector(".more-arrow");
//   moreArrow.onclick = function() {
//    navLinks.classList.toggle("show2");
//   }
  let jsArrow = document.querySelector(".js-arrow");
  jsArrow.onclick = function() {
   navLinks.classList.toggle("show2");
  }

  let reactArrow = document.querySelector(".react-arrow");
  reactArrow.onclick = function() {
   navLinks.classList.toggle("show3");
  }
  





