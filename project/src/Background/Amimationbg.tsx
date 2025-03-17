import './Animation_BG.css';
import { useEffect, useRef } from "react";

const BGAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Set initial canvas size based on window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const halfx = canvas.width / 2;
    const halfy = canvas.height / 2;
    const dotCount = 200;
    const dots: Dot[] = Array.from({ length: dotCount }, () => new Dot(halfx, halfy));

    const render = () => {
      context.fillStyle = "#000000";
      context.fillRect(0, 0, canvas.width, canvas.height);
      dots.forEach(dot => {
        dot.draw(context, halfx, halfy);
        dot.move();
      });
      requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
};

class Dot {
  rad_x: number;
  rad_y: number;
  alpha: number;
  speed: number;
  size: number;
  color: number;

  constructor(halfx: number, halfy: number) {
    this.rad_x = 2 * Math.random() * halfx + 1;
    this.rad_y = 1.2 * Math.random() * halfy + 1;
    this.alpha = Math.random() * 360 + 1;
    this.speed = (Math.random() > 0.5 ? 1 : -1) * 0.1;
    this.size = Math.random() * 5 + 1;
    this.color = Math.floor(Math.random() * 256);
  }

  draw(context: CanvasRenderingContext2D, halfx: number, halfy: number) {
    const dx = halfx + this.rad_x * Math.cos((this.alpha / 180) * Math.PI);
    const dy = halfy + this.rad_y * Math.sin((this.alpha / 180) * Math.PI);
    context.fillStyle = `rgb(${this.color}, ${this.color}, ${this.color})`;
    context.fillRect(dx, dy, this.size, this.size);
  }

  move() {
    this.alpha += this.speed;
    this.color = Math.max(0, Math.min(255, this.color + (Math.random() > 0.5 ? 1 : -1)));
  }
}

export default BGAnimation;
