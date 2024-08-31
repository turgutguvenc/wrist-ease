# Use the Node.js image that matches your project's Node version
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the package.json and package-lock.json files to leverage Docker cache for dependencies
COPY package.json package-lock.json ./

# Install dependencies based on your existing package.json and package-lock.json files
RUN npm install

# Copy the rest of your application files to the working directory
COPY . .

# Build your React application for production
RUN npm run build

# Install 'serve' globally to serve the static files from the build directory
RUN npm install -g serve

# Set the default command to serve your React app
CMD ["serve", "-s", "build"]

# Expose the port on which your React app will run
EXPOSE 3000
