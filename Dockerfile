# -------- Build Stage --------
FROM node:18 AS builder

WORKDIR /app

# Copy only necessary files first to leverage Docker cache
COPY package*.json ./

# Install all dependencies (dev + prod)
RUN npm install

# Copy the rest of the project
COPY . .

# Build the app
RUN npm run build

# -------- Production Stage --------
FROM node:18-slim AS production

WORKDIR /app

# Copy only built files and necessary resources from builder
COPY --from=builder /app ./

# Install only production dependencies
RUN npm install --omit=dev --ignore-scripts

# Optional: remove leftover dev files (if needed)
RUN rm -rf tests/ .git/ *.md

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
