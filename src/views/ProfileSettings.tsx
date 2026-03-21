import React, { useContext, useState, FormEvent } from 'react';
import { AppContext } from '../AppContext';
import { useToast } from '../components/Toast';

const ProfileSettings: React.FC = () => {
    const { profile, updateProfile } = useContext(AppContext);
    const { showToast } = useToast();
    
    const [nameInput, setNameInput] = useState<string>(profile?.full_name || '');
    const [paymentMethod, setPaymentMethod] = useState<string>(profile?.payment_method || 'PayPal');
    const [paymentAddress, setPaymentAddress] = useState<string>(profile?.payment_address || '');
    const [saving, setSaving] = useState<boolean>(false);

    const handleSave = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setSaving(true);
        await updateProfile({
            full_name: nameInput,
            payment_method: paymentMethod,
            payment_address: paymentAddress,
        });
        setSaving(false);
        showToast('Profile updated successfully!', 'success');
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600 }}>Profile & Settings</h2>
            
            <div className="card">
                <form onSubmit={handleSave}>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px', color: 'var(--text-secondary)' }}>Display Name</label>
                        <input 
                            type="text" 
                            value={nameInput} 
                            onChange={e => setNameInput(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #dfe1e6', fontSize: '14px' }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px', color: 'var(--text-secondary)' }}>Payment Method</label>
                        <select 
                            value={paymentMethod} 
                            onChange={e => setPaymentMethod(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #dfe1e6', fontSize: '14px' }}
                        >
                            <option value="PayPal">PayPal</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Crypto">Cryptocurrency (USDT)</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px', color: 'var(--text-secondary)' }}>Payment Address (Account / Wallet)</label>
                        <input 
                            type="text" 
                            value={paymentAddress} 
                            onChange={e => setPaymentAddress(e.target.value)}
                            placeholder="e.g. paypal@email.com or Wallet address"
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #dfe1e6', fontSize: '14px' }}
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;
