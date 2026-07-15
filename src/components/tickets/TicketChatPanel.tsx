import { useEffect, useRef, useState, type FormEvent } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  sendTicketMessage,
  useTicketMessages,
  type TicketMessage,
} from "@/lib/ticket-messages-store";
import type { SupportTicket } from "@/lib/support-tickets-data";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?";
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageBubble({ msg }: { msg: TicketMessage }) {
  const isSupport = msg.author === "suporte";
  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isSupport ? "flex-row-reverse" : "flex-row",
      )}
    >
      <span
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10.5px] font-medium",
          isSupport
            ? "bg-primary/15 text-primary"
            : "bg-[#efe6d7] text-[#7a5a1e] dark:bg-[#3a2f1c] dark:text-[#e0c78c]",
        )}
        aria-hidden
      >
        {initials(msg.name)}
      </span>
      <div className={cn("min-w-0 max-w-[78%]", isSupport ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-3 py-2 text-[12.5px] leading-relaxed shadow-[0_1px_0_rgba(15,23,42,0.04)]",
            isSupport
              ? "rounded-br-md bg-primary/12 text-foreground dark:bg-primary/20"
              : "rounded-bl-md bg-[#f7efe0] text-foreground dark:bg-[#2b2415]",
          )}
        >
          {msg.text}
        </div>
        <p
          className={cn(
            "mt-0.5 flex items-center gap-1 text-[10.5px] text-muted-foreground",
            isSupport ? "justify-end" : "justify-start",
          )}
        >
          <span className="font-medium">{msg.name}</span>
          <span>·</span>
          <span>{formatTime(msg.at)}</span>
        </p>
      </div>
    </div>
  );
}

export function TicketChatPanel({
  ticket,
  onClose,
  className,
}: {
  ticket: SupportTicket;
  onClose?: () => void;
  className?: string;
}) {
  const messages = useTicketMessages(ticket.id);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    sendTicketMessage(ticket.id, text);
    setDraft("");
  };

  return (
    <aside
      className={cn(
        "flex min-h-0 flex-col bg-card",
        className,
      )}
    >
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h3 className="text-[13px] font-bold text-foreground">Chat</h3>
          <p className="truncate text-[11.5px] text-muted-foreground">
            {ticket.contact} · {ticket.clientName}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar chat"
            className="grid h-7 w-7 cursor-pointer place-items-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </header>

      <div
        ref={listRef}
        className="flex-1 min-h-0 space-y-3 overflow-y-auto bg-muted/20 px-3 py-4"
      >
        {messages.length === 0 ? (
          <p className="py-8 text-center text-[12px] text-muted-foreground">
            Nenhuma mensagem ainda.
          </p>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} msg={m} />)
        )}
      </div>

      <form
        onSubmit={submit}
        className="flex shrink-0 items-end gap-2 border-t border-border bg-card px-3 py-3"
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(e as unknown as FormEvent);
            }
          }}
          rows={1}
          placeholder="Digite uma mensagem..."
          className="min-h-[38px] max-h-32 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!draft.trim()}
          aria-label="Enviar mensagem"
          className="h-9 w-9 shrink-0 cursor-pointer rounded-xl"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </aside>
  );
}
