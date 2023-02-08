FROM node:18.6.0-alpine3.16

# 디렉토리 지정
WORKDIR /usr/src/app

# 의존성 설치를 위해 컨테이너에 복사
COPY package.json ./
COPY yarn.lock ./

# 의존성 설치
RUN yarn

# 모든 파일 복사
COPY . .

RUN yarn build:dev

EXPOSE 3000

CMD ["yarn", "start"]