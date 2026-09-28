import React, { useEffect, useRef } from 'react';

export const WebGLBackground: React.FC<{ scrollY: number, theme: 'light' | 'dark' }> = ({ scrollY, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(scrollY);
  const themeRef = useRef(theme);

  // Keep refs updated dynamically without recreating WebGL context or shaders
  useEffect(() => {
    scrollRef.current = scrollY;
  }, [scrollY]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - (e.clientY / window.innerHeight)
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.warn("WebGL not supported, using fallback.");
      return;
    }

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_scroll;
      uniform float u_dark;

      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float ratio = u_resolution.x / u_resolution.y;
        uv.x *= ratio;

        vec2 p = uv * 3.0;
        p.y += u_scroll * 0.0005;
        
        for(int i=1; i<4; i++) {
          float fi = float(i);
          p.x += 0.3 / fi * sin(fi * p.y + u_time + u_mouse.x * 0.5);
          p.y += 0.3 / fi * cos(fi * p.x + u_time + u_mouse.y * 0.5);
        }

        // Palette blending based on theme
        vec3 darkBg = vec3(0.01, 0.02, 0.09);
        vec3 lightBg = vec3(0.97, 0.98, 1.0);
        
        vec3 color1 = mix(lightBg, darkBg, u_dark);
        
        vec3 darkAccent = vec3(0.95, 0.15, 0.32) * 0.08;
        vec3 lightAccent = vec3(0.95, 0.15, 0.32) * 0.02;
        vec3 color2 = mix(lightAccent, darkAccent, u_dark);

        float dist = 0.5 * sin(p.x + p.y) + 0.5;
        vec3 finalColor = mix(color1, color2, dist);

        float grain = noise(uv * u_time) * 0.02;
        finalColor += mix(grain, grain * 0.5, u_dark);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("Shader compilation failed:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) {
      console.warn("WebGL Shader loading failed. Falling back gracefully.");
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("WebGL Program linking failed:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    if (positionLoc >= 0) {
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    }

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const scrollLoc = gl.getUniformLocation(program, 'u_scroll');
    const darkLoc = gl.getUniformLocation(program, 'u_dark');

    let animationFrame: number;
    const render = (time: number) => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      gl.uniform1f(timeLoc, time * 0.0005);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(scrollLoc, scrollRef.current);
      gl.uniform1f(darkLoc, themeRef.current === 'dark' ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrame);
  }, []); // Run compile & setup EXACTLY ONCE on mount

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
    />
  );
};
