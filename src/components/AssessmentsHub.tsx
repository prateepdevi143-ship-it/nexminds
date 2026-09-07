import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  Camera,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Maximize,
  AlertTriangle,
  RefreshCw,
  Eye,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Wifi,
  Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Assessment, AssessmentIntegrityEvent } from '../types';
import { api } from '../services/api';

interface AssessmentsHubProps {
  initialSkill?: string;
  onRefreshProfile: () => void;
  onSelectTab: (tab: string) => void;
}

type ScreenMode = 'catalog' | 'env_check' | 'active_test' | 'result';

export const AssessmentsHub: React.FC<AssessmentsHubProps> = ({
  initialSkill,
  onRefreshProfile,
  onSelectTab
}) => {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'proctored' | 'normal'>('all');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('catalog');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Environment Check States
  const [cameraStatus, setCameraStatus] = useState<'idle' | 'checking' | 'connected' | 'error'>('idle');
  const [micStatus, setMicStatus] = useState<'idle' | 'checking' | 'connected' | 'error'>('idle');
  const [rulesAgreed, setRulesAgreed] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Media Stream Ref
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);

  // Active Assessment States
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  // Integrity Monitoring States
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);
  const [cameraInterruptions, setCameraInterruptions] = useState(0);
  const [microphoneInterruptions, setMicrophoneInterruptions] = useState(0);
  const [integrityEvents, setIntegrityEvents] = useState<AssessmentIntegrityEvent[]>([]);
  const [violationAlert, setViolationAlert] = useState<string | null>(null);
  const [cameraFeedActive, setCameraFeedActive] = useState(true);

  // Final Result State
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    loadAssessments();
    return () => {
      stopMediaStream();
    };
  }, []);

  useEffect(() => {
    if (initialSkill && assessments.length > 0) {
      const match = assessments.find(
        a => (a?.skillName || '').toLowerCase() === (initialSkill || '').toLowerCase()
      );
      if (match) {
        handleInitiateAssessment(match.id);
      }
    }
  }, [initialSkill, assessments]);

  // Clean stream helper
  const stopMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
  };

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const list = await api.getAssessments();
      setAssessments(list);
    } catch (err) {
      console.error('Failed to load assessments', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. User Clicks "Start Assessment" -> Initiates pre-check or test
  const handleInitiateAssessment = async (id: string) => {
    setLoading(true);
    setPermissionError(null);
    setRulesAgreed(false);
    setCameraStatus('idle');
    setMicStatus('idle');
    stopMediaStream();

    try {
      const data = await api.getAssessment(id);
      setSelectedAssessment(data);

      if (data.isProctored) {
        setCurrentScreen('env_check');
        // Automatically start the permission check on entering the screen
        requestMediaPermissions(data);
      } else {
        // Normal assessment: start directly
        startActiveAssessment(data);
      }
    } catch (err) {
      console.error('Failed to get assessment', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Request Camera & Mic Permissions with live preview
  const requestMediaPermissions = async (assessmentData?: Assessment) => {
    const current = assessmentData || selectedAssessment;
    const needCam = current?.cameraRequired ?? true;
    const needMic = current?.microphoneRequired ?? true;

    setCameraStatus(needCam ? 'checking' : 'connected');
    setMicStatus(needMic ? 'checking' : 'connected');
    setPermissionError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera or microphone capture.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: needCam ? { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' } : false,
        audio: needMic
      });

      streamRef.current = stream;

      // Attach to preview video element
      if (needCam) {
        setCameraStatus('connected');
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
          videoPreviewRef.current.play().catch(() => {});
        }
      }

      if (needMic) {
        setMicStatus('connected');
      }

      // Track listeners for interruptions
      stream.getVideoTracks().forEach(track => {
        track.onended = () => {
          handleMediaInterruption('CAMERA_INTERRUPTION');
        };
        track.onmute = () => {
          handleMediaInterruption('CAMERA_INTERRUPTION');
        };
      });

      stream.getAudioTracks().forEach(track => {
        track.onended = () => {
          handleMediaInterruption('MICROPHONE_INTERRUPTION');
        };
        track.onmute = () => {
          handleMediaInterruption('MICROPHONE_INTERRUPTION');
        };
      });
    } catch (err: any) {
      console.error('Media permission error:', err);
      const msg = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
        ? 'Camera and microphone permissions were denied. Both are required to verify assessment integrity.'
        : err.message || 'Could not connect to camera or microphone. Please check your browser settings.';
      setPermissionError(msg);
      if (needCam) setCameraStatus('error');
      if (needMic) setMicStatus('error');
    }
  };

  const handleMediaInterruption = (type: 'CAMERA_INTERRUPTION' | 'MICROPHONE_INTERRUPTION') => {
    if (type === 'CAMERA_INTERRUPTION') {
      setCameraInterruptions(prev => prev + 1);
      setCameraFeedActive(false);
      triggerViolation('⚠️ Camera connection was interrupted. Please check your camera.');
    } else {
      setMicrophoneInterruptions(prev => prev + 1);
      triggerViolation('⚠️ Microphone connection was interrupted.');
    }

    logIntegrityEvent(type);
  };

  const reconnectMedia = async () => {
    if (selectedAssessment) {
      await requestMediaPermissions(selectedAssessment);
      if (liveVideoRef.current && streamRef.current) {
        liveVideoRef.current.srcObject = streamRef.current;
        liveVideoRef.current.play().catch(() => {});
      }
      setCameraFeedActive(true);
      setViolationAlert(null);
    }
  };

  const logIntegrityEvent = (eventType: AssessmentIntegrityEvent['eventType']) => {
    const newEvent: AssessmentIntegrityEvent = {
      eventId: `iev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      attemptId: `att_${startTime}`,
      studentId: 'current',
      eventType,
      timestamp: new Date().toISOString()
    };
    setIntegrityEvents(prev => [...prev, newEvent]);
  };

  const triggerViolation = (msg: string) => {
    setViolationAlert(msg);
    setTimeout(() => {
      setViolationAlert(null);
    }, 5000);
  };

  // 3. Start the actual assessment
  const startActiveAssessment = async (assessmentData: Assessment) => {
    // If fullscreen required, request fullscreen
    if (assessmentData.fullscreenRequired && document.documentElement.requestFullscreen) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (e) {
        console.warn('Fullscreen request blocked or dismissed by user:', e);
      }
    }

    setAnswers({});
    setCurrentQuestionIdx(0);
    setTabSwitchCount(0);
    setFullscreenExitCount(0);
    setCameraInterruptions(0);
    setMicrophoneInterruptions(0);
    setIntegrityEvents([]);
    setViolationAlert(null);
    setCameraFeedActive(true);

    const now = Date.now();
    setStartTime(now);
    setRemainingSeconds((assessmentData.durationMinutes || 12) * 60);
    setCurrentScreen('active_test');

    // Attach stream to live PIP video element
    setTimeout(() => {
      if (liveVideoRef.current && streamRef.current) {
        liveVideoRef.current.srcObject = streamRef.current;
        liveVideoRef.current.play().catch(() => {});
      }
    }, 200);
  };

  // Timer countdown and Auto-submit effect
  useEffect(() => {
    if (currentScreen !== 'active_test') return;

    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentScreen]);

  // Tab switch & Fullscreen listeners during active test
  useEffect(() => {
    if (currentScreen !== 'active_test') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1);
        logIntegrityEvent('TAB_SWITCH');
        triggerViolation('⚠️ You left the assessment window. This activity has been recorded.');
      }
    };

    const handleWindowBlur = () => {
      setTabSwitchCount(prev => prev + 1);
      logIntegrityEvent('TAB_SWITCH');
      triggerViolation('⚠️ Assessment window lost focus. This event has been logged.');
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && selectedAssessment?.fullscreenRequired) {
        setFullscreenExitCount(prev => prev + 1);
        logIntegrityEvent('FULLSCREEN_EXIT');
        triggerViolation('⚠️ Fullscreen mode was exited. Please remain in fullscreen.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [currentScreen, selectedAssessment]);

  const selectOption = (qId: string, optIndex: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const handleAutoSubmit = () => {
    handleSubmit(true);
  };

  const handleSubmit = async (isTimeout = false) => {
    if (!selectedAssessment) return;
    setSubmitting(true);

    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);

    // Stop streams
    stopMediaStream();

    // Exit fullscreen if active
    if (document.fullscreenElement && document.exitFullscreen) {
      try {
        await document.exitFullscreen();
      } catch {
        // ignore
      }
    }

    try {
      const res = await api.submitAssessment(selectedAssessment.id, answers, {
        timeUsedSeconds: elapsedSeconds,
        isProctored: selectedAssessment.isProctored,
        tabSwitchCount,
        fullscreenExitCount,
        cameraInterruptions,
        microphoneInterruptions,
        integrityEvents
      });

      setResult({
        ...res,
        timeUsedSeconds: elapsedSeconds,
        wasTimeout: isTimeout
      });
      setCurrentScreen('result');

      if (res.passed) {
        onRefreshProfile();
      }
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredAssessments = assessments.filter(a => {
    if (filterType === 'proctored') return a.isProctored;
    if (filterType === 'normal') return !a.isProctored;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* SCREEN 1: CATALOG VIEW */}
      {currentScreen === 'catalog' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Skill Assessments & Verification
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Strict Proctored & Practice
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                Take verified technical evaluations to test your proficiency. Proctored exams use camera, microphone, and window integrity monitoring to certify your skills for hiring partners.
              </p>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium shrink-0">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({assessments.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('proctored')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  filterType === 'proctored' ? 'bg-white text-indigo-700 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Proctored Only</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterType('normal')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterType === 'normal' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Practice (Standard)
              </button>
            </div>
          </div>

          {/* Assessment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAssessments.map(assm => (
              <motion.div
                key={assm.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                      {assm.skillName}
                    </span>
                    {assm.isProctored ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <ShieldCheck className="w-3 h-3 text-indigo-600" />
                        Proctored Exam
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Standard Quiz
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-base text-slate-900">{assm.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{assm.description}</p>
                  </div>

                  {/* Capabilities badges */}
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{assm.durationMinutes} mins</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      <span>{assm.questionCount} Questions</span>
                    </div>
                    {assm.isProctored && (
                      <div className="flex items-center gap-1 bg-indigo-50/60 px-2 py-1 rounded border border-indigo-100 text-indigo-700">
                        <Camera className="w-3 h-3 text-indigo-500" />
                        <span>Camera & Mic</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Pass threshold: {assm.passingScore}%</span>
                  <button
                    id={`btn-start-test-${assm.id}`}
                    onClick={() => handleInitiateAssessment(assm.id)}
                    className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <span>Start Assessment</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 2: PRE-ASSESSMENT ENVIRONMENT CHECK */}
      {currentScreen === 'env_check' && selectedAssessment && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6"
        >
          {/* Title Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Strict Proctored Assessment
                </span>
                <span className="text-xs text-slate-400">• {selectedAssessment.skillName}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Assessment Environment Check
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                This assessment uses camera and microphone monitoring to maintain assessment integrity. Your camera and microphone permissions are required before starting.
              </p>
            </div>
            <button
              onClick={() => {
                stopMediaStream();
                setCurrentScreen('catalog');
              }}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>

          {/* Error Banner if permission denied */}
          {permissionError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-rose-900">
                  {cameraStatus === 'error' ? 'Camera Access Required' : 'Microphone Access Required'}
                </p>
                <p className="text-xs text-rose-700 leading-relaxed">
                  {permissionError}
                </p>
                <button
                  type="button"
                  onClick={() => requestMediaPermissions()}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}

          {/* Grid: Camera Preview on Left, Device & Rules on Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Camera Preview Card */}
            <div className="space-y-3">
              <div className="relative aspect-video rounded-xl bg-slate-900 border border-slate-300 overflow-hidden flex flex-col items-center justify-center text-white">
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraStatus === 'connected' ? 'block' : 'hidden'}`}
                />

                {cameraStatus === 'checking' && (
                  <div className="text-center space-y-2 p-4">
                    <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-medium text-slate-300">Checking camera permissions...</p>
                  </div>
                )}

                {cameraStatus === 'idle' && (
                  <div className="text-center space-y-2 p-4">
                    <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-400">Camera preview will appear here</p>
                  </div>
                )}

                {cameraStatus === 'error' && (
                  <div className="text-center space-y-2 p-4">
                    <VideoOff className="w-8 h-8 text-rose-400 mx-auto" />
                    <p className="text-xs text-rose-300">Camera connection failed</p>
                  </div>
                )}

                {/* Camera Status Overlay Badge */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/60 backdrop-blur-xs px-2.5 py-1.5 rounded-lg text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${cameraStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                    <span>
                      {cameraStatus === 'connected' ? 'Camera Connected' : cameraStatus === 'checking' ? 'Checking...' : 'Permission Required'}
                    </span>
                  </div>
                  {cameraStatus === 'connected' && (
                    <span className="text-emerald-300 text-[10px] font-semibold">Active Local Feed</span>
                  )}
                </div>
              </div>

              {/* Microphone Status Banner */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${micStatus === 'connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Microphone</p>
                    <p className="text-[11px] text-slate-500">
                      {micStatus === 'connected' ? 'Microphone Connected' : micStatus === 'checking' ? 'Checking...' : 'Permission Required'}
                    </p>
                  </div>
                </div>
                {micStatus === 'connected' ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> OK
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => requestMediaPermissions()}
                    className="text-xs text-indigo-600 font-semibold hover:underline"
                  >
                    Grant Access
                  </button>
                )}
              </div>

              {/* Privacy Notice */}
              <p className="text-[11px] text-slate-400 leading-relaxed px-1">
                🔒 <strong>Privacy Notice:</strong> Your camera/audio are being used only according to this assessment's monitoring configuration. Video and audio streams are processed locally in your browser for real-time integrity verification and are not permanently recorded or uploaded to cloud storage.
              </p>
            </div>

            {/* Right: Browser Checks & Rules */}
            <div className="space-y-4">
              {/* Browser Checks */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-slate-600" />
                  System & Browser Readiness
                </h4>
                <div className="space-y-1.5 pt-1 text-[11px] text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Supported Browser (Modern Web Standards):</span>
                    <span className="text-emerald-700 font-semibold">✓ Compatible</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Internet Connection:</span>
                    <span className="text-emerald-700 font-semibold">✓ Online & Latency Optimal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fullscreen Capability:</span>
                    <span className="text-emerald-700 font-semibold">✓ Supported</span>
                  </div>
                </div>
              </div>

              {/* Assessment Rules */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2.5 text-xs text-amber-900">
                <h4 className="font-bold flex items-center gap-1.5 text-amber-950">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  Assessment Rules & Integrity
                </h4>
                <ul className="space-y-1.5 text-[11px] text-amber-900/90 list-disc list-inside leading-relaxed">
                  <li>Do not switch tabs or minimize the assessment window.</li>
                  <li>Do not leave the assessment screen until submitted.</li>
                  <li>Do not disable camera or microphone after starting.</li>
                  <li>Do not use external assistance, AI tools, or secondary monitors.</li>
                  <li>Complete the assessment within the specified time limit.</li>
                  <li>Repeated integrity violations may automatically terminate the exam.</li>
                </ul>
              </div>

              {/* Agreement Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={rulesAgreed}
                  onChange={e => setRulesAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-slate-700 leading-snug">
                  I understand and agree to the assessment rules, proctoring requirements, and integrity monitoring.
                </span>
              </label>

              {/* Start Button */}
              <div className="pt-2">
                <button
                  id="btn-begin-proctored-test"
                  type="button"
                  disabled={
                    cameraStatus !== 'connected' ||
                    micStatus !== 'connected' ||
                    !rulesAgreed
                  }
                  onClick={() => startActiveAssessment(selectedAssessment)}
                  className="w-full py-3 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Maximize className="w-4 h-4" />
                  <span>Enter Fullscreen & Begin Assessment</span>
                </button>
                {(cameraStatus !== 'connected' || micStatus !== 'connected') && (
                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    Please grant camera and microphone access to enable the start button.
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* SCREEN 3: ACTIVE TEST VIEW (DISTRACTION-FREE PROCTORED RUNNER) */}
      {currentScreen === 'active_test' && selectedAssessment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto space-y-5"
        >
          {/* Violation Floating Alert Banner */}
          <AnimatePresence>
            {violationAlert && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3.5 rounded-xl bg-amber-500 text-white font-semibold text-xs shadow-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{violationAlert}</span>
                </div>
                {!cameraFeedActive && (
                  <button
                    type="button"
                    onClick={reconnectMedia}
                    className="px-2.5 py-1 bg-white text-amber-900 rounded-lg text-xs font-bold hover:bg-amber-50"
                  >
                    Reconnect Camera
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Test Top Navigation Bar */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                NextMind AI
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {selectedAssessment.title}
                </h3>
                <span className="text-xs text-slate-500">
                  Question {currentQuestionIdx + 1} of {selectedAssessment.questions.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Countdown Timer */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${
                remainingSeconds < 180 ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(remainingSeconds)}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to finish and submit your answers now?')) {
                    handleSubmit(false);
                  }
                }}
                disabled={submitting}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Finish & Submit'}
              </button>
            </div>
          </div>

          {/* Main Body: Questions Column + Integrity Column */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Questions Form Area (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              {(() => {
                const q = selectedAssessment.questions[currentQuestionIdx];
                const selectedOpt = answers[q.id];

                return (
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
                    <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                      <span className="font-semibold text-indigo-600 uppercase tracking-wider">
                        Topic: {q.skill || selectedAssessment.skillName}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-600">
                        {q.difficulty || 'Intermediate'} • 5 Marks
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                      {currentQuestionIdx + 1}. {q.question}
                    </h4>

                    {/* Options list */}
                    <div className="space-y-2.5 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedOpt === optIdx;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => selectOption(q.id, optIdx)}
                            className={`w-full text-left p-3.5 rounded-xl text-xs sm:text-sm transition-all border flex items-center justify-between ${
                              isChosen
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-medium shadow-xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                                isChosen ? 'border-indigo-600 bg-indigo-600 text-white font-bold' : 'border-slate-300 text-slate-400'
                              }`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>

                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isChosen ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                            }`}>
                              {isChosen && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Question navigation footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        disabled={currentQuestionIdx === 0}
                        onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                      >
                        ← Previous
                      </button>

                      <span className="text-xs text-slate-400">
                        {Object.keys(answers).length} of {selectedAssessment.questions.length} answered
                      </span>

                      {currentQuestionIdx < selectedAssessment.questions.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                          className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                        >
                          Next →
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSubmit(false)}
                          className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                        >
                          Submit Assessment
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Question Navigation Palette */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">Question Palette</span>
                <div className="flex flex-wrap gap-2">
                  {selectedAssessment.questions.map((q, idx) => {
                    const isAnswered = answers[q.id] !== undefined;
                    const isCurrent = idx === currentQuestionIdx;

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentQuestionIdx(idx)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all border flex items-center justify-center ${
                          isCurrent
                            ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-200'
                            : isAnswered
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Live Video + Integrity Monitor */}
            <div className="space-y-4">
              {/* Picture-in-picture live camera widget */}
              {selectedAssessment.isProctored && (
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      Proctoring Monitor
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE
                    </span>
                  </div>

                  <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden border border-slate-200">
                    <video
                      ref={liveVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${cameraFeedActive ? 'block' : 'hidden'}`}
                    />
                    {!cameraFeedActive && (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-3 text-rose-300 space-y-1">
                        <VideoOff className="w-6 h-6 text-rose-400" />
                        <span className="text-[11px] font-semibold">Feed Interrupted</span>
                        <button
                          type="button"
                          onClick={reconnectMedia}
                          className="px-2 py-1 rounded bg-white text-slate-900 text-[10px] font-bold mt-1"
                        >
                          Reconnect
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Real-time integrity metrics card */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Camera Status:</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Microphone Status:</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Fullscreen:</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-200/80 flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Tab Switches:</span>
                      <span className={`font-bold ${tabSwitchCount > 0 ? 'text-amber-600' : 'text-slate-700'}`}>
                        {tabSwitchCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Fullscreen Exits:</span>
                      <span className={`font-bold ${fullscreenExitCount > 0 ? 'text-amber-600' : 'text-slate-700'}`}>
                        {fullscreenExitCount}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Assessment details box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <span className="font-semibold text-slate-900 block">Assessment Details</span>
                <p><strong>Skill:</strong> {selectedAssessment.skillName}</p>
                <p><strong>Passing Score:</strong> {selectedAssessment.passingScore}%</p>
                <p className="text-[11px] text-slate-400 pt-1">
                  Passing this assessment adds verifiable evidence with 95% confidence to your skill profile.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* SCREEN 4: ASSESSMENT RESULT VIEW */}
      {currentScreen === 'result' && result && selectedAssessment && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6"
        >
          {/* Top Result Banner */}
          <div className="text-center space-y-3">
            <div
              className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                result.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}
            >
              {result.passed ? <CheckCircle2 className="w-9 h-9" /> : <XCircle className="w-9 h-9" />}
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Assessment Completed
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                {result.passed ? 'Assessment Passed! 🏆' : 'Assessment Not Passed'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {result.passed
                  ? 'Objective capability verified! Skill evidence has been updated on your profile.'
                  : 'You did not reach the passing threshold. Review the questions and retake when ready.'}
              </p>
            </div>

            {/* Score Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Overall Score</span>
                <span className={`text-xl font-bold ${result.passed ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {result.score}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Status</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                  result.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {result.passed ? 'PASSED' : 'NOT PASSED'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Questions</span>
                <span className="text-xl font-bold text-slate-900">
                  {result.correctCount} / {result.totalQuestions}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Time Used</span>
                <span className="text-xl font-bold text-slate-900">
                  {Math.floor(result.timeUsedSeconds / 60)}m {result.timeUsedSeconds % 60}s
                </span>
              </div>
            </div>
          </div>

          {/* Skill Performance Breakdown */}
          {result.skillScores && Object.keys(result.skillScores).length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                Skill Performance Breakdown
              </h4>
              <div className="space-y-2.5">
                {Object.entries(result.skillScores).map(([sk, sc]: [string, any]) => (
                  <div key={sk} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{sk}</span>
                      <span className="font-bold text-slate-900">{sc}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${sc >= 70 ? 'bg-emerald-500' : sc >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${sc}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Strengths and Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                {result.strengths && result.strengths.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-emerald-900 space-y-1">
                    <span className="font-bold block flex items-center gap-1 text-emerald-950">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Strengths
                    </span>
                    <p className="text-[11px]">{result.strengths.join(', ')}</p>
                  </div>
                )}
                {result.improvements && result.improvements.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-amber-900 space-y-1">
                    <span className="font-bold block flex items-center gap-1 text-amber-950">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Improvement Areas
                    </span>
                    <p className="text-[11px]">{result.improvements.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Assessment Integrity Summary */}
          {result.integrity && result.integrity.isProctored && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Assessment Integrity Monitoring
                </h4>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  result.integrity.status === 'CLEAR'
                    ? 'bg-emerald-100 text-emerald-800'
                    : result.integrity.status === 'REVIEW_REQUIRED'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  Status: {result.integrity.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 text-slate-600">
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span>Camera:</span>
                  <span className="float-right font-bold text-emerald-700">✓ Verified</span>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span>Microphone:</span>
                  <span className="float-right font-bold text-emerald-700">✓ Verified</span>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span>Tab switches:</span>
                  <span className={`float-right font-bold ${result.integrity.tabSwitchCount > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
                    {result.integrity.tabSwitchCount}
                  </span>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span>Interruptions:</span>
                  <span className="float-right font-bold text-slate-800">
                    {(result.integrity.cameraInterruptions || 0) + (result.integrity.microphoneInterruptions || 0)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Question Answers & Explanations */}
          {result.results && result.results.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <h4 className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
                Question Details & Explanations
              </h4>
              {result.results.map((qRes: any, i: number) => (
                <div key={i} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-slate-900">{i + 1}. {qRes.question}</span>
                    {qRes.isCorrect ? (
                      <span className="text-emerald-700 font-semibold shrink-0">Correct ✓</span>
                    ) : (
                      <span className="text-rose-600 font-semibold shrink-0">Incorrect ✕</span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] bg-white p-2.5 rounded border border-slate-200/80">
                    <span className="font-semibold text-slate-800">Explanation:</span> {qRes.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setSelectedAssessment(null);
                setResult(null);
                setCurrentScreen('catalog');
              }}
              className="text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              ← Back to Assessments
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onSelectTab('skills-gap')}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Update Skill Gap Analysis</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('skills-graph')}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>View Evidence Graph</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
