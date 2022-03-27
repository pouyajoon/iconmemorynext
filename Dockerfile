FROM node:16-alpine

# RUN apk --no-cache add \
#     chromium \
#     nss \
#     freetype \
#     freetype-dev \
#     harfbuzz \
#     ca-certificates \
#     ttf-freefont \
#     g++ \
#     gcc \
#     libgcc \
#     libstdc++ \
#     linux-headers \
#     make \
#     python3 \
#     musl-dev \
#     postgresql-libs \
#     postgresql-dev 

# RUN apk --no-cache add \
#     pixman \
#     cairo \
#     pango \
#     giflib 

# RUN apk --no-cache add \
#     # build-essential  \
#     build-base \
#     cairo-dev \
#     jpeg-dev \
#     pango-dev \
#     giflib-dev \
#     libjpeg-turbo-dev
# libpango1.0-dev \
# libjpeg-dev \
# libgif-dev \
# librsvg2-dev

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
#     PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
#     # ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true \
#     # PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST=true \
#     # ENV PLAYWRIGHT_BROWSERS_PATH=/usr/bin/pw-browsers \
#     NODE_ENV=production \
#     NODE_OPTIONS="--max-old-space-size=4096"

RUN yarn global add pm2

# RUN apt-get update
# RUN apt-get -yq install xfonts-utils
# RUN mkfontscale && mkfontdir && fc-cache
# RUN apt-get -yq install libnss3 libgtk2.0-0 libatk-bridge2.0-0 libsm6 libx11-6 libx11-xcb1 libxcb1 libxcb-dri3-0 libdrm2 libgbm1 libasound2 libxss1 libgtk-3-0 xauth xvfb 
# COPY docker/fonts/* /usr/share/fonts/truetype/

# RUN npm config set "@fortawesome:registry" https://npm.fontawesome.com/ && \
#     npm config set "//npm.fontawesome.com/:_authToken" 7640C723-2A32-40B6-999A-AC77A83201D8

#  .babelrc.js
COPY package.json yarn.lock tsconfig.back.json .eslint* webpack.config.js tsconfig.json /usr/workspace/
# COPY back/keys /usr/workspace/back/keys
# COPY webpack /usr/workspace/webpack

# ADD /Users/pouya/Library/Caches/Yarn/v2/ /usr/yarn-cache
# RUN yarn config set cache-folder /usr/yarn-cache

WORKDIR /usr/workspace/
RUN yarn install --frozen-lockfile

# RUN npx playwright install 

# WORKDIR /usr/workspace/webpack/
# RUN yarn install --frozen-lockfile
# RUN yarn build

COPY src /usr/workspace/src
# COPY apidocs /usr/workspace/apidocs

# WORKDIR /usr/workspace/

# RUN yarn apidocs:bundle
# RUN ls -LR /usr/bin/pw-browsers > a.md
RUN yarn back:production
RUN yarn front:production

RUN rm -rf src && \
    rm -rf webpack \
    yarn cache clean

# COPY manifests /usr/workspace/manifests

# ENV PORT 8080
EXPOSE 443 443
ENV JUP_ENV=docker
# CMD ["node", "dist/back/server.js" ]
CMD ["pm2-runtime","start", "dist/server/index.js", "-i", "1" ]



