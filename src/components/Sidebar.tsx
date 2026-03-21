import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Settings, FileText, HelpCircle, Shield } from 'lucide-react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-brand">
                Atlas Capture
            </div>
            <div className="sidebar-menu">
                <NavLink to="/" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"} end>
                    <Activity /> Overall Progress
                </NavLink>
                <NavLink to="/profile" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    <Settings /> Profile & Settings
                </NavLink>
                <NavLink to="/task-info" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    <FileText /> Task Info
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
