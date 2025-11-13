.PHONY: help install dev build start stop clean db-up db-down db-reset db-migrate db-studio api-dev web-dev api-build web-build

# Variables
API_DIR = arcads-api
WEB_DIR = arcads-web

# Colors for terminal output
GREEN = \033[0;32m
YELLOW = \033[1;33m
NC = \033[0m # No Color

help: ## Show this help message
	@echo "$(GREEN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

# Installation
install: ## Install dependencies for both API and Web
	@echo "$(GREEN)Installing API dependencies...$(NC)"
	cd $(API_DIR) && npm install
	@echo "$(GREEN)Installing Web dependencies...$(NC)"
	cd $(WEB_DIR) && npm install
	@echo "$(GREEN)Dependencies installed successfully!$(NC)"

# Development
dev: db-up ## Start both API and Web in development mode (with database)
	@echo "$(GREEN)Starting development environment...$(NC)"
	@make -j2 api-dev web-dev

api-dev: ## Start API in development mode
	@echo "$(GREEN)Starting API in development mode...$(NC)"
	cd $(API_DIR) && npm run start:dev

web-dev: ## Start Web in development mode
	@echo "$(GREEN)Starting Web in development mode...$(NC)"
	cd $(WEB_DIR) && npm run dev

# Build
build: ## Build both API and Web
	@echo "$(GREEN)Building API...$(NC)"
	cd $(API_DIR) && npm run build
	@echo "$(GREEN)Building Web...$(NC)"
	cd $(WEB_DIR) && npm run build
	@echo "$(GREEN)Build completed!$(NC)"

api-build: ## Build API
	cd $(API_DIR) && npm run build

web-build: ## Build Web
	cd $(WEB_DIR) && npm run build

# Production
start: db-up ## Start both API and Web in production mode
	@echo "$(GREEN)Starting production environment...$(NC)"
	cd $(API_DIR) && npm run start:prod &
	cd $(WEB_DIR) && npm run start &

# Database commands
db-up: ## Start PostgreSQL database
	@echo "$(GREEN)Starting PostgreSQL database...$(NC)"
	docker compose up -d postgres
	@echo "$(GREEN)Waiting for database to be ready...$(NC)"
	@sleep 3
	@echo "$(GREEN)Database is ready!$(NC)"

db-down: ## Stop PostgreSQL database
	@echo "$(YELLOW)Stopping PostgreSQL database...$(NC)"
	docker compose down

db-reset: ## Reset database (drop, create, and migrate)
	@echo "$(YELLOW)Resetting database...$(NC)"
	cd $(API_DIR) && npx prisma migrate reset --force
	@echo "$(GREEN)Database reset completed!$(NC)"

db-migrate: ## Run database migrations
	@echo "$(GREEN)Running database migrations...$(NC)"
	cd $(API_DIR) && npx prisma migrate dev
	@echo "$(GREEN)Migrations completed!$(NC)"

db-generate: ## Generate Prisma client
	@echo "$(GREEN)Generating Prisma client...$(NC)"
	cd $(API_DIR) && npx prisma generate
	@echo "$(GREEN)Prisma client generated!$(NC)"

db-studio: ## Open Prisma Studio to view database
	@echo "$(GREEN)Opening Prisma Studio...$(NC)"
	cd $(API_DIR) && npx prisma studio

db-seed: ## Seed database with initial data
	@echo "$(GREEN)Seeding database...$(NC)"
	cd $(API_DIR) && npx prisma db seed
	@echo "$(GREEN)Database seeded!$(NC)"

# Cleanup
stop: ## Stop all running services
	@echo "$(YELLOW)Stopping all services...$(NC)"
	docker compose down
	@pkill -f "nest start" || true
	@pkill -f "next dev" || true
	@echo "$(GREEN)All services stopped!$(NC)"

clean: stop ## Clean all dependencies and build artifacts
	@echo "$(YELLOW)Cleaning project...$(NC)"
	rm -rf $(API_DIR)/node_modules $(API_DIR)/dist
	rm -rf $(WEB_DIR)/node_modules $(WEB_DIR)/.next
	docker compose down -v
	@echo "$(GREEN)Project cleaned!$(NC)"

# Lint & Format
lint: ## Lint both API and Web
	@echo "$(GREEN)Linting API...$(NC)"
	cd $(API_DIR) && npm run lint
	@echo "$(GREEN)Linting Web...$(NC)"
	cd $(WEB_DIR) && npm run lint

format: ## Format code for both API and Web
	@echo "$(GREEN)Formatting API...$(NC)"
	cd $(API_DIR) && npm run format
	@echo "$(GREEN)Web will be formatted by lint-staged...$(NC)"

check-types: ## Check types for both API and Web
	@echo "$(GREEN)Checking types for API...$(NC)"
	cd $(API_DIR) && npm run check-types
	@echo "$(GREEN)Checking types for Web...$(NC)"
	cd $(WEB_DIR) && npm run check-types

# Testing
test: ## Run tests for API
	@echo "$(GREEN)Running API tests...$(NC)"
	cd $(API_DIR) && npm run test

test-e2e: ## Run e2e tests for API
	@echo "$(GREEN)Running API e2e tests...$(NC)"
	cd $(API_DIR) && npm run test:e2e

# Setup project from scratch
setup: install db-up db-migrate db-generate ## Complete project setup
	@echo "$(GREEN)Project setup completed!$(NC)"
	@echo "$(YELLOW)Run 'make dev' to start development environment$(NC)"
