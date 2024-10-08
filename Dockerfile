# Step 1: Base image with the latest stable Node.js
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --force

# Bundle app source
COPY . .

# Expose the port Next.js runs on
EXPOSE 3000

# Set the environment variable for NODE_ENV
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Command to run the application
CMD ["npm", "run", "dev"]
