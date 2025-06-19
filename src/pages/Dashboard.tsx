
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CallsTable from '@/components/CallsTable';
import CallDetails from '@/components/CallDetails';
import RunAgentDrawer from '@/components/RunAgentDrawer';
import { mockApiService } from '@/services/mockApi';
import { Call } from '@/types/call';

const Dashboard = () => {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Poll calls every 3 seconds
  const { data: calls = [], refetch } = useQuery({
    queryKey: ['calls'],
    queryFn: mockApiService.getCalls,
    refetchInterval: 3000,
  });

  // Filter calls based on search query
  const filteredCalls = calls.filter(call =>
    call.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCallSelect = (call: Call) => {
    setSelectedCall(call);
  };

  const handleRunAgent = () => {
    setIsDrawerOpen(true);
  };

  const handleSubmitCall = async (callData: any) => {
    await mockApiService.createCall(callData);
    setIsDrawerOpen(false);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-xl font-semibold text-gray-900">
              VC Due Diligence
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search calls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button onClick={handleRunAgent} className="bg-blue-500 hover:bg-blue-600">
              Run Agent
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Calls Table */}
        <div className="flex-1 lg:w-[70%] p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Call Queue</h2>
            </div>
            <CallsTable 
              calls={filteredCalls} 
              selectedCall={selectedCall}
              onCallSelect={handleCallSelect} 
            />
          </div>
        </div>

        {/* Details Pane */}
        <div className="hidden lg:block lg:w-[30%] p-6 pl-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
            <CallDetails call={selectedCall} />
          </div>
        </div>
      </div>

      {/* Run Agent Drawer */}
      <RunAgentDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleSubmitCall}
      />
    </div>
  );
};

export default Dashboard;
