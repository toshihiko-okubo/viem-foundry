FROM node:24-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl git \
  && rm -rf /var/lib/apt/lists/*

USER node
ENV HOME=/home/node

RUN curl -L https://foundry.paradigm.xyz | bash \
  && ${HOME}/.foundry/bin/foundryup

ENV PATH="${HOME}/.foundry/bin:${PATH}"

RUN node -v && npm -v && forge --version
