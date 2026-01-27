# Architectural Thinking

## Architecture vs Design

**Key Distinction:** Architecture focuses on _structure_, while design focuses on _appearance_.

Use the following criteria to determine whether something is architecture or design:

### Decision Criteria

1. **Strategic vs Tactical**
   - Architecture: Strategic decisions with long-term implications
   - Design: Tactical choices focused on immediate implementation

2. **Effort to Change**
   - Architecture: High cost and effort to modify later
   - Design: Relatively easier to refactor or adjust

3. **Significance of Trade-offs**
   - Architecture: Trade-offs have system-wide impact
   - Design: Trade-offs are more localized

---

## Technical Breadth

Technical breadth means knowing a little bit about a lot of things, rather than deep expertise in one area.

### The Knowledge Pyramid

Career growth involves moving knowledge through three levels:

1. **Unknown Unknowns** (Bottom) - Things you don't know you don't know
2. **Known Unknowns** (Middle) - Things you know you don't know
3. **Known Knowns** (Top) - Things you know

**Goal:** Continuously expand the middle tier by discovering new unknowns, and move critical items to the top when expertise becomes necessary.

### Building Technical Breadth

#### The 20-Minute Rule
Spend 20 minutes each day learning something new. This small, consistent investment compounds over time and keeps you current with evolving technologies.

#### Technology Radar
Create a technology radar to:
- Formalize your thinking about different technologies
- Track emerging trends and tools
- Balance opposing decision criteria
- Identify when to adopt, trial, assess, or hold on technologies

---

## Analyzing Trade-Offs

Thinking architecturally means looking beyond the benefits of a solution to analyze its negatives and trade-offs.

**Key Mindset:** Every architectural decision involves trade-offs. Your role is to:
- Identify all significant trade-offs
- Quantify their impact when possible
- Communicate trade-offs clearly to stakeholders
- Make informed choices based on your specific context and priorities

Remember: If you think you've found a solution without trade-offs, you probably haven't looked hard enough yet (see Law 1).

---

## Balancing Architecture and Hands-On Coding

Architects should remain technical and involved in code, but must avoid common pitfalls.

### ⚠️ The Bottleneck Trap Antipattern

Occurs when an architect takes ownership of code in the critical path (usually framework code or complex components) and becomes a bottleneck to the team.

**Warning Signs:**
- Team blocked waiting for architect's code reviews or implementations
- Architect owns core infrastructure that others can't touch
- Delays in feature delivery due to architect's availability

### ✅ Recommended Coding Activities

Stay technical without blocking the team:

- **Frequent Proofs-of-Concept** - Validate architectural decisions with working code
- **Tackle Technical Debt** - Improve areas that don't block active development
- **Fix Bugs** - Contribute to stability without owning critical paths
- **Automate** - Build tools and scripts that improve team productivity
- **Conduct Code Reviews** - Guide implementations and ensure architectural compliance
