FROM node:18

RUN mkdir /app
WORKDIR /app

ENV PORT ${6006:-80}
#ENV NODE_PATH=src

COPY package-lock.json /app
COPY package.json /app
RUN npm ci

COPY .storybook /app/.storybook

EXPOSE $PORT
CMD [ "npm", "run", "storybook"]
