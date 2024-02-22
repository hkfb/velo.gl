FROM node:bullseye

RUN mkdir /app
WORKDIR /app

EXPOSE 6006
CMD [ "npm", "run", "storybook"]
