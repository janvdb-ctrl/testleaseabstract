# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Who I Am

# About me
- Name: Jan Van Den Broeck
- Role: Senior Product Manager, Payments at Oak Network
- Team: Payments, reporting to Saquib
- Current quarter: Launching agents for enterprises, improving revenue

# How I work
- Short, direct communication. No filler.
- Show reasoning before conclusions.
- I use Cursor (with Claude Code installed) 
- When I say "spin up", delegate to a sub-agent.
- Check /knowledge/people/ before drafting any message.

# My tools
- Cursor with Claude Code: primary AI coding + PM environment
- GitHub CLI: installed (use for all git operations)
- Slack: use for drafting messages and stakeholder comms
- Discord: use for community/team communication
- Figma: reference for design context and specs
- Jira: use for ticket references, status updates, and sprint planning
- Google docs: for documentation

# Current priorities
1. Launch Lease Abstraction Agent
2. Set up AI native operation system
3. Set up AI native workflow where I can ship features myself

# Preferences
- Bold key phrases in documents
- Bullet points 
- End sections with a punchy one-liner


## How This System Works

This is a personal knowledge and task management system designed to work with Claude Code. It organizes:

- **Tasks/** - Active work and backlog items
- **Projects/** - Larger initiatives and project documentation
- **Workflows/** - Repeatable processes and playbooks
- **Meetings/** - Notes from 1:1s, standups, and other meetings
- **Knowledge/** - Reference materials, research, and people notes
- **Templates/** - Reusable document templates
- **Tools/** - Scripts and utilities

## Key Directories
```
Tasks/           → Active tasks and backlog
Projects/        → Project documentation
Workflows/       → Repeatable processes
Meetings/        → Meeting notes (1on1s, standups, one-offs)
Knowledge/       → Reference, Research, People notes
Templates/       → Document templates
Tools/           → Scripts and utilities
_Registry/       → System documentation (tags, tools, MCPs)
_temp/           → Scratch space
```

## Key Commands

| Say | Does |
|-----|------|
| "standup" | Read Tasks/active.md and GOALS.md, summarize what I'm working on today and any blockers |
| "weekly update" | Draft a weekly update for Saquib covering progress on Lease Abstraction Agent, blockers, and next week's plan |
| "new project [name]" | Create a new folder in Projects/ with a PRD template, tasks file, and meeting notes file |
| "jira ticket [feature]" | Draft a Jira ticket with title, description, acceptance criteria, and story points |
| "prep 1:1" | Read Knowledge/people/saquib.md and summarize talking points for our next 1:1 |
| "retro" | Run a sprint retrospective — what shipped, what didn't, what to change |

## Context Files

When starting work, Claude should read:
- `GOALS.md` - Current objectives and stakeholders
- `Tasks/active.md` - What I'm currently working on
- `Knowledge/people/` - Stakeholder context before any comms

## Notes

- All files are Markdown
- Use `[[wikilinks]]` to connect notes
- Templates in `Templates/` for new documents
- Update people files in Knowledge/people/ after every meeting
- Archive completed projects to Projects/_archive/