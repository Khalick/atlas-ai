import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import { useToast } from '../components/Toast';

const WITHDRAWAL_METHODS = ['PayPal', 'Bank Transfer', 'M-Pesa', 'Bitcoin', 'USDT (TRC-20)'];

const EarningsView: React.FC = () => {
    const { profile, updateProfile } = useContext(AppContext);
    const { showToast } = useToast();
    const [withdrawing, setWithdrawing] = useState<boolean>(false);
    const [selectedMethod, setSelectedMethod] = useState<string>(profile?.payment_method || '');
    const [walletAddress, setWalletAddress] = useState<string>(profile?.payment_address || '');
    const [savingMethod, setSavingMethod] = useState<boolean>(false);
    const earnings = profile?.earnings ?? 0;
    const hasSavedMethod = !!profile?.payment_method && !!profile?.payment_address;

    const handleSaveMethod = async () => {
        if (!selectedMethod) {
            showToast('Please select a withdrawal method', 'error');
            return;
        }
        if (!walletAddress.trim()) {
            showToast('Please enter your wallet/account address', 'error');
            return;
        }
        setSavingMethod(true);
        await updateProfile({ payment_method: selectedMethod, payment_address: walletAddress.trim() });
        setSavingMethod(false);
        showToast('Withdrawal method saved successfully!', 'success');
    };

    const handleWithdraw = async () => {
        if (!hasSavedMethod) {
            showToast('Please save a withdrawal method first', 'error');
            return;
        }
        if (earnings < 20) {
            showToast('Minimum withdrawal amount is $20.00', 'error');
            return;
        }
        setWithdrawing(true);
        await updateProfile({ earnings: 0 });
        showToast(`Withdrawal of $${Number(earnings).toFixed(2)} successful! Payment takes 3-7 days to get to your wallet.`, 'success');
        setWithdrawing(false);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600 }}>My Earnings</h2>

            {/* Balance Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
                <div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '10px' }}>Total Available Balance</div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--green)' }}>${Number(earnings).toFixed(2)} USD</div>
                
                <button 
                    className="btn-primary" 
                    onClick={handleWithdraw}
                    disabled={withdrawing || earnings < 20}
                    style={{ 
                        marginTop: '24px', 
                        backgroundColor: earnings >= 20 ? 'var(--green)' : '#a0aec0', 
                        padding: '14px 40px', 
                        fontSize: '16px',
                        borderRadius: '8px',
                        cursor: earnings >= 20 ? 'pointer' : 'not-allowed'
                    }}
                >
                    {withdrawing ? 'Processing...' : `Withdraw $${Number(earnings).toFixed(2)}`}
                </button>
                <div style={{ marginTop: '16px', fontSize: '14px', color: earnings < 20 ? '#e53e3e' : 'var(--text-secondary)', fontWeight: 500 }}>
                    Note: Minimum withdrawal amount is $20.00
                </div>
            </div>

            {/* Withdrawal Method Card */}
            <div className="card" style={{ marginTop: '24px', padding: '24px' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Withdrawal Method
                    {hasSavedMethod && (
                        <span style={{ 
                            background: '#e3fceb', color: 'var(--green)', padding: '3px 10px', 
                            borderRadius: '12px', fontSize: '12px', fontWeight: 600 
                        }}>
                            ✓ Saved
                        </span>
                    )}
                </h3>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Payment Method
                    </label>
                    <select
                        value={selectedMethod}
                        onChange={e => setSelectedMethod(e.target.value)}
                        style={{ 
                            width: '100%', padding: '12px', borderRadius: '8px', 
                            border: '1px solid #dfe1e6', fontSize: '14px', background: 'white' 
                        }}
                    >
                        <option value="">Select a method...</option>
                        {WITHDRAWAL_METHODS.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Wallet / Account Address
                    </label>
                    <input
                        type="text"
                        value={walletAddress}
                        onChange={e => setWalletAddress(e.target.value)}
                        placeholder="Enter your wallet address, email, or phone number"
                        style={{ 
                            width: '100%', padding: '12px', borderRadius: '8px', 
                            border: '1px solid #dfe1e6', fontSize: '14px' 
                        }}
                    />
                </div>

                <button
                    className="btn-primary"
                    onClick={handleSaveMethod}
                    disabled={savingMethod}
                    style={{ padding: '12px 30px', fontSize: '14px' }}
                >
                    {savingMethod ? 'Saving...' : hasSavedMethod ? 'Update Method' : 'Save Method'}
                </button>
            </div>

            {/* Recent Payouts */}
            <div className="card" style={{ marginTop: '24px', padding: '24px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Recent Payouts</h3>
                <p className="text-muted" style={{ fontSize: '14px' }}>No recent withdrawals found.</p>
            </div>
        </div>
    );
};

export default EarningsView;
