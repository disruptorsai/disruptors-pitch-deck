import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Card } from './card';

const TASKS = [
  { id: 1, text: 'Initializing web scraper...', duration: 800 },
  { id: 2, text: 'Extracting website content (header, body, footer)...', duration: 1500 },
  { id: 3, text: 'Parsing HTML structure and metadata...', duration: 1000 },
  { id: 4, text: 'Finding contact details (email, phone, address)...', duration: 1200 },
  { id: 5, text: 'Identifying social media profiles...', duration: 900 },
  { id: 6, text: 'Analyzing brand colors and visual identity...', duration: 1100 },
  { id: 7, text: 'Detecting technology stack and CMS...', duration: 1000 },
  { id: 8, text: 'Scanning for services and key features...', duration: 1300 },
  { id: 9, text: 'Analyzing competitive landscape...', duration: 1400 },
  { id: 10, text: 'Identifying strengths and opportunities...', duration: 1200 },
  { id: 11, text: 'Running AI analysis with Claude 3.5 Sonnet...', duration: 2000 },
  { id: 12, text: 'Generating comprehensive business intelligence report...', duration: 1600 },
  { id: 13, text: 'Finalizing data extraction...', duration: 800 },
];

export function TerminalLoader({ onComplete }) {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentTaskIndex >= TASKS.length) {
      setIsComplete(true);
      if (onComplete) {
        setTimeout(onComplete, 500);
      }
      return;
    }

    const currentTask = TASKS[currentTaskIndex];
    const timer = setTimeout(() => {
      setCompletedTasks((prev) => [...prev, currentTask.id]);
      setCurrentTaskIndex((prev) => prev + 1);
    }, currentTask.duration);

    return () => clearTimeout(timer);
  }, [currentTaskIndex, onComplete]);

  return (
    <Card className="bg-[#0D1117] border-[#30363D] p-8 shadow-2xl">
      <div className="max-w-3xl mx-auto">
        {/* Terminal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#30363D]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
          </div>
          <div className="flex items-center gap-2 text-[#8B949E] text-sm font-mono">
            <Terminal className="w-4 h-4" />
            <span>business-analyzer@v2.0</span>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="space-y-3 font-mono text-sm">
          {TASKS.map((task, index) => {
            const isCompleted = completedTasks.includes(task.id);
            const isCurrent = index === currentTaskIndex && !isComplete;
            const isPending = index > currentTaskIndex;

            return (
              <div
                key={task.id}
                className={`flex items-start gap-3 transition-all duration-300 ${
                  isPending ? 'opacity-30' : 'opacity-100'
                }`}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-[#3FB950] animate-in fade-in duration-200" />
                  )}
                  {isCurrent && (
                    <Loader2 className="w-4 h-4 text-[#58A6FF] animate-spin" />
                  )}
                  {isPending && (
                    <div className="w-4 h-4 rounded-full border-2 border-[#30363D]"></div>
                  )}
                </div>

                {/* Task Text */}
                <div className="flex-1">
                  <span
                    className={`${
                      isCompleted
                        ? 'text-[#7EE787]'
                        : isCurrent
                        ? 'text-[#58A6FF]'
                        : 'text-[#8B949E]'
                    }`}
                  >
                    {isCompleted && '✓ '}
                    {isCurrent && '▸ '}
                    {isPending && '○ '}
                    {task.text}
                  </span>

                  {/* Animated dots for current task */}
                  {isCurrent && (
                    <span className="inline-block ml-1">
                      <span className="animate-pulse">.</span>
                      <span className="animate-pulse delay-100">.</span>
                      <span className="animate-pulse delay-200">.</span>
                    </span>
                  )}

                  {/* Completion time */}
                  {isCompleted && (
                    <span className="ml-2 text-[#6E7681] text-xs">
                      ({task.duration}ms)
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Completion Message */}
          {isComplete && (
            <div className="mt-8 pt-6 border-t border-[#30363D] animate-in fade-in duration-500">
              <div className="flex items-center gap-3 text-[#3FB950]">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">
                  Analysis complete! Processing results...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-[#30363D]">
          <div className="flex items-center justify-between text-xs text-[#8B949E] mb-2">
            <span>
              Progress: {completedTasks.length}/{TASKS.length} tasks
            </span>
            <span>
              {Math.round((completedTasks.length / TASKS.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-[#161B22] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#58A6FF] to-[#3FB950] transition-all duration-300 ease-out"
              style={{
                width: `${(completedTasks.length / TASKS.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </Card>
  );
}
