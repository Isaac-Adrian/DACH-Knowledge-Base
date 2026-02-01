# 001 - Knowledge Tracker UI

**Status:** 🚧 In Progress (Phase 3 Complete)  
**Created:** 2026-02-01  
**Target Date:** 2026-03-15  
**Owner:** -

---

## Objective

Build an interactive web-based UI (hosted on GitHub Pages) to track personal knowledge and skill progression across technology topics. The system will provide visual representations of proficiency levels, learning time statistics, and goal tracking - serving as a progress dashboard rather than a learning platform.

---

## Success Criteria

1. **Skill Management**
   - [ ] Users can select from a library of pre-built common topics
   - [ ] Users can create custom topics
   - [ ] Topics can be added/removed from personal tracking view
   - [ ] Skill levels can be updated via click/drag interactions

2. **Visualizations**
   - [ ] Radar/spider chart showing proficiency across selected topics
   - [ ] Swim lane or timeline view for progress over time
   - [ ] Dashboard stats (by topic, learning time, goals)
   - [ ] Multiple visualization types can be combined

3. **Data Persistence**
   - [ ] Progress data persists long-term (survives browser clears)
   - [ ] Historical data preserved for trend analysis
   - [ ] Export/import functionality for backup

4. **Interactivity**
   - [ ] Click and drag to update skill levels
   - [ ] Search/filter topics
   - [ ] Stats dashboard with key metrics

5. **Deployment**
   - [ ] Hosted on GitHub Pages
   - [ ] Works on desktop browsers (mobile nice-to-have)
   - [ ] No backend server required

---

## Approach

### Tech Stack Decision

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Framework** | React + TypeScript | Component-based, great for interactive UIs, strong typing |
| **Build Tool** | Vite | Fast builds, excellent DX, easy static export |
| **Visualizations** | Recharts + Custom SVG | Recharts for standard charts, custom SVG for skill trees |
| **Styling** | Tailwind CSS | Rapid styling, consistent design system |
| **Data Storage** | IndexedDB + JSON Export | IndexedDB for durable local storage; JSON files for git-backed history |
| **Hosting** | GitHub Pages | Free, integrates with repo, static site support |

### Data Model

```typescript
interface Topic {
  id: string;
  name: string;
  category: string;
  isCustom: boolean;
  icon?: string;
}

interface TrackedSkill {
  topicId: string;
  level: 1 | 2 | 3 | 4 | 5;  // Novice → Expert
  lastUpdated: Date;
  history: SkillUpdate[];
  notes?: string;
  goalLevel?: number;
  goalDate?: Date;
}

interface SkillUpdate {
  date: Date;
  level: number;
  timeSpentMinutes?: number;
}

interface UserData {
  version: number;        // For data migrations
  skills: TrackedSkill[];
  settings: UserSettings;
  createdAt: Date;
  lastModified: Date;
  lastExported?: Date;    // For export reminder
}
```

### Pre-Built Topic Library

Categories to include by default (users select which to track):

| Category | Example Topics |
|----------|----------------|
| **Languages** | TypeScript, Python, C#, Java, Go, Rust, SQL |
| **Frontend** | React, Vue, Angular, HTML/CSS, Accessibility |
| **Backend** | Node.js, .NET, Django, FastAPI, GraphQL, REST |
| **Cloud/Infra** | Azure, AWS, Kubernetes, Docker, Terraform |
| **Data** | PostgreSQL, CosmosDB, Redis, Kafka, Data Modeling |
| **Architecture** | Microservices, Event-Driven, DDD, System Design |
| **DevOps** | CI/CD, Git, Monitoring, Security, Testing |
| **Soft Skills** | Communication, Leadership, Mentoring, Documentation |

---

## Phases

### Phase 1: Foundation (Week 1-2) ✅
**Goal:** Project setup and core data layer

