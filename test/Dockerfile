FROM wordpress:latest

RUN set -ex \
  apt-get update \
  && apt-get install -y --no-install-recommends \
    git \
    npm \ 
    vim \ 
  && rm -rf /var/lib/apt/lists/* \
  npm i npm@latest -g
