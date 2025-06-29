import { Call, CallStatus, CreateCallRequest } from '@/types/call';

// Mock data store
let mockCalls: Call[] = [
  {
    id: '1',
    customerName: 'Akshat Gada',
    phone: '+1 (555) 123-4567',
    email: 'akshat@polygon.com',
    company: 'Polygon',
    status: CallStatus.DONE,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    duration: 250, // 4:10 minutes
    transcript: `Here is the structured transcript clearly labeled by speaker — Alisha (AI voice on behalf of Accel) and User (business owner, e.g. Akshat/Varun):


---

Alisha

Hi, this is Alisha on behalf of Accel. We are evaluating Zomato and would like your feedback.
This 5-minute call is recorded. Would you be open to participating?


---

User

Yes, sure. I'm open.


---

Alisha

Great. We'd like to understand how Zomato impacts your business and day-to-day workflow.
There are four quick questions—most take less than a minute to answer.
Your feedback will be kept confidential and aggregated with responses from other customers.
You will hear a mix of open-ended questions and a rating question.
There are no right or wrong answers. We just want your honest perspective.
Can you briefly summarize your overall experience with Zomato and how it has impacted your business since you started using it?


---

User

Okay. So it's been an overall good experience.
Through Zomato, my customers had more discoverability.
My revenue has gone up. The number of delivery orders is higher.
Earlier I used to have only in-person restaurant customers.
But now, actually 40% of my revenue is generated using delivery. So that has been the major impact.
Another impact is that through the Zomato platform, people are able to find my restaurant.
Earlier it was difficult to find. Good ratings on Zomato also help.


---

Alisha

What are the main benefits and drawbacks you've experienced with Zomato?


---

User

Some of the benefits I mentioned earlier are that revenue has increased due to more discoverability and delivery orders through the platform.
But some drawbacks—although revenue increased, profit has only slightly increased.
This is because commission eats up most of my profit margin.
So a major drawback is the commission cut.


---

Alisha

Have you encountered any major issues or concerns with Zomato that you would consider red flags?


---

User

There are no technical issues with the app—so not much of a major issue.
But one concern is saturation.
There are many good restaurants on Zomato now, so it's harder to stand out.
My restaurant isn't getting as much reach or visibility now as before because of this saturation.


---

Alisha

Okay. How would you rate the value for money of Zomato services on a scale of 1 to 5, where 1 is very poor and 5 is excellent?


---

User

I would rate it a 4.
Overall, it is increasing my revenue and discoverability.
But the drawbacks, as I said, are the commission and saturation of the platform.


---

Alisha

What drives that score of 4?


---

User

The score of 4 is driven by the fact that it enhances revenue, and more people visit the restaurant because of better discoverability.
That's what drives the score.


---

Alisha

Those are all the questions I have.
Is there anything else about your experience with Zomato you'd like to share?


---

User

No, nothing for now. Thanks for the call.


---

Alisha

Thank you for your time.
Your feedback is invaluable to our evaluation.
Have a great day.`,
    summary: `Short Summary
The restaurant owner reports an overall positive experience with Zomato. The platform has increased customer discoverability and delivery orders, boosting revenue, although profit gains are limited because of high commission fees.

Positives

Higher customer discoverability through ratings and search

Significant increase in delivery orders and overall revenue

Easy-to-use platform with no technical issues reported


Negatives (in short)

High commission eats into profit margin

Growing saturation on the platform is reducing the restaurant's current visibility


Major Red Flags
None beyond ordinary concerns (no technical failures; only marketplace saturation mentioned)

Pricing

Commission rate viewed as "most of my profit margin," limiting profitability

Overall value-for-money rated 4 / 5 by the owner


Best Feature

Discoverability: good ratings and search visibility that attract new customers


Time of Adoption of Product
—`,
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
