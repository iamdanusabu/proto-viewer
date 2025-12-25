import { useState, useEffect, useRef } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Editor from "@monaco-editor/react";
import { DeviceFrame } from "@/components/DeviceFrame";
import { Header } from "@/components/Header";
import { useCreatePrototype } from "@/hooks/use-prototypes";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_CODE = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 40px 24px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #000;
      color: #fff;
      min-height: 100vh;
    }
    .card {
      background: linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%);
      border-radius: 24px;
      padding: 32px;
      margin-top: 24px;
      box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
    }
    h1 { font-size: 32px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
    p { opacity: 0.8; line-height: 1.6; font-size: 17px; }
    button {
      background: white;
      color: black;
      border: none;
      padding: 16px 32px;
      border-radius: 100px;
      font-weight: 600;
      font-size: 16px;
      margin-top: 24px;
      width: 100%;
      cursor: pointer;
      transition: transform 0.2s;
    }
    button:active { transform: scale(0.96); }
  </style>
</head>
<body>
  <h1>Hello Creator 👋</h1>
  <p>Start editing the code on the left to see your changes instantly.</p>
  
  <div class="card">
    <h2 style="margin:0">Premium Card</h2>
    <p>This is a live preview inside an iPhone 15 Pro Max frame.</p>
    <button onclick="alert('It works!')">Tap me</button>
  </div>
</body>
</html>`;

export default function EditorPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [debouncedCode, setDebouncedCode] = useState(DEFAULT_CODE);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const createPrototype = useCreatePrototype();

  // Debounce code updates for preview to avoid flashing
  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => {
      setDebouncedCode(code);
      setIsUpdating(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [code]);

  // Auto-scale effect
  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const padding = 40; // 20px padding on each side

      // Device frame dimensions (matches DeviceFrame.tsx)
      const frameWidth = 400;
      const frameHeight = 850;

      const scaleX = (clientWidth - padding) / frameWidth;
      const scaleY = (clientHeight - padding) / frameHeight;

      // Use the smaller scale to fit both dimensions, capped at 1.1 for large screens
      const newScale = Math.min(scaleX, scaleY, 1.1);
      setScale(Math.max(0.3, newScale)); // Minimum scale 0.3
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);

    // Also recalculate when switching fullscreen modes as container size changes
    const observer = new ResizeObserver(calculateScale);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', calculateScale);
      observer.disconnect();
    };
  }, [isFullscreen]);

  const handleSave = () => {
    createPrototype.mutate(
      {
        name: `Prototype ${new Date().toLocaleTimeString()}`,
        code: code,
        device: "iphone-15-pro-max",
      },
      {
        onSuccess: () => {
          toast({
            title: "Saved successfully",
            description: "Your prototype has been saved to the database.",
          });
        },
        onError: () => {
          toast({
            title: "Error saving",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleRun = () => {
    setDebouncedCode(code);
    setIsUpdating(false);
    setIsFullscreen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {!isFullscreen && (
        <Header
          onSave={handleSave}
          onRun={handleRun}
          isSaving={createPrototype.isPending}
        />
      )}

      {isFullscreen && (
        <div className="absolute top-4 left-4 z-50 animate-in fade-in slide-in-from-top-2">
          <Button
            variant="secondary"
            className="gap-2 shadow-lg backdrop-blur-md bg-white/10 hover:bg-white/20 text-white"
            onClick={() => setIsFullscreen(false)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-hidden relative">
        <ResizablePanelGroup direction="horizontal" className="h-full">

          {/* LEFT PANEL: CODE EDITOR */}
          {!isFullscreen && (
            <>
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full relative bg-[#1e1e1e]">
                  <Editor
                    height="100%"
                    defaultLanguage="html"
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      padding: { top: 24 },
                      fontFamily: "'JetBrains Mono', monospace",
                      fontLigatures: true,
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                      automaticLayout: true,
                    }}
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/50 pointer-events-none font-mono">
                    {code.length} chars
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle className="w-1.5 bg-border hover:bg-primary/50 transition-colors" />
            </>
          )}

          {/* RIGHT PANEL: DEVICE PREVIEW */}
          <ResizablePanel defaultSize={isFullscreen ? 100 : 50} minSize={30}>
            <div
              ref={containerRef}
              className="h-full bg-[#0a0a0a] overflow-hidden relative flex items-center justify-center bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px]"
            >
              <div
                style={{ transform: `scale(${scale})` }}
                className="origin-center transition-all duration-300 ease-in-out"
              >
                <DeviceFrame
                  code={debouncedCode}
                  isUpdating={isUpdating}
                />
              </div>

              <div className="absolute bottom-6 text-center w-full text-muted-foreground text-xs font-mono opacity-50">
                iPhone 15 Pro Max • 430 × 932
              </div>
            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>
    </div>
  );
}
