FROM node:alpine
WORKDIR /var/blue-team-status
COPY /src/. ./
RUN npm install --production
CMD [ "npm", "start" ]