import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { GCodeLoader } from 'three/examples/jsm/loaders/GCodeLoader.js';
import {
  RotateCw,
  Box,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Layers,
  MousePointer,
  HelpCircle
} from 'lucide-react';

export interface ModelMetrics {
  width: number;
  depth: number;
  height: number;
  volumeCm3: number;
  triangles: number;
  fitsK1Max: boolean;
}

interface ModelViewer3DProps {
  file: File;
  filamentColorHex?: string;
  onMetricsCalculated?: (metrics: ModelMetrics) => void;
}

export const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  file,
  filamentColorHex = '#0284c7',
  onMetricsCalculated
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const chamberBoxRef = useRef<THREE.BoxHelper | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [showChamber, setShowChamber] = useState<boolean>(true);

  // Aktualizacja koloru filamentu na załadowanym modelu
  useEffect(() => {
    if (!modelRef.current) return;
    const color = new THREE.Color(filamentColorHex);
    modelRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              if ('color' in mat) (mat as THREE.MeshStandardMaterial).color.set(color);
            });
          } else if ('color' in mesh.material) {
            (mesh.material as THREE.MeshStandardMaterial).color.set(color);
          }
        }
      }
    });
  }, [filamentColorHex]);

  // Przełączanie wireframe
  useEffect(() => {
    if (!modelRef.current) return;
    modelRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              if ('wireframe' in mat) (mat as THREE.MeshStandardMaterial).wireframe = isWireframe;
            });
          } else if ('wireframe' in mesh.material) {
            (mesh.material as THREE.MeshStandardMaterial).wireframe = isWireframe;
          }
        }
      }
    });
  }, [isWireframe]);

  // Przełączanie widoczności komory 300x300x300 mm
  useEffect(() => {
    if (chamberBoxRef.current) {
      chamberBoxRef.current.visible = showChamber;
    }
  }, [showChamber]);

  // Auto rotacja
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
    }
  }, [isAutoRotating]);

  // Reset kamery do optymalnego rzutu
  const resetCamera = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current || !metrics) return;
    const maxDim = Math.max(metrics.width, metrics.depth, metrics.height, 60);
    const targetY = metrics.height / 2;

    cameraRef.current.position.set(maxDim * 1.4, maxDim * 1.1 + targetY, maxDim * 1.5);
    cameraRef.current.lookAt(0, targetY, 0);
    controlsRef.current.target.set(0, targetY, 0);
    controlsRef.current.update();
  }, [metrics]);

  // Główna logika ładowania i Three.js
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDisposed = false;
    setIsLoading(true);
    setLoadError(null);
    setMetrics(null);

    // Czyszczenie poprzednich instancji
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x030712); // slate-950

    // 2. Camera
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 360;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(180, 160, 220);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 1.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Nie pozwól zejść pod stół roboczy
    controls.minDistance = 20;
    controls.maxDistance = 900;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(200, 300, 200);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.0); // Błękitne światło konturowe
    dirLight2.position.set(-200, 150, -200);
    scene.add(dirLight2);

    const bottomGlow = new THREE.DirectionalLight(0x1e3a8a, 0.4);
    bottomGlow.position.set(0, -100, 0);
    scene.add(bottomGlow);

    // 6. Stół roboczy Creality K1 Max (300 x 300 mm)
    // Siatka pomocnicza: 300mm, 30 podziałek = co 10mm
    const grid = new THREE.GridHelper(300, 30, 0x06b6d4, 0x1e293b);
    grid.position.y = 0;
    scene.add(grid);

    // Płytka stołu roboczego
    const bedGeo = new THREE.PlaneGeometry(300, 300);
    const bedMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.85,
      metalness: 0.1,
    });
    const bedMesh = new THREE.Mesh(bedGeo, bedMat);
    bedMesh.rotation.x = -Math.PI / 2;
    bedMesh.position.y = -0.1;
    bedMesh.receiveShadow = true;
    scene.add(bedMesh);

    // Klatka reprezentująca maksymalną przestrzeń roboczą K1 Max: 300x300x300 mm
    const chamberGeo = new THREE.BoxGeometry(300, 300, 300);
    const chamberEdges = new THREE.EdgesGeometry(chamberGeo);
    const chamberLine = new THREE.LineSegments(
      chamberEdges,
      new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.25 })
    );
    chamberLine.position.set(0, 150, 0);
    chamberLine.visible = showChamber;
    scene.add(chamberLine);
    chamberBoxRef.current = chamberLine as unknown as THREE.BoxHelper;

    // 7. Ładowanie pliku
    const fileName = file.name.toLowerCase();
    const reader = new FileReader();

    const handleLoadedObject = (object: THREE.Object3D, triangleCount: number = 0) => {
      if (isDisposed) return;

      // Wyliczanie bounding box
      const box = new THREE.Box3().setFromObject(object);
      const size = new THREE.Vector3();
      box.getSize(size);

      // Centrowanie obiektu: spód na y=0, środek X/Z w punkcie (0,0)
      const center = new THREE.Vector3();
      box.getCenter(center);
      object.position.x -= center.x;
      object.position.z -= center.z;
      object.position.y -= box.min.y;

      scene.add(object);
      modelRef.current = object;

      // Obliczenia metryk
      const widthMm = Math.round(size.x * 10) / 10;
      const depthMm = Math.round(size.z * 10) / 10;
      const heightMm = Math.round(size.y * 10) / 10;
      const fits = widthMm <= 300 && depthMm <= 300 && heightMm <= 300;

      // Przybliżona objętość bryły w cm³ (z uwzględnieniem orientacyjnego wypełnienia bryły 35-50% bounding box)
      const boundingVolCm3 = (widthMm * depthMm * heightMm) / 1000;
      const approxVol = Math.max(1, Math.round(boundingVolCm3 * 0.42 * 10) / 10);

      const calculatedMetrics: ModelMetrics = {
        width: widthMm,
        depth: depthMm,
        height: heightMm,
        volumeCm3: approxVol,
        triangles: triangleCount,
        fitsK1Max: fits
      };

      setMetrics(calculatedMetrics);
      onMetricsCalculated?.(calculatedMetrics);
      setIsLoading(false);

      // Dopasowanie pozycji kamery
      const maxDim = Math.max(widthMm, depthMm, heightMm, 60);
      const targetY = heightMm / 2;
      camera.position.set(maxDim * 1.4, maxDim * 1.1 + targetY, maxDim * 1.5);
      camera.lookAt(0, targetY, 0);
      controls.target.set(0, targetY, 0);
      controls.update();
    };

    // Tworzenie standardowego materiału filamentu
    const createFilamentMaterial = () => {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(filamentColorHex),
        roughness: 0.35,
        metalness: 0.15,
        wireframe: isWireframe
      });
    };

    try {
      if (fileName.endsWith('.stl')) {
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
          if (isDisposed || !e.target?.result) return;
          try {
            const loader = new STLLoader();
            const geometry = loader.parse(e.target.result as ArrayBuffer);
            geometry.computeVertexNormals();

            const triangles = geometry.attributes.position
              ? geometry.attributes.position.count / 3
              : 0;

            const material = createFilamentMaterial();
            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            handleLoadedObject(mesh, Math.round(triangles));
          } catch (err) {
            setLoadError('Nie udało się przetworzyć pliku STL. Upewnij się, że plik nie jest uszkodzony.');
            setIsLoading(false);
          }
        };
      } else if (fileName.endsWith('.obj')) {
        reader.readAsText(file);
        reader.onload = (e) => {
          if (isDisposed || !e.target?.result) return;
          try {
            const loader = new OBJLoader();
            const obj = loader.parse(e.target.result as string);
            let totalTriangles = 0;

            const defaultMat = createFilamentMaterial();
            obj.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.material = defaultMat;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                if (mesh.geometry) {
                  mesh.geometry.computeVertexNormals();
                  if (mesh.geometry.attributes.position) {
                    totalTriangles += mesh.geometry.attributes.position.count / 3;
                  }
                }
              }
            });
            handleLoadedObject(obj, Math.round(totalTriangles));
          } catch (err) {
            setLoadError('Nie udało się przetworzyć pliku OBJ.');
            setIsLoading(false);
          }
        };
      } else if (fileName.endsWith('.3mf')) {
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
          if (isDisposed || !e.target?.result) return;
          try {
            const loader = new ThreeMFLoader();
            const group = loader.parse(e.target.result as ArrayBuffer);
            let totalTriangles = 0;

            const defaultMat = createFilamentMaterial();
            group.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                if (!mesh.material) mesh.material = defaultMat;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                if (mesh.geometry && mesh.geometry.attributes.position) {
                  totalTriangles += mesh.geometry.attributes.position.count / 3;
                }
              }
            });
            handleLoadedObject(group, Math.round(totalTriangles));
          } catch (err) {
            setLoadError('Nie udało się przetworzyć pliku 3MF.');
            setIsLoading(false);
          }
        };
      } else if (fileName.endsWith('.ply')) {
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
          if (isDisposed || !e.target?.result) return;
          try {
            const loader = new PLYLoader();
            const geometry = loader.parse(e.target.result as ArrayBuffer);
            geometry.computeVertexNormals();
            const triangles = geometry.attributes.position ? geometry.attributes.position.count / 3 : 0;
            const mesh = new THREE.Mesh(geometry, createFilamentMaterial());
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            handleLoadedObject(mesh, Math.round(triangles));
          } catch (err) {
            setLoadError('Nie udało się przetworzyć pliku PLY.');
            setIsLoading(false);
          }
        };
      } else if (fileName.endsWith('.gcode')) {
        reader.readAsText(file);
        reader.onload = (e) => {
          if (isDisposed || !e.target?.result) return;
          try {
            const loader = new GCodeLoader();
            const gcodeObj = loader.parse(e.target.result as string);
            handleLoadedObject(gcodeObj, 0);
          } catch (err) {
            setLoadError('Nie udało się wyrenderować ścieżek GCODE.');
            setIsLoading(false);
          }
        };
      } else {
        // Inne formaty (np. .step)
        setLoadError(
          'Format ' + file.name.split('.').pop()?.toUpperCase() + ' to parametryczny format CAD. Przed podglądem wyeksportuj model do .STL, .OBJ lub .3MF.'
        );
        setIsLoading(false);
      }
    } catch (err) {
      setLoadError('Błąd podczas odczytu pliku.');
      setIsLoading(false);
    }

    // 8. Pętla renderowania
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 9. Obsługa zmiany rozmiaru
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 360;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Czyszczenie zasobów przy odmontowaniu
    return () => {
      isDisposed = true;
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [file]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/90 shadow-2xl">
      
      {/* Pasek narzędziowy / telemetryczny 3D na górze */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        
        {/* Lewy badge: format i status */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-cyan-400 font-mono text-xs font-bold uppercase shadow-lg backdrop-blur-md flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5" />
            <span>.{file.name.split('.').pop()}</span>
          </span>

          {metrics && (
            <span
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium backdrop-blur-md shadow-lg flex items-center gap-1.5 ${
                metrics.fitsK1Max
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/80 border-amber-500/40 text-amber-300'
              }`}
            >
              {metrics.fitsK1Max ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Mieści się w K1 Max (300×300×300 mm)</span>
                  <span className="sm:hidden">Pole OK</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Przekracza pole 300 mm!</span>
                </>
              )}
            </span>
          )}
        </div>

        {/* Prawe przyciski kontroli widoku */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/80 border border-slate-700/80 rounded-xl p-1 shadow-lg backdrop-blur-md">
          {/* Przełącznik rotacji */}
          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-1.5 rounded-lg transition-all ${
              isAutoRotating
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={isAutoRotating ? 'Zatrzymaj obrót (Auto-rotate)' : 'Włącz płynny obrót'}
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Przełącznik siatki (Wireframe) */}
          <button
            type="button"
            onClick={() => setIsWireframe(!isWireframe)}
            className={`p-1.5 rounded-lg transition-all ${
              isWireframe
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Siatka trójkątów (Wireframe)"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Przełącznik komory 300x300x300 mm */}
          <button
            type="button"
            onClick={() => setShowChamber(!showChamber)}
            className={`p-1.5 rounded-lg transition-all ${
              showChamber
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Pokaż obrys komory K1 Max (300 mm³)"
          >
            <Box className="w-4 h-4" />
          </button>

          {/* Reset kamery */}
          <button
            type="button"
            onClick={resetCamera}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Wycentruj kamerę"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Kontener canvas Three.js */}
      <div
        ref={containerRef}
        className="w-full h-80 sm:h-96 cursor-grab active:cursor-grabbing bg-radial from-slate-900 to-slate-950"
      />

      {/* Stan ładowania */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-sm font-medium text-slate-200">Przetwarzanie geometrii 3D...</p>
          <span className="text-xs text-slate-400">Generowanie buforów w Three.js</span>
        </div>
      )}

      {/* Stan błędu lub nieobsługiwanego formatu */}
      {loadError && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white mb-2">Podgląd niedostępny</h4>
          <p className="text-xs text-slate-300 max-w-md leading-relaxed mb-4">
            {loadError}
          </p>
          <p className="text-[11px] text-slate-500">
            Obsługiwane w podglądzie interaktywnym: <strong>.STL, .OBJ, .3MF, .PLY, .GCODE</strong>
          </p>
        </div>
      )}

      {/* Dolny pasek parametrów modelu (HUD) */}
      {metrics && !loadError && (
        <div className="p-3.5 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Wymiary modelu X x Y x Z */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-300 font-mono">
              <span className="text-[11px] text-slate-500 font-sans">Wymiary:</span>
              <span className="text-cyan-400 font-semibold">{metrics.width}</span>
              <span className="text-slate-600">×</span>
              <span className="text-cyan-400 font-semibold">{metrics.depth}</span>
              <span className="text-slate-600">×</span>
              <span className="text-cyan-400 font-semibold">{metrics.height}</span>
              <span className="text-slate-400 text-[10px]">mm</span>
            </div>

            <div className="hidden md:flex items-center gap-1 text-slate-400 font-mono text-[11px] pl-3 border-l border-slate-800">
              <span className="text-slate-500 font-sans">Objętość:</span>
              <span className="text-slate-200 font-semibold">~{metrics.volumeCm3} cm³</span>
            </div>

            {metrics.triangles > 0 && (
              <div className="hidden lg:flex items-center gap-1 text-slate-400 font-mono text-[11px] pl-3 border-l border-slate-800">
                <span className="text-slate-500 font-sans">Trójkąty:</span>
                <span className="text-slate-200 font-semibold">{metrics.triangles.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Podpowiedź sterowania myszą */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
            <MousePointer className="w-3.5 h-3.5 text-slate-400" />
            <span>LPM: Obrót • PPM: Przesunięcie • Scroll: Zoom</span>
          </div>

        </div>
      )}

    </div>
  );
};
