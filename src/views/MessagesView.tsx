import React from 'react';

const MessagesView: React.FC = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600 }}>Messages</h2>
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Your inbox is empty</h3>
                <p className="text-muted" style={{ marginTop: '8px', fontSize: '14px' }}>
                    When you receive notifications or messages from the team, they will appear here.
                </p>
            </div>
        </div>
    );
};

export default MessagesView;
