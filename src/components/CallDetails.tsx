
import React, { useState, useEffect } from 'react';
import { Call, CallStatus } from '@/types/call';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ExternalLink } from 'lucide-react';

interface CallDetailsProps {
  call: Call | null;
}

const statusConfig = {
  [CallStatus.QUEUED]: { color: 'bg-gray-100 text-gray-800', label: 'Queued' },
  [CallStatus.DIALING]: { color: 'bg-yellow-100 text-yellow-800', label: 'Dialing' },
  [CallStatus.IN_ROOM]: { color: 'bg-blue-100 text-blue-800', label: 'In Room' },
  [CallStatus.RAG]: { color: 'bg-purple-100 text-purple-800', label: 'Processing' },
  [CallStatus.DONE]: { color: 'bg-green-100 text-green-800', label: 'Done' },
  [CallStatus.ERROR]: { color: 'bg-red-100 text-red-800', label: 'Error' },
};

const CallDetails: React.FC<CallDetailsProps> = ({ call }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!call || call.status === CallStatus.DONE || call.status === CallStatus.ERROR) {
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const created = new Date(call.createdAt).getTime();
      const elapsed = Math.floor((now - created) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [call]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!call) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Select a call</p>
          <p className="text-gray-400 text-sm mt-2">Choose a row to view details and transcript</p>
        </div>
      </div>
    );
  }

  const isLive = call.status !== CallStatus.DONE && call.status !== CallStatus.ERROR;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <Badge className={statusConfig[call.status].color}>
            {statusConfig[call.status].label}
          </Badge>
          {isLive && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {formatTime(elapsedTime)}
            </div>
          )}
        </div>
        <h3 className="font-medium text-gray-900">{call.customerName}</h3>
        <p className="text-sm text-gray-500">{call.company}</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        {call.status === CallStatus.DONE && call.summary ? (
          <div>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm text-gray-900">
                {call.summary}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Full Report
              </Button>
            </div>
          </div>
        ) : isLive && call.transcript ? (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Live Transcript</h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="whitespace-pre-wrap text-sm text-gray-900 font-mono">
                {call.transcript}
                {call.status === CallStatus.IN_ROOM && (
                  <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p className="text-sm">
              {call.status === CallStatus.QUEUED && 'Call is queued...'}
              {call.status === CallStatus.DIALING && 'Dialing customer...'}
              {call.status === CallStatus.RAG && 'Processing transcript...'}
              {call.status === CallStatus.ERROR && 'Call failed'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallDetails;
