
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { mockApiService } from '@/services/mockApi';
import { CallStatus } from '@/types/call';
import { toast } from 'sonner';

const statusConfig = {
  [CallStatus.QUEUED]: { color: 'bg-gray-100 text-gray-800', label: 'Queued' },
  [CallStatus.DIALING]: { color: 'bg-yellow-100 text-yellow-800', label: 'Dialing' },
  [CallStatus.IN_ROOM]: { color: 'bg-blue-100 text-blue-800', label: 'In Room' },
  [CallStatus.RAG]: { color: 'bg-purple-100 text-purple-800', label: 'Processing' },
  [CallStatus.DONE]: { color: 'bg-green-100 text-green-800', label: 'Done' },
  [CallStatus.ERROR]: { color: 'bg-red-100 text-red-800', label: 'Error' },
};

const formatSummary = (summary: string) => {
  const lines = summary.split('\n');
  const formattedContent = [];
  let inNegativesSection = false;
  let inPositivesSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;
    
    // Check if we're entering the Negatives section
    if (line.toLowerCase().includes('negatives') && line.toLowerCase().includes('short')) {
      inNegativesSection = true;
      inPositivesSection = false;
    }
    // Check if we're entering a Positives section
    else if (line.toLowerCase().includes('positive') || 
             line.toLowerCase().includes('strength') || 
             line.toLowerCase().includes('benefit') ||
             line.toLowerCase().includes('advantage')) {
      inPositivesSection = true;
      inNegativesSection = false;
    }
    // Check if we're leaving current section (next heading)
    else if ((inNegativesSection || inPositivesSection) && 
             (line.startsWith('#') || (line.match(/^[A-Z][a-zA-Z\s]+$/) && !line.includes('.')))) {
      // Determine if this is a positive or negative section
      if (line.toLowerCase().includes('negatives') && line.toLowerCase().includes('short')) {
        inNegativesSection = true;
        inPositivesSection = false;
      } else if (line.toLowerCase().includes('positive') || 
                 line.toLowerCase().includes('strength') || 
                 line.toLowerCase().includes('benefit') ||
                 line.toLowerCase().includes('advantage')) {
        inPositivesSection = true;
        inNegativesSection = false;
      } else {
        inNegativesSection = false;
        inPositivesSection = false;
      }
    }
    
    // Check if it's a heading (starts with # or is a standalone title-like line)
    if (line.startsWith('#') || (line.match(/^[A-Z][a-zA-Z\s]+$/) && !line.includes('.'))) {
      const headingText = line.replace(/^#+\s*/, '');
      const isNegativesHeading = headingText.toLowerCase().includes('negatives') && headingText.toLowerCase().includes('short');
      const isPositivesHeading = headingText.toLowerCase().includes('positive') || 
                                 headingText.toLowerCase().includes('strength') || 
                                 headingText.toLowerCase().includes('benefit') ||
                                 headingText.toLowerCase().includes('advantage');
      
      let headingClass = 'text-lg font-bold mt-6 mb-3 first:mt-0 text-gray-900';
      if (isNegativesHeading) {
        headingClass = 'text-lg font-bold mt-6 mb-3 first:mt-0 text-red-800 bg-red-50 px-3 py-2 rounded-lg';
      } else if (isPositivesHeading) {
        headingClass = 'text-lg font-bold mt-6 mb-3 first:mt-0 text-green-800';
      }
      
      formattedContent.push(
        <h3 key={i} className={headingClass}>
          {headingText}
        </h3>
      );
    }
    // Check if it's a bullet point or should be formatted as one
    else if (line.startsWith('-') || line.startsWith('•') || line.match(/^\d+\./)) {
      const bulletText = line.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '');
      let bulletClass = 'text-sm mb-2 text-gray-700';
      
      if (inNegativesSection) {
        bulletClass = 'text-sm mb-2 text-red-700 font-medium';
      } else if (inPositivesSection) {
        bulletClass = 'text-sm mb-2 text-green-700';
      }
      
      formattedContent.push(
        <li key={i} className={bulletClass}>
          {bulletText}
        </li>
      );
    }
    // Regular paragraph text
    else {
      let paragraphClass = 'text-sm mb-3 text-gray-700';
      
      if (inNegativesSection) {
        paragraphClass = 'text-sm mb-3 text-red-700';
      } else if (inPositivesSection) {
        paragraphClass = 'text-sm mb-3 text-green-700';
      }
      
      formattedContent.push(
        <p key={i} className={paragraphClass}>
          {line}
        </p>
      );
    }
  }
  
  // Group consecutive list items into ul elements
  const groupedContent = [];
  let currentList = [];
  let currentListIsNegative = false;
  let currentListIsPositive = false;
  
  for (let i = 0; i < formattedContent.length; i++) {
    const item = formattedContent[i];
    
    if (item.type === 'li') {
      if (currentList.length === 0) {
        // Determine if this list is in the negatives or positives section based on the text color
        currentListIsNegative = item.props.className.includes('text-red-700');
        currentListIsPositive = item.props.className.includes('text-green-700');
      }
      currentList.push(item);
    } else {
      if (currentList.length > 0) {
        let listClass = 'list-disc list-inside space-y-2 mb-4 ml-4';
        if (currentListIsNegative) {
          listClass += ' bg-red-50 p-3 rounded-lg';
        }
        // Note: No background highlighting for positive lists as requested
        
        groupedContent.push(
          <ul key={`list-${i}`} className={listClass}>
            {currentList}
          </ul>
        );
        currentList = [];
        currentListIsNegative = false;
        currentListIsPositive = false;
      }
      groupedContent.push(item);
    }
  }
  
  // Don't forget the last list if it exists
  if (currentList.length > 0) {
    let listClass = 'list-disc list-inside space-y-2 mb-4 ml-4';
    if (currentListIsNegative) {
      listClass += ' bg-red-50 p-3 rounded-lg';
    }
    // Note: No background highlighting for positive lists as requested
    
    groupedContent.push(
      <ul key="final-list" className={listClass}>
        {currentList}
      </ul>
    );
  }
  
  return groupedContent;
};

