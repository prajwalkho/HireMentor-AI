import React, { useEffect, useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import toast from "react-hot-toast";
import useSpeechToText from "react-hook-speech-to-text";
import { axiosInstance, endPoints } from "../../api/axios";
import { MdMic, MdMicOff, MdSmartToy, MdVolumeUp } from "react-icons/md";

// ── Animated CSS fallback avatar shown when the 3D model fails to load ──
const FallbackAvatar = ({ isSpeaking, isListening }) => (
  <div className="flex flex-col items-center justify-center h-full gap-4">
    {/* Outer pulse ring */}
    <div className="relative flex items-center justify-center">
      {(isSpeaking || isListening) && (
        <>
          <span className="absolute w-48 h-48 rounded-full bg-indigo-400/20 animate-ping" />
          <span className="absolute w-40 h-40 rounded-full bg-indigo-400/30 animate-pulse" />
        </>
      )}
      {/* Avatar circle */}
      <div className={`relative w-36 h-36 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl flex items-center justify-center transition-transform duration-300 ${isSpeaking ? "scale-105" : "scale-100"}`}>
        <MdSmartToy size={64} className="text-white" />
        {/* Speaking mouth animation */}
        {isSpeaking && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-0.5 items-end">
            {[4, 7, 5, 8, 4, 6, 5].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-white rounded-full"
                style={{
                  height: `${h}px`,
                  animationName: "speakBar",
                  animationDuration: `${0.3 + i * 0.05}s`,
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDirection: "alternate",
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>

    <div className="text-center">
      <p className="text-white font-semibold text-lg">
        {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "AI Assistant"}
      </p>
      <p className="text-white/60 text-sm mt-1">
        {isListening ? "Say something..." : isSpeaking ? "Playing response" : "Press mic to start"}
      </p>
    </div>

    {/* Sound wave bars when speaking */}
    {isSpeaking && (
      <div className="flex gap-1 items-center h-8">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="w-1 bg-indigo-300 rounded-full"
            style={{
              height: `${Math.random() * 20 + 4}px`,
              animationName: "speakBar",
              animationDuration: `${0.4 + i * 0.03}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDirection: "alternate",
              animationDelay: `${i * 0.04}s`,
            }}
          />
        ))}
      </div>
    )}
  </div>
);

// ── 3D model group (only mounted when model is needed) ──
const Model3D = ({ modelRef }) => <group ref={modelRef} position={[0, -1.6, 0]} />;

// ── Main component ──────────────────────────────────────
const TalkWithAi = () => {
  const modelRef       = useRef(null);
  const mouthRef       = useRef(null);
  const leftEyeRef     = useRef(null);
  const rightEyeRef    = useRef(null);
  const headRef        = useRef(null);
  const mouthAnimRef   = useRef(null);
  const eyesAnimRef    = useRef(null);
  const headAnimRef    = useRef(null);

  const [modelLoaded, setModelLoaded]   = useState(false);
  const [modelFailed, setModelFailed]   = useState(false);
  const [isSpeaking,  setIsSpeaking]    = useState(false);
  const [aiResponse,  setAiResponse]    = useState("");
  const [conversation, setConversation] = useState([]);
  const chatEndRef = useRef(null);

  const {
    error, interimResult, isRecording,
    results, setResults,
    startSpeechToText, stopSpeechToText,
  } = useSpeechToText({ continuous: true, useLegacyResults: false });

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, interimResult]);

  // ── Load Ready Player Me model ──
  const loadHumanModel = () => {
    if (!modelRef.current) return;
    const loader = new GLTFLoader();
    loader.load(
      "https://models.readyplayer.me/679012f122bc116843b4a305.glb",
      (gltf) => {
        modelRef.current.add(gltf.scene);
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            if (child.name.toLowerCase().includes("mouth") || child.name.toLowerCase().includes("head")) {
              mouthRef.current = child;
            }
            if (child.name.includes("EyeLeft"))  leftEyeRef.current  = child;
            if (child.name.includes("EyeRight")) rightEyeRef.current = child;
            if (child.name === "Wolf3D_Head")     headRef.current     = child;
          }
        });
        setModelLoaded(true);
        if (leftEyeRef.current && rightEyeRef.current) startBlinking();
        if (headRef.current) startHeadMovement();
      },
      undefined,
      () => {
        // Model failed to load — use CSS fallback silently
        setModelFailed(true);
      }
    );
  };

  useEffect(() => {
    // Delay to ensure modelRef is mounted inside Canvas
    const t = setTimeout(loadHumanModel, 500);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(mouthAnimRef.current);
      cancelAnimationFrame(headAnimRef.current);
      clearTimeout(eyesAnimRef.current);
    };
  }, []);

  // ── Lip animation ──
  const animateLips = () => {
    if (!mouthRef.current?.morphTargetInfluences) return;
    let targetValue = 0, currentValue = 0;
    const animate = () => {
      if (Math.abs(targetValue - currentValue) > 0.01) {
        currentValue += (targetValue - currentValue) * 0.3;
      } else {
        targetValue = Math.random();
      }
      mouthRef.current.morphTargetInfluences[0] = currentValue;
      mouthAnimRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const stopLipAnimation = () => {
    if (mouthRef.current?.morphTargetInfluences) {
      mouthRef.current.morphTargetInfluences[0] = 0;
    }
    cancelAnimationFrame(mouthAnimRef.current);
  };

  // ── Blink animation ──
  const startBlinking = () => {
    const blink = () => {
      if (leftEyeRef.current && rightEyeRef.current) {
        leftEyeRef.current.visible = false;
        rightEyeRef.current.visible = false;
        setTimeout(() => {
          if (leftEyeRef.current)  leftEyeRef.current.visible  = true;
          if (rightEyeRef.current) rightEyeRef.current.visible = true;
        }, 150);
      }
      eyesAnimRef.current = setTimeout(blink, Math.random() * 2000 + 2000);
    };
    blink();
  };

  // ── Head movement ──
  const startHeadMovement = () => {
    let headBone = null;
    modelRef.current?.traverse((obj) => {
      if (obj.isBone && obj.name === "Head") headBone = obj;
    });
    if (!headBone) return;

    let cur = { x: 0, y: 0 }, target = { x: 0, y: 0 }, speed = 0.02;
    const regen = () => {
      target.x = (Math.random() - 0.5) * 0.2;
      target.y = (Math.random() - 0.5) * 0.4;
      speed    = Math.random() * 0.02 + 0.01;
    };
    const animate = () => {
      cur.x += (target.x - cur.x) * speed;
      cur.y += (target.y - cur.y) * speed;
      headBone.rotation.x = cur.x;
      headBone.rotation.y = cur.y;
      if (Math.abs(cur.x - target.x) < 0.01 && Math.abs(cur.y - target.y) < 0.01) regen();
      headAnimRef.current = requestAnimationFrame(animate);
    };
    regen();
    animate();
  };

  // ── Speak AI response ──
  const speakAiAnswer = (text) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice  = speechSynthesis.getVoices().find((v) => v.lang.startsWith("en")) || speechSynthesis.getVoices()[0];
    utterance.rate   = 0.95;
    utterance.onstart = () => { if (modelLoaded) animateLips(); };
    utterance.onend   = () => { if (modelLoaded) stopLipAnimation(); setIsSpeaking(false); };
    window.speechSynthesis.speak(utterance);
  };

  // ── Handle voice input ──
  useEffect(() => {
    if (!isRecording && results.length > 0) {
      handleStopListening();
    }
  }, [isRecording]);

  const handleStopListening = async () => {
    stopSpeechToText();
    const inputPrompt = results.map((r) => r.transcript).join(" ").trim();
    setResults([]);
    if (!inputPrompt) return;

    setConversation((prev) => [...prev, { role: "user", text: inputPrompt }]);

    try {
      const response = await axiosInstance.post(endPoints.ai.chat, { prompt: inputPrompt });
      const reply    = response.data?.data || "Sorry, I couldn't generate a response.";
      setConversation((prev) => [...prev, { role: "ai", text: reply }]);
      setAiResponse(reply);
      speakAiAnswer(reply);
    } catch {
      toast.error("Failed to get AI response.");
    }
  };

  const toggleRecording = () => {
    if (isRecording) stopSpeechToText();
    else startSpeechToText();
  };

  return (
    <>
      {/* Inject keyframes for the speaking bars */}
      <style>{`
        @keyframes speakBar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left: Avatar ── */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-xl"
            style={{
              height: "520px",
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)",
            }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
            />

            {modelFailed ? (
              /* CSS fallback avatar */
              <FallbackAvatar isSpeaking={isSpeaking} isListening={isRecording} />
            ) : (
              /* Three.js Canvas — only rendered when model might load */
              <Canvas
                style={{ width: "100%", height: "100%" }}
                camera={{ position: [0, 1.5, 0], fov: 30 }}
                onCreated={({ gl }) => {
                  gl.domElement.addEventListener("webglcontextlost", (e) => {
                    e.preventDefault();
                    setModelFailed(true);
                  });
                }}
              >
                <ambientLight intensity={2.3} />
                <pointLight position={[5, 5, 5]} />
                <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 1.8} />
                <Model3D modelRef={modelRef} />
              </Canvas>
            )}

            {/* Status badge overlay */}
            <div className="absolute top-4 left-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                isRecording ? "bg-red-500/80 text-white" : isSpeaking ? "bg-emerald-500/80 text-white" : "bg-white/10 text-white/80"
              }`}>
                {isRecording ? (
                  <><span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Listening</>
                ) : isSpeaking ? (
                  <><MdVolumeUp size={14} /> Speaking</>
                ) : (
                  <><MdSmartToy size={14} /> AI Ready</>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: Chat + Controls ── */}
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MdSmartToy size={22} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm">Talk with AI</h2>
                <p className="text-xs text-gray-400">Voice-powered career assistant</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-600 font-medium">Online</span>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-y-auto flex flex-col gap-3" style={{ minHeight: "300px", maxHeight: "340px" }}>
              {conversation.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-3">
                    <MdMic size={26} className="text-indigo-400" />
                  </div>
                  <p className="text-gray-500 font-medium text-sm">Start a conversation</p>
                  <p className="text-gray-400 text-xs mt-1">Press the mic button and speak</p>
                </div>
              )}

              {conversation.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "ai" && (
                    <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <MdSmartToy size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Interim result (typing indicator) */}
              {isRecording && interimResult && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm bg-indigo-100 text-indigo-700 rounded-br-sm italic opacity-70">
                    {interimResult}...
                  </div>
                </div>
              )}

              {/* AI thinking indicator */}
              {!isRecording && isSpeaking && conversation[conversation.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-2 flex-shrink-0">
                    <MdSmartToy size={14} className="text-white" />
                  </div>
                  <div className="px-4 py-3 bg-gray-100 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Mic control */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col items-center gap-4">
                {/* Big mic button */}
                <button
                  onClick={toggleRecording}
                  disabled={isSpeaking}
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 focus:ring-red-200 scale-110"
                      : isSpeaking
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:ring-indigo-200 hover:scale-105"
                  }`}
                >
                  {isRecording && (
                    <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-50" />
                  )}
                  {isRecording ? (
                    <MdMicOff size={32} className="text-white relative z-10" />
                  ) : (
                    <MdMic size={32} className="text-white relative z-10" />
                  )}
                </button>

                <p className="text-sm text-gray-500 font-medium">
                  {isRecording ? "Tap to stop recording" : isSpeaking ? "AI is speaking..." : "Tap mic to speak"}
                </p>

                {/* Speech error */}
                {error && (
                  <p className="text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-lg">
                    {error === "not-allowed" ? "Microphone access denied" : "Speech recognition unavailable"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TalkWithAi;
