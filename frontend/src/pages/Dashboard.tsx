import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  uploadDocument,
  getDocuments,
} from "../services/documentService";
import { getAIStats } from "../services/aiService";

import {
  FiCpu,
  FiUploadCloud,
  FiFileText,
  FiMessageSquare,
  FiLogOut,
  FiHome,
  FiDatabase,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiClock,
} from "react-icons/fi";

type DocumentStatus =
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

type Document = {
  id: number;
  originalName: string;
  status: DocumentStatus;
};

type AIStats = {
  queryCount: number;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // =========================
  // STATE
  // =========================

  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const [documents, setDocuments] = useState<Document[]>([]);

  const [documentsLoading, setDocumentsLoading] =
    useState(true);

  const [aiStats, setAIStats] = useState<AIStats>({
    queryCount: 0,
  });

  // =========================
  // LOAD DOCUMENTS
  // =========================

  const loadDocuments = useCallback(async () => {
    try {
      const response = await getDocuments();

      console.log("DOCUMENTS:", response);

      /*
        Expected backend response:

        {
          success: true,
          data: [...]
        }
      */

      setDocuments(response.data || []);
    } catch (error) {
      console.error(
        "Failed to load documents:",
        error
      );

      setMessageType("error");
      setMessage("Failed to load documents.");
    } finally {
      setDocumentsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadDocuments();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadDocuments]);

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await getAIStats();

        setAIStats({
          queryCount: response.data?.queryCount || 0,
        });
      } catch (error) {
        console.error("Failed to load AI stats:", error);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const hasProcessingDocuments = documents.some(
      (document) => document.status === "PROCESSING"
    );

    if (!hasProcessingDocuments) {
      return;
    }

    const intervalId = window.setInterval(() => {
      loadDocuments();
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [documents, loadDocuments]);

  // =========================
  // FILE CHANGE
  // =========================

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    // Check PDF
    if (selectedFile.type !== "application/pdf") {
      setFile(null);

      setMessageType("error");

      setMessage(
        "Only PDF files are supported."
      );

      return;
    }

    // Clear previous message
    setMessage("");

    setMessageType("");

    // Store file
    setFile(selectedFile);
  };

  // =========================
  // REMOVE FILE
  // =========================

  const removeFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setMessage("");

    setMessageType("");
  };

  // =========================
  // UPLOAD DOCUMENT
  // =========================

  const handleUpload = async () => {
    if (!file) {
      setMessageType("error");

      setMessage(
        "Please select a PDF file first."
      );

      return;
    }

    try {
      setLoading(true);

      setMessage("");

      setMessageType("");

      console.log(
        "Uploading file:",
        file.name
      );

      const result = await uploadDocument(file);

      console.log(
        "UPLOAD RESPONSE:",
        result
      );

      setMessageType("success");

      setMessage(
        "Your document has been uploaded successfully."
      );

      // Clear selected file
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Reload document list
      await loadDocuments();
    } catch (error) {
      console.error(
        "Upload failed:",
        error
      );

      setMessageType("error");

      setMessage(
        "Failed to upload the document. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  // =========================
  // STATUS UI
  // =========================

  const renderStatus = (
    status: DocumentStatus
  ) => {
    if (status === "PROCESSING") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs">
          <FiClock className="w-3.5 h-3.5" />
          Processing
        </span>
      );
    }

    if (status === "COMPLETED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">
          <FiCheckCircle className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs">
        <FiAlertCircle className="w-3.5 h-3.5" />
        Failed
      </span>
    );
  };

  // =========================
  // RETURN
  // =========================

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside className="hidden md:flex w-64 border-r border-white/10 bg-slate-950 flex-col">

        {/* LOGO */}

        <div className="h-20 px-6 flex items-center gap-3 border-b border-white/10">

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">

            <FiCpu className="w-5 h-5" />

          </div>

          <div>

            <h1 className="font-semibold text-sm">
              AI Knowledge
            </h1>

            <p className="text-xs text-slate-500">
              Assistant
            </p>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 p-4">

          <p className="px-3 mb-3 text-[11px] uppercase tracking-wider text-slate-600 font-semibold">
            Workspace
          </p>

          {/* Dashboard */}

          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 text-white text-sm"
          >
            <FiHome className="w-4 h-4" />

            Dashboard
          </button>

          {/* Ask AI */}

          <button
            onClick={() => navigate("/chat")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white text-sm transition mt-1"
          >
            <FiMessageSquare className="w-4 h-4" />

            Ask AI
          </button>

          {/* Documents */}

          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white text-sm transition mt-1"
          >
            <FiDatabase className="w-4 h-4" />

            Documents
          </button>

        </nav>

        {/* USER / LOGOUT */}

        <div className="p-4 border-t border-white/10">

          <div className="flex items-center gap-3 px-3 py-3 mb-2">

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-semibold">
              U
            </div>

            <div className="flex-1 min-w-0">

              <p className="text-sm font-medium truncate">
                User
              </p>

              <p className="text-xs text-slate-500 truncate">
                Knowledge Workspace
              </p>

            </div>

          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition text-sm"
          >

            <FiLogOut className="w-4 h-4" />

            Logout

          </button>

        </div>

      </aside>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="flex-1 min-w-0">

        {/* HEADER */}

        <header className="h-20 border-b border-white/10 flex items-center justify-between px-6 lg:px-10">

          <div>

            <h2 className="text-lg font-semibold">
              Dashboard
            </h2>

            <p className="text-sm text-slate-500">
              Manage your knowledge and ask questions.
            </p>

          </div>

          <button
            onClick={() => navigate("/chat")}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-sm font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/10"
          >

            <FiMessageSquare className="w-4 h-4" />

            Ask AI

          </button>

        </header>

        {/* CONTENT */}

        <div className="p-6 lg:p-10 max-w-6xl mx-auto">

          {/* WELCOME */}

          <div className="mb-8">

            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Build your AI knowledge base
            </h1>

            <p className="text-slate-400 mt-2 max-w-2xl">
              Upload your documents and use AI to
              search, understand, and interact with
              your knowledge.
            </p>

          </div>

          {/* ================================================= */}
          {/* STATS */}
          {/* ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

            {/* DOCUMENT COUNT */}

            <div className="border border-white/10 bg-white/[0.04] rounded-xl p-5">

              <div className="flex items-center justify-between">

                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">

                  <FiFileText className="w-5 h-5 text-blue-400" />

                </div>

                <span className="text-xs text-slate-600">
                  Workspace
                </span>

              </div>

              <p className="text-2xl font-bold mt-4">
                {documents.length}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Documents
              </p>

            </div>

            {/* AI QUERIES */}

            <div className="border border-white/10 bg-white/[0.04] rounded-xl p-5">

              <div className="flex items-center justify-between">

                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">

                  <FiMessageSquare className="w-5 h-5 text-purple-400" />

                </div>

                <span className="text-xs text-slate-600">
                  AI
                </span>

              </div>

              <p className="text-2xl font-bold mt-4">
                {aiStats.queryCount}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                AI Queries
              </p>

            </div>

            {/* KNOWLEDGE */}

            <div className="border border-white/10 bg-white/[0.04] rounded-xl p-5">

              <div className="flex items-center justify-between">

                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">

                  <FiDatabase className="w-5 h-5 text-emerald-400" />

                </div>

                <span className="text-xs text-slate-600">
                  Vector DB
                </span>

              </div>

              <p className="text-2xl font-bold mt-4">
                Ready
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Knowledge Base
              </p>

            </div>

          </div>

          {/* ================================================= */}
          {/* UPLOAD */}
          {/* ================================================= */}

          <div className="border border-white/10 bg-white/[0.04] rounded-2xl overflow-hidden">

            {/* HEADER */}

            <div className="px-6 py-5 border-b border-white/10">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">

                  <FiUploadCloud className="w-5 h-5 text-blue-400" />

                </div>

                <div>

                  <h2 className="font-semibold">
                    Upload a document
                  </h2>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Add PDFs to your AI knowledge base
                  </p>

                </div>

              </div>

            </div>

            {/* BODY */}

            <div className="p-6">

              {/* DROP AREA */}

              <label
                htmlFor="pdf-upload"
                className="group block cursor-pointer"
              >

                <div className="border border-dashed border-white/15 rounded-xl p-10 text-center bg-slate-900/40 hover:bg-slate-900/70 hover:border-blue-500/40 transition">

                  <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/15 transition">

                    <FiUploadCloud className="w-7 h-7 text-blue-400" />

                  </div>

                  <h3 className="font-medium mt-5">
                    Choose a PDF file
                  </h3>

                  <p className="text-sm text-slate-500 mt-2">
                    Click here to browse your files
                  </p>

                  <p className="text-xs text-slate-600 mt-3">
                    PDF files only
                  </p>

                </div>

                <input
                  ref={fileInputRef}
                  id="pdf-upload"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

              </label>

              {/* SELECTED FILE */}

              {file && (

                <div className="mt-5 flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-slate-900/60">

                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">

                    <FiFileText className="w-5 h-5 text-red-400" />

                  </div>

                  <div className="flex-1 min-w-0">

                    <p className="text-sm font-medium truncate">
                      {file.name}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    disabled={loading}
                    className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition"
                  >

                    <FiX className="w-4 h-4" />

                  </button>

                </div>

              )}

              {/* UPLOAD BUTTON */}

              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className="w-full mt-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-3 text-sm font-semibold shadow-lg shadow-blue-500/10 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >

                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUploadCloud className="w-4 h-4" />

                    Upload PDF
                  </>
                )}

              </button>

              {/* MESSAGE */}

              {message && (

                <div
                  className={`mt-4 flex items-start gap-3 p-4 rounded-xl border text-sm ${
                    messageType === "success"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
                >

                  {messageType === "success" ? (
                    <FiCheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}

                  <span>
                    {message}
                  </span>

                </div>

              )}

            </div>

          </div>

          {/* ================================================= */}
          {/* DOCUMENTS */}
          {/* ================================================= */}

          <div className="mt-6 border border-white/10 bg-white/[0.04] rounded-2xl overflow-hidden">

            {/* HEADER */}

            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">

                  <FiDatabase className="w-5 h-5 text-purple-400" />

                </div>

                <div>

                  <h2 className="font-semibold">
                    My Documents
                  </h2>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Documents uploaded to your knowledge base
                  </p>

                </div>

              </div>

              <span className="text-xs text-slate-500">
                {documents.length} total
              </span>

            </div>

            {/* DOCUMENT LIST */}

            <div className="p-6">

              {documentsLoading ? (

                <div className="flex justify-center py-8">

                  <span className="w-6 h-6 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin" />

                </div>

              ) : documents.length === 0 ? (

                <div className="text-center py-10">

                  <FiFileText className="w-10 h-10 mx-auto text-slate-700" />

                  <p className="text-sm text-slate-500 mt-3">
                    No documents uploaded yet.
                  </p>

                </div>

              ) : (

                <div className="space-y-3">

                  {documents.map((document) => (

                    <div
                      key={document.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-slate-900/50 hover:bg-slate-900/80 transition"
                    >

                      {/* FILE ICON */}

                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">

                        <FiFileText className="w-5 h-5 text-red-400" />

                      </div>

                      {/* NAME */}

                      <div className="flex-1 min-w-0">

                        <p className="text-sm font-medium truncate">
                          {document.originalName}
                        </p>

                        <p className="text-xs text-slate-600 mt-1">
                          Document #{document.id}
                        </p>

                      </div>

                      {/* STATUS */}

                      <div className="flex-shrink-0">

                        {renderStatus(
                          document.status
                        )}

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

          {/* ================================================= */}
          {/* ASK AI */}
          {/* ================================================= */}

          <div className="mt-6 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

              <div>

                <div className="flex items-center gap-2">

                  <FiCpu className="w-5 h-5 text-blue-400" />

                  <h3 className="font-semibold">
                    Ready to talk to your documents?
                  </h3>

                </div>

                <p className="text-sm text-slate-400 mt-2">
                  Ask questions and get AI-powered
                  answers from your uploaded knowledge base.
                </p>

              </div>

              <button
                onClick={() => navigate("/chat")}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-950 text-sm font-semibold hover:bg-slate-200 transition whitespace-nowrap"
              >

                <FiMessageSquare className="w-4 h-4" />

                Open AI Chat

              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Dashboard;
