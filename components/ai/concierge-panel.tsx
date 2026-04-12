"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Mic, Send, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { stripForTts } from "@/lib/concierge-tts";

const VOICE_MUTE_KEY = "damnit-frankie-voice-muted";

type Msg = { role: "user" | "assistant"; content: string };

function formatReply(text: string) {
  return text.split(/\n+/).map((line, i) => (
    <p key={i} className="mb-2 last:mb-0">
      {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="text-[var(--color-accent-soft)]">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </p>
  ));
}

export function ConciergePanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hey — I’m Frankie’s digital troublemaker. Ask about booking, travel, aftercare, or tattoo history. Want me to get **flirty**? Keep it classy and I’ll keep it fun.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [responseId, setResponseId] = useState<string | undefined>();
  const [speaking, setSpeaking] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setVoiceMuted(sessionStorage.getItem(VOICE_MUTE_KEY) === "1");
    } catch {
      /* private mode */
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setSpeaking(false);
  }, []);

  const setMuted = useCallback(
    (muted: boolean) => {
      setVoiceMuted(muted);
      try {
        if (muted) sessionStorage.setItem(VOICE_MUTE_KEY, "1");
        else sessionStorage.removeItem(VOICE_MUTE_KEY);
      } catch {
        /* ignore */
      }
      if (muted) stopAudio();
    },
    [stopAudio]
  );

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => () => stopAudio(), [stopAudio]);

  const speak = useCallback(
    async (text: string) => {
      if (voiceMuted) return;
      stopAudio();
      const plain = stripForTts(text);
      if (!plain) return;
      setSpeaking(true);
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: plain.slice(0, 3500) }),
        });
        if (!res.ok) throw new Error("tts");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          URL.revokeObjectURL(url);
          setSpeaking(false);
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          setSpeaking(false);
        };
        await audio.play();
      } catch {
        setSpeaking(false);
      }
    },
    [voiceMuted, stopAudio]
  );

  async function send() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          previousResponseId: responseId,
        }),
      });
      const data = (await res.json()) as {
        reply?: string;
        responseId?: string;
        error?: string;
      };
      const reply =
        typeof data.reply === "string"
          ? data.reply
          : "I’m tongue-tied. Try the booking form or call the studio.";
      if (data.responseId) setResponseId(data.responseId);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      if (res.ok && !voiceMuted) {
        void speak(reply);
      }
    } catch {
      const fallback =
        "Network hiccup — text **817-655-0959** and we’ll sort it.";
      setMessages((m) => [...m, { role: "assistant", content: fallback }]);
      if (!voiceMuted) void speak(fallback);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed z-50 flex size-14 min-h-14 min-w-14 touch-manipulation items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-lg shadow-black/40 transition-transform active:scale-95 sm:hover:scale-105",
          "bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] md:bottom-8 md:right-8",
          open && "pointer-events-none opacity-0"
        )}
        aria-label="Open concierge chat"
      >
        <MessageCircle className="size-7" />
      </button>

      <AnimatePresence>
        {open && (
          <div className="pointer-events-none fixed inset-x-4 bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] z-50 flex justify-center md:inset-x-auto md:bottom-8 md:right-8 md:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="pointer-events-auto flex max-h-[min(560px,80dvh)] w-full max-w-[380px] flex-col overflow-hidden rounded-2xl border border-[var(--color-paper)]/15 bg-[var(--color-ink)]/95 shadow-2xl backdrop-blur-xl touch-manipulation md:w-[380px]"
              role="dialog"
              aria-label="Concierge chat"
            >
            <div className="flex items-center justify-between gap-2 border-b border-[var(--color-paper)]/10 px-3 py-3">
              <div className="min-w-0 flex-1 pl-1">
                <p className="text-sm font-medium text-[var(--color-paper)]">
                  Frankie&apos;s concierge
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  Eve speaks replies — mute anytime
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  className="rounded-full p-2 hover:bg-[var(--color-paper)]/10"
                  aria-label={voiceMuted ? "Unmute Eve voice" : "Mute Eve voice"}
                  aria-pressed={voiceMuted}
                  onClick={() => setMuted(!voiceMuted)}
                >
                  {voiceMuted ? (
                    <VolumeX className="size-5 text-[var(--color-muted)]" />
                  ) : (
                    <Volume2 className="size-5 text-[var(--color-accent-soft)]" />
                  )}
                </button>
                <button
                  type="button"
                  className="rounded-full p-2 hover:bg-[var(--color-paper)]/10"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-xl px-3 py-2",
                    m.role === "user"
                      ? "ml-6 bg-[var(--color-accent)]/25 text-[var(--color-paper)]"
                      : "mr-4 bg-[var(--color-paper)]/5 text-[var(--color-paper)]/90"
                  )}
                >
                  {m.role === "assistant" ? (
                    <>
                      <div>{formatReply(m.content)}</div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-8 px-2 text-xs text-[var(--color-accent-soft)]"
                        onClick={() => speak(m.content)}
                        disabled={speaking || voiceMuted}
                      >
                        <Volume2 className="size-3.5" />
                        {voiceMuted ? "Muted" : speaking ? "Playing…" : "Replay Eve"}
                      </Button>
                    </>
                  ) : (
                    m.content
                  )}
                </div>
              ))}
              {loading && (
                <p className="text-xs text-[var(--color-muted)]">Thinking…</p>
              )}
            </div>

            <form
              className="flex gap-2 border-t border-[var(--color-paper)]/10 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                className="flex-1"
                disabled={loading}
                aria-label="Message"
              />
              <Button type="submit" size="icon" disabled={loading} aria-label="Send">
                <Send className="size-4" />
              </Button>
            </form>
            <p className="flex items-center justify-center gap-1 border-t border-[var(--color-paper)]/5 px-3 py-2 text-[10px] text-[var(--color-muted)]">
              <Mic className="size-3" />
              AI can be wrong on policy — confirm with Frankie.
            </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
