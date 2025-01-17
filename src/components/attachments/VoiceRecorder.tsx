import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, Send, X } from 'lucide-react';
import { formatDuration } from '../../utils/timeUtils';
import { drawWaveform } from '../../utils/audioUtils';

interface VoiceRecorderProps {
  onSend: (blob: Blob, duration: number, waveform: number[]) => void;
  onCancel: () => void;
}

const MAX_DURATION = 120; // 2 minutes in seconds

export function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [waveform, setWaveform] = useState<number[]>([]);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrame = useRef<number>();
  const startTime = useRef<number>(0);
  const audioContext = useRef<AudioContext>();
  const analyser = useRef<AnalyserNode>();

  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContext.current = new AudioContext();
      analyser.current = audioContext.current.createAnalyser();
      const source = audioContext.current.createMediaStreamSource(stream);
      source.connect(analyser.current);
      
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      startTime.current = Date.now();
      setWaveform([]);
      
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start(100);
      setIsRecording(true);
      updateWaveform();
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const updateWaveform = () => {
    if (!analyser.current || !canvasRef.current) return;
    
    const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
    analyser.current.getByteTimeDomainData(dataArray);
    
    const normalizedData = Array.from(dataArray).map(value => (value - 128) / 128);
    setWaveform(prev => [...prev, ...normalizedData]);
    
    drawWaveform(canvasRef.current, normalizedData);
    
    const elapsed = (Date.now() - startTime.current) / 1000;
    setDuration(elapsed);
    
    if (elapsed < MAX_DURATION) {
      animationFrame.current = requestAnimationFrame(updateWaveform);
    } else {
      stopRecording();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    }
  };

  const handleSend = () => {
    if (audioChunks.current.length > 0) {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
      onSend(audioBlob, duration, waveform);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Voice Message</span>
        <button
          onClick={onCancel}
          className="p-1 text-gray-500 hover:text-gray-700 rounded-full"
        >
          <X size={16} />
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-16 bg-white rounded"
      />
      
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          {formatDuration(duration)}
        </div>
        
        <div className="flex items-center space-x-2">
          {isRecording ? (
            <button
              onClick={stopRecording}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <Square size={16} />
            </button>
          ) : audioUrl ? (
            <>
              <button
                onClick={() => {
                  const audio = new Audio(audioUrl);
                  audio.play();
                }}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                <Play size={16} />
              </button>
              <button
                onClick={() => {
                  setAudioUrl(null);
                  setWaveform([]);
                  setDuration(0);
                  audioChunks.current = [];
                }}
                className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={handleSend}
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
              >
                <Send size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={startRecording}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <Mic size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}