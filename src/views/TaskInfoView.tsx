import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import { CheckCircle, Layers, CheckSquare } from 'lucide-react';
import './TaskInfoView.css';

const TaskInfoView: React.FC = () => {
    const { profile } = useContext(AppContext);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600 }}>Task Information</h2>
            
            <p className="text-muted" style={{ marginBottom: '24px' }}>
                Here is a summary of all the AI Training Tasks you have successfully completed on the platform.
            </p>

            <div className="card">
                <div className="task-info-grid">
                    
                    <div style={{ padding: '24px', background: '#f7f8fa', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ background: '#ebf4ff', padding: '16px', borderRadius: '50%', color: '#4299e1' }}>
                            <CheckSquare size={32} />
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', fontWeight: 600 }}>Questions Answered</div>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>{profile?.total_answered ?? 0}</div>
                        </div>
                    </div>

                    <div style={{ padding: '24px', background: '#f7f8fa', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ background: '#edf2f7', padding: '16px', borderRadius: '50%', color: '#4a5568' }}>
                            <Layers size={32} />
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', fontWeight: 600 }}>Batches Completed</div>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>{profile?.tasks_completed ?? 0}</div>
                        </div>
                    </div>

                    <div style={{ padding: '24px', background: '#f7f8fa', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '20px', gridColumn: '1 / -1' }}>
                        <div style={{ background: '#e3fceb', padding: '16px', borderRadius: '50%', color: 'var(--green)' }}>
                            <CheckCircle size={32} />
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', fontWeight: 600 }}>Correct Answers</div>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--green)' }}>{profile?.correct_answers ?? 0}</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TaskInfoView;
