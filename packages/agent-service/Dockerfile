# ---- Base Stage ----
# Use a slim Node.js image as a base
FROM node:20-slim AS base
WORKDIR /app
# Install pnpm globally
RUN npm install -g pnpm

# ---- Dependencies Stage ----
# This stage is dedicated to installing dependencies to leverage Docker caching
FROM base AS dependencies
# Copy dependency definition files from the monorepo root
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Copy the package.json of all packages in the workspace
COPY packages/ packages/
# Install only the dependencies needed for the 'agent-service' and its dependents
RUN pnpm install --frozen-lockfile --filter agent-service...

# ---- Build Stage ----
# This stage is dedicated to building the application
FROM base AS build
# Copy dependencies from the previous stage
COPY --from=dependencies /app /app
# Copy the source code for the agent-service
COPY packages/agent-service/ ./packages/agent-service/
# Build the agent-service application
RUN pnpm --filter agent-service run build

# ---- Production Stage ----
# This is the final, minimal image
FROM node:20-slim AS production
WORKDIR /app
# Copy the built application and the necessary node_modules from the build stage
# This copies the entire monorepo structure, but only with production dependencies
COPY --from=build /app /app
# Expose the port the application will run on
EXPOSE 3000
# Define the command to run the application
CMD ["node", "packages/agent-service/dist/main"]
