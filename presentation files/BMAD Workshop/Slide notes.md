# Slide Notes

## Slide 3

- **AI-Driven Agile Framework:** BMAD is an open-source methodology that augments agile software development with AI. It provides specialized AI agents and structured workflows to guide projects of any size. Each agent plays a role (e.g., Analyst, Developer, QA) in a collaborative "AI team."
- **"Facilitator" vs Generator:** Unlike one-shot coding tools, BMAD's agents act as expert collaborators. They guide you through questions and best practices rather than just spitting out code. This means the AI helps elicit your ideas and refine them, ensuring the human stays in control and the results are high-quality.
- **Scale-Adaptive Intelligence:** BMAD intelligently adapts its planning depth to project complexity, from a quick bug fix to enterprise-scale systems. It can be light-touch for small tasks or very thorough for big projects, ensuring just enough process for the job.
- **End-to-End Coverage:** The framework spans the complete SDLC, from brainstorming and design to coding, testing, and deployment. All steps produce just-in-time documentation, creating an auditable trail of what was built and why.
- **Modular:** Its modular design means it can go way beyond SDLC.

## Slide 4

- Planning inconsistency keeps requirements and architecture decisions coherent instead of "prompt-to-prompt drift."
- Context loss across sessions and agents is reduced by maintaining shared project context so the AI does not forget what was decided.
- "Average" output from one-shot AI coding is improved through structured workflows and expert-agent collaboration.
- The process depth scales to the job, from small fixes to enterprise builds.
- Fragmented end-to-end delivery is addressed through guided workflows that cover ideation -> planning -> implementation.

## Slide 5

### BMAD in SDLC Phase 1: Analysis

#### Discovery

The Analyst agent kicks off projects by facilitating idea generation and market research. It is like an AI business analyst who can run brainstorming workshops, perform competitive analysis, and turn vague ideas into concrete product briefs. Example: a business owner can ask the Analyst to explore an app idea; the agent will gather industry insights and help outline the opportunity.

**Validating concepts:** In this early phase, BMAD ensures you are building the right thing. The Analyst agent helps refine the project vision and identify risks or requirements early.

## Slide 6

The Product Manager agent (PM) translates business goals into a detailed plan. It works with you to create Product Requirement Documents (PRDs) that include functional and non-functional requirements, user stories (epics -> stories), and acceptance criteria.

The AI PM relentlessly organizes and asks clarifying questions, acting like a seasoned Product Owner who never misses a detail.

**User Experience design:** If applicable, a UX Designer agent can assist in this phase as well, mapping user journeys and even drafting wireframes or design system ideas.

## Slide 7

The Architect agent steps in to design the system's architecture and technical approach. It produces architecture specifications, such as proposing system components, data flows, tech stack choices, and creating Architecture Decision Records (ADRs) for key decisions.

By having the AI Architect build on the detailed requirements from the PM, BMAD avoids the typical misalignment between what was planned and what gets built. Design decisions explicitly trace back to the PRD and business needs, preventing the "telephone game" effect. Each agent builds on the last agent's output, preserving a cumulative understanding of the project.

## Slide 8

Before coding starts, the Scrum Master agent (SM) orchestrates the transition from plan to execution. It takes the epics from planning and performs "epic sharding" by breaking them into fully detailed story tasks. Each story file it generates contains everything a developer needs: context of the feature, design guidelines, rationale (the "why"), and test criteria. This ensures no context is lost when work is handed to development.

**Coding with AI Developer:** The Developer agent then writes the actual code for each story, following the specifications. Because the story file includes architecture and acceptance criteria, the AI Dev produces code that is consistent with the overall design and meets the requirements. It is as if a senior developer wrote the code with full knowledge of the spec, resulting in fewer bugs and rewrites. The human developer can pair-program with this agent, reviewing and refining the code.

**Automated Quality Assurance:** BMAD includes a QA agent (Test Architect) that validates each implemented story against the original requirements. This QA agent does not just do unit tests, it checks whether the feature fulfills the acceptance criteria and flags any deviation from the PRD. Users have reported this "dedicated QA agent" catches issues that even human developers miss. By having an automated second set of eyes, quality is baked in.

**Continuous Deployment and DevOps:** With BMAD's Test Architect workflow, you can even automate integration testing and CI/CD pipeline steps. BMAD provides workflows to set up CI pipeline steps and ensure all tests and checks run before deployment. Once code passes QA, deploying it can be as routine as pressing a button. Result: faster releases with confidence. Even handoffs to ops or cloud environments can be guided by BMAD's workflows, though final deploy decisions remain with the team.

## Slide 9

### BMAD Modes

1. Quick Flow - Barry, solo dev
2. BMM
3. Enterprise

### Official add-on modules (selectable during install)

- **Creative Intelligence Suite (CIS):** ideation, innovation, creativity, pitching agents and frameworks
- **Game Dev Studio (GDS):** game-dev specific workflows (Unity, Unreal, Godot, etc.)
- **Test Architect (TEA):** enterprise-grade testing strategy and workflows
- **BMad Builder (BMB):** build custom agents, workflows, and modules
- Make your own using **BMB**
- Marketplace coming

## Slide 10

- I am working with Startup Gigz, and we are using BMAD to build out the entire app and infrastructure.
- I have used it to create rapid prototypes to show to clients.
- I have used BMB to build research pipelines.
- I use it to build creative writing and editing pipelines, like for this video.
- In short, I use it for many, many things.
