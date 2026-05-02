"use client";
import { useEffect, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Loader2, Leaf } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { api, ChatMessage } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { cn } from "@/lib/utils";

const FALLBACK_STARTERS = [
  "What are my most critical findings?",
  "What lifestyle changes should I make?",
  "How serious is my ZenScore?",
  "Which findings need urgent attention?",
];

function Message({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {!isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zen-800">
          <Leaf className="h-4 w-4 text-white" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-tr-none bg-zen-800 text-white"
            : "rounded-tl-none bg-white text-gray-800 shadow-sm ring-1 ring-black/5"
        )}
      >
        {isUser ? (
          msg.content
        ) : (
          <ReactMarkdown
            components={{
              h1: ({ children }) => <p className="font-bold text-base mb-1">{children}</p>,
              h2: ({ children }) => <p className="font-bold mb-1">{children}</p>,
              h3: ({ children }) => <p className="font-semibold mb-1">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
              ul: ({ children }) => <ul className="list-disc pl-4 space-y-0.5 my-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 space-y-0.5 my-1">{children}</ol>,
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            }}
          >
            {msg.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const reportId = parseInt(id);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [starters, setStarters] = useState<string[]>(FALLBACK_STARTERS);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    api.chat
      .history(reportId)
      .then(setMessages)
      .finally(() => setLoading(false));
    api.chat
      .starters(reportId)
      .then((d) => {
        if (d?.starters?.length) setStarters(d.starters.slice(0, 4));
      })
      .catch(() => { /* keep fallback */ });
  }, [reportId, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || sending) return;
    setInput("");
    const userMsg: ChatMessage = { role: "user", content: msg, created_at: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setSending(true);
    try {
      const reply = await api.chat.send(reportId, msg);
      setMessages((m) => [...m, reply]);
    } catch {
      const err: ChatMessage = {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        created_at: new Date().toISOString(),
      };
      setMessages((m) => [...m, err]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-cream">
      {/* Header */}
      <header className="bg-cream/95 backdrop-blur-md border-b border-black/5">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            href={`/report/${reportId}`}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 text-gray-500 hover:text-zen-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zen-900">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-zen-900 leading-none">Zeno</p>
            <p className="text-[10px] text-gray-400">Your personal health AI · ZenLife</p>
          </div>
          <Link href="/dashboard" className="text-[11px] font-semibold text-gray-400 hover:text-zen-900 transition-colors">
            My Reports
          </Link>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl mx-auto w-full">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-zen-600" />
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <div className="text-center space-y-6 py-8">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zen-800">
                    <Leaf className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Hi, I&apos;m Zeno</h2>
                  <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                    I&apos;ve read your full ZenReport and I&apos;m here to explain your findings, answer questions, and help you understand your health.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                  {starters.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-xl border border-black/8 bg-white px-4 py-3 text-left text-sm text-gray-700 hover:border-zen-400 hover:bg-zen-50 transition-colors shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => <Message key={i} msg={msg} />)}

            {sending && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zen-800">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
                  <div className="flex gap-1.5 items-center h-5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-2 w-2 rounded-full bg-zen-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-black/8 bg-cream px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask Zeno about your report…"
              rows={1}
              className="flex-1 resize-none bg-white border border-black/8 rounded-2xl px-4 py-3 text-sm outline-none focus:border-zen-500 focus:ring-2 focus:ring-zen-500/20 transition-all"
              style={{ maxHeight: 120 }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || sending}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-zen-900 text-white disabled:opacity-40 hover:bg-zen-800 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-gray-400">
            Zeno provides educational information only. Always consult a qualified physician.
          </p>
        </div>
      </div>
    </div>
  );
}
