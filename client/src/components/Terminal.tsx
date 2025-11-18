import { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface TerminalProps {
  podId: string;
  podName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Terminal({ podId, podName, open, onOpenChange }: TerminalProps) {
  const [output, setOutput] = useState<string>("");
  const [command, setCommand] = useState("");
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setOutput("");
      setCommand("");
      setConnected(false);
      return;
    }

    if (!podId) return;

    // Reset output for new pod
    setOutput("");
    setCommand("");

    // Close existing WebSocket if any
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Connect to WebSocket
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(
      `${protocol}//${window.location.host}/ws?type=terminal&podId=${podId}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "output") {
          setOutput((prev) => prev + message.data);
        }
      } catch (error) {
        console.error("Failed to parse terminal message:", error);
      }
    };

    ws.onerror = () => {
      setConnected(false);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
      wsRef.current = null;
      setOutput("");
    };
  }, [open, podId]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    // Focus input when connected
    if (connected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [connected]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || !wsRef.current) return;

    wsRef.current.send(command);
    setCommand("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]" data-testid="modal-terminal">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Terminal: {podName}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className="text-xs text-muted-foreground">
                {connected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <ScrollArea className="h-[50vh] w-full">
            <div
              ref={scrollRef}
              className="bg-black text-green-400 rounded-md p-4 font-mono text-sm whitespace-pre-wrap"
              data-testid="terminal-output"
            >
              {output || "Connecting..."}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit}>
            <Input
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter command..."
              disabled={!connected}
              className="font-mono"
              data-testid="input-terminal-command"
            />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