| Task | Status | Deliverable |
|------|--------|-------------|
| Initialize Vite + React + TypeScript project | ✅ | `/app` folder with working dev server (Vite 5.4.21, localhost:5173) |
| Set up Tailwind CSS | ✅ | Configured with dark mode, custom skill-level classes |
| Implement IndexedDB data layer | ✅ | `useSkillStore` hook with CRUD operations (uses `idb` library) |
| **Add data versioning & migration support** | ✅ | Version field in UserData, `migrateData()` function ready for future migrations |
| Create topic library JSON | ✅ | 70+ pre-built topics in 8 categories with icons |
| Build basic topic selector UI | ✅ | TopicSelector component with search, category filter, add/remove |
| Export/Import JSON functionality | ✅ | DataManagement component with download/upload, export reminder |

**Exit Criteria:** ✅ Can select topics, save to IndexedDB, and export/import JSON

---

### Phase 2: Skill Tracking UI (Week 2-3) ✅
**Goal:** Core skill management interface

| Task | Status | Deliverable |
|------|--------|-------------|
| Skill card component | ✅ | SkillCard with level indicator, time tracking, goal badge |
| Click-to-set level adjustment | ✅ | Interactive 1-5 scale buttons with visual feedback |
| Skill list view with search | ✅ | SkillList with search, sort (name/level/recent/category) |
| Log time spent modal | ✅ | LogTimeModal with quick options and custom time input |
| Skill detail view | ✅ | SkillDetailModal with history, notes, goal setting tabs |

**Exit Criteria:** ✅ Can track skills, adjust levels, log time, set goals

---

### Phase 3: Visualizations (Week 3-4) ✅
**Status:** COMPLETE  
**Goal:** Charts and visual progress tracking

| Task | Status | Deliverable |
|------|--------|-------------|
| Install Recharts library | ✅ | `npm install recharts` - added 40 packages, build passes |
| Create visualization container layout | ✅ | Dashboard.tsx with 4-tab navigation, empty state, integrated in App.tsx |
| Radar chart component | ✅ | SkillsRadarChart.tsx with Recharts, max 8 topics, tooltip with skill levels |
| Category filter for radar | ✅ | Dropdown with all 8 categories + "All", filters radar data |
| Progress timeline component | ✅ | ProgressTimeline.tsx - line chart with 90-day view, step-after interpolation |
| Category breakdown chart | ✅ | CategoryBreakdown.tsx - horizontal bar chart + detail cards with avg levels |
| Activity heat map | ✅ | ActivityHeatMap.tsx - 12-week calendar grid with stats summary, color-coded intensity |
| Dashboard layout integration | ✅ | Dashboard header, 4-tab nav, responsive layout, all charts integrated |

**Technical Decisions:**
- **Recharts** for all charts (RadarChart, LineChart, BarChart, custom cells for heatmap)
- Limit radar to **8 topics max** per view for readability
- Timeline shows **last 90 days** by default with range selector
- Heat map uses **custom CSS grid** (not Recharts) for calendar layout

**Testing Strategy:**
1. **Build verification:** ✅ `npm run build` succeeds with no TypeScript errors
2. **Visual smoke test:** ✅ Each chart renders, dev server at localhost:5173
3. **Interaction test:** ✅ Category filter implemented in radar tab
4. **Responsive test:** ✅ Uses ResponsiveContainer, flex-wrap tabs
5. **Empty state test:** ✅ All charts have empty state handling

**Exit Criteria:** 
- [x] All 4 chart types render correctly with real skill data
- [x] Category filter works on radar chart
- [x] Dashboard layout is responsive (stacks on mobile, grid on desktop)
- [x] No console errors or TypeScript warnings
- [x] Build passes: `npm run build`

---

### Phase 4: Stats & Goals (Week 4-5)
**Goal:** Metrics and goal tracking

| Task | Deliverable |
|------|-------------|
| Stats dashboard | Key metrics (total skills, by level, by category) |
| Learning time stats | Time tracked this week/month/all-time |
| Goal progress indicators | Visual goal vs. actual comparison |
| Stale skill warnings | Highlight topics not updated recently |
| **Drag-to-adjust enhancement** | Add drag interaction to level adjustment (progressive enhancement) |
| Achievement/milestone system | Optional gamification elements (defer if time-constrained) |

**Exit Criteria:** Comprehensive stats and goal tracking functional

---

### Phase 5: Polish & Deploy (Week 5-6)
**Goal:** Production-ready deployment

