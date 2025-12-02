## desk Booking Application

# BMAD Startup guide
1. Run Codex.
2. Load the business analyst: `/prompts:bmad-bmm-agents-analyst`
3. Select or run `*workflow-init`.
4. Name the app as you like (other branches use "Desk Booking Application").
5. Select **[a] Advanced Elicitation**.
6. Press **[r]** to reshuffle the menu and explore different elicitation options.
7. Pick an option and start a chat.
8. Try different elicitation options. Press **y** when satisfied with one, or try another.
9. You can write commands like `y, then run 6`.
10. When finished, select [x] to proceed.
11. check your git status to review created or changed files.
12. If you get this:
          How would you like to proceed?
            a) Continue — work with existing artifacts
            b) Archive & Start Fresh — move old work to archive
            c) Express Setup — I know exactly what I need
            d) Guided Setup — walk me through options

            Choice [a/b/c/d]:
    Respond like this: 
        › It's not actually legacy code - the code in office-floorplans is a different app, though we're going to use some of its assets. What we're building here is a new app.
13. Select b to guide us through the options.
14. tell it what we're building. I said:
     We're going to build a simple desk booking application, where users can book desks for certain days. It is going to be local only, running on my machine, and we need to get it up and running quickly, so lots of features aren't neccessary. We don't need authentication or databases etc. The bookings can be held locally in files, and we'll worry about the backing up and restoring etc. There'll be no parallization, as we just need to get this up and running as quickly as possible using BMAD methods. We want it working, but we want to use bmm to create it. So we'll need a few different epics and a few different stories, but to keep it simple for now. We have some assets we can use. ./office-floorplans/demo-*.png holds the pngs of the offices we want to be able to book, and some have multiple floors. And ./office-floorplans/assets/floorplans/offices.json has a map of how those pngs correspond to actual desks which can be booked etc, so you can map clickable buttons or selections over the PNGs in the UI. Does that make sense? We need to get this up and running really quickly, but using best practices. 
15. Once that's done, proceed to Planning options. Choose BMM.
16. Select Brainstorming
17. Select Advanced Elicitation.
18. When you're finished, have a look at the changed file.
19. Crtl+C to exit Codex. You can see how to resume.
20. git stash
21. git checkout stage-2.

# Office Floorplans Assets

The project files now live in `office-floorplans/`.

- JSON data: `office-floorplans/assets/floorplans/offices.json`
- Render code and demo: `office-floorplans/src/` + `office-floorplans/scripts/`
- Generated PNGs: `office-floorplans/demo-*.png`

To run the demo:
```bash
cd office-floorplans
npm install
npm run dev
# open http://localhost:3000/demo-floorplans
```
