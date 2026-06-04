"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModal'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'

function AddNewInterview() {
    const [openDailog,setOpenDailog]=useState(false)
    const [jobField,setJobField]=useState('Software Engineer');
    const [jobPosition,setJobPosition]=useState('');
    const [jobDesc,setJobDesc]=useState('');
    const [jobExperience,setJobExperience]=useState('');
    const [loading,setLoading]=useState(false);
    const [jsonResponse,setJsonResponse]=useState([]);
    const router=useRouter();
    const {user}=useUser();
    const onSubmit=async(e)=>{
        setLoading(true)
        e.preventDefault()
        console.log(jobField, jobPosition, jobDesc, jobExperience);

        const questionCount = 5;
        const InputPrompt = `Technical field: ${jobField}. Job role: ${jobPosition || jobField}. Job Description: ${jobDesc}. Years of Experience: ${jobExperience}. Based on this, generate ${questionCount} interview questions with answers in JSON format. Use an array of objects with question and answer fields only.`

        // Try sending to Gemini with retries/backoff, then fall back to a small local sample
        let MockJsonResp = null;
        const maxAttempts = 3;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const result = await chatSession.sendMessage(InputPrompt);
                let rawResp = (result.response.text()).replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
                // Sanitize: replace literal newlines/tabs with spaces to normalize JSON
                rawResp = rawResp.replace(/[\n\r\t]/g, ' ').replace(/\s+/g, ' ');
                // Validate it's valid JSON
                JSON.parse(rawResp);
                MockJsonResp = rawResp;
                break; // success
            } catch (err) {
                console.warn(`AI generation attempt ${attempt} failed:`, err?.message || err);
                if (attempt < maxAttempts) {
                    // exponential backoff
                    const waitMs = 500 * Math.pow(2, attempt);
                    await new Promise(res => setTimeout(res, waitMs));
                    continue;
                }
            }
        }

        // If still no response, use a conservative local fallback so the user can continue
        if (!MockJsonResp) {
            console.error('AI generation failed after retries. Using local fallback.');
            const fallback = [
                { question: 'Tell me about yourself and your background.', answer: 'Briefly describe your experience and key accomplishments.' },
                { question: 'Explain a challenging bug you fixed and how you approached it.', answer: 'Describe the problem, debugging steps, and the final fix.' },
                { question: 'How do you ensure code quality in a team?', answer: 'Mention code reviews, testing, linting, and CI practices.' },
                { question: 'Describe a project where you improved performance.', answer: 'Explain the bottleneck, measurements, and optimizations applied.' },
                { question: 'How do you stay up to date with new technologies?', answer: 'Talk about blogs, courses, and hands-on experimentation.' }
            ];
            MockJsonResp = JSON.stringify(fallback);
        }

        let parsedJson = null;
        try {
            parsedJson = JSON.parse(MockJsonResp);
            console.log(parsedJson);
        } catch (error) {
            console.error('Failed to parse AI response as JSON:', error, MockJsonResp);
        }
        setJsonResponse(MockJsonResp);

        if (MockJsonResp) {
            const resp = await db.insert(MockInterview)
            .values({
                mockId: uuidv4(),
                jsonMockResp: MockJsonResp,
                jobPosition: jobPosition || jobField,
                jobDesc: jobDesc,
                jobExperience: jobExperience,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-yyyy')
            }).returning({mockId: MockInterview.mockId});

            console.log("Inserted ID:", resp)
            if (resp) {
                setOpenDailog(false);
                router.push('/dashboard/interview/' + resp[0]?.mockId)
            }
        } else {
            console.log("ERROR");
        }
        setLoading(false);
    }
  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary
        hover:scale-105 hover:shadow-md cursor-pointer
         transition-all border-dashed'
         onClick={()=>setOpenDailog(true)}
         >
            <h2 className='text-lg text-center'>+ Add New</h2>
        </div>
        <Dialog open={openDailog}>
       
        <DialogContent className="max-w-2xl">
            <DialogHeader >
            <DialogTitle className="text-2xl" >Tell us more about your job interviwing</DialogTitle>
            <DialogDescription>
                <form onSubmit={onSubmit}>
                <div>
                   
                    <h2>Add Details about yout job position/role, Job description and years of experience</h2>

                    <div className='mt-7 my-3'>
                        <label>Technical Field</label>
                        <select className='w-full rounded-md border p-3 mt-2 bg-white' value={jobField} onChange={(event)=>setJobField(event.target.value)}>
                            <option>Cyber Security</option>
                            <option>Data Analyst</option>
                            <option>Software Engineer</option>
                            <option>Frontend Developer</option>
                            <option>Backend Developer</option>
                            <option>DevOps Engineer</option>
                            <option>Cloud Engineer</option>
                            <option>Machine Learning Engineer</option>
                            <option>QA Engineer</option>
                            <option>Mobile Developer</option>
                            <option>UI/UX Designer</option>
                        </select>
                    </div>
                    <div className='mt-7 my-3'>
                        <label>Job Role / Position</label>
                        <Input placeholder="Ex. Full Stack Developer" 
                        onChange={(event)=>setJobPosition(event.target.value)}
                        />
                    </div>
                    <div className=' my-3'>
                        <label>Job Description / Tech Stack (In Short)</label>
                        <Textarea placeholder="Ex. React, Angular, NodeJs, MySql etc" 
                        required
                        onChange={(event)=>setJobDesc(event.target.value)} />
                    </div>
                    <div className=' my-3'>
                        <label>Years of experience</label>
                        <Input placeholder="Ex.5"  type="number"  max="100" 
                        required
                        onChange={(event)=>setJobExperience(event.target.value)}
                        />
                    </div>
                </div>
                <div className='flex gap-5 justify-end'>
                    <Button type="button" variant="ghost" onClick={()=>setOpenDailog(false)}>Cancel</Button>
                    <Button type="submit" disabled={loading} >
                        {loading? 
                        <>
                        <LoaderCircle className='animate-spin' /> Generating from AI
                        </>:'Start Interview'    
                    }
                        </Button>
                </div>
                </form>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>

    </div>
  )
}

export default AddNewInterview