FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the NestJS port
EXPOSE 3000

# Start the NestJS server
CMD ["npm", "run", "start"]
