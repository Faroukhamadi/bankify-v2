docker rmi faroukhamadi/bankify-backend -f
docker buildx build --platform=linux/amd64 . -t faroukhamadi/bankify-backend:latest
docker push faroukhamadi/bankify-backend:latest