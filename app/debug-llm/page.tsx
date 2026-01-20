"use client";

import { useState } from 'react';
import { useMediaPipeLLM } from '@/hooks/use-mediapipe-llm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DebugLLMPage() {
    const { state, loadModel, generate } = useMediaPipeLLM();
    const [url, setUrl] = useState('https://storage.googleapis.com/mediapipe-assets/gemma-2b-it-gpu-int4.bin'); // Example URL (might be invalid, just for test)
    const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.');
    const [userPrompt, setUserPrompt] = useState('Hello!');
    const [generatedOutput, setGeneratedOutput] = useState('');
    const [debugLog, setDebugLog] = useState<string[]>([]);

    const addToLog = (msg: string) => setDebugLog(prev => [...prev, msg]);

    const handleLoad = async () => {
        addToLog(`Starting download from: ${url}`);
        try {
            await loadModel(url);
            addToLog('Load function completed.');
        } catch (e: any) {
            addToLog(`Error loading: ${e.message}`);
        }
    };

    const handleGenerate = async () => {
        addToLog('Starting generation test...');
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ];

        try {
            await generate(
                messages, 
                (text, delta) => {
                   // Real-time update
                   setGeneratedOutput(text);
                }, 
                (final) => {
                    addToLog('Generation complete.');
                }
            );
        } catch (e: any) {
            addToLog(`Error generating: ${e.message}`);
            // If it fails because model is invalid (expected with dummy URL), 
            // we can still verify the prompt construction if we logged it in the hook.
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Phase 1 Verification: MediaPipe Engine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Model URL</label>
                        <div className="flex gap-2">
                            <Input value={url} onChange={e => setUrl(e.target.value)} />
                            <Button onClick={handleLoad} disabled={state.isLoading}>
                                {state.isLoading ? 'Loading...' : 'Load URL'}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Local File Upload</label>
                        <Input 
                            type="file" 
                            accept=".bin,.task" 
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    addToLog(`Loading local file: ${file.name}`);
                                    await loadModel(file);
                                }
                            }}
                            disabled={state.isLoading}
                        />
                        {state.isLoading && (
                            <div className="text-sm text-blue-500">
                                Progress: {state.progress}% | Status: {state.text}
                            </div>
                        )}
                        <div className="text-sm">
                            Model Loaded: {state.isModelLoaded ? '✅ Yes' : '❌ No'}
                        </div>
                        {state.error && (
                            <div className="text-sm text-red-500">Error: {state.error}</div>
                        )}
                    </div>

                    <div className="space-y-2 border-t pt-4">
                        <label className="text-sm font-medium">System Prompt Injection Test</label>
                        <Input 
                            value={systemPrompt} 
                            onChange={e => setSystemPrompt(e.target.value)} 
                            placeholder="System Prompt"
                        />
                        <Input 
                            value={userPrompt} 
                            onChange={e => setUserPrompt(e.target.value)} 
                            placeholder="User Prompt"
                        />
                        <Button 
                            onClick={handleGenerate} 
                            disabled={!state.isModelLoaded}
                            variant="secondary"
                        >
                            Test Generation (Requires Valid Model)
                        </Button>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                        <label className="text-sm font-medium">Output</label>
                        <div className="bg-muted p-4 rounded-md whitespace-pre-wrap font-mono text-xs h-32 overflow-auto">
                            {generatedOutput}
                        </div>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                        <label className="text-sm font-medium">Debug Log</label>
                        <div className="bg-black text-white p-4 rounded-md whitespace-pre-wrap font-mono text-xs h-32 overflow-auto">
                            {debugLog.map((l, i) => <div key={i}>{l}</div>)}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
