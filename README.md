## desk Booking Application

# BMAD BMM Stage 3
1. Run Codex.
2. /prompts:bmad-bmm-agents-analyst
3. *workflow-status
4. /prompts:bmad-bmm-agents-architect
5. *create-architecture
6. Did you get: "We’re blocked: the create-architecture workflow requires interactive web searches (it must verify current versions for every tech decision). Web access is disabled for me here, so I can’t run it as mandated by the instructions."
7. Ctrl+C to break out of codex.
8. codex resume [session-id] --search
9. Try again.
10. Continue drafting the architecture etc.
11. *create-epics-and-stories
12. /prompts:bmad-bmm-agents-tea
13. *framework
14. Run through that all until you get to implementation-readiness.
15. /prompts:bmad-bmm-agents-architect
16. continue through validation, implementation-readiness, sprint-planning; optional test-design/validate-architecture.
17. Exit
18. git stash
19. git checkout stage-4