
'use client';

import React, { useState, useMemo, useEffect } from 'react';

// --- Mock Data ---
type LogLevel = 'INFO' | 'ERROR' | 'WARNING';
type Log = {
  id: number;
  timestamp: string;
  message: string;
  level: LogLevel;
  group?: string;
};

type GroupedLog = {
    isGroup: true;
    logs: Log[];
    level: LogLevel;
    groupName: string;
};

type ProcessedLog = Log | GroupedLog;

const mockLogs: Log[] = [
    // This is a grouped log entry
    { id: 1, timestamp: '16:16:43.743', message: 'Failed to compile.', level: 'ERROR', group: 'compile-error' },
    { id: 2, timestamp: '16:16:43.743', message: './components/CV.tsx:122:25', level: 'INFO', group: 'compile-error' },
    { id: 3, timestamp: '16:16:43.744', message: 'Type error: Parameter \'prev\' implicitly has an \'any\' type.', level: 'ERROR', group: 'compile-error' },
    { id: 4, timestamp: '16:16:43.745', message: 'Another line in the group.', level: 'INFO', group: 'compile-error' },
    { id: 5, timestamp: '16:16:43.746', message: 'And another one.', level: 'INFO', group: 'compile-error' },
    { id: 6, timestamp: '16:16:43.747', message: 'Something something dark side.', level: 'WARNING', group: 'compile-error' },
    { id: 7, timestamp: '16:16:43.748', message: 'Final line of group.', level: 'INFO', group: 'compile-error' },

    { id: 8, timestamp: '16:16:43.781', message: 'Error: Command "npm run build" exited with 1', level: 'ERROR' },
    { id: 9, timestamp: '16:16:43.981', message: 'Starting up container...', level: 'INFO' },
    { id: 10, timestamp: '16:16:44.123', message: 'Fetching dependencies...', level: 'INFO' },
    { id: 11, timestamp: '16:16:45.567', message: 'Warning: Deprecated package found: left-pad', level: 'WARNING' },
    { id: 12, timestamp: '16:16:46.001', message: 'Successfully installed 1500 packages.', level: 'INFO' },
    { id: 13, timestamp: '16:16:47.324', message: 'Exiting build container', level: 'INFO' },
];

const groupedLogs = mockLogs.reduce((acc, log) => {
    if (log.group) {
        if (!acc[log.group]) {
            acc[log.group] = { isGroup: true, logs: [], level: 'INFO', groupName: log.group };
        }
        const group = acc[log.group] as GroupedLog;
        group.logs.push(log);
        if (log.level === 'ERROR') {
            group.level = 'ERROR';
        } else if (log.level === 'WARNING' && group.level !== 'ERROR') {
             group.level = 'WARNING';
        }
    } else {
        acc[String(log.id)] = log;
    }
    return acc;
}, {} as Record<string, ProcessedLog>);

const processedLogs: ProcessedLog[] = Object.values(groupedLogs);


// --- Components ---
const LogLine = ({ log }: { log: Log }) => (
    <div className={`log-line ${log.level.toLowerCase()}`}>
        <span className="timestamp">{log.timestamp}</span>
        <span className="message">{log.message}</span>
    </div>
);

