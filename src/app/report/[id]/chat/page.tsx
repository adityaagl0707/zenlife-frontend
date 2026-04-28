"use client";
import { useEffect, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Loader2, Leaf, Home } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { api, ChatMessage } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { cn } from "@/lib/utils";

const STARTERS = [
  "What are my most critical findings?",
  "Can you explain my calcium score?",
  "What lifestyle changes should I make?",
  "How serious is my ZenScore?",
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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    api.chat
      .history(reportId)
      .then(setMessages)
      .finally(() => setLoading(false));
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
      <div className="bg-zen-900 px-6 py-4 flex items-center gap-4">
        <Link href={`/report/${reportId}`} className="text-zen-300 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
          <Leaf className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-white">Zeno</p>
          <p className="text-xs text-zen-300">Your personal health AI · ZenLife</p>
        </div>
        <Link href="/dashboard" className="flex items-center gap-1.5 text-xs text-zen-300 hover:text-white transition-colors">
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
      </div>

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
                  <h2 className="text-xl font-bold text-gray-900">Hi, I'm Zeno</h2>
                  <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                    I've read your full ZenReport and I'm here to explain your findings, answer questions, and help you understand your health.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 hover:border-zen-400 hover:bg-zen-50 transition-colors shadow-sm"
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
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask Zeno about your report…"
              rows={1}
              className="flex-1 resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-zen-500 focus:ring-2 focus:ring-zen-500/20 transition-all"
              style={{ maxHeight: 120 }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || sending}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-zen-800 text-white disabled:opacity-40 hover:bg-zen-700 transition-colors"
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
