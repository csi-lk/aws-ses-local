FROM mhart/alpine-node:6.10.0

# Create app directory
RUN mkdir -p /aws-ses-local
WORKDIR /aws-ses-local

# Install app dependencies
COPY package.json /aws-ses-local
COPY .babelrc /aws-ses-local

RUN npm install --loglevel=silent

# Copy app source
COPY src /aws-ses-local/src

RUN npm run prepublish

ENV PORT=9001
EXPOSE 9001

CMD [ "npm", "start"]