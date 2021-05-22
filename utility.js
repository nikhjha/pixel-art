const photoSelection = document.getElementById("photo-selection");
const effectSelection = document.getElementById("effect-selection");
const greyscaleSelection = document.getElementsByClassName("greyscale")[0];
const particleSelection = document.getElementsByClassName("particle")[0];
const form = document.getElementById("rgb");
const nav = document.getElementById('nav');

let photoSelected = null;
let effectSelected = null;
let rgb = null;
let particleColor = null;
let isStarted = false;

const animateDiv = (
  card,
  titleTranslation,
  contentTranslation,
  content2Translation
) => {
  let selectedCard;
  if (card === "0") {
    selectedCard = photoSelection;
  } else {
    selectedCard = effectSelection;
  }
  const title = selectedCard.firstElementChild;
  const content = selectedCard.children[1];
  if (titleTranslation === "-50%") {
    title.style.animation = "up var(--speed) linear 0s normal forwards";
  } else if (titleTranslation === "0%") {
    title.style.animation = "down var(--speed) linear 0s normal forwards";
  }
  title.style.transform = "translateY(" + titleTranslation + ")";
  content.style.transform = "translateY(" + contentTranslation + ")";
  if (card === "1") {
    const content2 = selectedCard.children[2];
    if(contentTranslation === '-50%'){
        content2.style.transitionDelay = "1s";
    }else{
        content2.style.transitionDelay = "0s";
    }
    content2.style.transform = "translateY(" + content2Translation + ")";
  }
};

const canvasConfig = () => {
    nav.style.display = 'none';
    const photo = new Image();
    if(photoSelected === 'ghost'){
        photo.src = images.ghost;
    }else if(photoSelected === 'ghost1'){
        photo.src = images.ghost1;
    }else{
        photo.src = images.ghost2;
    }
    photo.addEventListener('load', ()=>{
        if(effectSelected === 'greyscale'){
            pixelManipulation(photo,'0',rgb,null);
        }else{
            pixelManipulation(photo,'1',null,particleColor);
        }
    });
}

const startCanvas = () => {
    isStarted = true;
    setTimeout(()=>{canvasConfig()},1500);
};

const optionClicked = (e) => {
  const input = e.target.firstElementChild;
  if(!input){
      return;
  }
  if (input.name === "title") {
    animateDiv(input.value, "-50%", "+50%", "0%");
  } else if (input.name === "photo-option") {
    photoSelected = input.value;
    animateDiv("0", "0%", "0%", "0%");
    if (effectSelected && (rgb || particleColor)) {
      startCanvas();
    } else {
      animateDiv("1", "-50%", "50%", "0%");
    }
  } else if (input.name === "effect-option") {
    const content2 = effectSelection.children[2];
    if (content2.firstElementChild) {
      content2.removeChild(content2.firstElementChild);
    }
    if (input.value === "0") {
      content2.appendChild(greyscaleSelection);
      effectSelected = "greyscale";
    } else {
      content2.appendChild(particleSelection);
      effectSelected = "particle";
    }
    animateDiv("1", "-50%", "-50%", "50%");
  } else if (input.name === "greyscale-effect") {
    rgb = [0, 0, 0];
    rgb[0] = form.elements[0].value ? form.elements[0].value : 0;
    rgb[1] = form.elements[1].value ? form.elements[1].value : 0;
    rgb[2] = form.elements[2].value ? form.elements[2].value : 0;
    if (photoSelected) {
      animateDiv("1", "0%", "0%", "0%");
      startCanvas();
    } else {
      animateDiv("1", "0%", "0%", "0%");
      animateDiv("0", "-50%", "50%", "0%");
    }
  } else if (input.name === "particle-effect-option") {
    particleColor = input.value;
    if (photoSelected) {
      animateDiv("1", "0%", "0%", "0%");
      startCanvas();
    } else {
      animateDiv("1", "0%", "0%", "0%");
      animateDiv("0", "-50%", "50%", "0%");
    }
  }
};

const options = document.querySelectorAll(".option");
options.forEach((option) => {
  option.addEventListener("click", optionClicked);
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  rgb = [0, 0, 0];
  rgb[0] = form.elements[0].value ? form.elements[0].value : 0;
  rgb[1] = form.elements[1].value ? form.elements[1].value : 0;
  rgb[2] = form.elements[2].value ? form.elements[2].value : 0;
  if (photoSelected) {
    animateDiv("1", "0%", "0%", "0%");
    startCanvas();
  } else {
    animateDiv("1", "0%", "0%", "0%");
    animateDiv("0", "-50%", "50%", "0%");
  }
});

window.addEventListener('resize', () => {
  if(isStarted){
    window.location.reload();
  }
})
