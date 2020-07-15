#!/bin/bash

API="http://localhost:4741"
URL_PATH="/collection"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
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
