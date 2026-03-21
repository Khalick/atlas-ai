import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';
import { supabase } from '../supabaseClient';
import { LayoutDashboard, CheckSquare, DollarSign, Mail } from 'lucide-react';
import './TopNav.css';

const TopNav: React.FC = () => {
    const { profile } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = async (): Promise<void> => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    const getInitials = (name: string): string => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="topnav">
            <div className="topnav-links">
                <NavLink to="/" className={({isActive}) => isActive ? "topnav-link active" : "topnav-link"} end>
                    <LayoutDashboard /> Dashboard
                </NavLink>
                <NavLink to="/tasks" className={({isActive}) => isActive ? "topnav-link active" : "topnav-link"}>
                    <CheckSquare /> Tasks
                </NavLink>
                <NavLink to="/earnings" className={({isActive}) => isActive ? "topnav-link active" : "topnav-link"}>
                    <DollarSign /> Earnings
                </NavLink>
                <NavLink to="/messages" className={({isActive}) => isActive ? "topnav-link active" : "topnav-link"}>
                    <Mail /> Messages
                </NavLink>
            </div>
            <div className="topnav-user">
                <div className="topnav-avatar">{getInitials(profile?.full_name || '')}</div>
                <button 
                    onClick={handleLogout} 
                    style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer', marginLeft: '10px' }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default TopNav;