const CollapsibleLogGroup = ({ group, isInitiallyExpanded, searchQuery }: { group: GroupedLog, isInitiallyExpanded: boolean, searchQuery: string }) => {
    const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);
    const filteredLogs = useMemo(() => {
        if (!searchQuery) return group.logs;
        return group.logs.filter(log => log.message.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [group.logs, searchQuery]);

    useEffect(() => {
        setIsExpanded(isInitiallyExpanded);
    }, [isInitiallyExpanded]);
    
    if (searchQuery && filteredLogs.length === 0) {
        return null;
    }

    if (!isExpanded) {
        return (
            <button className="expand-button" onClick={() => setIsExpanded(true)}>
                <i className="fas fa-chevron-right"></i>
                Expand {group.logs.length} Lines
            </button>
        );
    }
    
    return (
        <div>
            <button className="expand-button" onClick={() => setIsExpanded(false)}>
                <i className="fas fa-chevron-down"></i>
                Collapse Lines
            </button>
            <div className="collapsible-group">
                {filteredLogs.map(log => <LogLine key={log.id} log={log} />)}
            </div>
        </div>
    );
};


const Accordion = ({ title, endAdornment, children, defaultOpen = false }: { title: string, endAdornment?: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="card">
            <header className="accordion-header" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
                <i className="fas fa-chevron-down icon"></i>
                <h2>{title}</h2>
                {endAdornment && <div className="end-adornment">{endAdornment}</div>}
            </header>
            <div className={`accordion-content ${!isOpen ? 'collapsed' : ''}`}>
                {children}
            </div>
        </div>
    );
}

// --- Main Page Component ---
export default function LogViewerPage() {
    const [activeTab, setActiveTab] = useState<'all' | 'errors' | 'warnings'>('errors');
    const [searchQuery, setSearchQuery] = useState('');
    const [allExpanded, setAllExpanded] = useState(false);

    const counts = useMemo(() => ({
        all: mockLogs.length,
        errors: mockLogs.filter(l => l.level === 'ERROR').length,
        warnings: mockLogs.filter(l => l.level === 'WARNING').length,
    }), []);

    const filteredAndProcessedLogs = useMemo(() => {
        return processedLogs.filter(item => {
            const itemLevel = 'isGroup' in item ? item.level : item.level;
            const levelCheck =
                activeTab === 'all' ||
                (activeTab === 'errors' && itemLevel === 'ERROR') ||
                (activeTab === 'warnings' && itemLevel === 'WARNING');

            if (!levelCheck) return false;

            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if ('isGroup' in item && item.isGroup) {
                    return item.logs.some((log: Log) => log.message.toLowerCase().includes(query));
                } else if (!('isGroup' in item)) {
                    return (item as Log).message.toLowerCase().includes(query);
                }
            }
            
            return true;
        });
    }, [activeTab, searchQuery]);

    const copyLogsToClipboard = () => {
        const logText = mockLogs.map(l => `${l.timestamp} ${l.message}`).join('\n');
        navigator.clipboard.writeText(logText).then(() => {
            alert('Logs copied to clipboard!');
        }, () => {
            alert('Failed to copy logs.');
        });
    };

    return (
        <main className="main-container">
            <Accordion 
                title="Build Logs" 
                defaultOpen={true}
                endAdornment={
                    <>
                        <span>1m 9s</span>
                        <span className="status-badge">
                            <i className="fas fa-times-circle"></i>&nbsp;Error
                        </span>
                    </>
                }
            >
               <div className="log-viewer-tabs">
                    <button className={`tab-button ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
                        All Logs <span className="tab-badge">{counts.all}</span>
                    </button>
                    <button className={`tab-button ${activeTab === 'errors' ? 'active' : ''}`} onClick={() => setActiveTab('errors')}>
                        Errors <span className="tab-badge">{counts.errors}</span>
                    </button>
                    <button className={`tab-button ${activeTab === 'warnings' ? 'active' : ''}`} onClick={() => setActiveTab('warnings')}>
                        Warnings <span className="tab-badge">{counts.warnings}</span>
                    </button>
                </div>
                <div className="log-toolbar">
                    <button className="toolbar-button" onClick={() => setAllExpanded(!allExpanded)}>
                        <i className="fas fa-arrows-up-down"></i>
                        {allExpanded ? 'Collapse All' : 'Expand All'}
                    </button>
                    <div className="search-container">
                        <i className="fas fa-search"></i>
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Find in logs" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                         <span className="search-shortcut">Ctrl F</span>
                    </div>
                    <button className="toolbar-button" onClick={copyLogsToClipboard}>
                       <i className="far fa-copy"></i>
                    </button>
                </div>
                <div className="log-area">
                    {filteredAndProcessedLogs.map((item) => {
                        if ('isGroup' in item && item.isGroup) {
                            return <CollapsibleLogGroup key={`group-${item.groupName}`} group={item} isInitiallyExpanded={allExpanded} searchQuery={searchQuery} />;
                        }
                        return <LogLine key={(item as Log).id} log={item as Log} />;
                    })}
                </div>
            </Accordion>
            
            <div style={{marginTop: '1.5rem'}}>
                <Accordion title="Deployment Summary">
                    <div style={{padding: '1.5rem', color: 'var(--secondary-text)'}}>Deployment details would be here.</div>
                </Accordion>
            </div>
            <div style={{marginTop: '1.5rem'}}>
                <Accordion title="Assigning Custom Domains">
                     <div style={{padding: '1.5rem', color: 'var(--secondary-text)'}}>Domain assignment UI would be here.</div>
                </Accordion>
            </div>

            <div className="info-grid">
                <div className="card info-card">
                    <h3>Runtime Logs</h3>
                    <p>View and debug runtime logs & errors</p>
                </div>
                <div className="card info-card">
                   <h3>Observability</h3>
                    <p>Monitor app health & performance</p>
                </div>
                 <div className="card info-card">
                    <div className="info-card-header">
                         <div>
                           <h3>Web Analytics</h3>
                            <p>Analyze visitors & traffic in real-time</p>
                        </div>
                        <span className="info-badge">Not Enabled</span>
                    </div>
                </div>
                <div className="card info-card">
                    <div className="info-card-header">
                        <div>
                           <h3>Speed Insights</h3>
                            <p>Performance metrics from real users</p>
                        </div>
                        <span className="info-badge no-data">No Data</span>
                    </div>
                </div>
            </div>

            <footer className="app-footer">
                <div className="footer-links">
                    <a href="#">Home</a>
                    <a href="#">Docs</a>
                    <a href="#">Guides</a>
                    <a href="#">Help</a>
                    <a href="#">Contact</a>
                    <a href="#">Legal</a>
                </div>
                <div className="footer-status">
                    <span className="status-dot">
                        <i className="fas fa-circle"></i>
                    </span>
                    <span>All systems normal</span>
                    <i className="fas fa-desktop"></i>
                    <i className="far fa-sun"></i>
                    <i className="fas fa-sync"></i>
                </div>
            </footer>
        </main>
    );
}