| Task | Deliverable |
|------|-------------|
| GitHub Pages deployment setup | GitHub Actions workflow for auto-deploy |
| Responsive design pass | Works on various screen sizes |
| Performance optimization | Lazy loading, efficient renders |
| User onboarding | First-run experience, tutorial |
| Documentation | README with usage instructions |
| Integration with knowledge-base | Optional: link to existing markdown docs |

**Exit Criteria:** Live on GitHub Pages, documented, ready for daily use

---

## Dependencies

| Dependency | Type | Notes |
|------------|------|-------|
| Node.js 18+ | Development | For local development |
| GitHub repository | Infrastructure | Already exists |
| GitHub Pages enabled | Infrastructure | Enable in repo settings |

**No external service dependencies** - fully self-contained static site.

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| IndexedDB data loss | Low | High | JSON export reminders, auto-backup to localStorage as fallback |
| **Browser/device sync** | High | Medium | IndexedDB is browser-specific; make export/import prominent, add "last exported X days ago" reminder |
| **IndexedDB quota limits** | Low | Medium | Add optional data cleanup for history older than X years; monitor storage usage |
| Complex drag interactions | Medium | Medium | Start with click-to-set, add drag as Phase 4 enhancement |
| Visualization performance with many topics | Low | Medium | Virtualized lists, limit radar to 8-10 topics, use category filters |
| Scope creep | Medium | High | Strict phase boundaries, MVP first |
| GitHub Pages limitations | Low | Low | Static-only is actually a feature (simpler) |

---

## Testing Strategy

| Type | Approach |
|------|----------|
| **Component Testing** | Vitest + React Testing Library for UI components |
| **Data Layer Testing** | Unit tests for IndexedDB operations |
| **Visual Testing** | Manual testing of chart rendering |
| **E2E Testing** | Playwright for critical user flows (optional, Phase 5) |
| **Cross-browser** | Test Chrome, Firefox, Edge |

---

## Rollback Plan

Since this is a **new feature** (not modifying existing functionality):
- Rollback = delete the `/app` directory and GitHub Pages deployment
- No impact on existing knowledge-base markdown files
- User data stored in browser's IndexedDB (unaffected by code rollback)

---

## Decisions (Resolved from Review)

| Question | Decision | Rationale |
|----------|----------|----------|
| **Repo structure** | `/app` folder | Keeps knowledge-base markdown separate from app code; cleaner git history |
| **Integration with docs** | Defer to post-MVP | Nice-to-have; add links to markdown files later once core works |
| **Theme** | System preference + toggle | Low effort with Tailwind's `dark:` classes; users expect this in 2026 |
| **Gamification** | Defer to post-MVP | Fun but not core; add achievements later if still desired |

---

## Workflow Status

**Current Step:** ✅ Phase 3 Complete  
**Next Step:** Commit changes, then proceed to Phase 4 (Stats & Goals)

**Phase 1 Summary:**
- Vite + React + TypeScript project initialized in `/app`
- Tailwind CSS configured with dark mode support
- IndexedDB data layer with `useSkillStore` hook
- Data versioning and migration support
- 70+ pre-built topics across 8 categories
- Topic selector UI with search and filtering
- Export/Import JSON functionality

**Phase 2 Summary:**
- SkillCard component with level indicator, time tracking, goal badges
- Click-to-set level adjustment (1-5 scale with visual feedback)
- SkillList with search and sort (name/level/recent/category)
- LogTimeModal with quick select options and custom time input
- SkillDetailModal with tabs for history, notes, and goal setting

**Phase 3 Summary:**
- Installed Recharts library for data visualization
- Dashboard component with 4-tab navigation (Radar, Timeline, Category, Activity)
- SkillsRadarChart - spider chart with category filter, max 8 topics
- ProgressTimeline - line chart showing 90-day skill level changes
- CategoryBreakdown - horizontal bar chart with category detail cards
- ActivityHeatMap - 12-week calendar grid with activity stats
- All charts have empty state handling and responsive design

**To continue:**
1. Commit Phase 3 changes
2. Proceed to Phase 4 (Stats & Goals) or take a break
