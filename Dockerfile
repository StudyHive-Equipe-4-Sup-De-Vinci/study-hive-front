# The base image
FROM outlinewiki/outline:version-0.44.0

# Run the memory intensive build on an instance with 4 GB of memory (M)
RUN yarn install && yarn build

# Start the app on a smaller instance (nano)
CMD yarn start