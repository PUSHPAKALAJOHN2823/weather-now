# Step 1: Use a lightweight web server
FROM nginx:alpine

# Step 2: Copy your weather app files into the server
# (This assumes your index.html is in your main folder)
COPY . /usr/share/nginx/html

# Step 3: Cloud Run needs port 8080
ENV PORT 8080
EXPOSE 8080

# Step 4: Start the server
CMD ["nginx", "-g", "daemon off;"]
