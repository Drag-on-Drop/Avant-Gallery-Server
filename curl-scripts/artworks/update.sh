#!/bin/bash

API="http://localhost:4741"
URL_PATH="/artworks"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "artwork": {
    "imageUrl": "'"${IMAGEURL}"'",
    "description": "'"${DESC}"'",
    "price": "'"${PRICE}"'",
    "name": "'"${NAME}"'"
    }
  }'
echo
