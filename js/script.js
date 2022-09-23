const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');

const jump =() => {
 mario.classList.add('jump');

 setTimeout(() =>{
    mario.classList.remove('jump')
 },500);    
} 
const loop = setInterval(() =>{

  const pipeposition = pipe.offsetLeft;
  const marioposition = +window.getComputedStyle(mario).bottom.replace('px','');
  console.log(pipeposition);

  if (pipeposition <= 50   && pipeposition > 0  && marioposition < 90) {
 
   pipe.style.animation = 'none';
   pipe.style.left =`${pipeposition}px`;

   mario.style.animation = 'none';
   mario.style.bottom =`${pipeposition }px`;

    mario.src ='./img/gif-morto.gif';
   mario.style.width = '100px'
   mario.style.marginLeft ='5 px'
 
   clearInterval(loop )
 }
},15);

document.addEventListener('keydown', jump);

//menor ou igual <= 
//maior ou igual >=