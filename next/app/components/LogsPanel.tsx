import React from "react";

type LogsPanelProps = {
  logs: string[];
};

const LogsPanel: React.FC<LogsPanelProps> = ({ logs }) => (
  <div id="logs-panel" className="logs">
    <h2>Logs</h2>
    {logs.map((log, i) => <p key={i}>{log}</p>)}
  </div>
);

export default LogsPanel; 