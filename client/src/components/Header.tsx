import { Link } from "wouter";
import { Laptop, Save, Play } from "lucide-react";

export function Header({ 
  onSave, 
  onRun, 
  isSaving 
}: { 
  onSave: () => void; 
  onRun: () => void; 
  isSaving: boolean; 
}) {
  return (
    <header className="h-16 border-b bg-background/50 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Laptop className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg leading-tight">ProLive</h1>
          <p className="text-xs text-muted-foreground font-medium">HTML Prototype Environment</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRun}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>Run</span>
        </button>
        
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 text-sm font-bold shadow-lg shadow-white/5 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none"
        >
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Prototype</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