const ReportView = () => {
  const { call_id } = useParams<{ call_id: string }>();
  const navigate = useNavigate();

  const { data: call, isLoading, error } = useQuery({
    queryKey: ['call', call_id],
    queryFn: () => mockApiService.getCall(call_id!),
    enabled: !!call_id,
  });

  const handleCopySummary = async () => {
    if (call?.summary) {
      try {
        await navigator.clipboard.writeText(call.summary);
        toast.success('Summary copied to clipboard');
      } catch (err) {
        toast.error('Failed to copy summary');
      }
    }
  };

  const handleDownloadPDF = () => {
    toast.info('PDF download feature coming soon');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading report...</div>
        </div>
      </div>
    );
  }

  if (error || !call) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600">Report not found</div>
          <Button 
            variant="outline" 
            onClick={handleBackToDashboard}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Mock tags for demo purposes
  const tags = call.status === CallStatus.DONE ? ['Highly Satisfied', 'Strong Interest'] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={handleBackToDashboard}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{call.customerName}</h1>
              <p className="text-gray-600">{call.company}</p>
            </div>
            <Badge className={statusConfig[call.status].color}>
              {statusConfig[call.status].label}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Summary Section */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">AI Summary</CardTitle>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={handleCopySummary}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Summary
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleDownloadPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {call.summary ? (
                <div className="prose prose-sm max-w-none">
                  <div className="text-gray-900">
                    {formatSummary(call.summary)}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>Summary not available</p>
                  <p className="text-xs mt-1">
                    {call.status === CallStatus.DONE ? 'No summary generated' : 'Call in progress'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Full Transcript Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Full Transcript</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <ScrollArea className="h-96">
                {call.transcript ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="whitespace-pre-wrap text-sm text-gray-900 font-mono leading-relaxed">
                        {call.transcript}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>Transcript not available</p>
                    <p className="text-xs mt-1">
                      {call.status === CallStatus.DONE ? 'No transcript recorded' : 'Call in progress'}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ReportView;
