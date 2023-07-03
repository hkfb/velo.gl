FROM node:18

RUN mkdir /app
WORKDIR /app

COPY package-lock.json /app
COPY package.json /app
COPY *.ts /app
COPY *.tsx /app
RUN npm ci

COPY .storybook /app/.storybook

EXPOSE 6006
CMD [ "npm", "run", "storybook"]
