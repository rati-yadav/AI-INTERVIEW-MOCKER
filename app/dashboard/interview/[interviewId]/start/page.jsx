"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import QuestionsSection from './components/QuestionsSection';
import RecordAnswerSection from './components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({params}) {

    const [interviewData,setInterviewData]=useState(null);
    const [mockInterviewQuestion,setMockInterviewQuestion]=useState([]);
    const [activeQuestionIndex,setActiveQuestionIndex]=useState(0);
    useEffect(()=>{
        GetInterviewDetails();
    },[]);

    /**
     * Used to Get Interview Details by MockId/Interview Id
     */
    const GetInterviewDetails=async()=>{
        try {
            const result=await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId,params.interviewId))

            if (!result || result.length === 0) {
                console.error('No interview found with ID:', params.interviewId);
                return;
            }

            let jsonMockResp;
            try {
                jsonMockResp = JSON.parse(result[0].jsonMockResp);
            } catch (parseErr) {
                console.error('Failed to parse JSON response:', parseErr.message);
                console.log('Raw response:', result[0].jsonMockResp);
                // Try to recover by cleaning up control characters
                try {
                    const cleaned = result[0].jsonMockResp
                        .replace(/[\r\n\t]/g, ' ')
                        .replace(/\s+/g, ' ');
                    jsonMockResp = JSON.parse(cleaned);
                } catch (cleanErr) {
                    console.error('Failed to parse even after cleaning:', cleanErr.message);
                    // Use fallback questions
                    jsonMockResp = [
                        { question: 'Tell me about yourself.', answer: 'Describe your background.' },
                        { question: 'What is your experience?', answer: 'Share your experience.' }
                    ];
                }
            }

            if (!Array.isArray(jsonMockResp)) {
                if (jsonMockResp?.questions && Array.isArray(jsonMockResp.questions)) {
                    jsonMockResp = jsonMockResp.questions;
                } else if (jsonMockResp?.mockInterviewQuestion && Array.isArray(jsonMockResp.mockInterviewQuestion)) {
                    jsonMockResp = jsonMockResp.mockInterviewQuestion;
                } else {
                    jsonMockResp = [jsonMockResp];
                }
            }

            console.log(jsonMockResp)
            setMockInterviewQuestion(jsonMockResp);
            setInterviewData(result[0]);
        } catch (err) {
            console.error('Error getting interview details:', err);
        }
    } 
  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            {/* Questions  */}
            <QuestionsSection 
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            />

            {/* Video/ Audio Recording  */}
            <RecordAnswerSection
             mockInterviewQuestion={mockInterviewQuestion}
             activeQuestionIndex={activeQuestionIndex}
             interviewData={interviewData}
            />
        </div>
        <div className='flex justify-end gap-6'>
          {activeQuestionIndex>0&&  
          <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
          {activeQuestionIndex!=mockInterviewQuestion?.length-1&& 
           <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
          {activeQuestionIndex==mockInterviewQuestion?.length-1&&  
          <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
          <Button >End Interview</Button>
          </Link>}


        </div>
    </div>
  )
}

export default StartInterview