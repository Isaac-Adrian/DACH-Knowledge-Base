# 001 - Knowledge Tracker UI

**Status:** 📋 Planning  
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

### Phase 1: Foundation (Week 1-2)
**Goal:** Project setup and core data layer

| Task | Deliverable |
|------|-------------|
| Initialize Vite + React + TypeScript project | `/app` folder with working dev server |
| Set up Tailwind CSS | Configured styling system |
| Implement IndexedDB data layer | `useSkillStore` hook with CRUD operations |
| **Add data versioning & migration support** | Version field in UserData, migration runner on app load |
| Create topic library JSON | Pre-built topics available |
| Build basic topic selector UI | Add/remove topics from tracking |
| Export/Import JSON functionality | Backup/restore capability |

**Exit Criteria:** Can select topics, save to IndexedDB, and export/import JSON

---

### Phase 2: Skill Tracking UI (Week 2-3)
**Goal:** Core skill management interface

| Task | Deliverable |
|------|-------------|
| Skill card component | Display topic with level, last updated |
| Click-to-set level adjustment | Interactive 1-5 scale with click support |
| Skill list view with search | Filterable, sortable skill inventory |
| Log time spent modal | Record learning time per topic |
| Skill detail view | History, notes, goal setting |

**Exit Criteria:** Can track skills, adjust levels, log time, set goals

---

### Phase 3: Visualizations (Week 3-4)
**Goal:** Charts and visual progress tracking

| Task | Deliverable |
|------|-------------|
| Radar chart (proficiency overview) | Spider chart of selected topics (limit 8-10 per view) |
| **Category filter for radar** | Filter radar by category or show category averages |
| Progress timeline | Swim lane or line chart of level changes over time |
| Category breakdown | Bar/pie chart of skills by category |
| Heat map (recent activity) | Visual of what's been practiced |
| Dashboard layout | Combine multiple visualizations |

**Exit Criteria:** Multiple visualization types working and combinable

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

**Current Step:** ✅ Reviewed & Refined  
**Next Step:** Commit refinements, then `plan-execute` to begin implementation

**To continue:**
1. Commit the plan (git-review invoked automatically below)
2. Run `plan-review` from dach-prompts MCP to validate with multiple AI models
