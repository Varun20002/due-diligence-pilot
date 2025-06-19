
import React from 'react';
import { Call, CallStatus } from '@/types/call';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface CallsTableProps {
  calls: Call[];
  selectedCall: Call | null;
  onCallSelect: (call: Call) => void;
}

const statusConfig = {
  [CallStatus.QUEUED]: { color: 'bg-gray-100 text-gray-800', label: 'Queued' },
  [CallStatus.DIALING]: { color: 'bg-yellow-100 text-yellow-800', label: 'Dialing' },
  [CallStatus.IN_ROOM]: { color: 'bg-blue-100 text-blue-800', label: 'In Room' },
  [CallStatus.RAG]: { color: 'bg-purple-100 text-purple-800', label: 'Processing' },
  [CallStatus.DONE]: { color: 'bg-green-100 text-green-800', label: 'Done' },
  [CallStatus.ERROR]: { color: 'bg-red-100 text-red-800', label: 'Error' },
};

const CallsTable: React.FC<CallsTableProps> = ({ calls, selectedCall, onCallSelect }) => {
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="overflow-auto h-full">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {calls.map((call) => (
            <tr
              key={call.id}
              onClick={() => onCallSelect(call)}
              className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedCall?.id === call.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <td className="px-4 py-4 whitespace-nowrap">
                <Badge className={statusConfig[call.status].color}>
                  {statusConfig[call.status].label}
                </Badge>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{call.customerName}</div>
                <div className="text-sm text-gray-500">{call.phone}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {call.company}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDistanceToNow(new Date(call.createdAt), { addSuffix: true })}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDuration(call.duration)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {calls.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No calls found</p>
        </div>
      )}
    </div>
  );
};

export default CallsTable;
