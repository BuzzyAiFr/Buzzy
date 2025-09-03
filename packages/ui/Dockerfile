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
# Install only the dependencies needed for the 'ui' and its dependents
RUN pnpm install --frozen-lockfile --filter ui...

# ---- Build Stage ----
# This stage is dedicated to building the application
FROM base AS build
# Copy dependencies from the previous stage
COPY --from=dependencies /app /app
# Copy the source code for the ui
COPY packages/ui/ ./packages/ui/
# Build the ui application
RUN pnpm --filter ui run build

# ---- Production Stage ----
# This is the final, minimal image
FROM node:20-slim AS production
WORKDIR /app
# Install pnpm globally in production stage
RUN npm install -g pnpm
# Copy the built application and the necessary node_modules from the build stage
COPY --from=build /app /app
# Next.js listens on port 3000 by default, but we will map it to a different host port
EXPOSE 3000
# Define the command to run the application
# We need to change the CWD to the package directory for next start to work correctly
WORKDIR /app/packages/ui
CMD ["pnpm", "start"]
