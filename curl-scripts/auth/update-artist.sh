#!/bin/bash

API="http://localhost:4741"
URL_PATH="/update-artist"

curl "${API}${URL_PATH}" \
  --include \
  --request PATCH \
  --header "Authorization: Token token=${TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "name": "'"${NAME}"'",
      "location": "'"${LOC}"'",
      "biography": "'"${BIO}"'"
    }
  }'
