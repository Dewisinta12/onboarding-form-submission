# This Dockerfile is used for auto-deployment, not for candidate use. It has been added to .hatchways.gitignore, which
# means it will not be added to the candidate repository.
FROM node:18

WORKDIR /app
COPY . /app

COPY /server/.env.sample /app/server/.env

RUN cd /app/server && yarn install

RUN cd /app/client && yarn install

RUN apt-get update && apt-get install -y supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 3000
EXPOSE 8080

CMD ["/usr/bin/supervisord"]
