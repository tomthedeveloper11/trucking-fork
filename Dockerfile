FROM --platform=linux/amd64 node:16.16.0
RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates procps libxss1 \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     # We install Chrome to get all the OS level dependencies, but Chrome itself
     # is not actually used as it's packaged in the node puppeteer library.
     # Alternatively, we could could include the entire dep list ourselves
     # (https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix)
     # but that seems too easy to get out of date.
     && apt-get install -y google-chrome-stable \
     && rm -rf /var/lib/apt/lists/* \
     && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
     && chmod +x /usr/sbin/wait-for-it.sh

ENV OPENSSL_CONF=/dev/null 
ENV PHANTOMJS_BIN "/usr/local/bin/phantomjs"
RUN npm i -g phantomjs-prebuilt 
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)


COPY package-lock.json /usr/src/app/package-lock.json
COPY package.json /usr/src/app/package.json

RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /usr/src/app/
EXPOSE 3000

RUN npm run build
# RUN npm run start
# CMD [ "npm", "run", "dev" ]