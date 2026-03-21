import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Clock, CheckSquare, Bell, MoreHorizontal, Target } from 'lucide-react';
import './Dashboard.css';

interface ChartDataPoint {
    name: string;
    value: number;
}

const lineData: ChartDataPoint[] = [
  { name: 'Sun', value: 20 },
  { name: 'Mon', value: 10 },
  { name: 'Tue', value: 40 },
  { name: 'Wed', value: 25 },
  { name: 'Thu', value: 45 },
  { name: 'Fri', value: 35 },
  { name: 'Week', value: 65 },
];

const Dashboard: React.FC = () => {
    const { profile } = useContext(AppContext);

    const getInitials = (name: string): string => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const earnings = Number(profile?.earnings ?? 0);
    const tasksCompleted = profile?.tasks_completed ?? 0;
    const hoursWorked = profile?.hours_worked ?? 0;
    const userName = profile?.full_name ?? 'User';
    const accuracy = profile?.accuracy ?? 0;
    const totalAnswered = profile?.total_answered ?? 0;
    const isPaused = profile?.is_paused ?? false;

    return (
        <div className="dashboard-container">
            <h1 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '600' }}>My Dashboard</h1>
            
            {isPaused && (
                <div style={{ background: '#fed7d7', color: '#c53030', padding: '14px 20px', borderRadius: '10px', marginBottom: '20px', fontWeight: 500, fontSize: '14px' }}>
                    ⚠️ Your account is paused due to accuracy below 65%. Contact support for review.
                </div>
            )}

            <div className="dashboard-grid top-row">
                {/* User Profile Card */}
                <div className="card profile-card" style={{ border: '3px solid #ff914d' }}>
                    <div className="profile-header">
                        <span style={{ fontWeight: 600 }}>User Profile</span>
                        <span className="status-online"><span className="dot"></span> Online</span>
                    </div>
                    <div className="profile-avatar-large">
                        {getInitials(userName)}
                        <span className="status-badge"></span>
                    </div>
                    <h2 style={{ textAlign: 'center', marginTop: '16px' }}>{userName}</h2>
                    <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--green)', fontWeight: 500, marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                         <span className="dot"></span> Online
                    </div>
                    <div className="text-muted" style={{ textAlign: 'center', fontSize: '13px', marginTop: '8px' }}>
                        Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'recently'}
                    </div>
                </div>

                {/* Job Details Card */}
                <div className="card job-card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px' }}>
                        <h3 style={{ marginBottom: '16px' }}>Current Job Details</h3>
                        <div className="job-tier">AI Training Specialist</div>
                    </div>
                    <div className="earnings-block">
                        <div style={{ color: '#8c9cdb', fontSize: '14px', marginBottom: '8px' }}>Earnings</div>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: 'white' }}>${earnings.toFixed(2)} USD</div>
                    </div>
                    <div style={{ padding: '16px 20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Payment Status: <span style={{ color: 'var(--green)', fontWeight: 500, display: 'flex', alignItems: 'center', gap:'4px' }}>Processing <CheckSquare size={16} /></span>
                    </div>
                </div>

                {/* Activity Summary Card */}
                <div className="card activity-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
                    <h3 style={{ marginBottom: '0' }}>Activity Summary</h3>
                    
                    <div className="activity-item">
                        <div className="activity-icon dark"><CheckSquare size={20} /></div>
                        <div>
                            <div className="text-muted" style={{ fontSize: '13px' }}>Questions Answered</div>
                            <div style={{ fontSize: '24px', fontWeight: '700' }}>{totalAnswered}</div>
                        </div>
                    </div>

                    <div className="activity-item">
                        <div className="activity-icon green"><Target size={20} /></div>
                        <div>
                            <div className="text-muted" style={{ fontSize: '13px' }}>Accuracy Rate</div>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: accuracy >= 65 ? 'var(--green)' : totalAnswered > 0 ? '#e53e3e' : 'inherit' }}>
                                {totalAnswered > 0 ? `${accuracy.toFixed(1)}%` : '—'}
                            </div>
                        </div>
                    </div>

                    <div className="activity-item">
                        <div className="activity-icon dark"><Clock size={20} /></div>
                        <div>
                            <div className="text-muted" style={{ fontSize: '13px' }}>Tasks Completed</div>
                            <div style={{ fontSize: '24px', fontWeight: '700' }}>{tasksCompleted}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid bottom-row" style={{ marginTop: '24px' }}>
                {/* Recent Tasks */}
                <div className="card tasks-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3>Performance</h3>
                    </div>
                    <div className="task-list">
                        <div className="task-row">
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                                <span>Accuracy (min 65%)</span>
                                <span style={{ color: accuracy >= 65 ? 'var(--green)' : '#e53e3e' }}>{totalAnswered > 0 ? `${accuracy.toFixed(1)}%` : 'N/A'}</span>
                            </div>
                            <div className="progress-bar"><div className="progress" style={{ width: `${Math.min(accuracy, 100)}%`, backgroundColor: accuracy >= 65 ? 'var(--green)' : '#e53e3e' }}></div></div>
                        </div>
                        <div className="task-row">
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                                <span>Questions Correct</span>
                                <span>{profile?.correct_answers ?? 0}/{totalAnswered}</span>
                            </div>
                            <div className="progress-bar"><div className="progress" style={{ width: totalAnswered > 0 ? `${(Number(profile?.correct_answers ?? 0) / totalAnswered) * 100}%` : '0%' }}></div></div>
                        </div>
                        <div className="task-row">
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                                <span>Task Batches Done</span>
                                <span>{tasksCompleted}</span>
                            </div>
                            <div className="progress-bar"><div className="progress" style={{ width: `${Math.min(tasksCompleted * 10, 100)}%` }}></div></div>
                        </div>
                    </div>
                </div>

                {/* Earnings Overview */}
                <div className="card chart-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3>Earnings Overview</h3>
                        <select style={{ padding: '4px 8px', border: '1px solid #dfe1e6', borderRadius: '4px', fontSize: '13px' }}>
                            <option>Past week</option>
                        </select>
                    </div>
                    <div style={{ height: '220px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5e6c84' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5e6c84' }} tickFormatter={(v: number) => `$${v}`} />
                                <Line type="monotone" dataKey="value" stroke="var(--green)" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Notifications */}
                <div className="card notifications-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3>Notifications</h3>
                        <MoreHorizontal size={20} className="text-muted" />
                    </div>
                    <div className="notifications-list">
                        <div className="notification-item">
                            <div className="notif-icon" style={{ backgroundColor: '#fff4eb', color: '#ff914d' }}><Bell size={16} /></div>
                            <div>
                                <div style={{ fontSize: '13px', lineHeight: '1.4' }}>Welcome to Atlas Capture AI Training! Start your first task batch to begin earning.</div>
                                <div className="text-muted" style={{ fontSize: '12px', marginTop: '4px' }}>Just now</div>
                            </div>
                        </div>
                        <div className="notification-item">
                            <div className="notif-icon" style={{ backgroundColor: '#e8f7f1', color: 'var(--green)' }}><Bell size={16} /></div>
                            <div>
                                <div style={{ fontSize: '13px', lineHeight: '1.4' }}>Maintain above 65% accuracy to keep your account active and earning.</div>
                                <div className="text-muted" style={{ fontSize: '12px', marginTop: '4px' }}>Tips</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
