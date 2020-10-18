FROM node:12.8.1-alpine

# Set working directory
WORKDIR /

# Copy package.json and yarn.lock
COPY ./package.json ./yarn.lock ./

# Install node modules
RUN yarn install
# Copy source code into the image
COPY . .

# start app
CMD ["yarn", "start"]
