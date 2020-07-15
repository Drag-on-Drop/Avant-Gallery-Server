#!/bin/bash

API="http://localhost:4741"
URL_PATH="/collection"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "collection": {
      "artwork": "'"${ARTWORK}"'",
      "owner": "'"${OWNER}"'",
      "description": "'"${DESCRIPTION}"'"
    }
  }'

echo
