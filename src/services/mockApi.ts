
import { Call, CallStatus, CreateCallRequest } from '@/types/call';

// Mock data store
let mockCalls: Call[] = [
  {
    id: '1',
    customerName: 'John Smith',
    phone: '+1 (555) 123-4567',
    email: 'john@techcorp.com',
    company: 'TechCorp Inc',
    status: CallStatus.DONE,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    duration: 420, // 7 minutes
    summary: `# Customer Validation Summary

**Customer:** John Smith, TechCorp Inc
**Call Duration:** 7:00 minutes
**Overall Sentiment:** Positive

## Key Findings

### Product Market Fit
- Currently using legacy CRM system (Salesforce Classic)
- Pain points: Poor mobile experience, limited customization
- Budget allocated for Q1 2024 upgrade ($50K-100K range)

### Decision Making Process
- John is the IT Director, has budget authority up to $75K
- Needs approval from CTO for larger purchases
- Timeline: Looking to implement by March 2024

### Competitive Landscape
- Also evaluating HubSpot and Pipedrive
- Previous bad experience with Microsoft Dynamics
- Values integration with existing Google Workspace

## Recommendations
1. Schedule technical demo focused on mobile capabilities
2. Prepare Google Workspace integration documentation
3. Connect with CTO for larger deal discussion
4. Follow up within 48 hours while interest is high

## Next Steps
- Technical demo scheduled for next Tuesday
- Send pricing proposal by end of week
- Include references from similar mid-market companies`,
  },
  {
    id: '2',
    customerName: 'Sarah Johnson',
    phone: '+1 (555) 987-6543',
    email: 'sarah@startup.io',
    company: 'Innovation Startup',
    status: CallStatus.IN_ROOM,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    duration: null,
    transcript: `Agent: Hi Sarah, thank you for taking the time to speak with me today. I'm calling to understand your current customer management processes and see if there might be a fit with our CRM solution.

Sarah: Hi there! Yes, I'm happy to chat. We're definitely in the market for a better CRM system.

Agent: Great! Can you tell me a bit about what you're using currently?

Sarah: We're actually just using a combination of Google Sheets and email right now. It's getting pretty chaotic as we've grown to about 15 employees.

Agent: I can imagine that's becoming difficult to manage. What are the main pain points you're experiencing?

Sarah: Well, we're losing track of leads, there's no clear follow-up process, and reporting is basically non-existent. When someone asks about our pipeline, I have to spend hours pulling data together.

Agent: Those are exactly the kinds of challenges our platform addresses. How many leads are you typically working with in a month?

Sarah: Probably around 200-300 new leads monthly. We're in the B2B SaaS space, so...`,
  },
  {
    id: '3',
    customerName: 'Mike Chen',
    phone: '+1 (555) 555-1234',
    email: 'mike@enterprise.com',
    company: 'Enterprise Solutions',
    status: CallStatus.DIALING,
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutes ago
    duration: null,
  },
  {
    id: '4',
    customerName: 'Lisa Rodriguez',
    phone: '+1 (555) 777-8888',
    email: 'lisa@consulting.co',
    company: 'Strategic Consulting',
    status: CallStatus.QUEUED,
    createdAt: new Date(Date.now() - 1000 * 30).toISOString(), // 30 seconds ago
    duration: null,
  },
];

let nextId = 5;

// Simulate call progression
const progressCalls = () => {
  mockCalls = mockCalls.map(call => {
    if (call.status === CallStatus.DIALING && Math.random() > 0.7) {
      return { ...call, status: CallStatus.IN_ROOM };
    }
    if (call.status === CallStatus.IN_ROOM && Math.random() > 0.9) {
      return { 
        ...call, 
        status: CallStatus.RAG,
        duration: Math.floor(Math.random() * 300) + 180 // 3-8 minutes
      };
    }
    if (call.status === CallStatus.RAG && Math.random() > 0.8) {
      return { 
        ...call, 
        status: CallStatus.DONE,
        summary: `# Customer Validation Summary

**Customer:** ${call.customerName}, ${call.company}
**Call Duration:** ${Math.floor((call.duration || 300) / 60)}:${((call.duration || 300) % 60).toString().padStart(2, '0')} minutes
**Overall Sentiment:** ${Math.random() > 0.7 ? 'Positive' : 'Neutral'}

## Key Findings
- Currently evaluating CRM solutions
- Budget range: $10K-50K annually
- Decision timeline: Next quarter
- Main pain points: Manual processes, poor reporting

## Recommendations
1. Schedule product demonstration
2. Prepare ROI analysis
3. Connect with decision makers
4. Follow up within one week`
      };
    }
    return call;
  });
};

// Progress calls every few seconds
setInterval(progressCalls, 3000);

export const mockApiService = {
  async getCalls(): Promise<Call[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
    return [...mockCalls].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getCall(id: string): Promise<Call | null> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
    return mockCalls.find(call => call.id === id) || null;
  },

  async createCall(data: CreateCallRequest): Promise<Call> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
    
    const newCall: Call = {
      id: nextId.toString(),
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      company: data.company || '',
      status: CallStatus.QUEUED,
      createdAt: new Date().toISOString(),
      duration: null,
      customPrompt: data.customPrompt,
    };

    mockCalls.unshift(newCall);
    nextId++;

    // Simulate call progression
    setTimeout(() => {
      const call = mockCalls.find(c => c.id === newCall.id);
      if (call && call.status === CallStatus.QUEUED) {
        call.status = CallStatus.DIALING;
      }
    }, 2000);

    return newCall;
  },
};
