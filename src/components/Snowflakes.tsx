import { useEffect, useRef } from "react";

interface Snowflake {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number;
}

export const Snowflakes = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const nextIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajustar tamanho do canvas para a janela
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Criar um novo floco de neve
    const createSnowflake = (): Snowflake => {
      return {
        id: nextIdRef.current++,
        x: Math.random() * canvas.width,
        y: -10,
        size: Math.random() * 3 + 1, // Tamanho entre 1 e 4
        speed: Math.random() * 2 + 1, // Velocidade entre 1 e 3
        opacity: Math.random() * 0.5 + 0.5, // Opacidade entre 0.5 e 1
        drift: Math.random() * 0.5 - 0.25, // Deriva horizontal entre -0.25 e 0.25
      };
    };

    // Inicializar alguns flocos
    const initialCount = 50;
    for (let i = 0; i < initialCount; i++) {
      const flake = createSnowflake();
      flake.y = Math.random() * canvas.height; // Começar em posições aleatórias
      snowflakesRef.current.push(flake);
    }

    // Função de animação
    const animate = (currentTime: number) => {
      // Limitar a 60 FPS
      const deltaTime = currentTime - lastTimeRef.current;
      if (deltaTime < 16.67) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = currentTime;

      // Limpar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Atualizar e desenhar flocos
      const activeFlakes: Snowflake[] = [];

      for (const flake of snowflakesRef.current) {
        // Atualizar posição
        flake.y += flake.speed;
        flake.x += flake.drift;

        // Adicionar movimento oscilante
        flake.x += Math.sin(flake.y * 0.01) * 0.3;

        // Verificar se o floco ainda está visível
        if (
          flake.y < canvas.height + 10 &&
          flake.x > -10 &&
          flake.x < canvas.width + 10
        ) {
          activeFlakes.push(flake);

          // Desenhar floco
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
          ctx.fill();
        }
        // Se o floco saiu da tela, ele não será adicionado ao activeFlakes
        // e será automaticamente removido da memória
      }

      // Substituir array antigo pelo novo (limpeza de memória)
      snowflakesRef.current = activeFlakes;

      // Adicionar novos flocos no topo para manter o efeito contínuo
      const targetCount = 100;
      if (snowflakesRef.current.length < targetCount) {
        const flakesToAdd = targetCount - snowflakesRef.current.length;
        for (let i = 0; i < flakesToAdd; i++) {
          snowflakesRef.current.push(createSnowflake());
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Iniciar animação
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Limpar referências
      snowflakesRef.current = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      style={{ background: "transparent" }}
    />
  );
};

