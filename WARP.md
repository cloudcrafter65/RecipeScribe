# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

**RecipeScribe** is a Spec-Driven Development (SDD) framework that implements a structured 3-phase development lifecycle designed for AI agents. It transforms feature descriptions into complete implementations through automated planning, design, and task generation.

## Core Development Commands

### 3-Phase Development Lifecycle

The framework uses a rigid TDD-first approach with three primary commands:

```bash
# Phase 1: Create specification and feature branch
/specify "Add user authentication with email and password"

# Phase 2: Generate implementation plan and design artifacts  
/plan "Additional technical context or constraints"

# Phase 3: Break plan into executable development tasks
/tasks "Any additional context for task generation"
```

### Supporting Commands

```bash
# Check prerequisites for task generation
scripts/check-task-prerequisites.sh --json

# Update AI agent context files (CLAUDE.md, GEMINI.md, etc.)
scripts/update-agent-context.sh [claude|gemini|copilot]

# Get feature paths for current branch
scripts/get-feature-paths.sh

# Setup plan structure (used internally by /plan)
scripts/setup-plan.sh --json
```

### Branch and Directory Management

```bash
# Feature branches follow pattern: ###-feature-name
git checkout 001-user-auth
git checkout 002-recipe-crud

# Each feature creates a spec directory:
specs/001-user-auth/
├── spec.md          # Feature specification
├── plan.md          # Implementation plan  
├── research.md      # Technical research
├── data-model.md    # Entity definitions
├── contracts/       # API contracts
├── quickstart.md    # Test scenarios
└── tasks.md         # Executable tasks
```

## Architecture

### High-Level Structure

RecipeScribe operates as a **meta-development framework** rather than a traditional application:

- **Templates**: Executable specification and planning templates with built-in validation
- **Scripts**: Shell utilities that manage the SDD lifecycle and branch operations
- **Memory**: Constitutional principles and development guidelines 
- **Generated Specs**: Feature-specific directories with complete design artifacts

### Core Components

**Configuration Layer** (`.gemini/commands/`):
- `specify.toml`, `plan.toml`, `tasks.toml` - Define AI agent prompts and execution flows
- Each TOML file contains structured prompts that guide AI agents through phases

**Template System** (`templates/`):
- `spec-template.md` - Executable business specification template
- `plan-template.md` - Technical implementation planning template  
- `tasks-template.md` - Development task breakdown template
- `agent-file-template.md` - AI context file template

**Script Infrastructure** (`scripts/`):
- `common.sh` - Shared functions for path management and branch validation
- `create-new-feature.sh` - Initializes feature branches and spec directories
- `update-agent-context.sh` - Maintains AI agent context files incrementally

**Constitutional Memory** (`memory/`):
- `constitution.md` - Template for project-specific development principles
- Enforces library-first architecture, CLI interfaces, and TDD practices

### Data Flow

1. **User Input** → `feature description` → **AI Agent** → `spec.md`
2. **Specification** → **Technical Research** → `research.md`, `data-model.md`, `contracts/`
3. **Design Artifacts** → **Task Generation** → `tasks.md` with numbered, dependency-ordered tasks
4. **Tasks** → **Implementation** → Actual codebase following constitutional principles

### Integration Points

**AI Agent Context Management**: 
- Automatically generates/updates `CLAUDE.md`, `GEMINI.md`, or `.github/copilot-instructions.md`
- O(1) incremental updates that preserve manual additions
- Keeps context under 150 lines for token efficiency

**Version Control Integration**:
- Feature branches follow `###-description` naming convention
- All spec artifacts are git-tracked for audit trail
- Constitutional requirement: tests before implementation in commit history

### Key Design Patterns

**Template-Driven Execution**: Templates are executable with built-in validation flows and error handling
**Constitutional Architecture**: All features must comply with library-first, CLI-exposed, TDD principles  
**Phase Gates**: Each phase has validation checkpoints that prevent progression until requirements are met
**Parallel Task Identification**: Tasks marked `[P]` can run simultaneously on different files

## Constitutional Requirements

All features developed through this framework must adhere to:

- **Library-First**: Every feature starts as a standalone, testable library
- **CLI Interface**: Every library exposes functionality via command-line interface  
- **Test-First (NON-NEGOTIABLE)**: Red-Green-Refactor TDD cycle strictly enforced
- **Integration Testing**: Contract tests for library boundaries and API changes
- **Observability**: Structured logging and debuggable text I/O protocols

## Project Structure Conventions

Generated projects follow these patterns based on complexity:

```bash
# Single Project (Default)
src/models/, src/services/, src/cli/, src/lib/
tests/contract/, tests/integration/, tests/unit/

# Web Application  
backend/src/ and frontend/src/
backend/tests/ and frontend/tests/

# Mobile + API
api/src/ and ios/src/ (or android/src/)
```

## AI Agent Integration

This repository is designed to work with AI development agents:

- **Gemini CLI**: Primary target with `.gemini/commands/` configuration
- **Claude Code**: Supported via `CLAUDE.md` context files
- **GitHub Copilot**: Supported via `.github/copilot-instructions.md`

Context files are automatically maintained as features are developed, ensuring agents have current technical stack and project knowledge.

## Development Notes

- All scripts expect to be run from repository root
- Feature branches are required - scripts will error on `main` or non-feature branches
- The framework enforces TDD: tests must be written and failing before any implementation
- Task generation creates 25-30 numbered tasks in dependency order with parallelization markers
- Constitutional principles supersede all other practices and are checked at multiple phase gates
