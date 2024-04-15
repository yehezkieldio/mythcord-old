FROM node:latest

# Create working directory
RUN mkdir -p /app
WORKDIR /app

# Install dependencies
COPY package.json /app
RUN npm install

# Copy source files
COPY . /app

# Start the bot
CMD ["npm", "start"]