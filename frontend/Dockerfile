FROM node:latest
RUN apt-get update -y
#RUN apt-get install -y python-pip python-dev build-essential
WORKDIR /app
COPY ./package.json /app
RUN yarn install
ENTRYPOINT ["/bin/bash"]
CMD ["start.sh"]
