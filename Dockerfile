FROM node:18-slim

RUN npm install -g pnpm

RUN mkdir -p /code/app && chown -R node:node /code/app

WORKDIR /code/app

COPY package.json pnpm-lock.yaml ./

USER node

COPY --chown=node:node . .

RUN pnpm install --frozen-lockfile

RUN pnpm build

EXPOSE 3001

CMD [ "pnpm", "start" ]