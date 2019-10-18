import { TweenLite, TweenMax, Power0 } from 'gsap';
import CanvasComponent from './components/CanvasComponent';

TweenMax.staggerFromTo('.btn__start span', 1.5, { y: 100 }, { y: 0, ease: Power3.easeOut }, -0.08);

document.querySelector('.btn__start').addEventListener('click', () => {
    TweenLite.to('.btn__start', .5, { autoAlpha: 0 });
    new CanvasComponent();
})
