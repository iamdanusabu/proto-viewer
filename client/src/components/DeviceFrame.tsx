import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface DeviceFrameProps {
  code: string;
  className?: string;
  isUpdating?: boolean;
}

export function DeviceFrame({ code, className, isUpdating }: DeviceFrameProps) {
  const [iframeKey, setIframeKey] = useState(0);

  // Force iframe refresh when code changes significantly if needed, 
  // but usually srcDoc handles it. Adding a small delay for smoother UX.
  
  return (
    <div className={cn("relative mx-auto animate-in", className)}>
      {/* iPhone 15 Pro Max Frame */}
      <div 
        className="relative bg-black rounded-[55px] p-3 border-4 border-[#323232] shadow-2xl device-shadow w-[400px] h-[850px] mx-auto select-none overflow-hidden"
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[35px] w-[120px] bg-black rounded-b-[24px] z-50 flex items-center justify-center pointer-events-none">
          <div className="w-[80px] h-[20px] bg-[#1a1a1a] rounded-full flex items-center justify-between px-3">
             <div className="w-2 h-2 rounded-full bg-[#0f0f0f] shadow-inner"></div>
             <div className="w-2 h-2 rounded-full bg-[#2a2a2a]/50"></div>
          </div>
        </div>

        {/* Screen Content */}
        <div className="w-full h-full bg-white rounded-[44px] overflow-hidden relative">
          
          {/* Status Bar Mock */}
          <div className="absolute top-0 w-full h-12 z-20 flex justify-between px-8 items-center text-black font-medium text-xs pointer-events-none select-none mix-blend-difference text-white">
            <span>9:41</span>
            <div className="flex gap-1.5">
              <div className="w-4 h-2.5 bg-current rounded-sm opacity-90"></div>
              <div className="w-4 h-2.5 bg-current rounded-sm opacity-90"></div>
              <div className="w-5 h-2.5 border border-current rounded-sm flex items-center justify-end px-px">
                <div className="w-3 h-1.5 bg-current rounded-[1px]"></div>
              </div>
            </div>
          </div>

          {/* Iframe for User Code */}
          <iframe
            key={iframeKey}
            srcDoc={code}
            title="Preview"
            sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
            className="w-full h-full border-0 bg-white"
          />
          
          {/* Loading Overlay */}
          {isUpdating && (
            <div className="absolute top-4 right-4 z-30">
              <div className="bg-black/50 backdrop-blur-md rounded-full p-2 text-white">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[5px] bg-white/20 rounded-full z-50 pointer-events-none backdrop-blur-sm"></div>
      
        {/* Side Buttons */}
        <div className="absolute top-[100px] -left-[6px] w-[3px] h-[26px] bg-[#2a2a2a] rounded-l-md"></div>
        <div className="absolute top-[140px] -left-[6px] w-[3px] h-[50px] bg-[#2a2a2a] rounded-l-md"></div>
        <div className="absolute top-[200px] -left-[6px] w-[3px] h-[50px] bg-[#2a2a2a] rounded-l-md"></div>
        <div className="absolute top-[180px] -right-[6px] w-[3px] h-[80px] bg-[#2a2a2a] rounded-r-md"></div>
      </div>
      
      {/* Reflection/Glare */}
      <div className="absolute top-0 right-0 w-full h-full rounded-[55px] pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/0 z-40 opacity-50"></div>
    </div>
  );
}
