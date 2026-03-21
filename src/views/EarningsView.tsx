import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import { useToast } from '../components/Toast';

const EarningsView: React.FC = () => {
    const { profile, updateProfile } = useContext(AppContext);
    const { showToast } = useToast();
    const [withdrawing, setWithdrawing] = useState<boolean>(false);
    const earnings = profile?.earnings ?? 0;

    const handleWithdraw = async () => {
        if (earnings >= 20) {
            setWithdrawing(true);
            // Simulate withdrawal delay and reset earnings
            await updateProfile({ earnings: 0 });
            showToast('Withdrawal Successful! Your funds are on the way.', 'success');
            setWithdrawing(false);
        } else {
            showToast('You can only withdraw more than $20', 'error');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600 }}>My Earnings</h2>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
                <div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '10px' }}>Total Available Balance</div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--green)' }}>${Number(earnings).toFixed(2)} USD</div>
                
                <button 
                    className="btn-primary" 
                    onClick={handleWithdraw}
                    disabled={withdrawing}
                    style={{ marginTop: '24px', backgroundColor: 'var(--dark-header)', padding: '12px 30px', fontSize: '16px' }}
                >
                    {withdrawing ? 'Processing...' : 'Withdraw Funds'}
                </button>
                <div style={{ marginTop: '16px', fontSize: '14px', color: earnings < 20 ? '#e53e3e' : 'var(--text-secondary)', fontWeight: 500 }}>
                    Note: Minimum withdrawal amount is $20.00
                </div>
            </div>
            
            {/* Added a small history placeholder for realism */}
            <div className="card" style={{ marginTop: '24px', padding: '24px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Recent Payouts</h3>
                <p className="text-muted" style={{ fontSize: '14px' }}>No recent withdrawals found.</p>
            </div>
        </div>
    );
};

export default EarningsView;
