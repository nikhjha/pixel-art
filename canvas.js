
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
// const photo = new Image();
// photo.src = images.ghost2;

const greyScaleImage = (photo,r,g,b) => {
    const picRatio = photo.width/photo.height;
    ctx.drawImage(photo,0,0,canvas.height*picRatio, canvas.height);
    let imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    let mappedData = imageData.data;
    //Iterating through coloum
    for(let i = 0; i < 4*canvas.width*canvas.height; i = i + 4*canvas.width){
        //Iterating through row
        for(let j = i; j < i+4*canvas.width; j+=4){
            //Getting 4 rgba property of single pixel
            const red = imageData.data[j];
            const green = imageData.data[j+1];
            const blue = imageData.data[j+2];
            const avarage = (red+green+blue)/3;
            mappedData[j] = avarage+r;
            mappedData[j+1] = avarage+g;
            mappedData[j+2] = avarage+b;
        }
    }
    imageData.data = mappedData;
    ctx.putImageData(imageData,0,0);

}

const analyzeImage = (photo) => {
    const picRatio = photo.width/photo.height;
    ctx.drawImage(photo,0,0,canvas.height*picRatio, canvas.height);
    let imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    let mappedData = [];
    //Iterating through coloum
    const determineBrightness = (red,green,blue) => {
        return Math.sqrt(0.299*red*red + 0.587*green*green + 0.114*blue*blue)/100;
    }
    for(let i = 0; i < 4*canvas.width*canvas.height; i = i + 4*canvas.width){
        //Iterating through row
        let row = [];
        for(let j = i; j < i+4*canvas.width; j+=4){
            //Getting 4 rgba property of single pixel
            const red = imageData.data[j];
            const green = imageData.data[j+1];
            const blue = imageData.data[j+2];
            const avarage = (red+green+blue)/3;
            const brightness = determineBrightness(red,green,blue);
            const cell = {
                color : 'rgb('+red+','+green+','+blue+')',
                avarage : avarage,
                brightness : brightness
            }
            row.push(cell);
        }
        mappedData.push(row);
    }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    return mappedData;
}

class Particle {
    constructor(width){
        this.maxX = width;
        this.x = Math.random()*this.maxX;
        this.y = 0;
        this.size = Math.random()*1.5+1;
        this.velocityFunc = () => {
            return {
                y : Math.random()*0.5,
                x : 0
            }
        }
        this.velocity = this.velocityFunc();
        this.brightness = 0;
        this.movementFunc = ()=>{
            return{
                y : (2.5 - this.brightness)+this.velocity.y,
                x : 0 
            }
        }
        this.movement = this.movementFunc();
        this.positionFunc = () => {
            return {
                y : Math.floor(this.y),
                x : Math.floor(this.x)
            }
        }
        this.position = this.positionFunc();
    }
    update(scannedData){
        this.position = this.positionFunc();
        this.brightness = scannedData[this.position.y][this.position.x].brightness;
        this.movement = this.movementFunc();
        this.y += this.movement.y;
        this.x += this.movement.x;
        if(this.y >= canvas.height || this.x >= canvas.width){
            this.y = 0;
            this.x = Math.random()*this.maxX;
        }
    }
    draw(scannedData,colorType){
        ctx.beginPath();
        if(colorType === '0'){
            ctx.fillStyle = 'white';
        }
        else{
            ctx.fillStyle = scannedData[this.position.y][this.position.x].color;
        }
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fill();
    }
}

const init = (numberOfParticles,photo) => {
    let particleArray = [];
    let width = photo.width/photo.height*canvas.height;
    if(width >= canvas.width){
        width = canvas.width;
    }
    for(let i = 0; i<numberOfParticles; i++){
        particleArray.push(new Particle(width));
    }
    return particleArray;
}

const animate = (particleArray,scannedData,colorType) => {
    // const picRatio = photo.width/photo.height;
    // ctx.drawImage(photo,0,0,canvas.height*picRatio, canvas.height);
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.globalAlpha = 0.2;
    for(let i = 0; i<particleArray.length; i++){
        particleArray[i].update(scannedData);
        ctx.globalAlpha = particleArray[i].brightness*0.5;
        particleArray[i].draw(scannedData,colorType);
    }
    requestAnimationFrame(()=>{animate(particleArray,scannedData,colorType)});
}

const pixelManipulation = (photo,effectType,rgb,particleColor) => {
    if(effectType === '0'){
        greyScaleImage(photo,rgb[0]-'0',rgb[1]-'0',rgb[2]-'0');
    }else{
        const scannedData = analyzeImage(photo);
        let particleArray = init(6000,photo);
        animate(particleArray,scannedData,particleColor);
    }
}

// photo.addEventListener('load', ()=>{
//     pixelManipulation("0",[0,80,0],null);
// })