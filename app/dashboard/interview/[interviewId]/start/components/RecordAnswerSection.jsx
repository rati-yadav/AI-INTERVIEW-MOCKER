"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState, useRef } from 'react'
import Webcam from 'react-webcam'
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModal'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [interimResult, setInterimResult] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState([]);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);
  const wasRecordingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('SpeechRecognition API not supported in this browser.');
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setError('');
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      setError(event.error || event.message || 'Speech recognition error');
      setIsRecording(false);
    };

    recognition.onresult = (event) => {
      let interim = '';
      const finalTranscripts = [];

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscripts.push(transcript);
        } else {
          interim += transcript;
        }
      }

      if (finalTranscripts.length) {
        setResults((prev) => [...prev, ...finalTranscripts]);
        setUserAnswer((prev) => `${prev}${finalTranscripts.join(' ')} `.trim());
      }
      setInterimResult(interim);
    };

    recognitionRef.current = recognition;
    setSpeechSupported(true);

    return () => {
      recognition.stop();
    };
  }, []);

  useEffect(() => {
    if (!isRecording && wasRecordingRef.current && userAnswer?.trim().length > 0) {
      UpdateUserAnswer();
      wasRecordingRef.current = false;
    }
  }, [isRecording, userAnswer]);

  const StartStopRecording = async () => {
    if (!speechSupported) {
      toast('Speech recognition not supported. Use Chrome desktop and enable microphone access.');
      return;
    }

    if (!recognitionRef.current) {
      toast('Speech recognition is not initialized yet. Please wait a moment.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      wasRecordingRef.current = true;
      return;
    }

    setUserAnswer('');
    setResults([]);
    setInterimResult('');
    setError('');
    wasRecordingRef.current = false;

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Your browser does not support microphone access.');
      toast('Browser microphone access is unavailable.');
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      setError('Microphone permission denied or unavailable.');
      toast('Please allow microphone access and try again.');
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (e) {
      setError(e.message || 'Unable to start speech recognition.');
      toast('Unable to start speech recognition. Make sure microphone access is allowed.');
    }
  }

  const UpdateUserAnswer = async () => {

    console.log(userAnswer)
    setLoading(true)
    const feedbackPrompt = "Question:" + mockInterviewQuestion[activeQuestionIndex]?.question +
      ", User Answer:" + userAnswer + ",Depends on question and user answer for give interview question " +
      " please give us rating for answer and feedback as area of improvmenet if any " +
      "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
    const JsonFeedbackResp = JSON.parse(mockJsonResp);
    const resp = await db.insert(UserAnswer)
      .values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      })

    if (resp) {
      toast('User Answer recorded successfully');
      setUserAnswer('');
      setResults([]);
    }
    setResults([]);

    setLoading(false);
  }


  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
        <Image src={'/webcam.png'} width={200} height={200}
          className='absolute' />
        <Webcam
          mirrored={true}
          style={{
            height: 500,
            width: 500,
            zIndex: 10,
          }}
        />
      </div>
      {error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error} Use Chrome desktop and allow microphone access.
        </div>
      )}
      <Button
        type="button"
        disabled={loading}
        variant="outline" className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ?
          <h2 className='text-red-600 animate-pulse flex gap-2 items-center'>
            <StopCircle />Stop Recording
          </h2>
          :

          <h2 className='text-primary flex gap-2 items-center'>
            <Mic />  Record Answer</h2>}
      </Button>
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white/90 p-4 text-sm shadow-sm shadow-slate-200">
        <p className="mb-2 font-semibold">Status</p>
        <p>{isRecording ? 'Listening... speak now.' : 'Click the button to start recording.'}</p>
        {interimResult ? <p className="mt-2 text-slate-600">Interim: {interimResult}</p> : null}
        {userAnswer ? <p className="mt-2 text-slate-800">Transcript: {userAnswer}</p> : null}
      </div>

    </div>
  )
}

export default RecordAnswerSection