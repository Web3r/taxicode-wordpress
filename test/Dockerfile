FROM wordpress:latest

RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  git \
  npm \ 
  vim \
  && npm i npm@latest -g \ 
  && rm -rf /var/lib/apt/lists/*
