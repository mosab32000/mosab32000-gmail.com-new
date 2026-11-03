.PHONY: verify type-check lint test build seed-ai

verify: type-check lint test build

type-check:
	npm run type-check

lint:
	npm run lint

test:
	npm test

build:
	npm run build

seed-ai:
	bash scripts/seed-ai.sh
