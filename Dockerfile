FROM cypress/browsers:node-22.0.0-chrome-124.0.6367.60-1-ff-125.0.2-edge-124.0.2478.51-1

WORKDIR /app

COPY package.json package-lock.json ./
# Need to use --force, because we're using a beta version of React that none
# of our other dependencies support yet.
RUN npm install --force

COPY . .

RUN npx prisma generate
