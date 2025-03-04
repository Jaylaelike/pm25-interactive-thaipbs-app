# Start from the official Node.js LTS base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm ci

# Copy all files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Run database migrations
RUN npx prisma migrate deploy

RUN npm run build

# Expose the listening port
EXPOSE 3003

# Run npm start script
CMD ["npm", "run", "start"]



