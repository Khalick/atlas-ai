import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';

const MessagesView: React.FC = () => {
    const { profile } = useContext(AppContext);
    const navigate = useNavigate();

    // Get first name or default to 'User'
    const name = profile?.full_name ? profile.full_name.split(' ')[0] : 'User';

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600 }}>Messages</h2>
            
            <div className="card" style={{ padding: '30px', textAlign: 'left', borderLeft: '4px solid var(--primary-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                    <div>
                        <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>From:</span> Atlas Capture Team
                    </div>
                    <div className="text-muted" style={{ fontSize: '12px' }}>Just now</div>
                </div>
                
                <h3 style={{ fontSize: '20px', marginBottom: '20px', fontWeight: 600 }}>Project Invitation: Data Tasks</h3>
                
                <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#e0e0e0' }}>
                    <p style={{ marginBottom: '15px' }}>Dear {name},</p>
                    
                    <p style={{ marginBottom: '15px' }}>
                        You're invited to a project on <strong>Atlas Capture</strong>.
                    </p>
                    
                    <p style={{ marginBottom: '15px' }}>
                        This is a remote opportunity with compensation rates of <strong>$40, $30, or $70 USD per hour</strong>, depending on task complexity.
                    </p>
                    
                    <p style={{ marginBottom: '25px' }}>
                        Tasks include simple data-related work, and full guidance will be provided throughout the process.
                    </p>
                    
                    <button 
                        className="btn-primary" 
                        onClick={() => navigate('/tasks')}
                        style={{ padding: '12px 24px', fontSize: '16px', fontWeight: 600 }}
                    >
                        Start Project
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessagesView;
