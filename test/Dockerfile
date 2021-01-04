FROM wordpress:latest

RUN set -ex \
    apt-get update \
    apt-get install -y --no-install-recommends \
      git \
      npm \ 
      vim \ 
    apt-get clean \
    npm i npm@latest -g
