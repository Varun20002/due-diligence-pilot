
# VC Due Diligence Dashboard

A professional dashboard for automated customer validation calls, designed for VC due diligence processes.

## Features

- **Real-time Call Queue**: Monitor call status with live polling every 3 seconds
- **Live Transcript Streaming**: Watch conversations unfold in real-time
- **AI-Generated Summaries**: Get comprehensive call summaries with key insights
- **Run Agent Interface**: Easy-to-use form for initiating new calls
- **Responsive Design**: Works perfectly on 13" laptops and larger screens

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query for server state
- **Routing**: React Router
- **Build Tool**: Vite

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:8080`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CallsTable.tsx  # Main calls data table
│   ├── CallDetails.tsx # Call details and transcript pane
│   └── RunAgentDrawer.tsx # Form for creating new calls
├── pages/
│   └── Dashboard.tsx   # Main dashboard page
├── services/
│   └── mockApi.ts      # Mock API service with simulated data
├── types/
│   └── call.ts         # TypeScript interfaces
└── App.tsx             # Main app component with routing
```

## API Endpoints (Mocked)

- `GET /calls` - Fetch all calls with status updates
- `POST /calls` - Create new customer validation call
- `GET /calls/:id` - Get specific call details
- `GET /reports/:callId` - Get full call report (stubbed)

## Call Status Flow

1. **Queued** → Call is created and waiting to be dialed
2. **Dialing** → System is connecting to customer
3. **In Room** → Call is active, transcript streaming
4. **RAG** → Call ended, AI processing transcript
5. **Done** → Summary ready for review
6. **Error** → Call failed or encountered issues

## Features in Detail

### Call Queue Table
- Status-coded badges for quick visual scanning
- Live updates every 3 seconds without page refresh
- Click any row to view details and transcript
- Search functionality for filtering calls

### Call Details Pane
- Real-time elapsed time counter for active calls
- Live transcript streaming with cursor indicator
- AI-generated markdown summaries for completed calls
- "Open Full Report" button for detailed analysis

### Run Agent Drawer
- Form validation for required fields (name, phone, email)
- Regex validation for phone numbers and email addresses
- Optional company and custom prompt fields
- Disabled submit button until form is valid

## Responsive Design

- Desktop: Side-by-side table and details layout
- Tablet/Mobile: Stacked layout with collapsible details
- Minimum width: 320px mobile devices
- Optimized for 13" laptop screens (1280x800)

## Mock Data

The application includes realistic mock data that simulates:
- Call progression through different status states
- Live transcript updates during active calls
- AI-generated summaries with business insights
- Realistic timing and duration data

## Future Enhancements

- Real backend API integration
- User authentication and role management
- Advanced filtering and sorting options
- Export functionality for reports
- Integration with CRM systems
- Real-time notifications
