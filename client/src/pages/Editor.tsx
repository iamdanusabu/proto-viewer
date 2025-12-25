import { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Editor from "@monaco-editor/react";
import { DeviceFrame } from "@/components/DeviceFrame";
import { Header } from "@/components/Header";
import { useCreatePrototype } from "@/hooks/use-prototypes";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const createPrototype = useCreatePrototype();

  // Debounce code updates for preview to avoid flashing
  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => {
      setDebouncedCode(code);
      setIsUpdating(false);
    }, 800); // 800ms debounce
    return () => clearTimeout(timer);
  }, [code]);

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
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <Header 
        onSave={handleSave} 
        onRun={handleRun}
        isSaving={createPrototype.isPending} 
      />

      <div className="flex-1 overflow-hidden relative">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          
          {/* LEFT PANEL: CODE EDITOR */}
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

          {/* RIGHT PANEL: DEVICE PREVIEW */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full bg-[#0a0a0a] overflow-y-auto overflow-x-hidden relative flex items-center justify-center p-8 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px]">
              <div className="scale-[0.85] lg:scale-[0.9] xl:scale-100 origin-center transition-transform duration-500">
                <DeviceFrame 
                  code={debouncedCode} 
                  isUpdating={isUpdating}
                />
              </div>
              
              <div className="absolute bottom-6 text-center w-full text-muted-foreground text-xs font-mono">
                iPhone 15 Pro Max • 430 × 932
              </div>
            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>
    </div>
  );
}
