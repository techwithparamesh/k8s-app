# Design Guidelines: OpenShift-Like Kubernetes Platform

## Design Approach
**Reference-Based Approach**: Drawing from enterprise Kubernetes platforms (OpenShift, Rancher, Kubernetes Dashboard) combined with modern design system principles for data-heavy applications.

## Layout System

**Spacing Scale**: Use Tailwind units of 2, 4, 6, and 8 for consistent rhythm
- Component padding: p-4, p-6
- Section gaps: gap-4, gap-6
- Card spacing: space-y-6
- Margins: m-2, m-4

**Grid Structure**:
- Dashboard cards: 3-column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Table containers: Full-width with max-w-7xl
- Sidebar: Fixed width w-64
- Main content: flex-1 with p-6 to p-8 padding

## Typography

**Font Family**: Inter or IBM Plex Sans via Google Fonts CDN

**Hierarchy**:
- Page titles: text-2xl, font-semibold
- Card headers: text-lg, font-medium
- Table headers: text-sm, font-semibold, uppercase tracking-wide
- Body/table cells: text-sm, font-normal
- Stats/metrics: text-3xl, font-bold
- Labels: text-xs, font-medium, uppercase

## Component Library

**Sidebar Navigation**:
- Fixed left sidebar (h-screen, w-64)
- Logo/brand at top with h-16 height
- Navigation items: py-3 px-4 with icons (Heroicons) on left
- Active state: Distinct visual treatment with border-l-4 indicator
- Icon size: w-5 h-5

**Top Navbar**:
- Height: h-16
- Sticky positioning (sticky top-0)
- Contains breadcrumbs on left, user profile/actions on right
- Shadow for depth separation

**Resource Cards** (Dashboard):
- Rounded corners: rounded-lg
- Padding: p-6
- Shadow: shadow-md with hover:shadow-lg transition
- Structure: Icon + Label + Large Metric + Subtitle
- Icon size: w-12 h-12 in circular container

**Data Tables**:
- Header row with bottom border
- Row padding: py-4 px-6
- Alternating row backgrounds for readability
- Status badges: Inline pills with rounded-full, px-3 py-1, text-xs
- Hover state on rows for interactivity

**Status Indicators**:
- Running/Active: Badge with success styling
- Pending/Warning: Badge with warning styling
- Failed/Error: Badge with error styling
- Badge structure: Dot indicator (w-2 h-2 rounded-full) + text

**Metrics Display**:
- Large number at top (text-3xl)
- Unit/label below (text-sm)
- Optional trend indicator (arrow icon + percentage)

**Logs Viewer**:
- Monospace font: font-mono
- Full-width container with max-height and overflow-y-auto
- Line numbers on left
- Padding: p-4
- Text size: text-xs

## Navigation Patterns

**Sidebar Menu Items**:
- Dashboard (home icon)
- Nodes (server icon)
- Pods (cube icon)
- Deployments (layers icon)
- Services (network icon)

**Layout Composition**:
```
┌─────────┬──────────────────────┐
│         │   Top Navbar (h-16)  │
│ Sidebar ├──────────────────────┤
│ (w-64)  │                      │
│         │   Main Content       │
│         │   (flex-1, p-6)      │
│         │                      │
└─────────┴──────────────────────┘
```

## Page-Specific Layouts

**Dashboard**:
- Stats cards in 3-column grid with gap-6
- Each card: Icon, metric value, label, change indicator
- Below stats: Recent activity table or quick actions

**Tables Pages** (Pods, Nodes, Deployments, Services):
- Page header with title and action button (text-right)
- Search/filter bar (h-10, rounded-md)
- Full-width responsive table
- Pagination footer if needed

## Icons
**Library**: Heroicons via CDN
- Navigation icons: outline style
- Status indicators: solid style for filled dots
- Action buttons: mini style (w-4 h-4)

## Interactions

**Hover States**:
- Sidebar items: Subtle background change
- Table rows: Background shift
- Cards: Shadow elevation increase
- Buttons: Slight opacity change

**Loading States**:
- Skeleton screens for tables (animate-pulse)
- Spinner for async actions (w-5 h-5 animate-spin)

**Transitions**: Use transition-colors and transition-shadow with duration-200

## Accessibility
- Semantic HTML table structures
- ARIA labels on icon-only buttons
- Keyboard navigation support for sidebar and tables
- Focus indicators on all interactive elements with ring-2 offset-2

## Images
This platform does not require images. It's a data-focused interface relying on icons, tables, and metrics visualization.