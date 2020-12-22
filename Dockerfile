FROM node:15

# install server
RUN npm install -g serve

COPY . /app

WORKDIR /app

# compile and start app 
# NOTE: npm run build at start time allows us to change environment variables
CMD ["sh","-c","npm run build && serve -s build"]
