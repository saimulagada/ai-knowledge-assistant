import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiCpu,
  FiSend,
  FiArrowLeft,
  FiLogOut,
  FiUser,
  FiFileText,
} from "react-icons/fi";

import { askAI } from "../services/aiService";

type Source = {
  documentId: number;
  fileName: string;
  chunkIndex: number;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

const Chat = () => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState(false);

  // ================= ASK AI =================

  const handleAskAI = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    // Add user message immediately
    const userMessage: Message = {
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    // Clear input
    setQuestion("");

    try {
      setLoading(true);

      const response = await askAI(trimmedQuestion);

      console.log("AI RESPONSE:", response);

      const assistantMessage: Message = {
        role: "assistant",
        content:
          response.answer ||
          "I couldn't generate an answer.",
        sources: response.sources || [],
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    } catch (error) {
      console.error(
        "AI request failed:",
        error
      );

      const errorMessage: Message = {
        role: "assistant",
        content:
          "Sorry, I couldn't generate an answer. Please try again.",
      };

      setMessages((previous) => [
        ...previous,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ================= KEYBOARD =================

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      handleAskAI();
    }
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  // ================= RENDER =================

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* ================= HEADER ================= */}

      <header className="h-20 border-b border-white/10 flex items-center justify-between px-6 lg:px-10">

        {/* LEFT */}

        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            title="Back to Dashboard"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">

              <FiCpu className="w-5 h-5" />

            </div>

            <div>

              <h1 className="font-semibold">
                AI Knowledge Assistant
              </h1>

              <p className="text-xs text-slate-500">
                Ask questions about your documents
              </p>

            </div>

          </div>

        </div>

        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition text-sm"
        >
          <FiLogOut className="w-4 h-4" />
          Logout
        </button>

      </header>

      {/* ================= CHAT ================= */}

      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto">

        {/* ================= MESSAGES ================= */}

        <div className="flex-1 overflow-y-auto p-6">

          {messages.length === 0 ? (

            /* ================= EMPTY STATE ================= */

            <div className="h-full flex items-center justify-center">

              <div className="text-center max-w-lg">

                <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">

                  <FiCpu className="w-8 h-8 text-blue-400" />

                </div>

                <h2 className="text-2xl font-bold mt-6">
                  Ask your documents
                </h2>

                <p className="text-slate-500 mt-3">
                  Ask a question and the AI will
                  search your uploaded documents
                  for relevant information.
                </p>

                {/* SUGGESTIONS */}

                <div className="mt-6 flex flex-wrap justify-center gap-2">

                  <button
                    onClick={() =>
                      setQuestion(
                        "How many annual leave days do employees receive?"
                      )
                    }
                    className="px-4 py-2 rounded-lg border border-white/10 bg-white/[0.04] text-sm text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                  >
                    Annual leave days
                  </button>

                  <button
                    onClick={() =>
                      setQuestion(
                        "How many sick leave days are available?"
                      )
                    }
                    className="px-4 py-2 rounded-lg border border-white/10 bg-white/[0.04] text-sm text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                  >
                    Sick leave
                  </button>

                </div>

              </div>

            </div>

          ) : (

            /* ================= MESSAGE LIST ================= */

            <div className="space-y-6">

              {messages.map(
                (message, index) => (

                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    {/* ================= AI ICON ================= */}

                    {message.role === "assistant" && (

                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">

                        <FiCpu className="w-4 h-4" />

                      </div>

                    )}

                    {/* ================= MESSAGE ================= */}

                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                        message.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-white/[0.06] border border-white/10 text-slate-200"
                      }`}
                    >

                      {/* ANSWER */}

                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>

                      {/* ================= SOURCES ================= */}

                      {message.role === "assistant" &&
                        message.sources &&
                        message.sources.length > 0 && (

                          <div className="mt-4 border-t border-white/10 pt-3">

                            <div className="flex items-center gap-2 mb-3">

                              <FiFileText className="w-4 h-4 text-blue-400" />

                              <p className="text-xs font-semibold text-slate-400">
                                Sources
                              </p>

                            </div>

                            <div className="space-y-2">

                              {message.sources.map(
                                (
                                  source,
                                  sourceIndex
                                ) => (

                                  <div
                                    key={`${source.documentId}-${source.chunkIndex}-${sourceIndex}`}
                                    className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/5 px-3 py-2"
                                  >

                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">

                                      <FiFileText className="w-4 h-4 text-blue-400" />

                                    </div>

                                    <div className="min-w-0">

                                      <p className="text-sm text-slate-200 truncate">
                                        {source.fileName}
                                      </p>

                                      <p className="text-xs text-slate-500">
                                        Chunk{" "}
                                        {source.chunkIndex}
                                      </p>

                                    </div>

                                  </div>

                                )
                              )}

                            </div>

                          </div>

                        )}

                    </div>

                    {/* ================= USER ICON ================= */}

                    {message.role === "user" && (

                      <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">

                        <FiUser className="w-4 h-4 text-slate-400" />

                      </div>

                    )}

                  </div>

                )
              )}

              {/* ================= LOADING ================= */}

              {loading && (

                <div className="flex gap-3">

                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">

                    <FiCpu className="w-4 h-4" />

                  </div>

                  <div className="bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-3">

                    <div className="flex gap-1">

                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />

                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:150ms]" />

                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:300ms]" />

                    </div>

                  </div>

                </div>

              )}

            </div>

          )}

        </div>

        {/* ================= INPUT ================= */}

        <div className="p-6 border-t border-white/10">

          <div className="relative">

            <textarea
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask something about your documents..."
              rows={3}
              disabled={loading}
              className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 pr-14 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition disabled:opacity-50"
            />

            <button
              onClick={handleAskAI}
              disabled={
                loading ||
                !question.trim()
              }
              className="absolute right-3 bottom-3 w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Send message"
            >

              <FiSend className="w-4 h-4" />

            </button>

          </div>

          <p className="text-xs text-slate-600 mt-2 text-center">
            Press Enter to send • Shift + Enter for a new line
          </p>

        </div>

      </main>

    </div>
  );
};

export default Chat;