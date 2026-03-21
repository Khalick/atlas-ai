import React, { useState, useContext } from 'react';
import { AppContext } from '../AppContext';
import { supabase } from '../supabaseClient';
import { useToast } from '../components/Toast';
import { CheckCircle, XCircle, ArrowRight, AlertTriangle, ImageIcon } from 'lucide-react';
import './TasksView.css';

interface Question {
    id: string;
    category: string;
    question_text: string;
    image_url: string | null;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
}

const TASK_TIERS = [
    { id: 1, title: 'AI Model Training — Comprehensive', payout: 0.70, batchSize: 10, desc: '10 questions • Mixed categories' },
    { id: 2, title: 'AI Model Training — Standard', payout: 0.40, batchSize: 6, desc: '6 questions • Focus on accuracy' },
    { id: 3, title: 'AI Model Training — Quick Batch', payout: 0.30, batchSize: 4, desc: '4 questions • Rapid assessment' }
];

const TasksView: React.FC = () => {
    const { profile, completeTask } = useContext(AppContext);
    const { showToast } = useToast();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [correctCount, setCorrectCount] = useState<number>(0);
    const [taskActive, setTaskActive] = useState<boolean>(false);
    const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [taskCompleted, setTaskCompleted] = useState<boolean>(false);

    // Track which tier is currently being played
    const [currentPayout, setCurrentPayout] = useState<number>(0);

    const isPaused = profile?.is_paused ?? false;
    const earnings = profile?.earnings ?? 0;
    const accuracy = profile?.accuracy ?? 0;
    const totalAnswered = profile?.total_answered ?? 0;

    const fetchRandomQuestions = async (batchSize: number): Promise<void> => {
        setLoadingQuestions(true);
        const { count } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true });

        const total = count || 0;
        if (total === 0) {
            setLoadingQuestions(false);
            return;
        }

        const maxOffset = Math.max(0, total - batchSize);
        const randomOffset = Math.floor(Math.random() * maxOffset);

        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .range(randomOffset, randomOffset + batchSize - 1);

        if (error) {
            console.error('Error fetching questions:', error);
        } else {
            setQuestions(data as Question[]);
        }
        setLoadingQuestions(false);
    };

    const startTask = async (payout: number, batchSize: number): Promise<void> => {
        setCurrentPayout(payout);
        await fetchRandomQuestions(batchSize);
        setCurrentIndex(0);
        setCorrectCount(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setTaskActive(true);
        setTaskCompleted(false);
    };

    const selectAnswer = (answer: string): void => {
        if (showResult) return; 
        setSelectedAnswer(answer);
    };

    const submitAnswer = (): void => {
        if (!selectedAnswer || !questions[currentIndex]) return;

        const isCorrect = selectedAnswer === questions[currentIndex].correct_answer;
        if (isCorrect) {
            setCorrectCount(prev => prev + 1);
        }
        setShowResult(true);
    };

    const nextQuestion = (): void => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setTaskCompleted(true);
        }
    };

    const finishTask = async (): Promise<void> => {
        setSubmitting(true);
        await completeTask(currentPayout, correctCount, questions.length);
        setSubmitting(false);
        setTaskActive(false);
        setTaskCompleted(false);
        showToast(`Task Complete! You earned $${currentPayout.toFixed(2)}. You got ${correctCount}/${questions.length} correct.`, 'success');
    };

    if (isPaused) {
        return (
            <div className="tasks-container">
                <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
                    <AlertTriangle size={48} style={{ color: '#e53e3e', margin: '0 auto 16px' }} />
                    <h2 style={{ color: '#e53e3e', marginBottom: '12px' }}>Account Under Review</h2>
                    <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
                        Your accuracy has dropped below 65% ({accuracy.toFixed(1)}%).
                        Your account has been temporarily paused for quality review.
                        Please contact support for assistance.
                    </p>
                    <div style={{ marginTop: '24px', padding: '16px', background: '#fff5f5', borderRadius: '8px', fontSize: '14px' }}>
                        <strong>Your Stats:</strong> {profile?.correct_answers}/{profile?.total_answered} correct answers ({accuracy.toFixed(1)}% accuracy)
                    </div>
                </div>
            </div>
        );
    }

    if (taskCompleted && taskActive) {
        const batchAccuracy = questions.length > 0 ? ((correctCount / questions.length) * 100).toFixed(1) : '0';
        return (
            <div className="tasks-container">
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <CheckCircle size={48} style={{ color: 'var(--green)', margin: '0 auto 16px' }} />
                    <h2 style={{ marginBottom: '8px' }}>Batch Complete!</h2>
                    <p className="text-muted" style={{ marginBottom: '24px' }}>Here's how you did on this task batch:</p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '24px' }}>
                        <div>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--green)' }}>{correctCount}/{questions.length}</div>
                            <div className="text-muted" style={{ fontSize: '13px' }}>Correct Answers</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4a5568' }}>{batchAccuracy}%</div>
                            <div className="text-muted" style={{ fontSize: '13px' }}>Batch Accuracy</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff914d' }}>${currentPayout.toFixed(2)}</div>
                            <div className="text-muted" style={{ fontSize: '13px' }}>Earned</div>
                        </div>
                    </div>

                    <button className="btn-primary" onClick={finishTask} disabled={submitting} style={{ backgroundColor: 'var(--green)', padding: '12px 40px', fontSize: '16px' }}>
                        {submitting ? 'Saving...' : 'Claim Earnings'}
                    </button>
                </div>
            </div>
        );
    }

    if (taskActive && questions.length > 0) {
        const q = questions[currentIndex];
        const options = [
            { label: 'A', text: q.option_a },
            { label: 'B', text: q.option_b },
            { label: 'C', text: q.option_c },
            { label: 'D', text: q.option_d },
        ];

        return (
            <div className="tasks-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>AI Training Task</h2>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span className="text-muted">Question {currentIndex + 1}/{questions.length}</span>
                        <span style={{ fontWeight: 600, color: 'var(--green)' }}>{correctCount} correct</span>
                    </div>
                </div>

                <div className="progress-bar" style={{ marginBottom: '24px', height: '8px' }}>
                    <div className="progress" style={{ width: `${((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100}%`, transition: 'width 0.3s ease' }}></div>
                </div>

                <div className="card" style={{ padding: '30px' }}>
                    <div style={{ marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', color: '#a0aec0', fontWeight: 600, letterSpacing: '1px' }}>
                        {q.category}
                    </div>

                    {q.image_url && (
                        <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', maxHeight: '280px', display: 'flex', justifyContent: 'center', background: '#f7f8fa' }}>
                            <img 
                                src={q.image_url} 
                                alt="Question visual" 
                                style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'cover' }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        </div>
                    )}

                    <h3 style={{ fontSize: '20px', lineHeight: '1.5', marginBottom: '28px', fontWeight: 600 }}>
                        {q.image_url && <ImageIcon size={20} style={{ marginRight: '10px', verticalAlign: 'middle', color: '#a0aec0' }} />}
                        {q.question_text}
                    </h3>

                    <div className="options-grid">
                        {options.map(opt => {
                            let className = 'option-btn';
                            if (showResult) {
                                if (opt.label === q.correct_answer) className += ' correct';
                                else if (opt.label === selectedAnswer && opt.label !== q.correct_answer) className += ' wrong';
                            } else if (selectedAnswer === opt.label) {
                                className += ' selected';
                            }

                            return (
                                <button
                                    key={opt.label}
                                    className={className}
                                    onClick={() => selectAnswer(opt.label)}
                                    disabled={showResult}
                                >
                                    <span className="option-label">{opt.label}</span>
                                    <span className="option-text">{opt.text}</span>
                                    {showResult && opt.label === q.correct_answer && <CheckCircle size={22} className="option-icon" />}
                                    {showResult && opt.label === selectedAnswer && opt.label !== q.correct_answer && <XCircle size={22} className="option-icon" />}
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                        {!showResult ? (
                            <button className="btn-primary" onClick={submitAnswer} disabled={!selectedAnswer} style={{ padding: '14px 48px', fontSize: '16px' }}>
                                Submit Answer
                            </button>
                        ) : (
                            <button className="btn-primary" onClick={nextQuestion} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 48px', fontSize: '16px' }}>
                                {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'} <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Landing — show available tasks
    return (
        <div className="tasks-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2>Available Tasks</h2>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--green)' }}>Balance: ${Number(earnings).toFixed(2)}</span>
                    {totalAnswered > 0 && (
                        <span style={{ fontWeight: 500, color: accuracy >= 65 ? 'var(--green)' : '#e53e3e' }}>
                            Accuracy: {accuracy.toFixed(1)}%
                        </span>
                    )}
                </div>
            </div>

            <div className="video-list">
                {TASK_TIERS.map(tier => (
                    <div key={tier.id} className="card video-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
                        <div className="video-info">
                            <h3 style={{ marginBottom: '6px', fontSize: '16px' }}>{tier.title}</h3>
                            <p className="text-muted" style={{ fontSize: '13px' }}>{tier.desc}</p>
                            {totalAnswered >= 10 && accuracy < 75 && accuracy >= 65 && (
                                <p style={{ fontSize: '12px', color: '#e53e3e', marginTop: '8px' }}>
                                    ⚠️ Your accuracy is {accuracy.toFixed(1)}%. Keep it above 65% to avoid account pause.
                                </p>
                            )}
                        </div>
                        <div className="video-action">
                            <div className="payout-badge" style={{ fontSize: '16px', padding: '8px 16px' }}>${tier.payout.toFixed(2)}</div>
                            <button 
                                className="btn-primary" 
                                onClick={() => startTask(tier.payout, tier.batchSize)} 
                                disabled={loadingQuestions} 
                                style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}
                            >
                                {loadingQuestions ? 'Loading...' : 'Start Task'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {totalAnswered > 0 && (
                <div className="card" style={{ marginTop: '24px', padding: '24px' }}>
                    <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Your Performance</h3>
                    <div style={{ display: 'flex', gap: '40px' }}>
                        <div>
                            <div className="text-muted" style={{ fontSize: '12px' }}>Total Answered</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalAnswered}</div>
                        </div>
                        <div>
                            <div className="text-muted" style={{ fontSize: '12px' }}>Correct</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--green)' }}>{profile?.correct_answers ?? 0}</div>
                        </div>
                        <div>
                            <div className="text-muted" style={{ fontSize: '12px' }}>Accuracy</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: accuracy >= 65 ? 'var(--green)' : '#e53e3e' }}>{accuracy.toFixed(1)}%</div>
                        </div>
                        <div>
                            <div className="text-muted" style={{ fontSize: '12px' }}>Batches Completed</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{profile?.tasks_completed ?? 0}</div>
                        </div>
                    </div>
                    {/* Accuracy bar */}
                    <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                            <span className="text-muted">Accuracy</span>
                            <span style={{ color: accuracy >= 65 ? 'var(--green)' : '#e53e3e', fontWeight: 500 }}>{accuracy.toFixed(1)}% (min 65%)</span>
                        </div>
                        <div className="progress-bar" style={{ height: '8px', position: 'relative' }}>
                            <div className="progress" style={{
                                width: `${Math.min(accuracy, 100)}%`,
                                backgroundColor: accuracy >= 65 ? 'var(--green)' : '#e53e3e',
                                transition: 'width 0.5s ease'
                            }}></div>
                            <div style={{
                                position: 'absolute', left: '65%', top: '-4px', bottom: '-4px',
                                width: '2px', backgroundColor: '#e53e3e', opacity: 0.5
                            }}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksView;
